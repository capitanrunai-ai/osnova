import { spawn } from 'node:child_process'
import puppeteer from 'puppeteer-core'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const port = 5174
const server = spawn(
  'C:\\Program Files\\nodejs\\node.exe',
  [`${root}/node_modules/vite/bin/vite.js`, '--host', '127.0.0.1', '--port', String(port)],
  { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true },
)

const waitForServer = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/ru/`)
      if (response.ok) return
    } catch {
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error('Vite did not start')
}

const routes = [
  ['home', '/ru/'],
  ['services', '/ru/services'],
  ['automation', '/ru/services/automation'],
  ['development', '/ru/services/development'],
  ['performance-google', '/ru/services/performance', 0],
  ['performance-meta', '/ru/services/performance', 1],
  ['performance-tiktok', '/ru/services/performance', 2],
  ['cases', '/ru/cases'],
  ['case-detail', '/ru/cases/voice-to-crm'],
]

const viewports = [
  ['desktop', 1440, 1000],
  ['laptop', 1280, 800],
  ['mobile', 390, 844],
]

let browser
const report = []
const consoleErrors = []

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

  for (const [viewport, width, height] of viewports) {
    await page.setViewport({ width, height, deviceScaleFactor: 1 })
    for (const [name, route, channel] of routes) {
      await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'networkidle0' })
      if (channel !== undefined) {
        await page.evaluate((index) => document.querySelectorAll('.channel-navigation button')[index]?.click(), channel)
        await new Promise((resolve) => setTimeout(resolve, 120))
      }
      await page.evaluate(() => {
        document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))
      })

      const audit = await page.evaluate(() => {
        const selectorFor = (node) => {
          if (node.id) return `#${node.id}`
          const classes = [...node.classList].filter((value) => value !== 'reveal' && value !== 'is-visible').slice(0, 2)
          return `${node.tagName.toLowerCase()}${classes.length ? `.${classes.join('.')}` : ''}`
        }
        const directText = (node) => [...node.childNodes]
          .filter((child) => child.nodeType === Node.TEXT_NODE)
          .map((child) => child.textContent)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()
        const alphaFromColor = (color) => {
          const match = color.match(/rgba?\(([^)]+)\)/)
          if (!match) return 1
          const parts = match[1].split(/,\s*|\s+\/\s+|\s+/).filter(Boolean)
          return parts.length > 3 ? Number(parts[3]) : 1
        }

        const records = [...document.querySelectorAll('body *')].flatMap((node) => {
          const text = directText(node)
          if (!text || node.closest('[aria-hidden="true"], .portfolio-visual')) return []
          const rect = node.getBoundingClientRect()
          const style = getComputedStyle(node)
          if (style.display === 'none' || style.visibility === 'hidden' || rect.width < 1 || rect.height < 1) return []
          const size = Number.parseFloat(style.fontSize)
          if (!Number.isFinite(size) || size === 0) return []
          const interactive = Boolean(node.closest('a, button, input, select, textarea, label'))
          const bodyCopy = ['P', 'LI', 'BLOCKQUOTE'].includes(node.tagName)
          const lowContrast = alphaFromColor(style.color) < .48
          return [{
            selector: selectorFor(node),
            text: text.slice(0, 72),
            size,
            interactive,
            bodyCopy,
            lowContrast,
          }]
        })

        const group = (items) => Object.values(items.reduce((result, item) => {
          const key = `${item.selector}|${item.size}`
          result[key] ||= { selector: item.selector, size: item.size, count: 0, sample: item.text }
          result[key].count += 1
          return result
        }, {})).sort((a, b) => a.size - b.size || b.count - a.count)

        const meaningfulSmall = records.filter((item) => (
          item.size < 11
          || (item.interactive && item.size < 13)
          || (item.bodyCopy && item.size < 15)
        ))
        const touchTargets = [...document.querySelectorAll('a, button, input, select, textarea')]
          .filter((node) => !node.closest('[aria-hidden="true"], .portfolio-visual'))
          .flatMap((node) => {
            const rect = node.getBoundingClientRect()
            const style = getComputedStyle(node)
            if (style.display === 'none' || style.visibility === 'hidden' || rect.width < 1 || rect.height < 1) return []
            if (rect.width >= 44 && rect.height >= 44) return []
            return [{ selector: selectorFor(node), width: Math.round(rect.width), height: Math.round(rect.height), sample: (node.innerText || node.getAttribute('aria-label') || '').trim().slice(0, 60) }]
          })

        return {
          width: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          smallest: group(meaningfulSmall).slice(0, 24),
          smallCount: meaningfulSmall.length,
          lowContrastCount: records.filter((item) => item.lowContrast && item.size <= 14).length,
          lowContrast: group(records.filter((item) => item.lowContrast && item.size <= 14)).slice(0, 16),
          interactiveSmallCount: records.filter((item) => item.interactive && item.size < 13).length,
          bodySmallCount: records.filter((item) => item.bodyCopy && item.size < 15).length,
          smallTouchTargetCount: touchTargets.length,
          smallTouchTargets: touchTargets.slice(0, 16),
        }
      })
      report.push({ viewport, name, ...audit })
    }
  }
} finally {
  await browser?.close()
  server.kill()
}

process.stdout.write(`${JSON.stringify({ report, consoleErrors }, null, 2)}\n`)
