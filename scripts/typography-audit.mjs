import { spawn } from 'node:child_process'
import puppeteer from 'puppeteer-core'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const origin = 'http://127.0.0.1:5174'
const server = spawn(
  'C:\\Program Files\\nodejs\\node.exe',
  [`${root}/node_modules/vite/bin/vite.js`, '--host', '127.0.0.1', '--port', '5174'],
  { cwd: root, stdio: 'ignore', windowsHide: true },
)

const locales = ['ru', 'en', 'de', 'uk']
const routes = ['', 'services', 'services/automation', 'services/development', 'services/performance', 'services/seo', 'services/ai-visibility', 'cases', 'cases/ai-voice-operator', 'cases/bala-group']
const viewports = [['desktop', 1440, 1000], ['tablet', 768, 1024], ['mobile', 390, 844], ['mobile-small', 320, 568]]
const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

let browser
const failures = []

try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${origin}/ru/`)).ok) break
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
          const isVisible = (node) => {
            const style = getComputedStyle(node)
            const rect = node.getBoundingClientRect()
            return style.display !== 'none' && style.visibility !== 'hidden' && Number.parseFloat(style.opacity) > 0 && rect.width > 0 && rect.height > 0
          }
          const label = (node) => `${node.tagName.toLowerCase()}${node.className && typeof node.className === 'string' ? `.${node.className.trim().split(/\s+/).slice(0, 2).join('.')}` : ''}`
          const contentHeading = (node) => !node.closest('[aria-hidden="true"], .portfolio-visual, .spatial-card:not(.is-active)')
          const headings = [...document.querySelectorAll('h1, h2, h3')].filter((node) => isVisible(node) && contentHeading(node)).map((node) => {
            const rect = node.getBoundingClientRect()
            const range = document.createRange()
            range.selectNodeContents(node)
            const textRect = range.getBoundingClientRect()
            const style = getComputedStyle(node)
            const size = Number.parseFloat(style.fontSize)
            const lineHeight = Number.parseFloat(style.lineHeight)
            const letterSpacing = style.letterSpacing === 'normal' ? 0 : Number.parseFloat(style.letterSpacing)
            const scrollableAncestor = (() => {
              let parent = node.parentElement
              while (parent && parent !== document.body) {
                const parentStyle = getComputedStyle(parent)
                if ([parentStyle.overflow, parentStyle.overflowX, parentStyle.overflowY].some((value) => value === 'auto' || value === 'scroll')) return true
                parent = parent.parentElement
              }
              return false
            })()
            const clippedByAncestor = (() => {
              if (scrollableAncestor) return false
              let parent = node.parentElement
              while (parent && parent !== document.body) {
                const parentStyle = getComputedStyle(parent)
                if ([parentStyle.overflow, parentStyle.overflowX, parentStyle.overflowY].some((value) => value === 'hidden' || value === 'clip')) {
                  const parentRect = parent.getBoundingClientRect()
                  if (textRect.left < parentRect.left - 2 || textRect.right > parentRect.right + 2 || textRect.top < parentRect.top - 2 || textRect.bottom > parentRect.bottom + 2) return true
                }
                parent = parent.parentElement
              }
              return false
            })()
            return {
              node,
              selector: label(node),
              text: node.textContent.trim().replace(/\s+/g, ' ').slice(0, 90),
              rect,
              clipped: (!scrollableAncestor && rect.right > 0 && rect.left < viewportWidth && (textRect.left < -2 || textRect.right > viewportWidth + 2)) || clippedByAncestor,
              riskyType: size >= 32 && ((lineHeight / size) < .9 || letterSpacing < size * -.06),
            }
          })

          const textNodes = [...document.querySelectorAll('p, h1, h2, h3')].filter((node) => isVisible(node) && contentHeading(node)).map((node) => ({ node, rect: node.getBoundingClientRect() }))
          const collisions = []
          for (const heading of headings) {
            for (const item of textNodes) {
              if (item.node === heading.node || item.node.contains(heading.node) || heading.node.contains(item.node)) continue
              if (item.node.closest('section') !== heading.node.closest('section')) continue
              const horizontal = Math.min(heading.rect.right, item.rect.right) - Math.max(heading.rect.left, item.rect.left)
              const vertical = Math.min(heading.rect.bottom, item.rect.bottom) - Math.max(heading.rect.top, item.rect.top)
              if (horizontal > 4 && vertical > 4) collisions.push(`${heading.selector} ↔ ${label(item.node)}`)
            }
          }

          return {
            overflow: document.documentElement.scrollWidth > viewportWidth + 1,
            clipped: headings.filter((item) => item.clipped).map(({ selector, text }) => ({ selector, text })),
            riskyType: headings.filter((item) => item.riskyType).map(({ selector, text }) => ({ selector, text })),
            collisions: [...new Set(collisions)].slice(0, 20),
          }
        })

        if (result.overflow || result.clipped.length || result.riskyType.length || result.collisions.length) failures.push({ name, ...result })
      }
    }
  }
} finally {
  await browser?.close()
  server.kill()
}

process.stdout.write(`${JSON.stringify({ pages: locales.length * routes.length * viewports.length, failures }, null, 2)}\n`)
if (failures.length) process.exitCode = 1
