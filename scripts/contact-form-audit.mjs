// Browser -> real contact handler -> in-memory Telegram stub. Local requests only.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import contact from '../netlify/functions/contact.mjs'
import { content } from '../src/data/content.js'
import { closingContent } from '../src/data/closingContent.js'

const origin = 'http://127.0.0.1:5194'
const output = resolve('.visual-audit/contact-form')
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5194', '--strictPort'], { stdio: 'ignore', windowsHide: true })
const originalFetch = globalThis.fetch
const originalNetlify = globalThis.Netlify
const report = { layouts: [], submissions: [], deliveries: [], errors: [], externalRequests: [] }
const wait = ms => new Promise(done => setTimeout(done, ms))
globalThis.Netlify = { env: { get: name => `local-test-${name}` } }
globalThis.fetch = async (url, options) => {
  if (new URL(url).hostname === 'api.telegram.org') {
    report.deliveries.push(JSON.parse(options.body))
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }
  assert.equal(new URL(url).origin, origin, 'no external fetch')
  return originalFetch(url, options)
}
let browser
await mkdir(output, { recursive: true })
try {
  for (let n = 0; n < 60; n++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await wait(250)
  }
  browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  page.on('pageerror', error => report.errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()) })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.setRequestInterception(true)
  page.on('request', async request => {
    const url = new URL(request.url())
    if (url.origin !== origin) {
      report.externalRequests.push(request.url())
      return request.abort()
    }
    if (url.pathname !== '/api/contact') return request.continue()
    const body = JSON.parse(request.postData())
    const response = await contact(new Request(`${origin}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }))
    report.submissions.push({ body, status: response.status })
    return request.respond({ status: response.status, contentType: 'application/json', body: await response.text() })
  })
  const fill = async values => page.evaluate(values => {
    for (const [name, value] of Object.entries(values)) {
      const input = document.querySelector(`#contact [name="${name}"]`)
      input.value = value
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }, values)
  const submit = async () => page.$eval('#contact .form-submit', button => button.click())
  const back = async () => {
    await page.$eval('#contact .form-success button', button => button.click())
    await page.waitForSelector('#contact form')
  }
  for (const width of [320, 375, 390, 430, 768, 1280, 1440]) {
    await page.setViewport({ width, height: width < 700 ? 844 : 1000, isMobile: width < 700, hasTouch: width < 700 })
    for (const lang of ['ru', 'en', 'de', 'uk']) {
      const where = `${lang}@${width}`
      const copy = closingContent[lang]
      await page.goto(`${origin}/${lang}/contact`, { waitUntil: 'domcontentloaded' })
      await page.waitForSelector('#contact form')
      await page.evaluate(async () => {
        document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'))
        document.documentElement.style.scrollBehavior = 'auto'
        await document.fonts.ready
      })
      const layout = await page.evaluate(() => {
        const fields = [...document.querySelectorAll('#contact form label')].map(label => {
          const input = label.querySelector('input, select, textarea')
          return { name: input.name, label: label.querySelector('span').textContent.trim(), required: input.required, type: input.type, inputMode: input.inputMode, pattern: input.getAttribute('pattern'), placeholder: input.getAttribute('placeholder') }
        })
        const clipped = [...document.querySelectorAll('#contact label, #contact label > span, #contact .contact-form-heading p, #contact textarea')].filter(n => n.scrollWidth > n.clientWidth + 2).map(n => n.textContent)
        return { fields, clipped, overflow: document.documentElement.scrollWidth > innerWidth + 1, options: [...document.querySelector('select[name="service"]').options].map(n => n.value), textareaHeight: document.querySelector('textarea').getBoundingClientRect().height }
      })
      assert.deepEqual(layout.fields.map(field => field.name), ['name', 'contact', 'email', 'company', 'service', 'message'])
      assert.deepEqual(layout.fields.filter(field => field.required).map(field => field.name), ['name', 'contact', 'service'])
      assert.equal(layout.fields[1].label, content[lang].contact.fields.contact)
      assert.equal(layout.fields[1].type, 'text')
      assert.equal(layout.fields[1].inputMode, 'text')
      assert.equal(layout.fields[1].pattern, null, 'contact format stays flexible')
      assert.equal(layout.fields[2].type, 'email')
      assert.equal(layout.fields[5].label, `${content[lang].contact.fields.message} (${copy.optional})`)
      assert.equal(layout.fields[5].placeholder, copy.messageHint)
      assert.equal(layout.overflow, false, where)
      assert.deepEqual(layout.clipped, [], where)
      assert.ok(layout.textareaHeight >= 112)
      const options = content[lang].contact.options
      assert.deepEqual(layout.options, [options.at(-1), ...options.slice(0, -1)])
      const before = report.submissions.length
      await submit()
      assert.equal(await page.$eval('[name="name"]', n => n.validationMessage), copy.validation.name)
      await fill({ name: 'Local QA', contact: '' })
      await submit()
      assert.equal(await page.$eval('[name="contact"]', n => n.validationMessage), copy.validation.contact)
      await fill({ contact: '   ' })
      await submit()
      assert.equal(await page.$eval('[name="contact"]', n => n.validationMessage), copy.validation.contact)
      await fill({ name: '   ', contact: '@local_qa' })
      await submit()
      assert.equal(await page.$eval('[name="name"]', n => n.validationMessage), copy.validation.name)
      await fill({ name: 'Local QA', email: 'invalid-email' })
      await submit()
      assert.equal(await page.$eval('[name="email"]', n => n.validationMessage), copy.validation.email)
      assert.equal(report.submissions.length, before, 'invalid fields never submit')
      await fill({ email: '' })
      // Include the real anti-spam minimum time before the first valid submission.
      await wait(1250)
      await page.$eval('.site-header', n => { n.style.visibility = 'hidden' })
      await (await page.$('.contact-form-wrap')).screenshot({ path: resolve(output, `${lang}-${width}.png`) })
      await page.$eval('.site-header', n => { n.style.visibility = '' })
      for (const [index, service] of options.entries()) {
        const primary = ['+34 600 123 456', '@local_qa', 'local_qa'][index % 3]
        await fill({ name: 'Local QA', contact: primary })
        await page.select('select[name="service"]', service)
        // Use actual pointer/touch activation too, without any hover dependency.
        if (width < 700 && index === 0) await page.tap('#contact .form-submit')
        else await submit()
        await page.waitForSelector('#contact .form-success[role="status"]')
        const submitted = report.submissions.at(-1)
        assert.equal(submitted.status, 200, where)
        assert.deepEqual([submitted.body.contact, submitted.body.service, submitted.body.lang, submitted.body.email, submitted.body.company, submitted.body.message], [primary, service, lang, '', '', ''])
        const text = report.deliveries.at(-1).text
        assert.ok(text.includes(`Телефон / Telegram: ${primary}`) && text.includes(`Направление: ${service}`))
        assert.ok(!/Email:|Компания:|Описание задачи:|undefined|null/.test(text))
        await back()
      }
      await fill({ name: 'Local QA', contact: '+49 (30) 123-45', email: 'qa@example.invalid', company: 'QA Company', message: 'A new website from scratch' })
      await submit()
      await page.waitForSelector('#contact .form-success')
      assert.ok(report.deliveries.at(-1).text.includes('Email: qa@example.invalid\nКомпания: QA Company'))
      assert.ok(report.deliveries.at(-1).text.includes('Описание задачи: A new website from scratch'))
      assert.equal(report.submissions.length, before + 10)
      report.layouts.push({ where, ...layout, validation: 'passed', directions: options.length, phoneAndTelegram: 'passed', optionalFields: 'passed' })
    }
    console.log(`PASS contact form at ${width}px: four languages, all nine directions, validation and real handler payloads`)
  }
  assert.deepEqual(report.errors, [])
  assert.deepEqual(report.externalRequests, [])
  assert.equal(report.submissions.length, report.deliveries.length)
  console.log(`PASS contact form: ${report.layouts.length} layouts; ${report.submissions.length} submissions delivered only to the local Telegram stub; no console errors or external requests`)
} finally {
  await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2))
  await browser?.close()
  server.kill()
  globalThis.fetch = originalFetch
  if (originalNetlify === undefined) delete globalThis.Netlify
  else globalThis.Netlify = originalNetlify
}
