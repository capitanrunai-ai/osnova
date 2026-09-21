import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import puppeteer from 'puppeteer-core'
import { cases } from '../src/data/cases.js'

const origin = process.env.PORTFOLIO_ORIGIN || 'http://127.0.0.1:5178'
const output = resolve(import.meta.dirname, '../.visual-audit')
await mkdir(output, { recursive: true })
let server
try { await fetch(origin) } catch {
  server = spawn(process.execPath, [resolve(import.meta.dirname, '../node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', '5178'], { stdio: 'ignore', windowsHide: true })
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(origin)).ok) break } catch { /* Starting Vite. */ }
    await new Promise(r => setTimeout(r, 250))
  }
}
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const report = { errors: [], routes: [], navigation: {}, audio: {} }
const wait = ms => new Promise(r => setTimeout(r, ms))
try {
  const page = await browser.newPage()
  page.on('pageerror', error => report.errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()) })
  const open = async (path, width = 1440, height = 1000) => {
    await page.setViewport({ width, height, deviceScaleFactor: 1, hasTouch: width < 700, isMobile: width < 700 })
    await page.goto(`${origin}${path}`, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible')))
    await wait(150)
  }
  const checkLayout = async path => {
    const layout = await page.evaluate(() => ({
      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      title: document.querySelector('h1')?.textContent,
      brokenImages: [...document.images].filter(image => {
        const rect = image.getBoundingClientRect()
        return !image.closest('[aria-hidden="true"]') && rect.top < innerHeight && rect.bottom > 0 && rect.left < innerWidth && rect.right > 0 && (!image.complete || !image.naturalWidth)
      }).map(image => image.src),
      placeholders: /DRAFT|DATA PENDING|undefined|Результат ожидает/.test(document.querySelector('main')?.innerText || ''),
    }))
    assert.equal(layout.scrollWidth, layout.width, `Overflow at ${path}`)
    assert.equal(layout.placeholders, false, `Placeholder at ${path}`)
    assert.deepEqual(layout.brokenImages, [], `Broken images at ${path}`)
    report.routes.push({ path, ...layout })
  }
  await open('/en/cases')
  assert.equal(await page.$$eval('.spatial-card', nodes => nodes.length), 7)
  // DDS SERVICE must be the first card shown, with no interaction needed.
  assert.equal(await page.$eval('.spatial-card.is-active h3', node => node.textContent), 'DDS SERVICE')
  await page.screenshot({ path: resolve(output, 'portfolio-desktop.png'), fullPage: true })
  await page.$eval('.spatial-card.is-active > a', node => node.click())
  await wait(1400)
  assert.ok(page.url().endsWith('/cases/dds-service'))
  await page.click('.portfolio-breadcrumb a')
  await wait(1400)
  assert.equal(await page.$eval('.spatial-card.is-active h3', node => node.textContent), 'DDS SERVICE')
  report.navigation.returnRestoresProject = true
  await page.click('.case-filter-main button:nth-child(2)')
  assert.equal(await page.$$eval('.spatial-card', nodes => nodes.length), 6)
  await page.click('.case-filter-main button:nth-child(3)')
  assert.equal(await page.$$eval('.spatial-card', nodes => nodes.length), 1)
  await page.click('.case-filter-main button:first-child')
  await page.focus('.spatial-stage')
  await page.keyboard.press('End')
  assert.equal(await page.$eval('.spatial-card.is-active h3', node => node.textContent), 'RETATRUTIDELANDING PAGE')
  await page.keyboard.press('Home')
  assert.equal(await page.$eval('.spatial-card.is-active h3', node => node.textContent), 'DDS SERVICE')
  report.navigation.filtersAndKeyboard = true
  for (const lang of ['ru', 'en', 'de', 'uk']) {
    await open(`/${lang}/cases`, 390, 844)
    await checkLayout(`/${lang}/cases`)
    if (lang === 'ru') await page.screenshot({ path: resolve(output, 'portfolio-mobile.png'), fullPage: true })
    for (const item of cases) {
      await open(`/${lang}/cases/${item.slug}`, 390, 844)
      await checkLayout(`/${lang}/cases/${item.slug}`)
      if (item.url) assert.equal(await page.$eval('.portfolio-visit', node => node.href), item.url)
    }
  }
  await open('/en/cases/dds-service')
  await page.screenshot({ path: resolve(output, 'portfolio-detail-desktop.png'), fullPage: true })
  await page.click('.portfolio-preview-toolbar button:nth-child(2)')
  assert.ok(await page.$('.portfolio-screen.mode-mobile img'))
  await open('/ru/cases/ai-voice-operator', 390, 844)
  await page.screenshot({ path: resolve(output, 'portfolio-audio-mobile.png'), fullPage: true })
  await page.click('.audio-play')
  await wait(1100)
  report.audio = await page.$eval('audio', audio => ({ playing: !audio.paused, time: audio.currentTime, duration: audio.duration, source: audio.currentSrc }))
  assert.ok(report.audio.playing && report.audio.time > 0)
  assert.ok(Math.abs(report.audio.duration - 249.754) < .1)
  await page.click('.audio-play')
  assert.equal(await page.$eval('audio', audio => audio.paused), true)
  await page.$eval('.audio-seek', input => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
    setter.call(input, 100)
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })
  assert.ok(Math.abs(await page.$eval('audio', audio => audio.currentTime) - 100) < 1)
  await page.click('.audio-rate')
  assert.equal(await page.$eval('audio', audio => audio.playbackRate), 1.25)
  await page.click('.audio-play')
  await page.click('.portfolio-breadcrumb a')
  await wait(1400)
  assert.equal(await page.$('audio'), null)
  for (const width of [320, 360, 768, 1024]) {
    await open('/de/cases', width, 900)
    await checkLayout(`/de/cases@${width}`)
    await open('/de/cases/ai-voice-operator', width, 900)
    await checkLayout(`/de/cases/ai-voice-operator@${width}`)
  }
  await open('/ru/', 1440, 1000)
  assert.equal(await page.$$eval('.spatial-card', nodes => nodes.length), 7)
  assert.equal(await page.$eval('.spatial-card.is-active h3', node => node.textContent), 'DDS SERVICE')
  await page.$eval('#cases', node => node.scrollIntoView())
  await wait(700)
  await (await page.$('#cases')).screenshot({ path: resolve(output, 'portfolio-home-desktop.png') })
  assert.deepEqual(report.errors, [])
} finally {
  await writeFile(resolve(output, 'portfolio-audit.json'), JSON.stringify(report, null, 2))
  await browser.close()
  server?.kill()
}
console.log(JSON.stringify({ ...report, routes: report.routes.length }, null, 2))
