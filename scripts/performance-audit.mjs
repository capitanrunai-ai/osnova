// Verify the built chunk graph, prerender hydration and cached SPA navigation.
// The production-host check serves local files through request interception;
// neither analytics nor the contact form reaches an external service.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import puppeteer from 'puppeteer-core'
import { buildRoutes, buildUtilityRoutes } from './site-routes.mjs'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, '.visual-audit/performance')
const origin = 'http://127.0.0.1:5187'
const locales = ['ru', 'en', 'de', 'uk']
const manifest = JSON.parse(await readFile(resolve(root, 'dist/.vite/manifest.json'), 'utf8'))
const entry = manifest['index.html']
const source = file => readFile(resolve(root, 'dist', file))
const size = async file => {
  const bytes = await source(file)
  return { bytes: bytes.length, gzip: gzipSync(bytes).length }
}
const report = { entry: await size(entry.file), initial: {}, navigation: [], errors: [], forms: 0 }
assert.ok(report.entry.bytes < 500_000, 'entry JS remains below the normal Vite warning threshold')
const routes = [...buildRoutes(), ...buildUtilityRoutes()]
for (const { path, lang } of routes) {
  const html = await readFile(resolve(root, `dist/${path}/index.html`), 'utf8')
  const preload = [...html.matchAll(/<link\b[^>]*rel="modulepreload"[^>]*href="([^"]+)"/g)].map(match => match[1])
  const localeFiles = locales.map(code => `/${manifest[`src/data/services/${code}.js`].file}`)
  assert.deepEqual(preload.filter(file => localeFiles.includes(file)), [`/${manifest[`src/data/services/${lang}.js`].file}`], `${path}: preload only the matching language`)
}
await mkdir(output, { recursive: true })
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5187', '--strictPort'], { cwd: root, stdio: 'ignore', windowsHide: true })
const wait = ms => new Promise(done => setTimeout(done, ms))
let browser

try {
  for (let attempt = 0; attempt < 40; attempt++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await wait(250)
  }
  browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const observe = page => {
    page.on('pageerror', error => report.errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()) })
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`) })
  }
  const hydrated = page => page.waitForFunction(() => !document.getElementById('prerender-reveal') && !!document.querySelector('.language-current'))

  for (const lang of locales) {
    const context = await browser.createBrowserContext()
    const page = await context.newPage()
    observe(page)
    await page.setCacheEnabled(false)
    await page.setViewport({ width: 1440, height: 900 })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    const requested = new Set()
    page.on('request', request => { if (new URL(request.url()).pathname.endsWith('.js')) requested.add(new URL(request.url()).pathname) })
    await page.goto(`${origin}/${lang}/`, { waitUntil: 'networkidle0' })
    await hydrated(page)
    assert.deepEqual([...requested].sort(), [`/${entry.file}`, `/${manifest[`src/data/services/${lang}.js`].file}`].sort(), `${lang}: initial JS excludes other languages`)
    const localeSize = await size(manifest[`src/data/services/${lang}.js`].file)
    report.initial[lang] = { bytes: report.entry.bytes + localeSize.bytes, gzip: report.entry.gzip + localeSize.gzip }
    assert.ok(await page.$('.trust-team'), `${lang}: Trust preserved after hydration`)

    const visit = async (href, selector) => {
      requested.clear()
      const started = Date.now()
      await page.$$eval('a', (links, target) => {
        const link = links.find(node => node.getAttribute('href') === target)
        if (!link) throw new Error(`Missing route link: ${target}`)
        link.click()
      }, href)
      await page.waitForFunction(target => location.pathname === target, {}, href)
      await page.waitForSelector(selector)
      assert.equal(requested.size, 0, `${href}: same-language navigation must not fetch JS`)
      report.navigation.push({ href, milliseconds: Date.now() - started })
    }
    await visit(`/${lang}/services/development`, '.development-page')
    await visit(`/${lang}/cases/dds-service`, '.portfolio-detail')
    await page.goBack({ waitUntil: 'networkidle0' })
    assert.ok(await page.$('.development-page'), `${lang}: history restores the service`)
    await page.goForward({ waitUntil: 'networkidle0' })
    assert.ok(await page.$('.portfolio-detail'), `${lang}: forward restores the case`)
    await page.click('.language-current')
    await page.waitForNetworkIdle({ idleTime: 100 })
    const nextLang = locales[(locales.indexOf(lang) + 1) % locales.length]
    await page.$eval(`.language-menu button:nth-child(${['ru', 'en', 'de', 'uk'].indexOf(nextLang) + 1})`, node => node.click())
    await page.waitForFunction(code => document.documentElement.lang === code && location.pathname === `/${code}/cases/dds-service`, {}, nextLang)
    assert.ok(await page.$('.portfolio-detail'), `${lang}: language switch keeps the route`)
    await context.close()
  }

  // Simulate the production hostname with the local build. All requests are
  // fulfilled locally, including a successful contact response and gtag stub.
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  observe(page)
  let googleRequests = 0
  const leads = []
  let rejectNextSubmission = false
  await page.setRequestInterception(true)
  page.on('request', async request => {
    const url = new URL(request.url())
    if (url.pathname === '/api/contact') {
      leads.push(JSON.parse(request.postData()))
      if (rejectNextSubmission) {
        rejectNextSubmission = false
        return request.respond({ status: 502, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'server' }) })
      }
      return request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, delivered: true }) })
    }
    if (url.hostname !== 'osnovaai.com') {
      googleRequests++
      return request.respond({ status: 200, contentType: 'application/javascript', body: '' })
    }
    const response = await fetch(`${origin}${url.pathname}${url.search}`)
    return request.respond({ status: response.status, contentType: response.headers.get('content-type'), body: Buffer.from(await response.arrayBuffer()) })
  })
  await page.goto('https://osnovaai.com/en/', { waitUntil: 'networkidle0' })
  await hydrated(page)
  await page.waitForSelector('.consent-bar')
  assert.equal(googleRequests, 0, 'analytics blocked before consent')
  await page.click('.consent-decline')
  assert.equal(await page.evaluate(() => localStorage.getItem('osnova-analytics-consent')), 'denied')
  assert.equal(googleRequests, 0, 'declining consent keeps analytics blocked')
  await page.evaluate(() => localStorage.removeItem('osnova-analytics-consent'))
  await page.reload({ waitUntil: 'networkidle0' })
  await page.click('.consent-accept')
  await page.waitForFunction(() => !!document.querySelector('script[src*="googletagmanager"]'))
  await page.waitForNetworkIdle({ idleTime: 100 })
  assert.equal(googleRequests, 1, 'analytics loads once after consent')
  for (const lang of locales) {
    await page.goto(`https://osnovaai.com/${lang}/contact`, { waitUntil: 'networkidle0' })
    await hydrated(page)
    assert.equal(await page.$eval('#contact form', form => form.checkValidity()), false)
    await page.type('input[name="name"]', 'Local performance QA')
    await page.type('input[name="contact"]', 'test@example.com')
    await page.type('textarea[name="message"]', 'Local intercepted form test')
    await page.select('select[name="service"]', 'Email Deliverability')
    await page.click('.form-submit')
    await page.waitForSelector('.form-success')
    assert.equal(leads.at(-1).lang, lang)
    assert.equal(leads.at(-1).service, 'Email Deliverability')
    const leadEvents = await page.evaluate(() => (window.dataLayer || []).filter(event => event[0] === 'event' && event[1] === 'generate_lead').length)
    assert.equal(leadEvents, 1, `${lang}: one analytics lead event`)
    report.forms++
  }
  assert.equal(leads.length, 4, 'one intercepted request per form')
  // A delivery failure preserves the entered text and can be retried. Do not
  // count it as a conversion or make any real request to the lead endpoint.
  await page.click('.form-success button')
  await page.type('input[name="name"]', 'Local retry QA')
  await page.type('input[name="contact"]', 'retry@example.invalid')
  await page.type('textarea[name="message"]', 'Keep this message after a failed delivery')
  rejectNextSubmission = true
  await page.click('.form-submit')
  await page.waitForSelector('.form-error')
  assert.equal(await page.$eval('textarea[name="message"]', node => node.value), 'Keep this message after a failed delivery')
  assert.equal(await page.evaluate(() => (window.dataLayer || []).filter(event => event[0] === 'event' && event[1] === 'generate_lead').length), 1, 'failed delivery is not a conversion')
  // Expected HTTP 502 is the one deliberate browser resource error in this test.
  report.errors = report.errors.filter(message => !/^502 .*\/api\/contact$/.test(message) && !/^Failed to load resource:.*502/.test(message))
  await page.click('.form-submit')
  await page.waitForSelector('.form-success')
  assert.equal(await page.evaluate(() => (window.dataLayer || []).filter(event => event[0] === 'event' && event[1] === 'generate_lead').length), 2, 'successful retry records one conversion')
  report.retry = true
  await context.close()
  assert.deepEqual(report.errors, [], 'no browser, hydration or asset errors')
  console.log(`PASS: ${routes.length} localized preload documents; four cold starts, cached routes/history/language switching, consent, four intercepted forms and delivery retry.`)
  console.log(JSON.stringify({ entry: report.entry, initial: report.initial, forms: report.forms, errors: report.errors }, null, 2))
} finally {
  await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2))
  await browser?.close()
  server.kill()
}
