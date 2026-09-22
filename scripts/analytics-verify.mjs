// Guards the two things that quietly break lead reporting:
// a service slug that differs per language, and a form field leaking into an
// event. Run after `npm run build`.

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { content } from '../src/data/content.js'
import { serviceRoutes } from '../src/data/routes.js'
import { serviceSlug } from '../src/analytics.js'

const root = resolve(import.meta.dirname, '..')
const failures = []
const fail = (message) => failures.push(message)

const languages = Object.keys(content)

// --- one slug per position, in every language ---------------------------------
const byIndex = new Map()
for (const lang of languages) {
  const options = content[lang].contact.options
  options.forEach((option, index) => {
    const slug = serviceSlug(option, options)
    if (slug === 'other') fail(`${lang}: option "${option}" (index ${index}) has no slug`)
    const seen = byIndex.get(index)
    if (seen && seen.slug !== slug) {
      fail(`index ${index} is "${seen.slug}" in ${seen.lang} but "${slug}" in ${lang}`)
    }
    if (!seen) byIndex.set(index, { slug, lang })
  })
}

// The first six positions are the service pages, so a lead can be joined to the
// page that produced it.
serviceRoutes.forEach((route, index) => {
  const actual = byIndex.get(index)?.slug
  if (actual !== route) fail(`position ${index} is "${actual}", expected the route id "${route}"`)
})

// --- every pricing CTA resolves to a real slug --------------------------------
for (const lang of languages) {
  const { options } = content[lang].contact
  for (const item of content[lang].pricing.items) {
    const slug = serviceSlug(item, options)
    if (slug === 'other' || slug === 'none') fail(`${lang}: pricing item "${item}" does not map to a service`)
  }
}

// --- an unselected service is explicit, never empty ---------------------------
if (serviceSlug('', content.en.contact.options) !== 'none') fail('an empty service should report "none"')

// --- no form field can reach an event ----------------------------------------
const analyticsSource = await readFile(resolve(root, 'src', 'analytics.js'), 'utf8')
for (const field of ['name', 'contact', 'company', 'message', 'email', 'phone', 'telegram']) {
  if (new RegExp(`data\\.get\\(['"\`]${field}`).test(analyticsSource)) fail(`analytics.js reads the "${field}" field`)
}
for (const secret of ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']) {
  if (analyticsSource.includes(secret)) fail(`analytics.js references ${secret}`)
}

// The lead event is built from a fixed set of non-personal keys.
const leadBody = analyticsSource.slice(analyticsSource.indexOf('export function trackLead'))
for (const banned of ['data.get', 'value', '.name', '.message']) {
  if (leadBody.includes(banned)) fail(`trackLead references "${banned}"`)
}

// --- production-only transmission --------------------------------------------
if (!analyticsSource.includes("const PRODUCTION_HOST = 'osnovaai.com'")) fail('production host guard missing')
if (!/analytics_storage: 'denied'/.test(analyticsSource)) fail('consent mode does not default to denied')

// In-app navigation rewrites the URL without the query string, so the utm_*
// snapshot has to be taken during init. Taking it lazily at conversion time
// silently reported every campaign lead as "(direct)".
const initBody = analyticsSource.slice(
  analyticsSource.indexOf('export function initAnalytics'),
  analyticsSource.indexOf('export function setConsent'),
)
if (!initBody.includes('captureVisit()')) fail('initAnalytics does not snapshot the visit before the first navigation')

if (failures.length) {
  console.error(`\nAnalytics verification FAILED — ${failures.length} problem(s):\n`)
  for (const line of failures) console.error('  ✗ ' + line)
  process.exit(1)
}
console.log(
  `Analytics verification passed: ${byIndex.size} service slugs consistent across ${languages.length} languages, ` +
  'no form fields or secrets reachable from events.',
)
