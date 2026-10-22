// Complete local production-output audit. No live site, lead or analytics calls.
import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import { buildRoutes, buildUtilityRoutes } from './site-routes.mjs'
import { startProductionAuditServer } from './production-audit-server.mjs'
import { content } from '../src/data/content.js'
import { caseUi } from '../src/data/cases.js'
import { paymentContent } from '../src/data/paymentContent.js'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, '.visual-audit/predeploy')
await mkdir(output, { recursive: true })
const server = await startProductionAuditServer()
const report = { pages: [], utility: [], variants: 0, internalLinks: 0, resources: 0, languageSwitches: 0, menus: 0, devicePreviews: 0, structuredData: 0, errors: [], findings: [], externalRequests: [] }
const routes = buildRoutes()
const utilities = buildUtilityRoutes()
const documents = new Map()
for (const entry of [...routes, ...utilities]) documents.set(entry.path.replace(/\/$/, ''), await readFile(resolve(root, `dist/${entry.path}/index.html`), 'utf8'))
let browser
const check = (condition, text) => { if (!condition) report.findings.push(text) }
try {
  // Crawl the real emitted documents, including fragment and resource targets.
  const assets = new Set()
  for (const [path, html] of documents) {
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
      const url = new URL(match[1].replaceAll('&amp;', '&'), `https://osnovaai.com${path}`)
      if (url.origin !== 'https://osnovaai.com') continue
      const target = url.pathname.replace(/\/$/, '')
      check(!utilities.some(entry => entry.path === target), `${path}: internal link to utility ${target}`)
      const destination = documents.get(target)
      if (destination) {
        if (url.hash) check(destination.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path}: missing fragment ${url.pathname}${url.hash}`)
        check(url.pathname.split('/')[1] === path.split('/')[1], `${path}: cross-language internal link ${url.pathname}`)
      } else {
        check((await fetch(server.origin + url.pathname)).ok, `${path}: missing internal destination ${url.pathname}`)
      }
      report.internalLinks++
    }
    for (const match of html.matchAll(/<(?:img|script|audio|link)\b[^>]*(?:src|href)="([^"#]+)"/g)) {
      const url = new URL(match[1].replaceAll('&amp;', '&'), 'https://osnovaai.com')
      if (url.origin === 'https://osnovaai.com' && /\.[a-z\d]+$/i.test(url.pathname)) assets.add(url.pathname)
    }
    for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      JSON.parse(match[1]); report.structuredData++
    }
  }
  for (const path of assets) {
    const response = await fetch(server.origin + path)
    check(response.ok, `Missing emitted resource: ${path}`)
    report.resources++
  }
  const rootResponse = await fetch(server.origin + '/', { redirect: 'manual' })
  assert.equal(rootResponse.status, 302)
  assert.equal(rootResponse.headers.get('location'), '/en/')

  browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  let expectedDocumentStatus = 200
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (new URL(request.url()).origin === server.origin) return request.continue()
    report.externalRequests.push(request.url())
    return request.abort()
  })
  page.on('pageerror', error => report.errors.push({ path: page.url(), error: error.message }))
  page.on('console', message => {
    // Chromium reports the deliberately requested 404 document as a network
    // error too. Missing subresources are still recorded by the response hook.
    if (expectedDocumentStatus === 404 && /^Failed to load resource:.*404/.test(message.text())) return
    if (message.type() === 'error') report.errors.push({ path: page.url(), error: message.text() })
  })
  page.on('response', response => {
    if (response.status() >= 400 && response.request().resourceType() !== 'document') report.errors.push({ path: page.url(), error: `${response.status()} ${response.url()}` })
  })
  const open = async (path, expectedStatus = 200) => {
    expectedDocumentStatus = expectedStatus
    const response = await page.goto(server.origin + path, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => document.querySelector('main') && !document.getElementById('prerender-reveal'))
    return response
  }

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewport({ width, height: width === 320 ? 568 : width < 700 ? 844 : 1000, isMobile: width < 700, hasTouch: width < 900 })
    for (const entry of routes) {
      const response = await open(entry.path)
      check(response.status() === 200, `${entry.path}@${width}: HTTP ${response.status()}`)
      await page.evaluate(async () => {
        document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'))
        await document.fonts.ready
        const images = [...document.images]
        images.forEach(img => { img.loading = 'eager' })
        await Promise.all(images.map(img => img.decode().catch(() => {})))
      })
      const state = await page.evaluate(() => {
        const main = document.querySelector('main')
        const headings = [...document.querySelectorAll('h1, h2, h3')].filter(node => !node.closest('[aria-hidden="true"], .spatial-card:not(.is-active), .closing-marquee'))
        const clipped = headings.flatMap(node => {
          const rect = node.getBoundingClientRect()
          if (!rect.width || !rect.height || getComputedStyle(node).visibility === 'hidden') return []
          return node.scrollWidth > node.clientWidth + 3 ? [node.textContent.trim()] : []
        })
        return {
          lang: document.documentElement.lang, h1: document.querySelectorAll('h1').length,
          heading: main.querySelector('h1')?.textContent, text: document.body.innerText,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          brokenImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.getAttribute('src')),
          clipped, footer: Boolean(document.querySelector('footer')),
          clippedCtas: [...document.querySelectorAll('.visibility-cta p, .visibility-cta .button')].filter(node => {
            const rect = node.getBoundingClientRect()
            return rect.width && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1)
          }).map(node => node.textContent.trim()),
          wrongInternalLanguages: [...document.querySelectorAll('a[href]')].filter(a => a.origin === location.origin && /^\/(ru|en|de|uk)(\/|$)/.test(a.pathname) && a.pathname.split('/')[1] !== document.documentElement.lang).map(a => a.pathname),
        }
      })
      const where = `${entry.path}@${width}`
      check(state.lang === entry.lang, `${where}: wrong html lang`)
      check(state.h1 === 1, `${where}: expected one H1, found ${state.h1}`)
      check(!state.overflow, `${where}: horizontal overflow`)
      check(state.brokenImages.length === 0, `${where}: missing images ${state.brokenImages.join(', ')}`)
      check(state.clipped.length === 0, `${where}: overflowing headings ${state.clipped.join(' | ')}`)
      check(state.clippedCtas.length === 0, `${where}: clipped CTA ${state.clippedCtas.join(' | ')}`)
      check(state.footer, `${where}: missing footer`)
      check(state.wrongInternalLanguages.length === 0, `${where}: wrong-language anchors`)
      check(!/undefined|\uFFFD|DATA PENDING|DRAFT/.test(state.text), `${where}: placeholder or missing text`)
      if (['en', 'de'].includes(entry.lang)) check(!/[А-Яа-яІіЇїЄєҐґ]/.test(state.text), `${where}: Cyrillic in ${entry.lang}: ${state.text.match(/[^\n]*[А-Яа-яІіЇїЄєҐґ][^\n]*/g)?.join(' | ')}`)
      if (!entry.route) {
        const slugs = await page.$$eval('#cases .home-work-card', nodes => nodes.map(node => node.pathname.split('/').at(-1)))
        assert.deepEqual(slugs, ['dds-service', 'ds-repair-solutions', 'comfort-lab'])
        assert.ok(await page.$(`#cases .home-more-card[href="/${entry.lang}/cases/bala-group"]`))
        assert.ok(state.text.includes(content[entry.lang].contact.fields.name))
      }
      if (entry.route === 'payment') {
        const methods = await page.$$eval('.payment-method h2', nodes => nodes.map(node => node.textContent))
        assert.deepEqual(methods, paymentContent[entry.lang].methods.map(method => method.title))
        assert.equal(await page.$eval('.payment-paypal-mark img', img => img.complete && img.naturalWidth > 0), true)
        assert.equal(await page.$$eval('.payment-method:last-child a, .payment-method:last-child form, .payment-method:last-child button', nodes => nodes.length), 0)
      }
      if (entry.route === 'cases/ds-repair-solutions') {
        await page.waitForSelector(`.portfolio-screen.mode-${width < 700 ? 'mobile' : 'desktop'}`)
        assert.equal(await page.$eval('.portfolio-visit', a => a.href), 'https://dsrepairsolutions.com/')
        assert.deepEqual(await page.$$eval('.web-case-highlights dd', nodes => nodes.map(node => node.textContent)), ['16', '138', '45'])
        assert.ok(state.text.toLocaleLowerCase().includes(caseUi[entry.lang].webStudy.work.toLocaleLowerCase()))
        for (const device of ['desktop', 'mobile', width < 700 ? 'mobile' : 'desktop']) {
          await page.click(`.portfolio-preview-toolbar button:nth-child(${device === 'desktop' ? 1 : 2})`)
          await page.waitForSelector(`.portfolio-screen.mode-${device} img[src$="-${device}.webp"]`)
        }
        report.devicePreviews++
      }
      report.pages.push({ path: entry.path, width })
      if (entry.lang === 'uk' && [390, 1440].includes(width) && ['', 'services', 'services/seo', 'cases/ds-repair-solutions', 'payment'].includes(entry.route)) {
        await page.screenshot({ path: resolve(output, `${entry.route.replaceAll('/', '-') || 'home'}-${width}.png`), fullPage: true })
      }
    }
    console.log(`Production pages verified at ${width}px`)
  }

  // Full filenames and trailing slashes must resolve to the same real page.
  for (const entry of routes) {
    for (const path of [entry.path.replace(/\/$/, '') + '/', entry.path.replace(/\/$/, '') + '/index.html']) {
      const response = await open(path)
      check(response.status() === 200, `${path}: document unavailable`)
      check(await page.$eval('meta[name="robots"]', node => node.content === 'index, follow'), `${path}: real document became noindex/404`)
      check(await page.$eval('link[rel="canonical"]', node => node.href.replace(location.origin, '')) === entry.path, `${path}: incorrect canonical`)
      report.variants++
    }
  }

  for (const entry of utilities) {
    for (const path of [entry.path, entry.path + '/', entry.path + '/index.html', `/${entry.lang}/missing-audit-page`, `/${entry.lang}/services/missing-audit-page`]) {
      const response = await open(path, 404)
      check(response.status() === 404, `${path}: expected HTTP 404, got ${response.status()}`)
      check(await page.$eval('meta[name="robots"]', node => node.content === 'noindex, follow'), `${path}: missing noindex`)
      check(!(await page.$('link[rel="canonical"], link[rel="alternate"][hreflang]')), `${path}: 404 declares canonical/hreflang`)
      check(await page.$eval('html', node => node.lang) === entry.lang, `${path}: incorrect 404 language`)
      report.utility.push({ path, status: response.status() })
    }
  }

  // Every route family preserves its location when switching languages.
  for (const route of [...new Set(routes.map(entry => entry.route))]) {
    await open('/en/' + route)
    for (const lang of ['uk', 'de', 'ru', 'en']) {
      await page.click('.language-current')
      await page.$$eval('.language-menu button', (buttons, code) => buttons.find(node => node.querySelector('span')?.textContent === code).click(), { uk: 'UA', en: 'EN', ru: 'RU', de: 'DE' }[lang])
      await page.waitForFunction(({ lang, route }) => document.documentElement.lang === lang && location.pathname === `/${lang}/${route}`, {}, { lang, route })
      report.languageSwitches++
    }
  }
  for (const width of [320, 390, 768]) {
    await page.setViewport({ width, height: 844, isMobile: width < 700, hasTouch: true })
    for (const lang of ['uk', 'en', 'de', 'ru']) {
      await open(`/${lang}/`)
      const toggle = await page.$('.menu-button')
      if (toggle && await toggle.isVisible()) {
        await toggle.click()
        check(await page.$eval('.main-nav', nav => nav.classList.contains('is-open')), `${lang}@${width}: menu did not open`)
        await page.click('.main-nav a')
        await page.waitForSelector('.development-page')
        check(!(await page.$('.main-nav.is-open')), `${lang}@${width}: menu did not close after navigation`)
        report.menus++
      }
    }
  }
  // Generic fallback is English and must hydrate cleanly with saved languages.
  for (const lang of ['en', 'de', 'uk', 'ru']) {
    await page.evaluate(code => localStorage.setItem('osnova-language', code), lang)
    const response = await open('/missing-audit-page', 404)
    check(response.status() === 404, 'Generic missing URL must return HTTP 404')
  }
} catch (error) {
  report.findings.push(error.stack)
} finally {
  await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2))
  await browser?.close()
  await server.close()
}
console.log(JSON.stringify({ ...report, pages: report.pages.length }, null, 2))
if (report.findings.length || report.errors.length || report.externalRequests.length) process.exitCode = 1
