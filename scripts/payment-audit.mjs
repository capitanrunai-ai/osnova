import { spawn } from 'node:child_process'
import puppeteer from 'puppeteer-core'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const origin = 'http://127.0.0.1:5181'
const server = spawn(
  'C:\\Program Files\\nodejs\\node.exe',
  [`${root}/node_modules/vite/bin/vite.js`, '--host', '127.0.0.1', '--port', '5181'],
  { cwd: root, stdio: 'ignore', windowsHide: true },
)

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))
const failures = []
let browser

try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${origin}/en/payment`)).ok) break
    } catch {
      // Vite is still starting.
    }
    await wait(250)
  }

  browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  })
  const page = await browser.newPage()
  const consoleErrors = []
  page.on('console', (message) => message.type() === 'error' && consoleErrors.push(message.text()))
  page.on('pageerror', (error) => consoleErrors.push(error.message))

  const viewports = [[1440, 1000], [1280, 800], [768, 900], [390, 844], [320, 568]]
  for (const [width, height] of viewports) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width <= 640, hasTouch: width <= 640 })
    for (const locale of ['ru', 'en', 'de', 'uk']) {
      await page.goto(`${origin}/${locale}/payment`, { waitUntil: 'networkidle0' })
      const result = await page.evaluate(async () => {
        document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))
        const initialHeader = getComputedStyle(document.querySelector('.site-header'))
        const initial = { background: initialHeader.backgroundColor, filter: initialHeader.backdropFilter }
        window.scrollTo(0, document.querySelector('.payment-methods').offsetTop + 80)
        await new Promise((resolve) => setTimeout(resolve, 420))
        const scrolledHeader = getComputedStyle(document.querySelector('.site-header'))
        return {
          width: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          title: document.title,
          methods: document.querySelectorAll('.payment-method').length,
          currencies: [...document.querySelectorAll('.crypto-asset strong')].map((node) => node.textContent.trim()),
          cryptoMarks: document.querySelectorAll('.crypto-asset svg').length,
          fakeData: /0x[a-f\d]{8}|[13][a-km-zA-HJ-NP-Z1-9]{25,}|DE\d{20}/.test(document.body.innerText),
          removedCta: Boolean(document.querySelector('.payment-note, .payment-contact')),
          removedCtaCopy: /Нужны реквизиты|Need payment details|Benötigen Sie Zahlungsdaten|Потрібні реквізити/.test(document.body.innerText),
          footerGap: Math.round(document.querySelector('footer').getBoundingClientRect().top - document.querySelector('.payment-method:last-child').getBoundingClientRect().bottom),
          initial,
          scrolled: { background: scrolledHeader.backgroundColor, filter: scrolledHeader.backdropFilter },
          paymentLink: document.querySelector('.footer-links a[href$="/payment"]')?.getAttribute('href'),
        }
      })
      const name = `${locale}@${width}`
      if (result.width !== result.scrollWidth) failures.push(`${name}: horizontal overflow`)
      if (result.methods !== 3) failures.push(`${name}: expected 3 methods`)
      if (result.currencies.join(',') !== 'USDT,BTC,ETH' || result.cryptoMarks !== 3) failures.push(`${name}: crypto methods or marks missing`)
      if (result.fakeData) failures.push(`${name}: fake payment data detected`)
      if (result.removedCta || result.removedCtaCopy) failures.push(`${name}: removed payment CTA is still present`)
      if (result.footerGap > 60) failures.push(`${name}: excessive gap before footer (${result.footerGap}px)`)
      if (result.paymentLink !== `/${locale}/payment`) failures.push(`${name}: footer payment link missing`)
      if (width <= 640 && (result.initial.filter !== 'none' || result.scrolled.filter !== 'none')) failures.push(`${name}: mobile header blur detected`)
      if (width <= 640 && !result.initial.background.startsWith('rgba(')) failures.push(`${name}: mobile header is not translucent`)
    }
  }

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  for (const locale of ['ru', 'en', 'de', 'uk']) {
    await page.goto(`${origin}/${locale}/`, { waitUntil: 'networkidle0' })
    const contacts = await page.evaluate(() => ({
      email: document.querySelector('.direct-contact a[href^="mailto:"]')?.getAttribute('href'),
      telegram: document.querySelector('.direct-contact a[href^="https://t.me/"]')?.getAttribute('href'),
      payment: document.querySelector('.contact-payment-link')?.getAttribute('href'),
      placeholders: document.body.innerText.includes('hello@your-agency.com') || document.body.innerText.includes('@your_agency'),
    }))
    if (contacts.email !== 'mailto:capitanrunai@gmail.com') failures.push(`${locale}: email link incorrect`)
    if (contacts.telegram !== 'https://t.me/capitanrun') failures.push(`${locale}: Telegram link incorrect`)
    if (contacts.payment !== `/${locale}/payment`) failures.push(`${locale}: contact payment link incorrect`)
    if (contacts.placeholders) failures.push(`${locale}: placeholder contact remains`)
  }

  if (consoleErrors.length) failures.push(`console errors: ${consoleErrors.join(' | ')}`)
} finally {
  await browser?.close()
  server.kill()
}

if (failures.length) throw new Error(`Payment audit failed\n${failures.join('\n')}`)
process.stdout.write('Payment audit passed: 4 locales × 5 responsive viewports; contacts and mobile header verified.\n')
