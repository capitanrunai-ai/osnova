import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, '.visual-audit/targeted-ui')
const origin = 'http://127.0.0.1:5198'
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5198'], {
  cwd: root,
  stdio: 'ignore',
  windowsHide: true,
})
const wait = ms => new Promise(resolveWait => setTimeout(resolveWait, ms))
const viewports = [
  ['desktop', 1440, 1000],
  ['laptop', 1280, 800],
  ['tablet', 768, 1024],
  ['mobile', 390, 844],
]
const languages = ['ru', 'en', 'de', 'uk']
const report = []
const browserErrors = []

await mkdir(output, { recursive: true })
let browser
try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(origin)).ok) break
    } catch {}
    await wait(250)
  }

  browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  page.on('pageerror', error => browserErrors.push(error.message))
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])

  for (const [device, width, height] of viewports) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 600, hasTouch: width < 900 })
    for (const lang of languages) {
      await page.goto(`${origin}/${lang}/`, { waitUntil: 'networkidle0' })
      await page.evaluate(() => {
        document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'))
        document.documentElement.style.scrollBehavior = 'auto'
      })
      const home = await page.evaluate(() => {
        const scope = document.querySelectorAll('#services, #about')
        const overflow = [...scope].flatMap(section => [...section.querySelectorAll('h2, h3, h4, p, a, span')]
          .filter(node => {
            const box = node.getBoundingClientRect()
            return box.width > 0 && (box.left < -1 || box.right > innerWidth + 1 || node.scrollWidth > node.clientWidth + 2)
          })
          .map(node => `${node.tagName}.${node.className}: ${node.textContent.slice(0, 60)}`))
        const service = document.querySelector('#services')
        const team = document.querySelector('#about')
        return {
          services: service.querySelectorAll('.world-entry').length,
          team: team.querySelectorAll('.about-team-role').length,
          serviceBackground: getComputedStyle(service).backgroundColor,
          teamBackground: getComputedStyle(team).backgroundColor,
          serviceSignalCount: service.querySelectorAll('.world-signal').length,
          teamLeadTitle: team.querySelector('.about-team-role.is-lead h3')?.textContent,
          overflow,
        }
      })
      assert.equal(home.services, 6, `${device}/${lang}: service count`)
      assert.equal(home.team, 6, `${device}/${lang}: team count`)
      assert.equal(home.serviceSignalCount, 6, `${device}/${lang}: service visual signals`)
      assert.equal(home.teamLeadTitle, 'CEO', `${device}/${lang}: team lead`)
      assert.notEqual(home.serviceBackground, home.teamBackground, `${device}/${lang}: team and services visual worlds`)
      assert.deepEqual(home.overflow, [], `${device}/${lang}: home target overflow`)

      if (lang === 'ru') {
        await page.$eval('.site-header', node => { node.style.visibility = 'hidden' })
        for (const [name, selector] of [['services', '#services'], ['team', '#about']]) {
          const element = await page.$(selector)
          await element.screenshot({ path: resolve(output, `${device}-${name}.png`) })
        }
      }

      await page.goto(`${origin}/${lang}/services/email-deliverability`, { waitUntil: 'networkidle0' })
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible')))
      const email = await page.evaluate(() => {
        const rootNode = document.querySelector('.email-page')
        const overflow = [...rootNode.querySelectorAll('h1, h2, h3, p, li, a')].filter(node => {
          const box = node.getBoundingClientRect()
          return box.width > 0 && (box.left < -1 || box.right > innerWidth + 1 || node.scrollWidth > node.clientWidth + 2)
        }).map(node => `${node.tagName}.${node.className}: ${node.textContent.slice(0, 60)}`)
        return {
          sections: rootNode.querySelectorAll(':scope > section').length,
          situations: rootNode.querySelectorAll('.email-situation-list article').length,
          capabilities: rootNode.querySelectorAll('.visibility-capability-list article').length,
          scope: rootNode.querySelectorAll('.email-scope li').length,
          cta: Boolean(rootNode.querySelector('.cta-email .button')),
          overflow,
        }
      })
      assert.equal(email.sections, 7, `${device}/${lang}: email sections`)
      assert.equal(email.situations, 3, `${device}/${lang}: email situations`)
      assert.equal(email.capabilities, 4, `${device}/${lang}: email capabilities`)
      assert.equal(email.scope, 6, `${device}/${lang}: email scope`)
      assert.equal(email.cta, true, `${device}/${lang}: email CTA`)
      assert.deepEqual(email.overflow, [], `${device}/${lang}: email overflow`)

      await page.goto(`${origin}/${lang}/services/automation`, { waitUntil: 'networkidle0' })
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible')))
      const automation = await page.evaluate(() => {
        const section = document.querySelector('.automation-principle')
        const box = section.getBoundingClientRect()
        const overflow = [...section.querySelectorAll('h2, span, strong, li')].filter(node => {
          const nodeBox = node.getBoundingClientRect()
          return nodeBox.width > 0 && (nodeBox.left < -1 || nodeBox.right > innerWidth + 1 || node.scrollWidth > node.clientWidth + 2)
        }).map(node => `${node.tagName}: ${node.textContent.slice(0, 60)}`)
        return {
          label: section.querySelector('.automation-principle-label span').textContent,
          background: getComputedStyle(section).backgroundColor,
          flow: section.querySelectorAll('.automation-principle-flow li').length,
          height: box.height,
          nextSection: section.nextElementSibling?.classList.contains('voice-product'),
          overflow,
        }
      })
      assert.match(automation.label, /^02 \/ /, `${device}/${lang}: principle label`)
      assert.equal(automation.background, 'rgb(10, 10, 12)', `${device}/${lang}: principle base`)
      assert.equal(automation.flow, 4, `${device}/${lang}: principle flow`)
      assert.equal(automation.nextSection, true, `${device}/${lang}: principle transition`)
      assert.ok(automation.height < 1150, `${device}/${lang}: principle height ${automation.height}`)
      assert.deepEqual(automation.overflow, [], `${device}/${lang}: principle overflow`)

      if (lang === 'ru') {
        await page.$eval('.site-header', node => { node.style.visibility = 'hidden' })
        const element = await page.$('.automation-principle')
        await element.screenshot({ path: resolve(output, `${device}-automation-principle.png`) })
      }

      report.push({ device, lang, home, email, automation })
    }
  }

  assert.deepEqual(browserErrors, [], 'browser errors')
  await writeFile(resolve(output, 'report.json'), JSON.stringify({ report, browserErrors }, null, 2))
  console.log(`PASS: ${report.length} localized layouts across desktop, laptop, tablet and mobile.`)
} finally {
  await browser?.close()
  server.kill()
}
