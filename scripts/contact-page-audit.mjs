// Local route, CTA, footer and curated Development showcase regression checks.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import { getLocalizedCases } from '../src/data/cases.js'
import { content } from '../src/data/content.js'
import { contactContent } from '../src/data/contactContent.js'

const origin = 'http://127.0.0.1:5195'
const output = resolve('.visual-audit/contact-page')
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5195', '--strictPort'], { stdio: 'ignore', windowsHide: true })
const routes = ['', 'services', 'services/development', 'services/automation', 'services/seo', 'services/performance', 'services/ai-visibility', 'services/email-deliverability', 'cases', 'cases/slavabud', 'payment', 'contact']
const report = { layouts: [], ctas: [], history: [], languages: [], errors: [], externalRequests: [] }
const wait = ms => new Promise(done => setTimeout(done, ms))
let browser
await mkdir(output, { recursive: true })
try {
  for (let n = 0; n < 60; n++) {
    try { if ((await fetch(origin)).ok) break } catch {}
    await wait(250)
  }
  browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  page.on('pageerror', error => report.errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()) })
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (new URL(request.url()).origin === origin) return request.continue()
    report.externalRequests.push(request.url())
    return request.abort()
  })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  const open = async (lang, route) => {
    await page.goto(`${origin}/${lang}/${route}`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('main')
    await page.evaluate(async () => {
      document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'))
      document.documentElement.style.scrollBehavior = 'auto'
      await document.fonts.ready
    })
  }
  for (const width of [320, 375, 390, 430, 768, 1280, 1440]) {
    await page.setViewport({ width, height: width < 700 ? 844 : 1000, isMobile: width < 700, hasTouch: width < 900 })
    for (const lang of ['ru', 'en', 'de', 'uk']) {
      for (const route of routes) {
        await open(lang, route)
        const where = `${lang}/${route || 'home'}@${width}`
        const state = await page.evaluate(() => {
          const rect = node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom } }
          const nodes = [...document.querySelectorAll('.contact-page h1, .contact-page label > span, .contact-page .contact-copy p, footer a')]
          return {
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
            clipped: nodes.filter(n => n.scrollWidth > n.clientWidth + 2 || n.scrollHeight > n.clientHeight + 2).map(n => n.textContent),
            form: document.querySelectorAll('#contact form').length,
            stale: [...document.querySelectorAll('a[href]')].filter(a => /#contact(?:-form)?$/.test(a.getAttribute('href'))).map(a => a.getAttribute('href')),
            footer: [...document.querySelectorAll('footer a')].map(a => a.getAttribute('href')),
            contact: document.querySelector('.contact-page') ? { h1: document.querySelector('h1').textContent, sections: [...document.querySelector('.contact-layout').children].map(rect), formBox: rect(document.querySelector('.contact-form-wrap')), intro: rect(document.querySelector('.contact-copy')), context: rect(document.querySelector('.contact-context')) } : null,
            ctas: document.querySelectorAll(`a[href="/${document.documentElement.lang}/contact"]`).length,
          }
        })
        assert.equal(state.overflow, false, where)
        assert.deepEqual(state.clipped, [], where)
        assert.deepEqual(state.stale, [], 'no footer-form anchor links')
        assert.equal(state.form, route === 'contact' ? 1 : 0, where)
        assert.ok(state.footer.includes(`/${lang}/services`) && state.footer.includes(`/${lang}/payment`) && state.footer.includes(`/${lang}/contact`))
        assert.ok(state.footer.includes('mailto:capitanrun@osnova.ai') && state.footer.includes('https://t.me/capitanrun'))
        assert.ok(state.ctas >= 2, 'header/footer contact entry points')
        if (state.contact) {
          assert.equal(state.contact.h1, contactContent[lang].title)
          const sections = state.contact.sections
          for (let a = 0; a < sections.length; a++) for (let b = a + 1; b < sections.length; b++) {
            const x = sections[a], y = sections[b]
            assert.ok(x.right <= y.x + 1 || y.right <= x.x + 1 || x.bottom <= y.y + 1 || y.bottom <= x.y + 1, `${where}: no overlapping sections`)
          }
          if (width <= 800) assert.ok(state.contact.intro.bottom <= state.contact.formBox.y && state.contact.formBox.bottom <= state.contact.context.y, 'mobile: introduction, form, direct contacts')
          if ([320, 390, 768, 1440].includes(width)) await page.screenshot({ path: resolve(output, `${lang}-${width}.png`), fullPage: true })
        }
        if (route === '' || route === 'services/development') {
          const prefix = route === '' ? '#cases' : '.service-related'
          const featured = await page.$$eval(`${prefix} .home-work-card`, nodes => nodes.map(n => n.pathname.split('/').at(-1)))
          assert.deepEqual(featured, ['dds-service', 'ds-repair-solutions', 'comfort-lab'])
          const more = await page.$$eval(`${prefix} .home-more-card`, nodes => nodes.map(n => ({ slug: n.pathname.split('/').at(-1), title: n.querySelector('h3').textContent, image: n.querySelector('img').getAttribute('src') })))
          assert.deepEqual(more.map(n => n.slug), ['slavabud', 'comfort-home', 'bala-group'])
          const cases = getLocalizedCases(lang)
          for (const item of more) {
            const source = cases.find(n => n.slug === item.slug)
            assert.equal(item.title, source.title)
            assert.equal(item.image, source.desktop)
            assert.equal(await (await fetch(`${origin}/${lang}/cases/${item.slug}`)).status, 200)
          }
          assert.equal(cases.filter(n => n.slug === 'slavabud').length, 1)
          assert.ok(cases.some(n => n.slug === 'retatrutide-landing') && cases.some(n => n.slug === 'retatrutide-silver-signal'))
        }
        report.layouts.push({ where, ...state })
      }
    }
    console.log(`PASS contact page/footer/projects at ${width}px, four languages, twelve route families`)
  }
  // Every inquiry CTA is clicked from its own page through the client router.
  await page.setViewport({ width: 1440, height: 1000, isMobile: false, hasTouch: false })
  for (const lang of ['ru', 'en', 'de', 'uk']) {
    for (const route of routes.filter(n => n !== 'contact')) {
      await open(lang, route)
      const count = await page.$$eval(`a[href="/${lang}/contact"]`, nodes => nodes.length)
      for (let index = 0; index < count; index++) {
        await open(lang, route)
        const label = await page.$$eval(`a[href="/${lang}/contact"]`, (nodes, i) => { const n = nodes[i]; const label = n.textContent; n.click(); return label }, index)
        await page.waitForSelector('.contact-page')
        assert.equal(new URL(page.url()).pathname, `/${lang}/contact`)
        assert.equal(new URL(page.url()).hash, '')
        assert.ok(await page.$('#contact form'))
        report.ctas.push({ lang, route, label })
      }
    }
    await open(lang, 'services/development')
    await page.$eval('.development-hero-cta', n => n.click())
    await page.waitForSelector('.contact-page')
    assert.equal(await page.$eval('select[name=service]', n => n.value), content[lang].contact.options[1], 'Development is preselected')
    await page.goBack()
    await page.waitForSelector('.development-page')
    await page.goForward()
    await page.waitForSelector('.contact-page')
    report.history.push(lang)
  }
  await open('ru', 'contact')
  await page.select('select[name=service]', content.ru.contact.options[1])
  for (const lang of ['en', 'de', 'uk', 'ru']) {
    await page.click('.language-current')
    await page.$$eval('.language-menu button', (nodes, code) => nodes.find(n => n.querySelector('span')?.textContent === code).click(), { ru: 'RU', en: 'EN', de: 'DE', uk: 'UA' }[lang])
    await page.waitForFunction(code => location.pathname === `/${code}/contact` && document.documentElement.lang === code, {}, lang)
    assert.equal(await page.$eval('h1', n => n.textContent), contactContent[lang].title)
    assert.equal(await page.$eval('select[name=service]', n => n.value), content[lang].contact.options[1])
    report.languages.push(lang)
  }
  assert.deepEqual(report.errors, [])
  assert.deepEqual(report.externalRequests, [])
  console.log(`PASS: ${report.layouts.length} layouts, ${report.ctas.length} CTA clicks, browser back/forward and contact language switching`)
} finally {
  await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2))
  await browser?.close()
  server.kill()
}
