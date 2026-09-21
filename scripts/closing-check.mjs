import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'
import puppeteer from 'puppeteer-core'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, '.visual-audit/closing')
const origin = 'http://127.0.0.1:5193'
await mkdir(output, { recursive: true })
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5193'], { cwd: root, stdio: 'ignore', windowsHide: true })
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
const viewports = [['desktop', 1440, 1000], ['laptop', 1280, 800], ['tablet', 768, 1024], ['mobile', 390, 844], ['small-mobile', 320, 740]]
const report = []
const errors = []
let browser
try {
  for (let n = 0; n < 40; n++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await pause(250)
  }
  browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  for (const [device, width, height] of viewports) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 600, hasTouch: width < 900 })
    for (const lang of ['ru', 'en', 'de', 'uk']) {
      await page.goto(`${origin}/${lang}/`, { waitUntil: 'networkidle0' })
      await page.evaluate(() => {
        document.querySelectorAll('#services .reveal, #contact .reveal').forEach(node => node.classList.add('is-visible'))
        document.documentElement.style.scrollBehavior = 'auto'
      })
      const result = await page.evaluate(() => {
        const sections = [...document.querySelectorAll('#services, #contact')]
        const overflow = sections.flatMap(section => [...section.querySelectorAll('h2, h3, p, a, label, input, select, textarea, button, .world-items span')].filter(el => {
          const box = el.getBoundingClientRect()
          return box.width && (box.left < -1 || box.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 2)
        }).map(el => `${el.tagName}.${el.className}: ${el.textContent.slice(0, 70)}`))
        const cards = [...document.querySelectorAll('.world-entry')]
        return { count: cards.length, heading: document.querySelector('.worlds-heading h2').textContent, numbers: cards.map(el => el.querySelector('.world-number').textContent), overflow, contactBackground: getComputedStyle(document.querySelector('#contact')).backgroundColor, contactTitle: document.querySelector('#contact h2').textContent, columns: getComputedStyle(document.querySelector('.world-list')).gridTemplateColumns, contactHeight: document.querySelector('#contact').offsetHeight }
      })
      assert.equal(result.count, 6, `${device}/${lang}: six directions`)
      assert.match(result.heading, /^6 /)
      assert.deepEqual(result.numbers, ['01', '02', '03', '04', '05', '06'])
      assert.deepEqual(result.overflow, [], `${device}/${lang}: overflow`)
      assert.equal(result.contactBackground, 'rgb(10, 10, 12)')
      // Keep the fixed header out of isolated section captures.
      await page.$eval('.site-header', node => { node.style.visibility = 'hidden' })
      for (const [section, selector] of [['services', '#services'], ['contact', '#contact']]) {
        const element = await page.$(selector)
        await element.screenshot({ path: resolve(output, `${lang}-${device}-${section}.png`) })
      }
      await page.$eval('.site-header', node => { node.style.visibility = '' })
      await page.click('.world-email-deliverability')
      await page.waitForSelector('.email-page')
      await page.click('.cta-email .button')
      await page.waitForFunction(() => location.hash === '#contact' && document.querySelector('select[name="service"]').value === 'Email Deliverability')
      assert.equal(await page.$eval('#contact form', form => form.checkValidity()), false)
      await page.type('input[name="name"]', 'OSNOVA check')
      await page.type('input[name="contact"]', 'test@example.com')
      await page.type('textarea[name="message"]', 'Email delivery review')
      assert.equal(await page.$eval('#contact form', form => form.checkValidity()), true)
      await page.click('#contact .form-submit')
      await page.waitForSelector('#contact [role="status"]')
      await page.click('#contact .form-success button')
      await page.waitForSelector('#contact form')
      report.push({ device, lang, ...result, interaction: 'passed' })
      process.stdout.write(`${device}/${lang}: passed\n`)
    }
  }
  // The same capabilities block also appears in the service directory.
  for (const lang of ['ru', 'en', 'de', 'uk']) {
    await page.goto(`${origin}/${lang}/services`, { waitUntil: 'networkidle0' })
    assert.equal(await page.$$eval('.world-entry', nodes => nodes.length), 6)
    await page.click('.world-email-deliverability')
    await page.waitForSelector('.email-page')
    await page.click('.cta-email .button')
    await page.waitForFunction(() => location.hash === '#contact' && document.querySelector('select[name="service"]')?.value === 'Email Deliverability')
  }
  assert.deepEqual(errors, [])
  await writeFile(resolve(output, 'report.json'), JSON.stringify({ report, errors, directoryLinks: 'passed' }, null, 2))
} finally {
  await browser?.close()
  server.kill()
}
