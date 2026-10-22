// Read-only inspection and authentic screenshots of the client's public website.
import puppeteer from 'puppeteer-core'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, 'public/assets/cases')
const evidence = resolve(root, '.visual-audit/ds-repair')
await mkdir(output, { recursive: true })
await mkdir(evidence, { recursive: true })
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
const report = []
try {
  const page = await browser.newPage()
  await page.setRequestInterception(true)
  page.on('request', request => /google-analytics|googletagmanager|googleadservices|doubleclick/.test(new URL(request.url()).hostname) ? request.abort() : request.continue())
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 1 })
  const inspect = async url => {
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
    if (!response.ok()) throw new Error(`HTTP ${response.status()}: ${url}`)
    await page.evaluate(async () => {
      await document.fonts.ready
      for (let y = 0; y < document.body.scrollHeight; y += 800) {
        window.scrollTo(0, y)
        await new Promise(done => setTimeout(done, 100))
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
    })
    const entry = await page.evaluate(() => ({
      url: location.href, title: document.title, text: document.body.innerText,
      links: [...document.querySelectorAll('a[href]')].map(a => ({ text: a.textContent.trim(), href: a.href })),
      forms: [...document.forms].map(form => ({ action: form.getAttribute('action'), fields: [...form.elements].map(e => ({ name: e.name, type: e.type })) })),
    }))
    report.push(entry)
    return entry
  }
  const home = await inspect('https://dsrepairsolutions.com/')
  await page.screenshot({ path: resolve(output, 'ds-repair-solutions-desktop.webp'), type: 'webp', quality: 88 })
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await new Promise(done => setTimeout(done, 600))
  await page.screenshot({ path: resolve(output, 'ds-repair-solutions-mobile.webp'), type: 'webp', quality: 88 })
  console.log(JSON.stringify({ url: home.url, title: home.title, forms: home.forms.length }))
  // Follow only public navigation links; never submit a form or send a lead.
  const urls = [...new Set(home.links.map(link => link.href))].filter(url => new URL(url).origin === 'https://dsrepairsolutions.com' && /services|contact|about/.test(new URL(url).pathname) && !new URL(url).hash)
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 1, isMobile: false, hasTouch: false })
  for (const url of [...urls.slice(0, 4), 'https://dsrepairsolutions.com/services/maintenance-services/engine-oil-change/']) {
    const entry = await inspect(url)
    console.log(JSON.stringify({ url: entry.url, title: entry.title, forms: entry.forms.length }))
    if (new URL(url).pathname === '/services/') await page.screenshot({ path: resolve(output, 'ds-repair-solutions-detail.webp'), type: 'webp', quality: 85 })
  }
} finally {
  await writeFile(resolve(evidence, 'source.json'), JSON.stringify(report, null, 2))
  await browser.close()
}
