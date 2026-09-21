import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

// Run against a local Vite server: node scripts/email-direction-audit.mjs [origin]
const origin = process.argv[2] || 'http://127.0.0.1:5187'
const output = new URL('../.visual-audit/email-direction/', import.meta.url)
await mkdir(output, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})
const errors = []
let layouts = 0
try {
  const page = await browser.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 })
    for (const lang of ['ru', 'en', 'de', 'uk']) {
      const path = `/${lang}/services/email-deliverability`
      await page.goto(`${origin}${path}`, { waitUntil: 'domcontentloaded' })
      await page.waitForSelector('.email-page')
      await page.waitForFunction(() => document.title.includes('Email Deliverability'))
      const result = await page.evaluate(() => {
        document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'))
        const overflow = [...document.querySelectorAll('.email-page h1, .email-page h2, .email-page h3, .email-page p, .email-page li, .email-page .button')].filter(node => {
          const r = node.getBoundingClientRect()
          return r.left < -1 || r.right > innerWidth + 1 || node.scrollWidth > node.clientWidth + 1
        }).map(node => `${node.tagName}: ${node.textContent.slice(0, 50)}`)
        return {
          overflow,
          headings: document.querySelectorAll('h1').length,
          sections: document.querySelectorAll('.email-page > section').length,
          canonical: document.querySelector('link[rel="canonical"]').href,
          alternate: document.querySelector('link[hreflang="de"]').href,
        }
      })
      assert.deepEqual(result.overflow, [], `${lang}@${width}: overflow`)
      assert.equal(result.headings, 1)
      assert.equal(result.sections, 7)
      assert.equal(result.canonical, `${origin}${path}`)
      assert.equal(result.alternate, `${origin}/de/services/email-deliverability`)
      layouts += 1
      if (lang === 'ru' && [1440, 390].includes(width)) {
        await page.screenshot({ path: new URL(`email-${width}.png`, output).pathname.replace(/^\/([A-Z]:)/, '$1'), fullPage: true })
      }
    }
  }

  await page.setViewport({ width: 1440, height: 1000 })
  for (const lang of ['ru', 'en', 'de', 'uk']) {
    for (const entry of ['', 'services']) {
      await page.goto(`${origin}/${lang}/${entry}`, { waitUntil: 'domcontentloaded' })
      const card = '.world-email-deliverability'
      await page.waitForSelector(card)
      assert.equal(await page.$eval(card, node => node.getAttribute('href')), `/${lang}/services/email-deliverability`)
      await page.$eval(card, node => node.click())
      await page.waitForSelector('.email-page')
      assert.equal(new URL(page.url()).hash, '')
      assert.equal(await page.evaluate(() => sessionStorage.getItem('osnova:contact-service')), null)
    }
    await page.$eval('.cta-email .button', node => node.click())
    await page.waitForSelector('#contact select[name="service"]')
    assert.equal(await page.$eval('#contact select', node => node.value), 'Email Deliverability')
    assert.equal(new URL(page.url()).hash, '#contact')
    await page.goBack()
    await page.waitForSelector('.email-page')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.email-page')
    await page.$eval('.next-direction a', node => node.click())
    await page.waitForSelector('.automation-page')
    await page.goto(`${origin}/${lang}/services/ai-visibility`, { waitUntil: 'domcontentloaded' })
    await page.$eval('.next-direction a', node => node.click())
    await page.waitForSelector('.email-page')
  }

  await page.click('.language-current')
  await page.$$eval('.language-menu button', buttons => buttons.find(button => button.querySelector('span').textContent.trim() === 'EN').click())
  await page.waitForFunction(() => location.pathname === '/en/services/email-deliverability' && document.documentElement.lang === 'en')
  assert.equal(await page.$eval('.email-page h1', node => node.textContent), 'Your emails.Closer to customers.')
  assert.deepEqual(errors, [], 'Browser errors')
  console.log(`PASS: ${layouts} localized layouts; service cards, CTA selection, history, reload, direction navigation and language switch.`)
} finally {
  await browser.close()
}
