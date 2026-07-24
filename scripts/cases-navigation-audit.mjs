import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const output = `${root}/.visual-audit`
const origin = 'http://127.0.0.1:5176'
await mkdir(output, { recursive: true })

const server = spawn(
  'C:\\Program Files\\nodejs\\node.exe',
  [`${root}/node_modules/vite/bin/vite.js`, '--host', '127.0.0.1', '--port', '5176'],
  { cwd: root, stdio: 'ignore', windowsHide: true },
)

const expectedFilters = {
  all: 6,
  automation: { all: 2, 'AI Voice': 1, CRM: 2, Workflow: 1 },
  development: { all: 2, Websites: 1, Development: 1 },
  performance: { all: 2, 'Google Ads': 1, 'Meta Ads': 1, 'TikTok Ads': 1, Analytics: 2 },
}

let browser
const consoleErrors = []
const report = { desktop: {}, mobile: {}, filters: {}, locales: {} }

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

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

  const openGallery = async (width, height) => {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 700, hasTouch: width < 700 })
    await page.goto(`${origin}/en/`, { waitUntil: 'networkidle0' })
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))
      document.querySelector('#cases')?.scrollIntoView({ block: 'start' })
    })
    await wait(250)
  }

  await openGallery(1440, 1000)
  await page.$eval('.spatial-nav-button.is-next', (node) => node.click())
  await wait(780)
  report.desktop = await page.evaluate(() => ({
    active: [...document.querySelectorAll('.spatial-card')].findIndex((node) => node.classList.contains('is-active')),
    current: document.querySelector('.spatial-status strong')?.textContent,
    total: document.querySelector('.spatial-status b')?.textContent,
    previousDisabled: document.querySelector('.spatial-nav-button.is-previous')?.disabled,
    nextDisabled: document.querySelector('.spatial-nav-button.is-next')?.disabled,
    openLabel: document.querySelector('.spatial-card.is-active .case-open-action > span')?.textContent,
    progressItems: document.querySelectorAll('.spatial-progress button').length,
    navTargets: [...document.querySelectorAll('.spatial-nav-button')].map((node) => {
      const rect = node.getBoundingClientRect()
      return [Math.round(rect.width), Math.round(rect.height)]
    }),
  }))
  await (await page.$('.cases-showcase')).screenshot({ path: `${output}/cases-navigation-desktop.png` })

  await page.$eval('.spatial-card.is-active > a', (node) => node.click())
  await wait(1400)
  report.desktop.openedPath = new URL(page.url()).pathname

  await openGallery(390, 844)
  await page.$eval('.spatial-stage', (node) => node.scrollIntoView({ block: 'center' }))
  await wait(100)
  const stageBounds = await page.$eval('.spatial-stage', (node) => {
    const rect = node.getBoundingClientRect()
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  })
  const dispatchTouch = (type, clientX, active) => page.$eval('.spatial-stage', (node, payload) => {
    const event = new Event(payload.type, { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'touches', { value: payload.active ? [{ clientX: payload.clientX }] : [] })
    node.dispatchEvent(event)
  }, { type, clientX, active })
  await dispatchTouch('touchstart', stageBounds.x + stageBounds.width * .77, true)
  for (let step = 1; step <= 10; step += 1) {
    const progress = step / 10
    await dispatchTouch('touchmove', stageBounds.x + stageBounds.width * (.77 - .57 * progress), true)
    await wait(18)
  }
  await dispatchTouch('touchend', stageBounds.x + stageBounds.width * .2, false)
  await wait(780)
  report.mobile = await page.evaluate(() => ({
    activeAfterSwipe: [...document.querySelectorAll('.spatial-card')].findIndex((node) => node.classList.contains('is-active')),
    current: document.querySelector('.spatial-status strong')?.textContent,
    total: document.querySelector('.spatial-status b')?.textContent,
    navPosition: getComputedStyle(document.querySelector('.spatial-navigation')).position,
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    navTargets: [...document.querySelectorAll('.spatial-nav-button')].map((node) => {
      const rect = node.getBoundingClientRect()
      return [Math.round(rect.width), Math.round(rect.height)]
    }),
  }))
  await (await page.$('.cases-showcase')).screenshot({ path: `${output}/cases-navigation-mobile.png` })

  for (let step = 0; step < 5; step += 1) {
    await page.$eval('.spatial-nav-button.is-next', (node) => node.click())
    await wait(30)
  }
  report.mobile.endBoundary = await page.evaluate(() => ({
    current: document.querySelector('.spatial-status strong')?.textContent,
    nextDisabled: document.querySelector('.spatial-nav-button.is-next')?.disabled,
    nextLabel: document.querySelector('.spatial-nav-button.is-next small')?.textContent,
  }))
  await page.$eval('.spatial-nav-button.is-previous', (node) => node.click())
  await wait(30)
  report.mobile.afterPrevious = await page.$eval('.spatial-status strong', (node) => node.textContent)

  const selectGroup = async (label) => {
    await page.$$eval('.case-filter-main button', (nodes, text) => nodes.find((node) => node.textContent.trim() === text)?.click(), label)
    await wait(80)
  }
  const selectSubfilter = async (label) => {
    await page.$$eval('.case-subfilters button', (nodes, text) => nodes.find((node) => node.textContent.trim() === text)?.click(), label)
    await wait(80)
  }
  const galleryState = () => page.evaluate(() => ({
    cards: document.querySelectorAll('.spatial-card').length,
    current: document.querySelector('.spatial-status strong')?.textContent,
    total: document.querySelector('.spatial-status b')?.textContent,
    previousDisabled: document.querySelector('.spatial-nav-button.is-previous')?.disabled,
  }))

  report.filters.all = await galleryState()
  for (const [group, filters] of Object.entries(expectedFilters).filter(([name]) => name !== 'all')) {
    const groupLabel = group[0].toUpperCase() + group.slice(1)
    await selectGroup(groupLabel)
    report.filters[group] = { all: await galleryState() }
    for (const label of Object.keys(filters).filter((name) => name !== 'all')) {
      await selectSubfilter(label)
      report.filters[group][label] = await galleryState()
    }
  }

  for (const code of ['ru', 'en', 'de', 'uk']) {
    await page.goto(`${origin}/${code}/`, { waitUntil: 'networkidle0' })
    await page.$eval('.spatial-nav-button.is-next', (node) => node.click())
    await wait(40)
    report.locales[code] = await page.evaluate(() => ({
      current: document.querySelector('.spatial-status strong')?.textContent,
      total: document.querySelector('.spatial-status b')?.textContent,
      labels: [...document.querySelectorAll('.spatial-nav-button small')].map((node) => node.textContent.trim()),
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
  }

  const mismatches = []
  if (report.desktop.active !== 1 || report.desktop.current !== '02' || report.desktop.total !== '06') mismatches.push('desktop next control')
  if (report.desktop.openedPath !== '/en/cases/lead-routing-system') mismatches.push('active case opening')
  if (report.mobile.activeAfterSwipe !== 1 || report.mobile.current !== '02' || report.mobile.total !== '06') mismatches.push('mobile swipe')
  if (report.mobile.width !== report.mobile.scrollWidth) mismatches.push('mobile overflow')
  if (report.mobile.endBoundary.current !== '06' || !report.mobile.endBoundary.nextDisabled || report.mobile.endBoundary.nextLabel !== 'End' || report.mobile.afterPrevious !== '05') mismatches.push('end boundary')
  if ([...report.desktop.navTargets, ...report.mobile.navTargets].some(([width, height]) => width < 44 || height < 44)) mismatches.push('navigation touch targets')

  if (report.filters.all.cards !== expectedFilters.all) mismatches.push('all filter')
  for (const [group, filters] of Object.entries(expectedFilters).filter(([name]) => name !== 'all')) {
    for (const [filter, expected] of Object.entries(filters)) {
      const actual = report.filters[group][filter].cards
      if (actual !== expected || report.filters[group][filter].total !== String(expected).padStart(2, '0')) {
        mismatches.push(`${group}/${filter}`)
      }
    }
  }
  if (Object.values(report.locales).some(({ current, total, labels, width, scrollWidth }) => (
    current !== '02'
    || total !== '06'
    || labels.some((label) => !label)
    || width !== scrollWidth
  ))) mismatches.push('localized navigation')
  if (mismatches.length) throw new Error(`Navigation audit failed: ${mismatches.join(', ')}\n${JSON.stringify(report, null, 2)}`)
  if (consoleErrors.length) throw new Error(`Browser errors: ${consoleErrors.join(' | ')}`)
} finally {
  await browser?.close()
  server.kill()
}

process.stdout.write(`${JSON.stringify({ report, consoleErrors }, null, 2)}\n`)
