// Local regression coverage for payment, offer interactions, managed rows and showcase links.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import { paymentContent } from '../src/data/paymentContent.js'
import { commercialContent } from '../src/data/commercialContent.js'
import { featuredDevelopmentSlugs, moreDevelopmentSlugs } from '../src/data/developmentShowcase.js'

const origin = 'http://127.0.0.1:5197'
const output = resolve('.visual-audit/polish')
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5197', '--strictPort'], { stdio: 'ignore', windowsHide: true })
const wait = ms => new Promise(done => setTimeout(done, ms))
const report = { layouts: [], interactions: [], links: [], errors: [], externalRequests: [] }
const widths = process.env.POLISH_WIDTHS ? process.env.POLISH_WIDTHS.split(',').map(Number) : [320, 375, 390, 430, 768, 1280, 1440]
let browser
await mkdir(output, { recursive: true })
try {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await wait(250)
  }
  browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(60_000)
  page.on('pageerror', error => report.errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()) })
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (new URL(request.url()).origin === origin) return request.continue()
    report.externalRequests.push(request.url())
    return request.abort()
  })
  const open = async (lang, route = '') => {
    await page.goto(`${origin}/${lang}/${route}`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('main')
    await page.evaluate(async () => {
      document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'))
      await document.fonts.ready
      await Promise.all([...document.images].map(img => { img.loading = 'eager'; return img.decode().catch(() => {}) }))
    })
  }
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  for (const width of widths) {
    await page.setViewport({ width, height: width < 700 ? 844 : 1000, isMobile: width < 700, hasTouch: width < 900 })
    for (const lang of ['ru', 'en', 'de', 'uk']) {
      for (const route of ['payment', '', 'services', 'services/automation', 'services/development']) {
        await open(lang, route)
        const where = `${lang}/${route || 'home'}@${width}`
        const layout = await page.evaluate(() => {
          const selectors = '.payment-heading h1, .payment-method h2, .payment-method p, .payment-detail-slot strong, .payment-visual, .crypto-asset, .commercial-offer-card, .commercial-offer-card h3, .commercial-offer-card p, .commercial-offer-action, .commercial-managed-row h3, .commercial-managed-row strong, .commercial-managed-row p, .trust-last-row a'
          const clipped = [...document.querySelectorAll(selectors)].filter(node => node.scrollWidth > node.clientWidth + 2 || node.scrollHeight > node.clientHeight + 2).map(node => node.textContent)
          const rows = [...document.querySelectorAll('.commercial-managed-row')].map(row => {
            const box = node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom } }
            return { row: box(row), cells: [...row.children].map(box), price: row.querySelector('strong').textContent, detail: row.querySelector('p').textContent }
          })
          const cards = [...document.querySelectorAll('.commercial-offer-card')].map(card => ({
            background: getComputedStyle(card).backgroundColor, titleColor: getComputedStyle(card.querySelector('h3')).color,
            priceColor: getComputedStyle(card.querySelector('.commercial-price')).color, href: card.getAttribute('href'),
          }))
          const visuals = [...document.querySelectorAll('.payment-visual, .crypto-asset')].map(node => ({ height: node.getBoundingClientRect().height, background: getComputedStyle(node).backgroundColor, border: getComputedStyle(node).borderTopColor }))
          const title = document.querySelector('.payment-heading h1')
          return { overflow: document.documentElement.scrollWidth > innerWidth + 1, clipped, rows, cards, visuals,
            heading: title?.textContent, headingLeading: title ? parseFloat(getComputedStyle(title).lineHeight) / parseFloat(getComputedStyle(title).fontSize) : null,
            bankIcons: document.querySelectorAll('.payment-bank-icon svg').length,
            crypto: [...document.querySelectorAll('.crypto-asset strong')].map(n => n.textContent),
            paypal: document.querySelector('.payment-paypal-mark img')?.naturalWidth,
            broken: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
            proof: [...document.querySelectorAll('.commercial-trust a[href*="/cases/"]')].map(a => a.getAttribute('href')),
          }
        })
        assert.equal(layout.overflow, false, `${where}: horizontal overflow`)
        assert.deepEqual(layout.clipped, [], `${where}: clipped content`)
        assert.deepEqual(layout.broken, [], `${where}: broken images`)
        if (route === 'payment') {
          assert.equal(layout.heading, paymentContent[lang].title)
          assert.ok(layout.headingLeading >= 1.05, `${where}: heading line height`)
          assert.equal(layout.bankIcons, 2)
          assert.deepEqual(layout.crypto, ['USDT', 'BTC', 'ETH'])
          assert.ok(layout.paypal > 0)
          assert.equal(layout.visuals.length, 6)
          for (const visual of layout.visuals) assert.deepEqual(visual, layout.visuals[0], `${where}: common payment visual system`)
        }
        if (route === '' || route === 'services') {
          assert.equal(layout.cards.length, 3)
          assert.equal(new Set(layout.cards.map(card => card.background)).size, 1)
          assert.equal(new Set(layout.cards.map(card => card.titleColor)).size, 1)
          assert.equal(new Set(layout.cards.map(card => card.priceColor)).size, 1)
          assert.deepEqual(layout.cards.map(card => card.href), commercialContent[lang].offers.items.map(item => `/${lang}/services/${item.route}`))
        }
        if (route === 'services/automation') {
          assert.equal(layout.rows.length, 4)
          assert.deepEqual(layout.rows.map(row => row.price), commercialContent[lang].automation.managed.rows.map(row => row[1]))
          assert.ok(layout.rows[0].detail.includes('\n'), `${where}: separate support statements`)
          layout.rows.forEach((row, index) => {
            row.cells.forEach(cell => assert.ok(cell.y >= row.row.y && cell.bottom <= row.row.bottom, `${where}: content stays in row ${index}`))
            for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) {
              const x = row.cells[a], y = row.cells[b]
              assert.ok(x.right <= y.x + 1 || y.right <= x.x + 1 || x.bottom <= y.y + 1 || y.bottom <= x.y + 1, `${where}: cells overlap`)
            }
            if (width > 900) {
              row.cells.forEach((cell, cellIndex) => {
                assert.ok(Math.abs(cell.x - layout.rows[0].cells[cellIndex].x) < 1, `${where}: shared columns`)
                assert.ok(Math.abs(cell.y - row.cells[0].y) < 1, `${where}: top alignment`)
              })
            }
          })
        }
        if (route === '' || route === 'services/development') assert.deepEqual(layout.proof, [], `${where}: case list appears only in the main showcase`)
        if ([320, 390, 768, 1440].includes(width)) {
          const selector = route === 'payment' ? '.payment-page' : route === 'services/automation' ? '#managed' : route === 'services/development' ? '.trust-last-row' : '.commercial-offers'
          // Fixed navigation otherwise appears across an element screenshot after auto-scrolling.
          await page.$eval('.site-header', node => { node.style.visibility = 'hidden' })
          await (await page.$(selector)).screenshot({ path: resolve(output, `${lang}-${route.replaceAll('/', '-') || 'home'}-${width}.png`) })
          await page.$eval('.site-header', node => { node.style.visibility = '' })
        }
        report.layouts.push({ where, ...layout })
      }
    }
    console.log(`PASS polish layouts: ${width}px, four languages, five pages`)
  }
  // Real hover and keyboard focus on every offer, with stable sibling layout.
  await page.setViewport({ width: 1440, height: 1000, isMobile: false, hasTouch: false })
  for (const route of ['', 'services']) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
    await open('ru', route)
    await wait(1100)
    for (let index = 0; index < 3; index++) {
      const selector = `.commercial-offer-reveal:nth-child(${index + 1}) .commercial-offer-card`
      await page.$eval(selector, n => n.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await page.mouse.move(0, 0)
      await wait(300)
      const before = await page.$$eval('.commercial-offer-reveal', nodes => nodes.map(n => { const r = n.getBoundingClientRect(); return [r.x + scrollX, r.y + scrollY, r.width, r.height] }))
      await page.hover(selector)
      await wait(300)
      const hovered = await page.$eval(selector, n => getComputedStyle(n).transform)
      assert.notEqual(hovered, 'none')
      const after = await page.$$eval('.commercial-offer-reveal', nodes => nodes.map(n => { const r = n.getBoundingClientRect(); return [r.x + scrollX, r.y + scrollY, r.width, r.height] }))
      assert.deepEqual(after, before, 'hover must not shift layout')
      await page.mouse.move(0, 0)
      await page.focus(selector)
      await page.keyboard.press('Tab')
      await page.keyboard.down('Shift')
      await page.keyboard.press('Tab')
      await page.keyboard.up('Shift')
      await wait(300)
      const focused = await page.$eval(selector, n => ({ visible: n.matches(':focus-visible'), transform: getComputedStyle(n).transform, outline: getComputedStyle(n).outlineWidth }))
      assert.ok(focused.visible && parseFloat(focused.outline) >= 2)
      assert.equal(focused.transform, hovered, 'focus and hover share the same elevation')
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
      await page.hover(selector)
      const reduced = await page.$eval(selector, n => ({ transform: getComputedStyle(n).transform, duration: getComputedStyle(n).transitionDuration }))
      assert.equal(reduced.transform, 'none')
      assert.ok(reduced.duration.split(',').every(n => parseFloat(n) <= .01))
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
      await page.$eval(selector, n => n.blur())
      report.interactions.push({ route, index, hovered, focused, reduced })
    }
  }
  // Exercise showcase routes and offer links through the real client router in all locales.
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  for (const lang of ['ru', 'en', 'de', 'uk']) {
    const showcase = [...featuredDevelopmentSlugs, ...moreDevelopmentSlugs, 'ai-news-automation', 'retail-stock-monitor']
    const selectors = [...showcase.map(slug => `.home-work-card[href="/${lang}/cases/${slug}"], .home-more-card[href="/${lang}/cases/${slug}"]`), ...[1, 2, 3].map(i => `.commercial-offer-reveal:nth-child(${i}) a`)]
    for (const selector of selectors) {
      await open(lang)
      const href = await page.$eval(selector, a => a.getAttribute('href'))
      await page.click(selector)
      await page.waitForFunction(path => location.pathname === path && !!document.querySelector('main h1'), {}, href)
      report.links.push(href)
    }
  }
  // Touch cards remain actionable without any hover dependency.
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await open('ru', 'services')
  await wait(1100)
  await page.tap('.commercial-offer-reveal:last-child a')
  await page.waitForFunction(() => location.pathname === '/ru/services/automation')
  assert.deepEqual(report.errors, [], 'browser console/runtime errors')
  assert.deepEqual(report.externalRequests, [], 'local-only browser requests')
  console.log(`PASS polish: ${report.layouts.length} layouts, ${report.interactions.length} hover/focus/reduced-motion checks, ${report.links.length} router links and touch navigation`)
} finally {
  await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2))
  await browser?.close()
  server.kill()
}
