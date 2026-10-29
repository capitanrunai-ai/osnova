// Local production-output checks. Never sends orders, leads or analytics.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
import { startProductionAuditServer } from './production-audit-server.mjs'

const output = '.visual-audit/terms'
await mkdir(output, { recursive: true })
const server = await startProductionAuditServer()
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
const report = { layouts: [], contexts: [], errors: [], externalRequests: [] }
try {
  const page = await browser.newPage()
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (new URL(request.url()).origin === server.origin) return request.continue()
    report.externalRequests.push(request.url())
    return request.abort()
  })
  page.on('pageerror', error => report.errors.push(error.message))
  for (const lang of ['ru', 'en', 'de', 'uk']) {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewport({ width, height: width < 700 ? 844 : 1000 })
      const response = await page.goto(`${server.origin}/${lang}/terms`, { waitUntil: 'networkidle0' })
      assert.equal(response.status(), 200)
      await page.waitForSelector('.terms-details article')
      const state = await page.evaluate(async () => {
        await document.fonts.ready
        const main = document.querySelector('main')
        const heading = main.querySelector('h1').firstChild
        const brokenHeadingWords = [...heading.textContent.matchAll(/\S+/gu)].filter(match => {
          const range = document.createRange()
          range.setStart(heading, match.index)
          range.setEnd(heading, match.index + match[0].length)
          return range.getClientRects().length > 1
        }).map(match => match[0])
        return {
          brokenHeadingWords,
          lang: document.documentElement.lang, h1: main.querySelectorAll('h1').length,
          text: main.innerText, overflow: document.documentElement.scrollWidth > innerWidth,
          clipped: [...main.querySelectorAll('h1,h2,p,li,a')].filter(n => n.scrollWidth > n.clientWidth + 2 && getComputedStyle(n).display !== 'inline').map(n => n.textContent),
          canonical: document.querySelector('link[rel=canonical]').href,
          alternates: [...document.querySelectorAll('link[hreflang]')].map(n => n.hreflang),
          email: main.querySelector('a[href^="mailto:"]').getAttribute('href'),
          telegram: main.querySelector('a[href^="https://t.me/"]').href,
        }
      })
      assert.equal(state.lang, lang)
      assert.equal(state.h1, 1)
      assert.deepEqual(state.brokenHeadingWords, [], `${lang}@${width}: split heading word`)
      assert.equal(state.overflow, false, `${lang}@${width}: overflow`)
      assert.deepEqual(state.clipped, [], `${lang}@${width}: clipped text`)
      for (const term of ['30', '70', '45', '2–3', '7', '48', '24', '14', 'B2B', 'B2C', 'SLA', 'Managed Automation', 'Email Deliverability']) assert(state.text.includes(term), `${lang}: missing ${term}`)
      assert(!/09:00|23:00|\[reference|\[номер|undefined|\uFFFD/.test(state.text), `${lang}: unapproved promise or placeholder`)
      assert(state.canonical.endsWith(`/${lang}/terms`))
      assert.deepEqual(state.alternates.sort(), ['de', 'en', 'ru', 'uk', 'x-default'])
      assert.equal(state.email, 'mailto:capitanrun@osnova.ai')
      assert.equal(state.telegram, 'https://t.me/capitanrun')
      await page.screenshot({ path: `${output}/${lang}-${width}.png`, fullPage: true })
      report.layouts.push({ lang, width, overflow: false, clipped: false })
    }
    for (const route of ['contact', 'payment', 'services/development', 'services/automation', 'services/email-deliverability', 'cases']) {
      await page.goto(`${server.origin}/${lang}/${route}`, { waitUntil: 'networkidle0' })
      await page.waitForSelector(`footer a[href="/${lang}/terms"]`)
      const selector = route === 'contact' ? 'form .terms-link' : route === 'payment' ? '.payment-intro .terms-link' : `footer a[href="/${lang}/terms"]`
      if (route === 'contact') assert.equal(await page.$('form input[type=checkbox][required]'), null, 'enquiries need no mandatory terms checkbox')
      await page.$eval(selector, node => node.click())
      await page.waitForSelector('.terms-page')
      assert.equal(new URL(page.url()).pathname, `/${lang}/terms`)
      await page.goBack()
      await page.waitForFunction(route => location.pathname.endsWith('/' + route), {}, route)
      report.contexts.push({ lang, route, link: 'PASS', history: 'PASS' })
    }
  }
  assert.deepEqual(report.errors, [])
  assert.deepEqual(report.externalRequests, [])
  console.log('PASS Terms: 16 layouts, 24 context links and history checks; four languages; no required enquiry checkbox or external calls.')
} finally {
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2))
  await browser.close()
  await server.close()
}
