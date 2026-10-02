// Audit the built release: service/case links, approved commercial terms and
// Dentistry evidence across languages and desktop/mobile sizes. No live leads.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import { cases } from '../src/data/cases.js'
import { buildRoutes } from './site-routes.mjs'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, '.visual-audit/case-services')
const origin = 'http://127.0.0.1:5186'
const locales = ['ru', 'en', 'de', 'uk']
const automation = ['ai-voice-operator', 'ai-news-automation', 'retail-stock-monitor']
const development = ['dds-service', 'bala-group', 'comfort-home']
const report = { internalLinks: 0, pages: [], errors: [], failures: [] }
await mkdir(output, { recursive: true })

// Check every internal anchor against actual prerendered output, including
// fragments. A SPA fallback returning HTTP 200 must not hide a missing page.
const documents = new Map()
for (const { path } of buildRoutes()) documents.set(path.replace(/\/$/, ''), await readFile(resolve(root, `dist/${path}/index.html`), 'utf8'))
for (const [path, html] of documents) {
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), `https://osnovaai.com${path}`)
    if (url.origin !== 'https://osnovaai.com') continue
    const target = url.pathname.replace(/\/$/, '')
    const document = documents.get(target)
    if (document) {
      if (url.hash) assert.ok(document.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path}: missing fragment ${url.href}`)
    } else {
      assert.ok(existsSync(resolve(root, `dist/${url.pathname}`)), `${path}: missing destination ${url.href}`)
    }
    report.internalLinks++
  }
}

const server = spawn(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '5186', '--strictPort'], { stdio: 'ignore', windowsHide: true })
let browser
try {
  for (let n = 0; n < 40; n++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  page.on('pageerror', error => report.errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()) })
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`) })
  const prices = nodes => nodes.map(node => node.textContent.replace(/[^\d€–+]/g, ''))
  const paths = ['services/automation', 'services/development', ...cases.map(item => `cases/${item.slug}`)]
  for (const width of [320, 360, 375, 390, 412, 430, 1440]) {
    await page.setViewport({ width, height: width < 700 ? 844 : 1000, isMobile: width < 700, hasTouch: width < 700 })
    for (const lang of locales) {
      const routes = [360, 375, 412].includes(width) ? ['services/automation', 'cases/ai-voice-operator'] : paths
      for (const route of routes) {
        const path = `/${lang}/${route}`
        await page.goto(origin + path, { waitUntil: 'networkidle0' })
        await page.evaluate(async () => {
          document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'))
          for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 15)) }
          window.scrollTo(0, 0)
          await document.fonts.ready
          await Promise.all([...document.images].map(async img => {
            img.loading = 'eager'
            try { await img.decode() } catch { /* Report failed evidence below. */ }
          }))
        })
        const layout = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          brokenImages: [...document.images].filter(img => !img.closest('[aria-hidden="true"]') && (!img.complete || !img.naturalWidth)).map(img => img.getAttribute('src')),
          lang: document.documentElement.lang,
          placeholders: /undefined|\uFFFD|DATA PENDING|DRAFT/.test(document.querySelector('main').innerText),
        }))
        assert.equal(layout.lang, lang, path)
        assert.equal(layout.overflow, false, `${path}@${width}: overflow`)
        assert.equal(layout.placeholders, false, `${path}@${width}: placeholder`)
        assert.deepEqual(layout.brokenImages, [], `${path}@${width}: missing evidence`)
        report.pages.push({ path, width })
        if (route.startsWith('services/')) {
          const direction = route.split('/')[1]
          const slugs = await page.$$eval('.service-related .home-work-card', nodes => nodes.map(node => node.pathname.split('/').at(-1)))
          assert.deepEqual(slugs, direction === 'automation' ? automation : development, `${path}: service cases`)
          if (direction === 'development') {
            assert.deepEqual(await page.$$eval('.service-related .home-more-card', nodes => nodes.map(node => node.pathname.split('/').at(-1))), cases.filter(item => item.category === 'development' && !development.includes(item.slug)).map(item => item.slug))
          }
          if (direction === 'automation') {
            // Detect a broken final letter of a long localized product name,
            // even when overflow is hidden and the page width still passes.
            const orphanedHeadings = await page.$$eval('#products h3', headings => headings.flatMap(heading => {
              const lines = new Map()
              const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
              for (let node = walker.nextNode(); node; node = walker.nextNode()) {
                for (let i = 0; i < node.length; i++) {
                  const range = document.createRange()
                  range.setStart(node, i); range.setEnd(node, i + 1)
                  const top = Math.round(range.getBoundingClientRect().top)
                  lines.set(top, (lines.get(top) || '') + node.textContent[i])
                }
              }
              return [...lines.values()].some(line => /^\p{L}$/u.test(line.trim())) ? [heading.textContent] : []
            }))
            assert.deepEqual(orphanedHeadings, [], `${path}@${width}: isolated heading letter`)
            assert.deepEqual((await page.$$eval('#products .commercial-price', prices)).slice(0, 3), ['€149', '€250–300', '€350–500'])
            assert.equal(await page.$$eval('#products .commercial-card', nodes => nodes.length), 6)
            assert.deepEqual(await page.$$eval('#managed .commercial-managed-row > strong', prices), ['€49–99', '€150', '€300', '€700–800+'])
            const text = await page.$eval('main', node => node.innerText)
            for (const term of ['24', '2–5', '30', '70', '45', '2–3', '09:00–23:00', 'Dentistry']) assert.ok(text.includes(term), `${path}: missing ${term}`)
            assert.ok(await page.$('.commercial-custom a[href$="#contact-form"]'), `${path}: custom-task CTA`)
          }
        } else {
          const item = cases.find(item => route === `cases/${item.slug}`)
          const links = await page.$$eval(`main a[href="/${lang}/services/${item.category}"]`, nodes => nodes.length)
          assert.equal(links, 1, `${path}: exactly one service backlink`)
          assert.ok(await page.$('.portfolio-prev'))
          assert.ok(await page.$('.portfolio-next'))
          if (item.visual === 'voice') {
            assert.equal(await page.$eval('h1', node => node.innerText.replace(/\s+/g, ' ').trim()), 'Dentistry AI Voice')
            assert.equal(await page.$$eval('.automation-study-overview > div', nodes => nodes.length), 2)
            assert.equal(await page.$$eval('.automation-study-facts > div', nodes => nodes.length), 4)
            assert.equal(await page.$$eval('.voice-scenario li', nodes => nodes.length), 4)
            const text = await page.$eval('main', node => node.innerText)
            for (const term of ['Dentistry', 'Telegram', 'API']) assert.ok(text.includes(term), `${path}: missing ${term}`)
            assert.ok(!/mockup|capability demo|ROI|ROAS/.test(text), `${path}: unsupported positioning`)
            const audio = await page.$eval('audio', node => ({ source: new URL(node.currentSrc).pathname, duration: node.duration }))
            assert.equal(audio.source, '/assets/cases/primer.mp3')
            assert.ok(Math.abs(audio.duration - 249.754) < .1, `${path}: audio metadata`)
          }
          if (item.screenshots && width === 390) {
            await page.click('.automation-study-gallery button')
            await page.waitForSelector('dialog[open] img')
            assert.ok(await page.$eval('dialog[open] img', img => img.complete && img.naturalWidth > 0))
            await page.keyboard.press('Escape')
            assert.equal(await page.$('dialog[open]'), null)
          }
        }
        if ([320, 390, 1440].includes(width) && ['cases/ai-voice-operator', 'services/automation'].includes(route)) {
          await page.screenshot({ path: resolve(output, `${lang}-${route.replaceAll('/', '-')}-${width}.png`), fullPage: true })
        }
      }
    }
  }
  assert.deepEqual(report.errors, [])
} catch (error) {
  report.failures.push(error.message)
  throw error
} finally {
  await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2))
  await browser?.close()
  server.kill()
}
console.log(JSON.stringify({ pages: report.pages.length, internalLinks: report.internalLinks, errors: report.errors, failures: report.failures }, null, 2))
