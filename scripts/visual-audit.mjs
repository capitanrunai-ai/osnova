// Full-page captures of the v1 site plus hard checks: no horizontal overflow, real headings,
// localized chrome, the cases gallery (filter + drag), route transitions and Performance channels.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const output = `${root}/.visual-audit`
await mkdir(output, { recursive: true })

const server = spawn(
  'C:\\Program Files\\nodejs\\node.exe',
  [`${root}/node_modules/vite/bin/vite.js`, '--host', '127.0.0.1', '--port', '5173', '--strictPort'],
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
    ['seo', '/ru/services/seo'],
    ['email', '/ru/services/email-deliverability'],
    ['payment', '/ru/payment'],
    ['cases', '/ru/cases'],
    ['case-detail', '/ru/cases/ai-voice-operator'],
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
      h1: document.querySelector('h1')?.innerText || '',
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      brandMarks: document.querySelectorAll('.brand-svg').length,
      growthVisible: /\bgrowth\b/i.test(document.body.innerText),
    }))
    assert.equal(metrics.scrollWidth, metrics.width, `desktop ${name}: horizontal overflow`)
    assert.ok(metrics.title.endsWith('OSNOVA'), `desktop ${name}: title`)
    assert.ok(metrics.h1.trim(), `desktop ${name}: h1`)
    audit.push({ name, viewport: 'desktop', ...metrics })
    await page.screenshot({ path: `${output}/${name}-desktop.png`, fullPage: true })
  }

  for (const [name, route] of routes) {
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
    await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'networkidle0' })
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 650) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 30))
      }
      document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))
      window.scrollTo(0, 0)
      await new Promise((resolve) => setTimeout(resolve, 700))
    })
    const metrics = await page.evaluate(() => ({
      title: document.title,
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }))
    assert.equal(metrics.scrollWidth, metrics.width, `laptop ${name}: horizontal overflow`)
    audit.push({ name, viewport: 'laptop', ...metrics })
    await page.screenshot({ path: `${output}/${name}-laptop.png`, fullPage: true })
  }

  for (const [name, route] of routes) {
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
      // Informational: intentionally off-canvas pieces (gallery neighbours) are clipped by their containers.
      overflowNodes: [...document.querySelectorAll('body *')]
        .filter((node) => {
          const rect = node.getBoundingClientRect()
          return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1
        })
        .slice(0, 6)
        .map((node) => `${node.tagName.toLowerCase()}.${node.className}`),
    }))
    assert.equal(metrics.scrollWidth, metrics.width, `mobile ${name}: horizontal overflow`)
    assert.equal(metrics.fixedHeader, 'fixed', `mobile ${name}: fixed header`)
    audit.push({ name, viewport: 'mobile', ...metrics })
    await page.screenshot({ path: `${output}/${name}-mobile.png`, fullPage: true })
  }

  // Development first, Automation second, then the four specializations — in every language.
  const firstNav = { ru: 'Разработка', en: 'Development', de: 'Entwicklung', uk: 'Розробка' }
  for (const code of ['ru', 'en', 'de', 'uk']) {
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
    await page.goto(`http://127.0.0.1:5173/${code}/services`, { waitUntil: 'networkidle0' })
    const locale = await page.evaluate((language) => ({
      name: `locale-${language}`,
      htmlLang: document.documentElement.lang,
      title: document.title,
      offers: [...document.querySelectorAll('.commercial-offers .commercial-price')].map((node) => node.textContent.trim()),
      directions: [...document.querySelectorAll('#specializations .specialist-card h3')].map((node) => node.textContent.trim()),
      nav: [...document.querySelectorAll('.main-nav > a')].map((node) => node.textContent.trim()),
    }), code)
    assert.equal(locale.htmlLang, code)
    assert.equal(locale.nav[0], firstNav[code], `${code}: localized navigation`)
    assert.equal(locale.offers.length, 3, `${code}: offers`)
    assert.ok(['€250', '€500', '€149'].every((price, index) => locale.offers[index].includes(price)), `${code}: offer order and prices`)
    assert.equal(locale.directions.length, 4, `${code}: specializations`)
    assert.ok(locale.directions.every(Boolean), `${code}: specialization names`)
    audit.push(locale)
  }
  assert.equal(new Set(audit.filter((item) => item.name.startsWith('locale-')).map((item) => item.offers.join('|'))).size, 4, 'offers are localized')

  for (const code of ['ru', 'en', 'de', 'uk']) {
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
    await page.goto(`http://127.0.0.1:5173/${code}/services/performance`, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.querySelectorAll('.channel-navigation button')[2]?.click())
    await new Promise((resolve) => setTimeout(resolve, 120))
    const channel = await page.evaluate((language) => ({
      name: `tiktok-locale-${language}`,
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      capabilitiesLabel: document.querySelector('.channel-capabilities > span')?.textContent.trim(),
      capabilities: [...document.querySelectorAll('.channel-capability strong')].map((node) => node.textContent.trim()),
      story: [...document.querySelectorAll('.channel-logic > span')].map((node) => ({
        title: node.querySelector('strong')?.textContent.trim(),
        text: node.querySelector('small')?.textContent.trim(),
      })),
    }), code)
    assert.equal(channel.scrollWidth, channel.width, `${code}: TikTok channel overflow`)
    assert.ok(channel.capabilitiesLabel && channel.capabilities.length, `${code}: TikTok capabilities`)
    assert.ok(channel.story.length && channel.story.every((step) => step.title && step.text), `${code}: TikTok story`)
    audit.push(channel)
  }

  for (const code of ['ru', 'en', 'de', 'uk']) {
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
    await page.goto(`http://127.0.0.1:5173/${code}/cases`, { waitUntil: 'networkidle0' })
    const cases = await page.evaluate((language) => ({
      name: `cases-locale-${language}`,
      htmlLang: document.documentElement.lang,
      title: document.title,
      h1: document.querySelector('.cases-archive-hero h1')?.textContent,
      cards: document.querySelectorAll('.spatial-card').length,
      audioPlayers: document.querySelectorAll('.voice-player').length,
    }), code)
    assert.equal(cases.htmlLang, code)
    assert.ok(cases.h1?.trim(), `${code}: cases heading`)
    assert.ok(cases.cards > 0, `${code}: case gallery`)
    assert.equal(cases.cards, audit.find((item) => item.name.startsWith('cases-locale-'))?.cards ?? cases.cards, `${code}: same case set in every language`)
    audit.push(cases)
  }
  const allCases = audit.find((item) => item.name === 'cases-locale-ru').cards

  for (const code of ['ru', 'en', 'de', 'uk']) {
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
    await page.goto(`http://127.0.0.1:5173/${code}/cases/ai-voice-operator`, { waitUntil: 'networkidle0' })
    const detail = await page.evaluate((language) => ({
      name: `case-detail-locale-${language}`,
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      h1: document.querySelector('.portfolio-detail-heading h1')?.textContent,
      robots: document.querySelector('meta[name="robots"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
    }), code)
    assert.equal(detail.scrollWidth, detail.width, `${code}: case detail overflow`)
    assert.ok(detail.h1?.trim(), `${code}: case detail heading`)
    assert.equal(new URL(detail.canonical).pathname, `/${code}/cases/ai-voice-operator`)
    audit.push(detail)
  }

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await page.goto('http://127.0.0.1:5173/ru/cases', { waitUntil: 'networkidle0' })
  await page.click('.case-filter-main button:nth-child(2)')
  await new Promise((resolve) => setTimeout(resolve, 400))
  const filter = await page.evaluate(() => ({
    name: 'cases-filter',
    activeGroup: document.querySelector('.case-filter-main button.active')?.textContent.trim(),
    expectedGroup: document.querySelector('.case-filter-main button:nth-child(2)')?.textContent.trim(),
    cards: document.querySelectorAll('.spatial-card').length,
    subfiltersVisible: document.querySelector('.case-subfilters')?.classList.contains('is-visible'),
  }))
  assert.equal(filter.activeGroup, filter.expectedGroup, 'filter activates')
  assert.ok(filter.cards > 0 && filter.cards < allCases, 'filter narrows the gallery')
  audit.push(filter)

  // The spatial gallery lives on the cases archive since the v1 homepage.
  await page.goto('http://127.0.0.1:5173/ru/cases', { waitUntil: 'networkidle0' })
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
  const drag = await page.evaluate(() => ({
    name: 'cases-drag',
    activeTitle: document.querySelector('.spatial-card.is-active h3')?.textContent,
    activeIndex: [...document.querySelectorAll('.spatial-card')].findIndex((node) => node.classList.contains('is-active')),
  }))
  assert.equal(drag.activeIndex, 1, 'dragging left advances the gallery')
  audit.push(drag)

  for (const code of ['ru', 'en', 'de', 'uk']) {
    for (const service of ['automation', 'development', 'performance']) {
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
      await page.goto(`http://127.0.0.1:5173/${code}/services/${service}`, { waitUntil: 'networkidle0' })
      const responsive = await page.evaluate((name) => ({
        name: `responsive-${name}`,
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        title: document.title,
        h1: document.querySelector('h1')?.innerText,
      }), `${code}-${service}`)
      assert.equal(responsive.scrollWidth, responsive.width, `${responsive.name}: overflow`)
      assert.ok(responsive.h1?.trim(), `${responsive.name}: h1`)
      audit.push(responsive)
    }
  }

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await page.goto('http://127.0.0.1:5173/ru/services', { waitUntil: 'networkidle0' })
  await page.$eval('.commercial-bridge .commercial-text-link', (node) => node.click())
  await new Promise((resolve) => setTimeout(resolve, 1700))
  const transition = await page.evaluate(() => ({
    name: 'route-transition',
    path: window.location.pathname,
    transitionIdle: !document.querySelector('.page-transition').classList.contains('is-cover') && !document.querySelector('.page-transition').classList.contains('is-reveal'),
  }))
  assert.equal(transition.path, '/ru/services/automation', 'Automation link routes')
  assert.ok(transition.transitionIdle, 'route transition finishes')
  audit.push(transition)

  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
  await page.goto('http://127.0.0.1:5173/ru/services/performance', { waitUntil: 'networkidle0' })
  for (let index = 0; index < 3; index += 1) {
    await page.evaluate((activeIndex) => document.querySelectorAll('.channel-navigation button')[activeIndex]?.click(), index)
    await new Promise((resolve) => setTimeout(resolve, 420))
    await page.$eval('.brand-composition', (node) => node.scrollIntoView({ block: 'center' }))
    const activeName = await page.$eval('.channel-navigation button.active strong', (node) => node.textContent.trim().toLowerCase())
    await (await page.$('.brand-composition')).screenshot({ path: `${output}/brand-${activeName}-desktop.png` })
    await (await page.$('.brand-world')).screenshot({ path: `${output}/brand-${activeName}-experience-desktop.png` })
    const channelSwitch = await page.evaluate(() => ({
      name: 'channel-switch',
      active: document.querySelector('.channel-navigation button.active strong')?.textContent,
      world: document.querySelector('.brand-world')?.className,
      mark: document.querySelector('.brand-object .brand-svg')?.getAttribute('aria-label') || document.querySelector('.brand-object .brand-svg')?.getAttribute('alt'),
      core: Math.round(document.querySelector('.brand-object')?.getBoundingClientRect().width || 0),
      orbit: Math.round(document.querySelector('.brand-orbits')?.getBoundingClientRect().width || 0),
      microLabels: document.querySelectorAll('.brand-object small, .vertical-frames').length,
    }))
    assert.equal(channelSwitch.active?.trim().toLowerCase(), activeName)
    assert.ok(channelSwitch.mark && channelSwitch.core > 0, `${activeName}: brand mark`)
    audit.push(channelSwitch)
  }
  assert.equal(new Set(audit.filter((item) => item.name === 'channel-switch').map((item) => item.world)).size, 3, 'each channel has its own world')

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
  for (let index = 0; index < 3; index += 1) {
    await page.goto('http://127.0.0.1:5173/ru/services/performance', { waitUntil: 'networkidle0' })
    await page.evaluate((activeIndex) => document.querySelectorAll('.channel-navigation button')[activeIndex]?.click(), index)
    await new Promise((resolve) => setTimeout(resolve, 420))
    await page.$eval('.brand-composition', (node) => node.scrollIntoView({ block: 'center' }))
    const activeName = await page.$eval('.channel-navigation button.active strong', (node) => node.textContent.trim().toLowerCase())
    await (await page.$('.brand-composition')).screenshot({ path: `${output}/brand-${activeName}-mobile.png` })
    await (await page.$('.brand-world')).screenshot({ path: `${output}/brand-${activeName}-experience-mobile.png` })
  }
  assert.deepEqual(consoleErrors, [], 'console errors')
} finally {
  await browser?.close()
  server.kill()
}

process.stdout.write(`${JSON.stringify({ audit, consoleErrors }, null, 2)}\n`)
process.stdout.write(`PASS: ${audit.length} visual checks\n`)
