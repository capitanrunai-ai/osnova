// Generates dist/sitemap.xml and dist/robots.txt from the same route data the
// app routes on. Adding a case, a service or a language updates the sitemap
// automatically — there is nothing to maintain by hand.

import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { siteUrl } from '../site.config.mjs'
import { defaultLanguage } from '../src/data/routes.js'
import { buildRoutes, languageCodes } from './site-routes.mjs'

const dist = resolve(import.meta.dirname, '..', 'dist')
const absolute = (path) => `${siteUrl}${path}`
const day = (iso) => iso.slice(0, 10)

const routes = buildRoutes()

// Group by route so every language version can list its siblings.
const byRoute = new Map()
for (const entry of routes) {
  if (!byRoute.has(entry.route)) byRoute.set(entry.route, new Map())
  byRoute.get(entry.route).set(entry.lang, entry)
}

const urls = routes.map((entry) => {
  const siblings = byRoute.get(entry.route)
  const alternates = languageCodes
    .filter((code) => siblings.has(code))
    .map((code) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${absolute(siblings.get(code).path)}"/>`)
  if (siblings.has(defaultLanguage)) {
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(siblings.get(defaultLanguage).path)}"/>`)
  }
  return [
    '  <url>',
    `    <loc>${absolute(entry.path)}</loc>`,
    `    <lastmod>${day(entry.lastmod)}</lastmod>`,
    ...alternates,
    '  </url>',
  ].join('\n')
})

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...urls,
  '</urlset>',
  '',
].join('\n')

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${absolute('/sitemap.xml')}`,
  '',
].join('\n')

await writeFile(resolve(dist, 'sitemap.xml'), sitemap, 'utf8')
await writeFile(resolve(dist, 'robots.txt'), robots, 'utf8')

console.log(`sitemap.xml: ${routes.length} urls, ${languageCodes.length} languages, origin ${siteUrl}`)
