import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import { trustCases } from '../src/data/trustContent.js'
import { cases } from '../src/data/cases.js'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, '.visual-audit/trust')
const origin = 'http://127.0.0.1:5199'
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5199'], { cwd: root, stdio: 'ignore', windowsHide: true })
const wait = ms => new Promise(done => setTimeout(done, ms))
const errors = []
let browser

for (const [category, links] of Object.entries(trustCases)) {
  for (const [, slug] of links) {
    assert.equal(cases.find(item => item.slug === slug)?.category, category, `${slug}: published case category`)
  }
}

await mkdir(output, { recursive: true })
try {
  for (let attempt = 0; attempt < 40; attempt++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await wait(250)
  }
  browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])

  for (const [device, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844], ['small-mobile', 320, 568]]) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 600, hasTouch: width < 600 })
    for (const lang of ['ru', 'en', 'de', 'uk']) {
      for (const route of ['', 'services/development']) {
        await page.goto(`${origin}/${lang}/${route}`, { waitUntil: 'networkidle0' })
        await page.evaluate(() => document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible')))
        const state = await page.evaluate(() => {
          const trust = document.querySelector('.commercial-trust')
          return {
            trustCount: document.querySelectorAll('.commercial-trust').length,
            roles: trust?.querySelectorAll('.trust-team li').length,
            caseLinks: [...trust.querySelectorAll('.trust-proof a')].map(a => [a.textContent.trim(), new URL(a.href).pathname]),
            email: trust.querySelector('a[href^="mailto:"]')?.getAttribute('href'),
            telegram: trust.querySelector('a[href^="https://t.me/"]')?.href,
            text: trust.innerText,
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
          }
        })
        const where = `${device}/${lang}/${route || 'home'}`
        assert.equal(state.trustCount, 1, `${where}: trust section`)
        assert.equal(state.roles, 6, `${where}: specialist roles`)
        assert.equal(state.overflow, false, `${where}: horizontal overflow`)
        assert.equal(state.email, 'mailto:capitanrun@osnova.ai', `${where}: email`)
        assert.equal(state.telegram, 'https://t.me/capitanrun', `${where}: Telegram`)
        assert.ok(state.text.includes('45') && state.text.includes('30') && state.text.includes('70'), `${where}: terms`)
        assert.deepEqual(state.caseLinks.map(([, path]) => path), Object.values(trustCases).flat().map(([, slug]) => `/${lang}/cases/${slug}`), `${where}: case links`)
        if (route === '' && device !== 'small-mobile') {
          const section = await page.$('.commercial-trust')
          await section.screenshot({ path: resolve(output, `${lang}-${device}.png`) })
        }
      }
    }
  }
  assert.deepEqual(errors, [], 'browser errors')
  console.log('Trust audit passed: RU / EN / DE / UK, home and Development, desktop and 390/320px mobile; terms, roles, proof links, contacts and overflow.')
} finally {
  await browser?.close()
  server.kill()
}
