import { spawn } from 'node:child_process'
import puppeteer from 'puppeteer-core'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const origin = 'http://127.0.0.1:5174'
const server = spawn(
  'C:\\Program Files\\nodejs\\node.exe',
  [`${root}/node_modules/vite/bin/vite.js`, '--host', '127.0.0.1', '--port', '5174'],
  { cwd: root, stdio: 'ignore', windowsHide: true },
)

let browser
const results = {}
const consoleErrors = []

try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${origin}/ru/cases`)).ok) break
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  })
  const page = await browser.newPage()
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(error.message))

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await page.goto(`${origin}/ru/`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => {
    const node = document.querySelector('.spatial-stage')
    window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY, behavior: 'instant' })
  })
  await new Promise((resolve) => setTimeout(resolve, 100))
  const bounds = await page.$eval('.spatial-stage', (node) => {
    const rect = node.getBoundingClientRect()
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  })
  await page.mouse.move(bounds.x + bounds.width * .66, bounds.y + bounds.height * .5)
  await page.mouse.down()
  await page.mouse.move(bounds.x + bounds.width * .25, bounds.y + bounds.height * .5, { steps: 10 })
  await page.mouse.up()
  await new Promise((resolve) => setTimeout(resolve, 850))
  results.drag = await page.$eval('.spatial-card.is-active h3', (node) => node.textContent)

  await page.goto(`${origin}/ru/cases`, { waitUntil: 'networkidle0' })
  await page.click('.case-filter-main button:nth-child(2)')
  await new Promise((resolve) => setTimeout(resolve, 350))
  results.filterCount = await page.$$eval('.archive-card', (nodes) => nodes.length)

  results.locales = {}
  for (const code of ['ru', 'en', 'de', 'uk']) {
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
    await page.goto(`${origin}/${code}/cases/voice-to-crm`, { waitUntil: 'networkidle0' })
    results.locales[code] = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      robots: document.querySelector('meta[name="robots"]')?.content,
    }))
  }
} finally {
  await browser?.close()
  server.kill()
}

if (results.drag === 'От звонка до CRM') throw new Error('Spatial drag did not advance the active case')
if (results.filterCount !== 2) throw new Error(`Automation filter returned ${results.filterCount} cases`)
if (Object.values(results.locales).some(({ width, scrollWidth }) => width !== scrollWidth)) throw new Error('Mobile horizontal overflow detected')
if (consoleErrors.length) throw new Error(`Browser errors: ${consoleErrors.join(' | ')}`)

process.stdout.write(`${JSON.stringify({ results, consoleErrors }, null, 2)}\n`)
