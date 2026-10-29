// Local production QA for search steps, mobile reading order and BALA GROUP.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
import { cases } from '../src/data/cases.js'

const origin = 'http://127.0.0.1:5207'
const output = '.visual-audit/seo-mobile-case'
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5207', '--strictPort'], { stdio: 'ignore', windowsHide: true })
const errors = [], report = [], links = new Set()
const routes = process.env.AUDIT_CASE_ONLY ? ['cases/bala-group'] : ['services/seo', 'services/ai-visibility', 'services/email-deliverability', 'cases/bala-group']
let browser
await mkdir(output, { recursive: true })
try {
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await new Promise(r => setTimeout(r, 250))
  }
  browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  for (const width of [320, 375, 390, 430, 768, 1280, 1440]) {
    await page.setViewport({ width, height: 900, isMobile: width < 600, hasTouch: width < 600 })
    for (const lang of ['ru', 'en', 'de', 'uk']) {
      for (const route of routes) {
        const key = `${lang}/${route}/${width}`
        await page.goto(`${origin}/${lang}/${route}`, { waitUntil: 'networkidle0' })
        await page.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('.reveal').forEach(n => n.classList.add('is-visible')) })
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${key}: page overflow`)
        for (const href of await page.$$eval('a[href]', ns => ns.map(n => n.href))) if (href.startsWith(origin)) links.add(href.split('#')[0])
        const clipped = await page.$$eval('.journey-step, .visibility-process-grid > div, .comparison-column, .search-flow-panel', ns => ns.filter(n => {
          const r = n.getBoundingClientRect(); return r.width && (r.left < -1 || r.right > innerWidth + 1 || n.scrollWidth > n.clientWidth + 1)
        }).map(n => n.className))
        assert.deepEqual(clipped, [], `${key}: clipped content`)
        if (route === 'services/seo') {
          const selector = '.search-flow-nav button'
          assert.equal(await page.$$eval(selector, ns => ns.length), 5)
          let firstHeight
          for (let i = 0; i < 5; i++) {
            const button = (await page.$$(selector))[i]
            if (width < 600) await button.tap(); else await button.click()
            const state = await page.evaluate(i => {
              const panel = document.querySelector(`#search-step-${i}`)
              const nav = document.querySelector('.search-flow-nav')
              const indicator = document.querySelector('.search-flow-indicator').getBoundingClientRect()
              const button = nav.querySelectorAll('button')[i].getBoundingClientRect()
              return { selected: nav.querySelectorAll('[aria-pressed="true"]').length, pressed: nav.querySelectorAll('button')[i].getAttribute('aria-pressed'), hidden: panel.getAttribute('aria-hidden'), text: panel.textContent, height: document.querySelector('.search-flow').getBoundingClientRect().height, indicator: indicator.left, buttonLeft: button.left, target: button.height, transition: getComputedStyle(document.querySelector('.search-flow-indicator')).transitionDuration }
            }, i)
            assert.equal(state.selected, 1, key)
            assert.equal(state.pressed, 'true', key)
            assert.equal(state.hidden, 'false', key)
            assert.ok(state.text.length > 40, key)
            assert.ok(Math.abs(state.indicator - state.buttonLeft) < 2, `${key}: indicator`)
            assert.ok(state.target >= 44, `${key}: touch target`)
            assert.ok(parseFloat(state.transition) <= .00001, `${key}: reduced motion`)
            firstHeight ??= state.height
            assert.equal(state.height, firstHeight, `${key}: layout jump`)
          }
          await (await page.$(selector)).focus()
          await page.keyboard.press('ArrowRight')
          assert.equal(await page.$eval(`${selector}:nth-child(2)`, n => n.getAttribute('aria-pressed')), 'true')
          assert.equal(await page.$eval(`${selector}:nth-child(2)`, n => n.matches(':focus-visible')), true)
          await page.keyboard.press('End'); await page.keyboard.press('Home'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter')
          assert.equal(await page.$eval(`${selector}:nth-child(2)`, n => n.getAttribute('aria-pressed')), 'true')
          if (width < 600) {
            const vertical = await page.$$eval('.journey-step', ns => ns.every((n, i) => !i || n.getBoundingClientRect().top >= ns[i - 1].getBoundingClientRect().bottom - 1))
            assert.ok(vertical, `${key}: vertical steps`)
          }
        }
        if (route === 'cases/bala-group') {
          await page.$$eval('img[src*="bala-group"]', async ns => { await Promise.all(ns.map(async n => { n.loading = 'eager'; await n.decode() })) })
          assert.ok(await page.$('a[href="https://balagroup.com.ua"]'), `${key}: live project link`)
          assert.ok(await page.$eval('.portfolio-tracking', n => n.textContent.includes('Google tag') && !n.textContent.includes('Google Ads')), `${key}: confirmed Google tag only`)
          assert.ok((await page.$eval('body', n => n.textContent)).includes(cases.find(c => c.slug === 'bala-group').copy[lang].webCase.delivery))
          assert.equal(await page.$$eval('img[src*="bala-group"]', ns => ns.every(n => n.complete && n.naturalWidth > 0)), true, `${key}: images`)
          assert.equal(await page.$eval('link[rel="canonical"]', n => n.href), `${origin}/${lang}/cases/bala-group`)
          assert.equal(await page.$$eval('link[hreflang]', ns => ns.length), 5)
        }
        if (lang === 'uk' && [320, 390, 768, 1440].includes(width)) {
          await page.screenshot({ path: `${output}/${route.replaceAll('/', '-')}-${width}.png`, fullPage: true })
          if (route === 'services/seo') for (const [name, selector] of [['flow', '.search-flow'], ['steps', '.journey-sequence'], ['process', '.visibility-process']]) await (await page.$(selector)).screenshot({ path: `${output}/${name}-${width}.png` })
        }
        report.push(key)
      }
    }
    console.log(`Checked ${width}px in all four languages`)
  }
  // Listing and Development showcase retain one BALA entry in the existing order.
  for (const lang of ['ru', 'en', 'de', 'uk']) for (const route of ['', 'services/development', 'cases']) {
    await page.goto(`${origin}/${lang}/${route}`, { waitUntil: 'networkidle0' })
    assert.ok(await page.$(`a[href="/${lang}/cases/bala-group"]`), `${lang}/${route}: case link`)
    for (const href of await page.$$eval('a[href]', ns => ns.map(n => n.href))) if (href.startsWith(origin)) links.add(href.split('#')[0])
  }
  for (const link of links) assert.ok((await fetch(link)).ok, `broken internal link: ${link}`)
  const bala = cases.filter(c => c.slug === 'bala-group')
  assert.equal(bala.length, 1)
  assert.equal(bala[0].url, 'https://balagroup.com.ua')
  assert.ok((await fetch(bala[0].url)).ok, 'live project HTTP')
  const sitemap = await readFile('dist/sitemap.xml', 'utf8')
  for (const lang of ['ru', 'en', 'de', 'uk']) assert.ok(sitemap.includes(`https://osnovaai.com/${lang}/cases/bala-group`))
  assert.deepEqual(errors, [], 'console / runtime / resource errors')
  await writeFile(`${output}/${process.env.AUDIT_CASE_ONLY ? 'case-only-report' : 'report'}.json`, JSON.stringify({ pages: report, internalLinks: [...links], errors }, null, 2))
  console.log(`PASS: ${report.length} viewport/language/page checks; ${links.size} internal links; ${process.env.AUDIT_CASE_ONLY ? '' : '5-step tap, keyboard, focus, ARIA, indicator, stable height, reduced motion; '}case media, tracking copy, canonical, hreflang, sitemap and live URL; no console/runtime errors.`)
} finally {
  await browser?.close()
  server.kill()
}
