import { execFileSync } from 'node:child_process'
import { statSync } from 'node:fs'
import { resolve } from 'node:path'

import { languages } from '../src/data/content.js'
import { getLocalizedCases } from '../src/data/cases.js'
import { notFoundRoute, staticRoutes } from '../src/data/routes.js'

const root = resolve(import.meta.dirname, '..')

export const languageCodes = Object.keys(languages)

// Which content file each route's freshness is derived from, so <lastmod>
// reflects a real change instead of the build timestamp.
const SOURCE_BY_ROUTE = {
  '': ['src/data/content.js', 'src/data/serviceContent.js', 'src/data/visibilityContent.js'],
  services: ['src/data/serviceContent.js', 'src/data/visibilityContent.js'],
  cases: ['src/data/cases.js'],
  payment: ['src/data/paymentContent.js'],
}

function sourcesFor(route) {
  if (SOURCE_BY_ROUTE[route]) return SOURCE_BY_ROUTE[route]
  if (route === 'services/email-deliverability') return ['src/data/emailContent.js']
  if (route === 'services/seo' || route === 'services/ai-visibility') return ['src/data/visibilityContent.js']
  if (route.startsWith('services/')) return ['src/data/serviceContent.js']
  if (route.startsWith('cases/')) return ['src/data/cases.js']
  return ['src/data/content.js']
}

const lastModCache = new Map()

function lastModified(file) {
  if (lastModCache.has(file)) return lastModCache.get(file)
  let iso
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (out) iso = out
  } catch { /* not a git checkout — fall through to mtime */ }
  if (!iso) {
    try { iso = statSync(resolve(root, file)).mtime.toISOString() } catch { iso = new Date().toISOString() }
  }
  lastModCache.set(file, iso)
  return iso
}

/** Every indexable route, for every language. */
export function buildRoutes() {
  const caseRoutes = getLocalizedCases('en')
    .filter(item => item.status !== 'draft')
    .map(item => `cases/${item.slug}`)

  // Keep the existing sitemap ordering: grouped by page type, then by language.
  const routes = [...staticRoutes.slice(0, -1), ...caseRoutes, 'payment']

  return routes.flatMap(route => languageCodes.map(lang => ({
    lang,
    route,
    // /ru/ for a language home, /ru/services (no trailing slash) otherwise —
    // matching the canonical the app already emits and every internal href.
    path: route ? `/${lang}/${route}` : `/${lang}/`,
    lastmod: sourcesFor(route).map(lastModified).sort().at(-1),
  })))
}

/** Non-indexable routes that still need a prerendered document. */
export function buildUtilityRoutes() {
  return languageCodes.map(lang => ({ lang, route: notFoundRoute, path: `/${lang}/${notFoundRoute}` }))
}
