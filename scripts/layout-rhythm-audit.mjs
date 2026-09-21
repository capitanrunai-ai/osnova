import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const origin = 'http://127.0.0.1:5182'
const output = `${root}/.visual-audit/layout-rhythm`
await mkdir(output, { recursive: true })
const server = spawn(
  'C:\\Program Files\\nodejs\\node.exe',
  [`${root}/node_modules/vite/bin/vite.js`, '--host', '127.0.0.1', '--port', '5182'],
  { cwd: root, stdio: 'ignore', windowsHide: true },
)

const quick = process.argv.includes('--quick')
const capture = process.argv.includes('--capture')
const ci = process.argv.includes('--ci')
const allRoutes = ['', 'services', 'services/automation', 'services/development', 'services/performance', 'services/seo', 'services/ai-visibility', 'cases', 'cases/ai-voice-operator']
const locales = quick ? ['ru', 'de', 'uk'] : capture ? ['ru', 'de'] : ['ru', 'en', 'de', 'uk']
const routes = quick ? ['services/development'] : allRoutes
const viewports = quick ? [['tablet', 768, 1024]] : capture ? [['tablet-landscape', 1024, 768], ['tablet', 768, 1024]] : [
  ['desktop', 1440, 1000],
  ['laptop', 1280, 800],
  ['tablet-landscape', 1024, 768],
  ['tablet', 768, 1024],
  ['mobile', 390, 844],
  ['mobile-small', 320, 568],
]
const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

let browser
const report = []
const failures = []

try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${origin}/en/`)).ok) break
    } catch {
      // Vite is starting.
    }
    await wait(250)
  }

  browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  })
  const page = await browser.newPage()

  for (const [viewport, width, height] of viewports) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 700, hasTouch: width < 700 })
    for (const locale of locales) {
      for (const route of routes) {
        const name = `${locale}/${route || 'home'}@${viewport}`
        await page.goto(`${origin}/${locale}/${route}`, { waitUntil: 'domcontentloaded' })
        const result = await page.evaluate(() => {
          document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))
          const viewportWidth = document.documentElement.clientWidth
          const visible = (node) => {
            const style = getComputedStyle(node)
            const rect = node.getBoundingClientRect()
            return style.display !== 'none' && style.visibility !== 'hidden' && Number.parseFloat(style.opacity) > 0 && rect.width > 0 && rect.height > 0
          }
          const selector = (node) => {
            const classes = [...node.classList].filter((item) => !['reveal', 'is-visible'].includes(item)).slice(0, 2)
            const parentClasses = node.parentElement ? [...node.parentElement.classList].slice(0, 2) : []
            return `${node.tagName.toLowerCase()}${classes.length ? `.${classes.join('.')}` : parentClasses.length ? `<.${parentClasses.join('.')}>` : ''}`
          }
          const sections = [...document.querySelectorAll('section')].filter(visible).map((section) => {
            const rect = section.getBoundingClientRect()
            const container = section.querySelector('.container')
            const containerRect = container?.getBoundingClientRect() || { left: 0, right: viewportWidth, width: viewportWidth }
            const text = [...section.querySelectorAll('h1, h2, p')]
              .filter((node) => visible(node) && !node.closest('[aria-hidden="true"]'))
              .map((node) => {
                const nodeRect = node.getBoundingClientRect()
                return {
                  node: selector(node),
                  left: Math.round(nodeRect.left),
                  offset: Math.round(nodeRect.left - containerRect.left),
                  width: Math.round(nodeRect.width),
                  containerShare: Number((nodeRect.width / containerRect.width).toFixed(2)),
                  copy: node.textContent.trim().replace(/\s+/g, ' ').slice(0, 72),
                }
              })
            const contentChildren = [...section.children].filter((node) => visible(node) && !['absolute', 'fixed'].includes(getComputedStyle(node).position))
            const contentRects = contentChildren.map((node) => node.getBoundingClientRect())
            return {
              section: selector(section),
              height: Math.round(rect.height),
              topInset: contentRects.length ? Math.round(Math.min(...contentRects.map((item) => item.top)) - rect.top) : 0,
              bottomInset: contentRects.length ? Math.round(rect.bottom - Math.max(...contentRects.map((item) => item.bottom))) : 0,
              containerLeft: Math.round(containerRect.left),
              containerWidth: Math.round(containerRect.width),
              text,
            }
          })
          return {
            width: viewportWidth,
            scrollWidth: document.documentElement.scrollWidth,
            overflowNodes: [...document.querySelectorAll('body *')]
              .filter((node) => visible(node))
              .map((node) => ({ node: selector(node), rect: node.getBoundingClientRect() }))
              .filter(({ rect }) => rect.left < -1 || rect.right > viewportWidth + 1)
              .slice(0, 12)
              .map(({ node, rect }) => ({ node, left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) })),
            sections,
          }
        })
        if (capture) await page.screenshot({ path: `${output}/${locale}-${route.replaceAll('/', '-') || 'home'}-${viewport}.png`, fullPage: true })
        if (result.width !== result.scrollWidth) failures.push(`${name}: overflow ${result.width}/${result.scrollWidth} ${JSON.stringify(result.overflowNodes)}`)
        const shifted = result.sections.flatMap((section) => section.text
          .filter((item) => item.node.startsWith('h1') || item.node.startsWith('h2'))
          .filter((item) => width <= 700 ? item.offset > 24 : item.offset > section.containerWidth * .29)
          .map((item) => ({ section: section.section, ...item })))
        const narrow = result.sections.flatMap((section) => section.text
          .filter((item) => item.node.startsWith('p') && item.containerShare < (width <= 700 ? .72 : .31) && item.offset > section.containerWidth * .25)
          .map((item) => ({ section: section.section, ...item })))
        const vertical = result.sections
          .filter((section) => !/hero/.test(section.section))
          .filter((section) => section.topInset > height * .28 || section.bottomInset > height * .28)
          .map(({ section, height: sectionHeight, topInset, bottomInset }) => ({ section, height: sectionHeight, topInset, bottomInset }))
        if (shifted.length || narrow.length || vertical.length) report.push({ name, shifted, narrow, vertical })
      }
    }
  }
} finally {
  await browser?.close()
  server.kill()
}

const verticalDeadZones = report.reduce((total, item) => total + item.vertical.length, 0)
process.stdout.write(`${JSON.stringify(ci ? { pages: locales.length * routes.length * viewports.length, reviewCandidates: report.length, verticalDeadZones, failures } : { report, failures }, null, 2)}\n`)
if (failures.length) process.exitCode = 1
