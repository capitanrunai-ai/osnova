import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const output = `${root}/.visual-audit`
await mkdir(output, { recursive: true })

const server = spawn(
  'C:\\Program Files\\nodejs\\node.exe',
  [`${root}/node_modules/vite/bin/vite.js`, '--host', '127.0.0.1'],
  { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true },
)

const waitForServer = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:5173/ru/services')
      if (response.ok) return
    } catch {
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error('Vite did not start')
}

const audit = []
const consoleErrors = []
let browser

try {
  await waitForServer()
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

  const routes = [
    ['services', '/ru/services'],
    ['automation', '/ru/services/automation'],
    ['development', '/ru/services/development'],
    ['performance', '/ru/services/performance'],
    ['cases', '/ru/cases'],
    ['case-detail', '/ru/cases/voice-to-crm'],
    ['home', '/ru/'],
  ]

  for (const [name, route] of routes) {
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
    await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'networkidle0' })
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 35))
      }
      document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))
      window.scrollTo(0, 0)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })
    const metrics = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.innerText || document.querySelector('h2')?.innerText || '',
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      brandMarks: document.querySelectorAll('.brand-svg').length,
      growthVisible: /\bgrowth\b/i.test(document.body.innerText),
    }))
    audit.push({ name, viewport: 'desktop', ...metrics })
    await page.screenshot({ path: `${output}/${name}-desktop.png`, fullPage: true })
  }

  for (const [name, route] of routes.filter(([name]) => ['services', 'automation', 'development', 'performance', 'cases', 'case-detail', 'home'].includes(name))) {
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
    await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'networkidle0' })
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 30))
      }
      document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))
      window.scrollTo(0, 0)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })
    const metrics = await page.evaluate(() => ({
      title: document.title,
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      fixedHeader: getComputedStyle(document.querySelector('.site-header')).position,
      overflowNodes: [...document.querySelectorAll('body *')]
        .filter((node) => {
          const rect = node.getBoundingClientRect()
          return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1
        })
        .slice(0, 6)
        .map((node) => `${node.tagName.toLowerCase()}.${node.className}`),
    }))
    audit.push({ name, viewport: 'mobile', ...metrics })
    await page.screenshot({ path: `${output}/${name}-mobile.png`, fullPage: true })
  }

  for (const code of ['ru', 'en', 'de', 'uk']) {
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
    await page.goto(`http://127.0.0.1:5173/${code}/services`, { waitUntil: 'networkidle0' })
    audit.push(await page.evaluate((language) => ({
      name: `locale-${language}`,
      htmlLang: document.documentElement.lang,
      title: document.title,
      directions: [...document.querySelectorAll('.world-copy h3')].map((node) => node.textContent.trim()),
      nav: [...document.querySelectorAll('.main-nav > a')].map((node) => node.textContent.trim()),
    }), code))
  }

  for (const code of ['ru', 'en', 'de', 'uk']) {
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
    await page.goto(`http://127.0.0.1:5173/${code}/cases`, { waitUntil: 'networkidle0' })
    audit.push(await page.evaluate((language) => ({
      name: `cases-locale-${language}`,
      htmlLang: document.documentElement.lang,
      title: document.title,
      h1: document.querySelector('.cases-archive-hero h1')?.textContent,
      cards: document.querySelectorAll('.archive-card').length,
      draftBadges: document.querySelectorAll('.case-draft-badge').length,
    }), code))
  }

  for (const code of ['ru', 'en', 'de', 'uk']) {
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
    await page.goto(`http://127.0.0.1:5173/${code}/cases/voice-to-crm`, { waitUntil: 'networkidle0' })
    audit.push(await page.evaluate((language) => ({
      name: `case-detail-locale-${language}`,
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      h1: document.querySelector('.case-detail-title h1')?.textContent,
      robots: document.querySelector('meta[name="robots"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
    }), code))
  }

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await page.goto('http://127.0.0.1:5173/ru/cases', { waitUntil: 'networkidle0' })
  await page.click('.case-filter-main button:nth-child(2)')
  await new Promise((resolve) => setTimeout(resolve, 400))
  audit.push(await page.evaluate(() => ({
    name: 'cases-filter',
    activeGroup: document.querySelector('.case-filter-main button.active')?.textContent.trim(),
    cards: document.querySelectorAll('.archive-card').length,
    subfiltersVisible: document.querySelector('.case-subfilters')?.classList.contains('is-visible'),
  })))

  await page.goto('http://127.0.0.1:5173/ru/', { waitUntil: 'networkidle0' })
  await page.evaluate(() => {
    const node = document.querySelector('.spatial-stage')
    window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY, behavior: 'instant' })
  })
  await new Promise((resolve) => setTimeout(resolve, 100))
  const stage = await page.$('.spatial-stage')
  const bounds = await stage.evaluate((node) => {
    const rect = node.getBoundingClientRect()
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  })
  await page.mouse.move(bounds.x + bounds.width * .66, bounds.y + bounds.height * .5)
  await page.mouse.down()
  await page.mouse.move(bounds.x + bounds.width * .25, bounds.y + bounds.height * .5, { steps: 8 })
  await page.mouse.up()
  await new Promise((resolve) => setTimeout(resolve, 850))
  audit.push(await page.evaluate(() => ({
    name: 'cases-drag',
    activeTitle: document.querySelector('.spatial-card.is-active h3')?.textContent,
    activeIndex: [...document.querySelectorAll('.spatial-card')].findIndex((node) => node.classList.contains('is-active')),
  })))

  for (const code of ['ru', 'en', 'de', 'uk']) {
    for (const service of ['automation', 'development', 'performance']) {
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
      await page.goto(`http://127.0.0.1:5173/${code}/services/${service}`, { waitUntil: 'networkidle0' })
      audit.push(await page.evaluate((name) => ({
        name: `responsive-${name}`,
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        title: document.title,
        h1: document.querySelector('h1')?.innerText,
      }), `${code}-${service}`))
    }
  }

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await page.goto('http://127.0.0.1:5173/ru/services', { waitUntil: 'networkidle0' })
  await page.click('.world-entry.world-automation')
  await new Promise((resolve) => setTimeout(resolve, 1700))
  audit.push(await page.evaluate(() => ({
    name: 'route-transition',
    path: window.location.pathname,
    transitionIdle: !document.querySelector('.page-transition').classList.contains('is-cover') && !document.querySelector('.page-transition').classList.contains('is-reveal'),
  })))

  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
  await page.goto('http://127.0.0.1:5173/ru/services/performance', { waitUntil: 'networkidle0' })
  for (let index = 0; index < 3; index += 1) {
    await page.click(`.channel-navigation button:nth-child(${index + 1})`)
    await new Promise((resolve) => setTimeout(resolve, 180))
    audit.push(await page.evaluate(() => ({
      name: 'channel-switch',
      active: document.querySelector('.channel-navigation button.active strong')?.textContent,
      world: document.querySelector('.brand-world')?.className,
      mark: document.querySelector('.brand-object .brand-svg')?.getAttribute('aria-label'),
    })))
  }
} finally {
  await browser?.close()
  server.kill()
}

process.stdout.write(`${JSON.stringify({ audit, consoleErrors }, null, 2)}\n`)
