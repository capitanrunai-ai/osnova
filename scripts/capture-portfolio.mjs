import puppeteer from 'puppeteer-core'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, 'public/assets/cases')
await mkdir(output, { recursive: true })
await mkdir(resolve(root, '.visual-audit'), { recursive: true })
const projects = [
  ['dds-service', 'https://ddsservice.com.ua/'],
  ['comfort-lab', 'https://comfortlabkiev.com.ua/'],
  ['bala-group', 'https://www.bala-group.com.ua/'],
  ['comfort-home', 'https://comforthomekiev.com.ua/'],
  ['retatrutide-silver-signal', 'https://shalomesp11-creator.github.io/retatrutide-silver-signal/'],
  ['retatrutide-landing', 'https://shalomesp11-creator.github.io/retatrutide-landing-preview/'],
].filter(([slug]) => !process.argv[2] || slug.includes(process.argv[2]))
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox', '--hide-scrollbars'] })
const report = []
try {
  // Two browser pages at a time keep rendering and network use bounded.
  for (let index = 0; index < projects.length; index += 2) {
    await Promise.all(projects.slice(index, index + 2).map(async ([slug, url]) => {
      const page = await browser.newPage()
      try {
        await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 1 })
        const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
        if (!response.ok()) throw new Error(`HTTP ${response.status()}`)
        await page.evaluate(() => {
          const dismiss = [...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Dismiss')
          dismiss?.click()
        })
        await page.evaluate(async () => {
          await document.fonts.ready
          for (let y = 0; y < Math.min(document.body.scrollHeight, 6500); y += 700) {
            window.scrollTo(0, y)
            await new Promise(r => setTimeout(r, 160))
          }
          window.scrollTo(0, 0)
        })
        await new Promise(r => setTimeout(r, 2000))
        await page.screenshot({ path: resolve(output, `${slug}-desktop.webp`), type: 'webp', quality: 88 })
        await page.evaluate(() => window.scrollTo(0, Math.min(window.innerHeight, document.body.scrollHeight - window.innerHeight)))
        await new Promise(r => setTimeout(r, 800))
        await page.screenshot({ path: resolve(output, `${slug}-detail.webp`), type: 'webp', quality: 85 })
        const text = await page.evaluate(() => document.body.innerText.slice(0, 11000))
        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
        await page.evaluate(() => window.scrollTo(0, 0))
        await new Promise(r => setTimeout(r, 1200))
        await page.screenshot({ path: resolve(output, `${slug}-mobile.webp`), type: 'webp', quality: 88 })
        const entry = { slug, url: page.url(), status: response.status(), title: await page.title(), text }
        report.push(entry)
        console.log(JSON.stringify({ ...entry, text: text.slice(0, 1300) }))
      } catch (error) {
        report.push({ slug, url, error: error.message })
        console.error(slug, error.message)
      } finally { await page.close() }
    }))
  }
} finally { await browser.close() }
await writeFile(resolve(root, '.visual-audit/portfolio-sources.json'), JSON.stringify(report, null, 2))
if (report.some(p => p.error)) process.exitCode = 1
