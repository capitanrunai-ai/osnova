// Visual and interaction regression coverage for the commercial homepage.
// Optional QA_ORIGIN runs the same checks against the existing production site.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:5196'
const live = origin.startsWith('https:')
const output = resolve('.visual-audit', live ? 'design-live' : 'design-local')
const server = live ? null : spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5196'], { stdio: 'ignore', windowsHide: true })
const wait = ms => new Promise(r => setTimeout(r, ms))
const report = []
const errors = []
await mkdir(output, { recursive: true })
let browser
try {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await wait(250)
  }
  browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  page.on('pageerror', e => errors.push(e.message))
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  const open = async (lang, path = '') => {
    await page.goto(`${origin}/${lang}/${path}`, { waitUntil: 'networkidle0' })
  }
  for (const [device, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: device === 'mobile', hasTouch: device === 'mobile' })
    for (const lang of ['ru', 'en', 'de', 'uk']) {
      await open(lang)
      if (live) {
        await page.evaluate(() => localStorage.removeItem('osnova-analytics-consent'))
        await page.reload({ waitUntil: 'networkidle0' })
        await page.waitForSelector('.consent-bar')
        await page.screenshot({ path: resolve(output, `${device}-${lang}-consent.png`) })
        const buttons = await page.$$eval('.consent-actions button', nodes => nodes.map(n => n.getBoundingClientRect().height))
        assert.ok(buttons.every(h => h >= 44), 'consent touch targets')
        await page.click('.consent-actions button:not(.consent-accept)')
        assert.equal(await page.evaluate(() => localStorage.getItem('osnova-analytics-consent')), 'denied')
      }
      // Scroll through every section to exercise reveals and lazy-loaded evidence.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * .7) {
          window.scrollTo({ top: y, behavior: 'instant' })
          await new Promise(r => setTimeout(r, 70))
        }
        await Promise.all([...document.images].map(img => img.decode().catch(() => {})))
        window.scrollTo({ top: 0, behavior: 'instant' })
      })
      await wait(150)
      const state = await page.evaluate(() => {
        const card = document.querySelector('.hero-offer-card')
        const box = card.getBoundingClientRect()
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          textOverflow: [...document.querySelectorAll('.home-hero h1, .home-hero p, .commercial-section h2, .commercial-section h3, .specialist-card p')].filter(n => n.scrollWidth > n.clientWidth + 2).map(n => n.textContent),
          heroPrice: card.innerText, heroVisible: box.width > 0 && box.height > 0,
          services: [...document.querySelectorAll('.specialist-card')].map(n => ({ href: n.getAttribute('href'), height: n.getBoundingClientRect().height, text: n.innerText })),
          work: [...document.querySelectorAll('.home-work-card')].map(n => n.getAttribute('href')),
          moreWork: [...document.querySelectorAll('.home-more-card')].map(n => n.getAttribute('href')),
          useCases: [...document.querySelectorAll('.automation-usecases li')].map(n => n.innerText.trim()),
          managed: document.querySelector('.automation-managed')?.innerText || '',
          managedPrice: document.querySelector('.automation-managed > strong')?.textContent.trim() || '',
          navFirst: document.querySelector('.main-nav a')?.textContent.trim(),
          smallTargets: [...document.querySelectorAll('.hero-offer-card, .offer-card-action, .home-more-card, .home-work-card, .specialist-card, .automation-entry-prices a, .automation-managed, .commercial-text-link')].filter(n => { const r = n.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44) }).map(n => n.className),
          brokenImages: [...document.images].filter(n => !n.complete || !n.naturalWidth).map(n => n.src),
          prices: document.querySelector('.automation-entry-prices').innerText,
          automationColor: getComputedStyle(document.querySelector('.commercial-bridge')).backgroundColor,
        }
      })
      assert.equal(state.overflow, false, `${device}/${lang}: overflow`)
      assert.deepEqual(state.textOverflow, [], `${device}/${lang}: clipped text`)
      assert.ok(state.heroVisible && state.heroPrice.includes('250') && state.heroPrice.includes('500'), 'hero offer shows both development prices')
      assert.equal(state.services.length, 4)
      assert.ok(state.services.every(n => n.height > 200 && n.text.length > 70), 'full service cards')
      assert.equal(state.work.length, 5)
      assert.equal(state.moreWork.length, 3, 'every other real web project is shown')
      assert.equal(state.useCases.length, 6, 'automation use cases')
      assert.ok(state.useCases.every(text => text.length > 40), 'use cases carry a description')
      // Managed Automation starts at the first managed tier; €49–99 is only the client-paid support option.
      assert.match(state.managedPrice, /€150\//, `${device}/${lang}: managed automation starts from €150`)
      assert.ok(!state.managedPrice.includes('49'), `${device}/${lang}: managed price is not the support tier`)
      assert.ok(state.managed.includes('€49–99'), `${device}/${lang}: support-only option stays explained`)
      assert.equal(state.navFirst, { ru: 'Разработка', en: 'Development', de: 'Entwicklung', uk: 'Розробка' }[lang], 'localized nav')
      assert.deepEqual(state.smallTargets, [], 'touch targets')
      assert.deepEqual(state.brokenImages, [], 'all real evidence images load')
      assert.ok(['149', '250', '300', '350', '500'].every(p => state.prices.includes(p)))
      assert.equal(state.automationColor, 'rgb(16, 17, 19)')
      await page.screenshot({ path: resolve(output, `${device}-${lang}-full.png`), fullPage: true })
      for (const [name, selector] of [['hero', '.home-hero'], ['development', '.commercial-offers'], ['web-cases', '#cases'], ['automation', '#automation'], ['automation-cases', '.commercial-automation-cases'], ['more-work', '.home-more-work'], ['services', '.commercial-secondary'], ['process', '.commercial-process'], ['contact', '#contact']]) {
        await page.$eval(selector, n => n.scrollIntoView({ behavior: 'instant', block: 'start' }))
        await page.screenshot({ path: resolve(output, `${device}-${lang}-${name}.png`) })
      }
      // The price object must navigate to real packages, and the second hero CTA to work.
      await page.click('.hero-offer-card')
      await page.waitForFunction(() => location.pathname.endsWith('/services/development') && location.hash === '#packages')
      assert.ok(await page.$('#packages'))
      await open(lang)
      await page.click('.automation-managed')
      await page.waitForFunction(() => location.pathname.endsWith('/services/automation') && location.hash === '#managed')
      assert.ok(await page.$('#managed'), 'managed section target exists')
      await open(lang)
      await page.click('.hero-actions .button-ghost')
      await page.waitForFunction(() => location.hash === '#cases')
      await page.click('.commercial-bridge .button')
      await page.waitForFunction(() => location.hash === '#contact-form')
      const selection = await page.$eval('select[name=service]', n => n.selectedIndex)
      assert.equal(selection, 1, 'Automation preselected')
      if (device === 'mobile') {
        await page.click('.menu-button')
        await page.waitForSelector('.main-nav.is-open')
        await wait(350)
      }
      await page.click(`.main-nav a[href="/${lang}/#about"]`)
      await page.waitForFunction(() => location.hash === '#about')
      assert.ok(await page.$('#about'), 'About target exists')
      // Verify each new service and case link through the actual router.
      for (const href of [...state.services.map(n => n.href), ...state.work, ...state.moreWork]) {
        await open(lang)
        await page.click(`a[href="${href}"]`)
        await page.waitForFunction(path => location.pathname === path, {}, href)
        assert.ok(await page.$('h1'), href)
      }
      if (device === 'mobile') {
        await open(lang)
        await page.click('.menu-button')
        const nav = await page.$eval('.main-nav', n => ({ visible: getComputedStyle(n).visibility, height: n.getBoundingClientRect().height }))
        assert.ok(nav.visible !== 'hidden' && nav.height > 0)
        await page.click('.menu-button')
      }
      report.push({ device, lang, ...state })
      console.log(`PASS ${device}/${lang}: visuals, evidence, prices, service/case links, hero and Automation CTA`)
    }
  }
  assert.deepEqual(errors, [])
  await writeFile(resolve(output, 'report.json'), JSON.stringify({ origin, report, errors }, null, 2))
} finally {
  await browser?.close()
  server?.kill()
}
