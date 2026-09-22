import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'
import puppeteer from 'puppeteer-core'
import { cases } from '../src/data/cases.js'

const origin = 'http://127.0.0.1:5179'
const wait = ms => new Promise(r => setTimeout(r, ms))
const server = spawn(process.execPath, [resolve(import.meta.dirname, '../node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', '5179'], { stdio: 'ignore', windowsHide: true })
let browser
const errors = []
const report = {}
try {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await wait(250)
  }
  browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  const open = async mobile => {
    await page.setViewport({ width: mobile ? 390 : 1440, height: mobile ? 844 : 1000, hasTouch: mobile, isMobile: mobile })
    await page.goto(origin + '/en/cases', { waitUntil: 'networkidle0' })
    await page.$eval('.spatial-stage', node => node.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await wait(600)
  }
  const active = () => page.$eval('.spatial-status strong', node => node.textContent)
  await open(false)
  const bounds = await page.$eval('.spatial-card.is-active', node => {
    const r = node.getBoundingClientRect()
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  })
  await page.mouse.move(bounds.x + bounds.width * .65, bounds.y + 150)
  await page.mouse.down()
  await page.mouse.move(bounds.x + bounds.width * .3, bounds.y + 150, { steps: 16 })
  await page.mouse.up()
  await wait(850)
  assert.notEqual(await active(), '01')
  assert.ok(page.url().endsWith('/cases'), 'Drag must not open a case')
  report.desktopDrag = true
  await page.focus('.spatial-stage')
  await page.keyboard.press('Home')
  await wait(800)
  await page.mouse.move(700, 450)
  await page.mouse.wheel({ deltaX: 160, deltaY: 0 })
  await wait(850)
  assert.equal(await active(), '02')
  report.trackpad = true
  await page.click('.spatial-card.is-active .case-open-icon')
  await wait(1400)
  assert.ok(page.url().endsWith('/cases/bala-group'), 'Real pointer click must open selected case')
  await page.goBack({ waitUntil: 'networkidle0' })
  assert.equal(await active(), '02')
  report.pointerClickAndBrowserBack = true

  await open(true)
  assert.ok(await page.$eval('.spatial-card.is-active .project-phone img', image => Math.abs(image.offsetHeight / image.offsetWidth - 844 / 390) < .04), 'Mobile preview must preserve its original aspect ratio')
  const cdp = await page.createCDPSession()
  const stage = await page.$eval('.spatial-stage', node => {
    const r = node.getBoundingClientRect()
    return { y: r.y + r.height * .35 }
  })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 310, y: stage.y }] })
  for (const x of [285, 255, 225, 195, 165, 135, 100]) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: stage.y }] })
    await wait(35)
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await wait(850)
  assert.notEqual(await active(), '01')
  assert.ok(page.url().endsWith('/cases'))
  report.nativeTouchSwipe = true
  await page.tap('.spatial-card.is-active .case-open-icon')
  await wait(1400)
  assert.ok(page.url().includes('/cases/'))
  report.nativeTouchOpen = true

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.click('.portfolio-breadcrumb a')
  await wait(150)
  assert.ok(page.url().endsWith('/cases'))
  report.reducedMotion = true
  await page.click('.case-filter-main button:nth-child(3)')
  assert.equal(await page.$$eval('.spatial-card', nodes => nodes.length), cases.filter(item => item.category === 'automation').length)
  await page.tap('.spatial-card.is-active .case-open-icon')
  await wait(200)
  await page.click('.language-current')
  await page.click('.language-menu button:nth-child(3)')
  await wait(200)
  assert.equal(await page.$eval('html', node => node.lang), 'de')
  assert.equal(await page.$eval('h1', node => node.textContent), 'AI VOICE OPERATOR')
  assert.ok((await page.$eval('.audio-note', node => node.textContent)).includes('Russisch'))
  report.localeSwitchPreservesCase = true
  assert.deepEqual(errors, [])
} finally {
  await browser?.close()
  server.kill()
}
console.log(JSON.stringify({ report, errors }, null, 2))
