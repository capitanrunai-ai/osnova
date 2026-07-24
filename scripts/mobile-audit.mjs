import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const origin = 'http://127.0.0.1:5177'
const output = `${root}/.visual-audit/mobile`
await mkdir(output, { recursive: true })

const server = spawn(
  'C:\\Program Files\\nodejs\\node.exe',
  [`${root}/node_modules/vite/bin/vite.js`, '--host', '127.0.0.1', '--port', '5177'],
  { cwd: root, stdio: 'ignore', windowsHide: true },
)

const locales = ['ru', 'en', 'de', 'uk']
const routes = ['', 'services', 'services/automation', 'services/development', 'services/performance', 'cases', 'cases/voice-to-crm']
const viewports = [
  [320, 568],
  [360, 740],
  [375, 812],
  [390, 844],
  [412, 915],
  [430, 932],
]
const landscapeViewports = [[740, 360], [844, 390]]
const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

const consoleErrors = []
const report = []
const failures = []
let browser

const selectorFor = (node) => {
  if (node.id) return `#${node.id}`
  const classes = [...node.classList].filter((name) => !['reveal', 'is-visible'].includes(name)).slice(0, 2)
  return `${node.tagName.toLowerCase()}${classes.length ? `.${classes.join('.')}` : ''}`
}

try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${origin}/en/`)).ok) break
    } catch {
      // Vite is still starting.
    }
    await wait(250)
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

  const inspect = () => page.evaluate((selectorSource) => {
    const selectorForNode = new Function('node', `return (${selectorSource})(node)`)
    document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))
    const width = document.documentElement.clientWidth
    const isVisible = (node) => {
      const style = getComputedStyle(node)
      const rect = node.getBoundingClientRect()
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
    }
    const directText = (node) => [...node.childNodes]
      .filter((child) => child.nodeType === Node.TEXT_NODE)
      .map((child) => child.textContent)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    const tinyBody = [...document.querySelectorAll('p')]
      .filter((node) => isVisible(node) && !node.closest('footer') && Number.parseFloat(getComputedStyle(node).fontSize) < 15)
      .slice(0, 8)
      .map((node) => `${selectorForNode(node)}:${getComputedStyle(node).fontSize}`)

    const tinyInteractive = [...document.querySelectorAll('a, button')]
      .filter((node) => {
        if (!isVisible(node) || !directText(node)) return false
        return Number.parseFloat(getComputedStyle(node).fontSize) < 12
      })
      .slice(0, 8)
      .map((node) => `${selectorForNode(node)}:${getComputedStyle(node).fontSize}`)

    const smallTargets = [...document.querySelectorAll('a, button, select, input, textarea')]
      .filter((node) => {
        if (!isVisible(node) || node.closest('[aria-hidden="true"]')) return false
        const rect = node.getBoundingClientRect()
        return rect.width < 44 || rect.height < 44
      })
      .slice(0, 10)
      .map((node) => {
        const rect = node.getBoundingClientRect()
        return `${selectorForNode(node)}:${Math.round(rect.width)}x${Math.round(rect.height)}`
      })

    const header = document.querySelector('.site-header')?.getBoundingClientRect()
    const firstHeading = document.querySelector('main h1, main h2, .home-hero h1, .services-page h2')?.getBoundingClientRect()
    const pricing = [...document.querySelectorAll('.price-row')].map((node) => node.textContent.replace(/\s+/g, ' ').trim())

    return {
      width,
      scrollWidth: document.documentElement.scrollWidth,
      tinyBody,
      tinyInteractive,
      smallTargets,
      headerOverlap: Boolean(header && firstHeading && firstHeading.top < header.bottom + 12),
      statementPresent: document.body.textContent.includes('автоматизацию ради автоматизации')
        || document.body.textContent.includes('automation for automation')
        || document.body.textContent.includes('Automatisierung um ihrer selbst')
        || document.body.textContent.includes('автоматизацію заради автоматизації'),
      pricing,
      mobileMap: getComputedStyle(document.querySelector('.map-lines-mobile') || document.body).display,
      mobileVoice: getComputedStyle(document.querySelector('.voice-mobile-story') || document.body).display,
    }
  }, selectorFor.toString())

  for (const [width, height] of viewports) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    for (const locale of locales) {
      for (const route of routes) {
        await page.goto(`${origin}/${locale}/${route}`, { waitUntil: 'domcontentloaded' })
        await page.waitForSelector('.site-header')
        const audit = await inspect()
        const name = `${locale}/${route || 'home'}@${width}`
        report.push({ name, ...audit })
        if (audit.width !== audit.scrollWidth) failures.push(`${name}: horizontal overflow ${audit.width}/${audit.scrollWidth}`)
        if (audit.headerOverlap) failures.push(`${name}: header overlap`)
        if (audit.tinyBody.length) failures.push(`${name}: tiny body ${audit.tinyBody.join(', ')}`)
        if (audit.smallTargets.length) failures.push(`${name}: small targets ${audit.smallTargets.join(', ')}`)
        if (audit.statementPresent) failures.push(`${name}: removed statement still present`)
      }
    }
  }

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  for (const route of routes) {
    await page.goto(`${origin}/en/${route}`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.menu-button')
    await page.$eval('.menu-button', (node) => node.click())
    await wait(25)
    const menu = await page.evaluate(() => ({
      open: document.querySelector('.main-nav')?.classList.contains('is-open'),
      items: [...document.querySelectorAll('.main-nav > a')].map((node) => {
        const rect = node.getBoundingClientRect()
        return [Math.round(rect.width), Math.round(rect.height)]
      }),
    }))
    if (!menu.open || menu.items.some(([width, height]) => width < 44 || height < 44)) failures.push(`menu ${route || 'home'}`)
    await page.$eval('.menu-button', (node) => node.click())
  }

  for (const [width, height] of landscapeViewports) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    for (const route of routes) {
      await page.goto(`${origin}/en/${route}`, { waitUntil: 'domcontentloaded' })
      const audit = await inspect()
      if (audit.width !== audit.scrollWidth) failures.push(`landscape ${route || 'home'}@${width}: overflow`)
    }
  }

  const screenshots = [
    ['home-320', 320, 568, 'ru', ''],
    ['home-390', 390, 844, 'ru', ''],
    ['services-320-de', 320, 568, 'de', 'services'],
    ['services-390', 390, 844, 'ru', 'services'],
    ['automation-320-de', 320, 568, 'de', 'services/automation'],
    ['automation-390', 390, 844, 'ru', 'services/automation'],
    ['development-320-de', 320, 568, 'de', 'services/development'],
    ['development-390', 390, 844, 'ru', 'services/development'],
    ['performance-390', 390, 844, 'ru', 'services/performance'],
    ['cases-320', 320, 568, 'ru', 'cases'],
    ['case-detail-390', 390, 844, 'ru', 'cases/voice-to-crm'],
  ]

  for (const [name, width, height, locale, route] of screenshots) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    await page.goto(`${origin}/${locale}/${route}`, { waitUntil: 'networkidle0' })
    await page.evaluate(async () => {
      const step = Math.max(window.innerHeight * 0.75, 480)
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 40))
      }
      document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))
      window.scrollTo(0, 0)
    })
    await wait(900)
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true })
  }

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await page.goto(`${origin}/en/services/automation`, { waitUntil: 'networkidle0' })
  const automation = await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))
    const field = document.querySelector('.integration-field')?.getBoundingClientRect()
    const nodes = [...document.querySelectorAll('.integration-node')].map((node) => {
      const rect = node.getBoundingClientRect()
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }
    })
    return {
      processRows: document.querySelectorAll('.automation-hero-visual .ah-node').length,
      voiceRows: document.querySelectorAll('.voice-mobile-flow > div').length,
      assistantRows: document.querySelectorAll('.assistant-context-flow > div').length,
      mobileConnections: document.querySelectorAll('.integration-lines-mobile path').length,
      desktopConnectionsVisible: getComputedStyle(document.querySelector('.integration-lines-desktop')).display !== 'none',
      integrationNodesInside: nodes.every((rect) => field && rect.left >= field.left && rect.right <= field.right && rect.top >= field.top && rect.bottom <= field.bottom),
    }
  })
  if (automation.processRows !== 4 || automation.voiceRows !== 7 || automation.assistantRows !== 4 || automation.mobileConnections !== 6 || automation.desktopConnectionsVisible || !automation.integrationNodesInside) {
    failures.push(`automation composition ${JSON.stringify(automation)}`)
  }

  await page.goto(`${origin}/ru/`, { waitUntil: 'networkidle0' })
  const pricing = await page.$$eval('.price-row', (nodes) => nodes.map((node) => node.textContent.replace(/\s+/g, ' ').trim()))
  if (!pricing.some((row) => row.includes('Landing Page') && row.includes('€120'))
    || !pricing.some((row) => row.includes('Корпоративный сайт') && row.includes('€250'))
    || !pricing.some((row) => row.includes('Реклама и продвижение') && row.includes('€300'))) {
    failures.push(`pricing ${JSON.stringify(pricing)}`)
  }

  if (consoleErrors.length) failures.push(`console: ${consoleErrors.join(' | ')}`)
} finally {
  await browser?.close()
  server.kill()
}

const summary = {
  pages: report.length,
  overflows: report.filter((item) => item.width !== item.scrollWidth).length,
  tinyBodyPages: report.filter((item) => item.tinyBody.length).length,
  smallTargetPages: report.filter((item) => item.smallTargets.length).length,
  failures,
}

if (failures.length) throw new Error(`Mobile audit failed\n${JSON.stringify(summary, null, 2)}`)
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
