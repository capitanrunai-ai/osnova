// Localized content, word wrapping and commercial layout across target viewports.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, '.visual-audit/targeted-ui')
const origin = 'http://127.0.0.1:5198'
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', ...(process.env.TARGETED_BUILT ? ['preview'] : []), '--host', '127.0.0.1', '--port', '5198', '--strictPort'], { cwd: root, stdio: 'ignore', windowsHide: true })
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
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  for (const [device, width, height] of viewports) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 600, hasTouch: width < 900 })
    for (const lang of languages) {
      const result = { device, lang }
      for (const [route, key] of [['', 'home'], ['services', 'services'], ['services/development', 'development'], ['services/automation', 'automation'], ['services/performance', 'performance'], ['services/seo', 'seo']]) {
        await page.goto(`${origin}/${lang}/${route}`, { waitUntil: 'networkidle0' })
        await page.evaluate(async () => {
          document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'))
          await document.fonts.ready
        })
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
        assert.equal(state.process, ['services', 'performance', 'seo'].includes(key) ? 0 : 8, `${device}/${lang}/${route}: process`)
        if (key === 'home' || key === 'services') {
          assert.equal(state.cards, 3, `${device}/${lang}: home offers`)
          assert.ok(state.text.includes('€250') && state.text.includes('€500') && state.text.includes('€149'), `${device}/${lang}: offer prices`)
          if (key === 'home') assert.ok(state.custom, `${device}/${lang}: custom CTA`)
        } else if (key === 'development') {
          assert.equal(state.cards, 2, `${device}/${lang}: development offers`)
          assert.ok(state.text.includes('45') && state.text.includes('Telegram'), `${device}/${lang}: development terms`)
        } else if (key === 'automation') {
          assert.equal(state.cards, 6, `${device}/${lang}: automation products`)
          assert.ok(state.text.includes('€150') && state.text.includes('€300') && state.text.includes('€700'), `${device}/${lang}: managed prices`)
          assert.ok(state.custom, `${device}/${lang}: automation custom CTA`)
        }
        const headings = await page.evaluate(() => {
          const selectors = '.direction-title h1, .home-hero h1, #products h2, #packages h2, .brand-copy h2, .visibility-process-head h2'
          return [...document.querySelectorAll(selectors)].map(node => {
            const rect = node.getBoundingClientRect()
            const range = document.createRange()
            range.selectNodeContents(node)
            const textRect = range.getBoundingClientRect()
            const splitWords = []
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
            const lines = new Set()
            while (walker.nextNode()) {
              const text = walker.currentNode
              for (const match of text.textContent.matchAll(/[\p{L}\p{M}]+/gu)) {
                const tops = new Set()
                for (let i = 0; i < match[0].length; i++) {
                  range.setStart(text, match.index + i)
                  range.setEnd(text, match.index + i + 1)
                  const top = Math.round(range.getBoundingClientRect().top)
                  tops.add(top)
                  lines.add(top)
                }
                if (tops.size > 1) splitWords.push(match[0])
              }
            }
            let clipped = textRect.left < -2 || textRect.right > innerWidth + 2
            for (let parent = node.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
              const style = getComputedStyle(parent)
              if ([style.overflowX, style.overflowY].some(value => ['hidden', 'clip'].includes(value))) {
                const box = parent.getBoundingClientRect()
                if (textRect.left < box.left - 2 || textRect.right > box.right + 2 || textRect.top < box.top - 2 || textRect.bottom > box.bottom + 2) clipped = true
              }
            }
            return { text: node.textContent, splitWords, clipped, lines: lines.size, height: rect.height }
          })
        })
        for (const heading of headings) {
          assert.deepEqual(heading.splitWords, [], `${device}/${lang}/${route}: word split in ${heading.text}`)
          assert.equal(heading.clipped, false, `${device}/${lang}/${route}: clipped headline ${heading.text}`)
        }
        if (key === 'automation' || key === 'development') {
          assert.notEqual(headings[0].text, headings[1].text, `${key}: hero and products have distinct headings`)
          assert.ok(headings[0].lines <= 3, `${device}/${lang}/${route}: hero exceeds three lines`)
        }
        if (key === 'automation') {
          const intro = await page.$eval('.direction-title p', node => node.textContent)
          assert.equal(await page.$$eval('p', (nodes, text) => nodes.filter(node => node.textContent === text).length, intro), 1, 'Automation intro appears once')
        }
        result[key] = { heading: state.heading, cards: state.cards, process: state.process, headlines: headings }
        const captures = key === 'home' ? ['.home-hero', '.trust-last-row'] : key === 'automation' || key === 'development' ? ['.direction-hero', '.commercial-product-section'] : key === 'performance' ? ['.direction-hero', '.brand-world-google'] : key === 'seo' ? ['.visibility-process'] : []
        await page.$eval('.site-header', node => { node.style.visibility = 'hidden' })
        for (let i = 0; i < captures.length; i++) await (await page.$(captures[i])).screenshot({ path: resolve(output, `${lang}-${key}-${width}-${i}.png`) })
        await page.$eval('.site-header', node => { node.style.visibility = '' })
        if (lang === 'ru' && (device === 'desktop' || device === 'mobile') && key === 'home') await page.screenshot({ path: resolve(output, `${device}-home-ru.png`), fullPage: true })
      }
      report.push(result)
    }
  }
  assert.deepEqual(errors, [], 'browser errors')
  await writeFile(resolve(output, 'report.json'), JSON.stringify({ report, errors }, null, 2))
  console.log(`PASS: ${report.length * 6} localized pages at 1440/768/390/320px; home, Services, Development, Automation, Performance and SEO. No split words, clipped headlines or overflow.`)
} finally {
  await browser?.close()
  server.kill()
}
