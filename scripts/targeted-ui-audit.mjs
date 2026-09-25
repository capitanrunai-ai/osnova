// Commercial v1 layout and language smoke test across desktop and mobile.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, '.visual-audit/targeted-ui')
const origin = 'http://127.0.0.1:5198'
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5198'], { cwd: root, stdio: 'ignore', windowsHide: true })
const wait = ms => new Promise(done => setTimeout(done, ms))
const viewports = [['desktop', 1440, 1000], ['tablet', 768, 1024], ['mobile', 390, 844], ['small-mobile', 320, 568]]
const languages = ['ru', 'en', 'de', 'uk']
const report = []
const errors = []
await mkdir(output, { recursive: true })
let browser
try {
  for (let attempt = 0; attempt < 40; attempt++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await wait(250)
  }
  browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  for (const [device, width, height] of viewports) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 600, hasTouch: width < 900 })
    for (const lang of languages) {
      const result = { device, lang }
      for (const [route, key] of [['', 'home'], ['services', 'services'], ['services/development', 'development'], ['services/automation', 'automation']]) {
        await page.goto(`${origin}/${lang}/${route}`, { waitUntil: 'networkidle0' })
        await page.evaluate(() => document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible')))
        const state = await page.evaluate(() => ({
          heading: document.querySelector('h1')?.textContent || '',
          text: document.body.innerText,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
          cards: document.querySelectorAll('.commercial-card').length,
          process: document.querySelectorAll('.commercial-process li').length,
          custom: Boolean(document.querySelector('.commercial-custom a')),
        }))
        assert.ok(state.heading.length > 10, `${device}/${lang}/${route}: heading`)
        assert.equal(state.overflow, false, `${device}/${lang}/${route}: horizontal overflow`)
        assert.equal(state.process, key === 'services' ? 0 : 8, `${device}/${lang}/${route}: process`)
        if (key === 'home' || key === 'services') {
          assert.equal(state.cards, 3, `${device}/${lang}: home offers`)
          assert.ok(state.text.includes('€250') && state.text.includes('€500') && state.text.includes('€149'), `${device}/${lang}: offer prices`)
          if (key === 'home') assert.ok(state.custom, `${device}/${lang}: custom CTA`)
        } else if (key === 'development') {
          assert.equal(state.cards, 2, `${device}/${lang}: development offers`)
          assert.ok(state.text.includes('45') && state.text.includes('Telegram'), `${device}/${lang}: development terms`)
        } else {
          assert.equal(state.cards, 6, `${device}/${lang}: automation products`)
          assert.ok(state.text.includes('€150') && state.text.includes('€300') && state.text.includes('€700'), `${device}/${lang}: managed prices`)
          assert.ok(state.custom, `${device}/${lang}: automation custom CTA`)
        }
        result[key] = { heading: state.heading, cards: state.cards, process: state.process }
        if (lang === 'ru' && (device === 'desktop' || device === 'mobile') && key === 'home') await page.screenshot({ path: resolve(output, `${device}-home-ru.png`), fullPage: true })
      }
      report.push(result)
    }
  }
  assert.deepEqual(errors, [], 'browser errors')
  await writeFile(resolve(output, 'report.json'), JSON.stringify({ report, errors }, null, 2))
  console.log(`PASS: ${report.length} localized layouts across desktop, tablet and mobile; home, Services, Development and Automation.`)
} finally {
  await browser?.close()
  server.kill()
}
