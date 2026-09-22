// GA4 measurement for OSNOVA.
//
// Three rules hold everywhere in this file:
//   1. Nothing a visitor types ever reaches Google. Events carry a route, a
//      language and a service *slug* — never a name, contact or message.
//   2. Google is contacted only from the production host, so localhost,
//      Netlify preview deploys and the prerender browser cannot reach the
//      production reports at all.
//   3. Nothing is stored on the device until the visitor accepts. Consent
//      Mode v2 starts fully denied, and a decline stops transmission outright.

const MEASUREMENT_ID = 'G-7PXW7Z01TB' // public data-stream id, not a secret
const PRODUCTION_HOST = 'osnovaai.com'
const CONSENT_KEY = 'osnova-analytics-consent'
const VISIT_KEY = 'osnova:visit'
const DEBUG_KEY = 'osnova:ga-debug'

// Positional slugs for `contact.options` in src/data/content.js, which is the
// same list in the same order in all four languages. Deriving the slug from
// the index is what makes a Russian and a German lead land on one value in
// the reports instead of fragmenting into translated strings.
const SERVICE_SLUGS = [
  'automation', 'development', 'performance', 'seo', 'ai-visibility',
  'email-deliverability', 'crm', 'website', 'not-sure',
]

export function serviceSlug(value, options) {
  if (!value) return 'none'
  const index = options.indexOf(value)
  return index < 0 ? 'other' : SERVICE_SLUGS[index] || 'other'
}

let enabled = false
let loaded = false

function gtag() {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(arguments)
}

function readStored(key) {
  try { return window.localStorage.getItem(key) } catch { return null }
}

export function readConsent() {
  const value = readStored(CONSENT_KEY)
  return value === 'granted' || value === 'denied' ? value : null
}

export function isProductionHost() {
  return window.location.hostname === PRODUCTION_HOST
}

// A session flagged with ?ga_debug=1 reports itself as internal traffic, so a
// GA4 data filter can keep our own production checks out of the reports while
// the same hits stay visible in DebugView.
function isDebugSession() {
  try {
    if (new URLSearchParams(window.location.search).get('ga_debug') === '1') {
      window.sessionStorage.setItem(DEBUG_KEY, '1')
    }
    return window.sessionStorage.getItem(DEBUG_KEY) === '1'
  } catch {
    return false
  }
}

function classifyReferrer(referrer) {
  if (!referrer) return null
  let host
  try { host = new URL(referrer).hostname.replace(/^www\./, '') } catch { return null }
  if (host === PRODUCTION_HOST || host.endsWith(`.${PRODUCTION_HOST}`)) return null
  const name = host.split('.')[0]
  if (/^(google|bing|yahoo|duckduckgo|yandex|ecosia|baidu|startpage|qwant|search|seznam)$/.test(name)) {
    return { source: host, medium: 'organic' }
  }
  if (host === 'x.com' || host === 't.me' || /^(facebook|instagram|twitter|linkedin|youtube|reddit|tiktok|vk|threads)$/.test(name)) {
    return { source: host, medium: 'social' }
  }
  return { source: host, medium: 'referral' }
}

let visit = null

// How this visit started. It must be read at load: in-app navigation rewrites
// the URL through history.pushState without the query string, so by the time a
// lead is submitted the utm_* parameters are already gone from location.search.
function captureVisit() {
  if (visit) return visit
  try {
    const cached = window.sessionStorage.getItem(VISIT_KEY)
    if (cached) {
      visit = JSON.parse(cached)
      return visit
    }
  } catch { /* fall through and recompute */ }

  const params = new URLSearchParams(window.location.search)
  const referred = classifyReferrer(document.referrer)
  visit = {
    entry_source: params.get('utm_source') || referred?.source || '(direct)',
    entry_medium: params.get('utm_medium') || referred?.medium || '(none)',
    entry_campaign: params.get('utm_campaign') || '(not set)',
    entry_content: params.get('utm_content') || '(not set)',
    entry_term: params.get('utm_term') || '(not set)',
    landing_page: window.location.pathname,
  }
  return visit
}

// Kept in memory until consent, then carried across reloads for the session.
function persistVisit() {
  try { window.sessionStorage.setItem(VISIT_KEY, JSON.stringify(captureVisit())) } catch { /* private mode */ }
}

function startGtag() {
  if (loaded) return
  loaded = true

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  gtag('js', new Date())
  gtag('config', MEASUREMENT_ID, {
    send_page_view: false, // page_view is sent per route by trackPageView
    ...(isDebugSession() ? { debug_mode: true, traffic_type: 'internal' } : {}),
  })
}

// Nothing is loaded and nothing is sent until the visitor accepts — not even a
// cookieless ping — which is exactly what the consent banner promises.
export function initAnalytics() {
  if (!isProductionHost()) return
  captureVisit() // before the first in-app navigation drops the query string
  if (readConsent() !== 'granted') {
    window[`ga-disable-${MEASUREMENT_ID}`] = true
    return
  }
  startGtag()
  gtag('consent', 'update', { analytics_storage: 'granted' })
  enabled = true
  persistVisit()
}

export function setConsent(choice) {
  try { window.localStorage.setItem(CONSENT_KEY, choice) } catch { /* private mode */ }
  if (!isProductionHost()) return

  if (choice === 'denied') {
    enabled = false
    window[`ga-disable-${MEASUREMENT_ID}`] = true
    return
  }
  window[`ga-disable-${MEASUREMENT_ID}`] = false
  startGtag()
  gtag('consent', 'update', { analytics_storage: 'granted' })
  enabled = true
  persistVisit()
  // The route that was open while the banner was still up never reported a
  // page_view, so replay it now that reporting is allowed.
  if (lastPageView) sendPageView(lastPageView)
}

export function track(name, params = {}) {
  if (!enabled) return
  gtag('event', name, params)
}

let lastPageView = null

function sendPageView({ language, contentGroup }) {
  track('page_view', {
    page_location: window.location.href,
    page_title: document.title,
    site_language: language,
    content_group: contentGroup,
  })
}

export function trackPageView(params) {
  lastPageView = params
  sendPageView(params)
}

// The single business conversion: a request the backend confirmed it delivered.
export function trackLead({ language, service }) {
  track('generate_lead', {
    site_language: language,
    service,
    page_path: window.location.pathname,
    ...captureVisit(),
  })
}
