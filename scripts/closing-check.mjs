// Closing half of the v1 homepage: specializations 03–06, process, terms, custom CTA and the contact form.
// /api/contact is answered inside the browser so the check never sends a real Telegram lead.
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'
import puppeteer from 'puppeteer-core'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, '.visual-audit/closing')
const origin = 'http://127.0.0.1:5193'
await mkdir(output, { recursive: true })
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5193', '--strictPort'], { cwd: root, stdio: 'ignore', windowsHide: true })
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
const viewports = [['desktop', 1440, 1000], ['laptop', 1280, 800], ['tablet', 768, 1024], ['mobile', 390, 844], ['small-mobile', 320, 740]]
const specialists = ['seo', 'performance', 'ai-visibility', 'email-deliverability']
const report = []
const errors = []
const leads = []
let browser
try {
  for (let n = 0; n < 40; n++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await pause(250)
  }
  browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (new URL(request.url()).pathname !== '/api/contact') return request.continue()
    leads.push(JSON.parse(request.postData()))
    request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, delivered: false }) })
  })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  const submitEmailLead = async (lang, expectedPage) => {
    await page.waitForFunction(() => location.hash === '#contact' && document.querySelector('select[name="service"]')?.value === 'Email Deliverability')
    assert.equal(await page.$eval('#contact form', form => form.checkValidity()), false, 'empty form is invalid')
    await page.type('input[name="name"]', 'OSNOVA check')
    await page.type('input[name="contact"]', 'test@example.com')
    await page.type('textarea[name="message"]', 'Email delivery review')
    assert.equal(await page.$eval('#contact form', form => form.checkValidity()), true, 'filled form is valid')
    const before = leads.length
    await page.click('#contact .form-submit')
    await page.waitForSelector('#contact .form-success[role="status"]')
    assert.equal(leads.length, before + 1, 'one request per submit')
    const lead = leads.at(-1)
    assert.deepEqual([lead.name, lead.contact, lead.service, lead.lang, lead.hp], ['OSNOVA check', 'test@example.com', 'Email Deliverability', lang, ''])
    assert.equal(lead.page, expectedPage)
    await page.click('#contact .form-success button')
    await page.waitForSelector('#contact form')
  }
  for (const [device, width, height] of viewports) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 600, hasTouch: width < 900 })
    for (const lang of ['ru', 'en', 'de', 'uk']) {
      await page.goto(`${origin}/${lang}/`, { waitUntil: 'networkidle0' })
      await page.evaluate(() => {
        document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'))
        document.documentElement.style.scrollBehavior = 'auto'
      })
      const result = await page.evaluate(() => {
        const sections = [...document.querySelectorAll('#specializations, #process, #about, .commercial-custom, #contact')]
        const overflow = sections.flatMap(section => [...section.querySelectorAll('h2, h3, p, a, li, label, input, select, textarea, button')].filter(el => {
          const box = el.getBoundingClientRect()
          return box.width && (box.left < -1 || box.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 2)
        }).map(el => `${el.tagName}.${el.className}: ${el.textContent.slice(0, 70)}`))
        const cards = [...document.querySelectorAll('#specializations .specialist-card')]
        const targets = [...document.querySelectorAll('#specializations a, .commercial-custom a, #contact input:not([type=hidden]):not([tabindex="-1"]), #contact select, #contact textarea, #contact button')]
          .filter(el => el.getBoundingClientRect().width && !el.closest('[aria-hidden="true"]'))
          .filter(el => { const r = el.getBoundingClientRect(); return r.width < 44 || r.height < 44 })
          .map(el => `${el.tagName}.${el.className || el.name}`)
        return {
          order: sections.map(section => section.id || section.className.split(' ').pop()),
          heading: document.querySelector('#specializations h2')?.textContent,
          numbers: cards.map(el => el.querySelector('.specialist-art span').textContent.slice(0, 2)),
          hrefs: cards.map(el => el.getAttribute('href')),
          cardText: cards.map(el => el.querySelector('p')?.textContent.length || 0),
          steps: document.querySelectorAll('#process li').length,
          terms: document.querySelectorAll('#about .commercial-trust-grid p').length,
          overflow,
          targets,
          contactBackground: getComputedStyle(document.querySelector('#contact')).backgroundColor,
          contactTitle: document.querySelector('#contact h2')?.textContent,
          fields: ['name', 'contact', 'company', 'service', 'message'].filter(name => document.querySelector(`#contact [name="${name}"]`)),
        }
      })
      assert.deepEqual(result.order, ['specializations', 'process', 'about', 'commercial-custom', 'contact'], `${device}/${lang}: closing sections in order`)
      assert.ok(result.heading?.trim(), `${device}/${lang}: specializations heading`)
      assert.deepEqual(result.numbers, ['03', '04', '05', '06'], `${device}/${lang}: specializations follow Development and Automation`)
      assert.deepEqual(result.hrefs, specialists.map(slug => `/${lang}/services/${slug}`))
      assert.ok(result.cardText.every(length => length > 30), `${device}/${lang}: every specialization is described`)
      assert.equal(result.steps, 8, `${device}/${lang}: process steps`)
      assert.equal(result.terms, 4, `${device}/${lang}: working terms`)
      assert.deepEqual(result.overflow, [], `${device}/${lang}: overflow`)
      assert.deepEqual(result.targets, [], `${device}/${lang}: touch targets`)
      assert.equal(result.contactBackground, 'rgb(10, 10, 12)')
      assert.ok(result.contactTitle?.trim(), `${device}/${lang}: contact heading`)
      assert.deepEqual(result.fields, ['name', 'contact', 'company', 'service', 'message'])
      // Keep the fixed header out of isolated section captures.
      await page.$eval('.site-header', node => { node.style.visibility = 'hidden' })
      for (const [section, selector] of [['specializations', '#specializations'], ['process', '#process'], ['contact', '#contact']]) {
        const element = await page.$(selector)
        await element.screenshot({ path: resolve(output, `${lang}-${device}-${section}.png`) })
      }
      await page.$eval('.site-header', node => { node.style.visibility = '' })
      // The generic CTA opens the form without a preselected service.
      await page.$eval('.commercial-custom .button', node => node.click())
      await page.waitForFunction(() => location.hash === '#contact-form')
      assert.equal(await page.$eval('select[name="service"]', node => node.selectedIndex), 0, `${device}/${lang}: custom CTA leaves the neutral "not sure yet" option`)
      // A specialization card leads to its page, whose CTA preselects that service in the form.
      await page.goto(`${origin}/${lang}/`, { waitUntil: 'networkidle0' })
      await page.$eval('.specialist-email-deliverability', node => node.click())
      await page.waitForSelector('.email-page')
      await page.$eval('.cta-email .button', node => node.click())
      await submitEmailLead(lang, `/${lang}/#contact`)
      report.push({ device, lang, ...result, interaction: 'passed' })
      process.stdout.write(`${device}/${lang}: passed\n`)
    }
  }
  // The same specializations block also appears in the service directory.
  for (const lang of ['ru', 'en', 'de', 'uk']) {
    await page.goto(`${origin}/${lang}/services`, { waitUntil: 'networkidle0' })
    assert.deepEqual(await page.$$eval('#specializations .specialist-card', nodes => nodes.map(node => node.getAttribute('href'))), specialists.map(slug => `/${lang}/services/${slug}`))
    await page.$eval('.specialist-email-deliverability', node => node.click())
    await page.waitForSelector('.email-page')
    await page.$eval('.cta-email .button', node => node.click())
    await page.waitForFunction(() => location.hash === '#contact' && document.querySelector('select[name="service"]')?.value === 'Email Deliverability')
  }
  assert.deepEqual(errors, [])
  await writeFile(resolve(output, 'report.json'), JSON.stringify({ report, errors, leads: leads.length, directoryLinks: 'passed' }, null, 2))
  process.stdout.write(`PASS: ${report.length} layouts, ${leads.length} intercepted form submissions, directory links\n`)
} finally {
  await browser?.close()
  server.kill()
}
