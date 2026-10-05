// Capture the current public website, never substitute local demo photographs.
import puppeteer from 'puppeteer-core'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, 'public/assets/cases')
await mkdir(output, { recursive: true })
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
const captures = []
try {
  const page = await browser.newPage()
  await page.setCacheEnabled(false)
  await page.evaluateOnNewDocument(() => sessionStorage.setItem('slava-intro-v2-seen', '1'))
  await page.setRequestInterception(true)
  page.on('request', request => /google-analytics|googletagmanager|googleadservices|doubleclick/.test(new URL(request.url()).hostname) ? request.abort() : request.continue())
  for (const [name, path, width, height] of [
    ['slavabud-desktop.webp', '/', 1440, 960],
    ['slavabud-mobile.webp', '/', 390, 844],
    ['slavabud-detail.webp', '/portfolio', 1440, 960],
  ]) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 700, hasTouch: width < 700 })
    const response = await page.goto(`https://slavabud.com.ua${path}`, { waitUntil: 'networkidle0', timeout: 60000 })
    if (response.status() !== 200) throw new Error(`Source returned ${response.status()}: ${path}`)
    await page.evaluate(async () => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      await document.fonts.ready
      await Promise.all([...document.images].filter(image => image.getBoundingClientRect().top < innerHeight).map(image => image.decode().catch(() => {})))
    })
    await new Promise(done => setTimeout(done, 1500))
    const screenshot = await page.screenshot({ type: 'webp', quality: 85, path: resolve(output, name) })
    captures.push({ file: name, source: page.url(), width, height, sha256: createHash('sha256').update(screenshot).digest('hex'), capturedAt: new Date().toISOString() })
  }
} finally { await browser.close() }
await mkdir(resolve(root, '.visual-audit/slavabud'), { recursive: true })
await writeFile(resolve(root, '.visual-audit/slavabud/source.json'), JSON.stringify(captures, null, 2))
console.log(JSON.stringify(captures, null, 2))
