import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const origin = 'http://127.0.0.1:5184'
const output = `${root}/.visual-audit/visibility`
await mkdir(output, { recursive: true })

const server = spawn(
  'C:\\Program Files\\nodejs\\node.exe',
  [`${root}/node_modules/vite/bin/vite.js`, '--host', '127.0.0.1', '--port', '5184'],
  { cwd: root, stdio: 'ignore', windowsHide: true },
)

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))
const viewports = [
  ['desktop', 1440, 1000],
  ['laptop', 1280, 800],
  ['tablet', 768, 1024],
  ['mobile', 390, 844],
]
const routes = ['services/seo', 'services/ai-visibility']
let browser

try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${origin}/ru/services/seo`)).ok) break
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
    for (const route of routes) {
      await page.goto(`${origin}/ru/${route}`, { waitUntil: 'networkidle0' })
      await page.evaluate(async () => {
        const step = Math.max(window.innerHeight * .75, 480)
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((resolve) => setTimeout(resolve, 30))
        }
        document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))
        window.scrollTo(0, 0)
      })
      await wait(300)
      await page.screenshot({ path: `${output}/${route.split('/').at(-1)}-${viewport}.png`, fullPage: true })
    }
  }
} finally {
  await browser?.close()
  server.kill()
}

process.stdout.write('Visibility screenshots captured for desktop, laptop, tablet and mobile.\n')
