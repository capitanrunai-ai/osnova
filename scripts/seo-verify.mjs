// Validates the built output against the SEO contract. Run after `npm run build`.

import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { siteUrl } from '../site.config.mjs'
import { defaultLanguage } from '../src/data/routes.js'
import { buildRoutes, buildUtilityRoutes, languageCodes } from './site-routes.mjs'

const dist = resolve(import.meta.dirname, '..', 'dist')
const failures = []
const seenTitles = new Map()

const fail = (where, message) => failures.push(`${where}: ${message}`)

const attr = (html, selector, name) => {
  const tag = html.match(selector)
  if (!tag) return null
  const value = tag[0].match(new RegExp(`${name}="([^"]*)"`))
  return value ? value[1] : null
}
const meta = (html, attribute, key) =>
  attr(html, new RegExp(`<meta[^>]*${attribute}="${key}"[^>]*>`, 'i'), 'content')
const link = (html, rel, hreflang) =>
  attr(html, new RegExp(`<link[^>]*rel="${rel}"${hreflang ? `[^>]*hreflang="${hreflang}"` : ''}[^>]*>`, 'i'), 'href')

const read = async (path) => {
  const file = join(dist, path, 'index.html')
  if (!existsSync(file)) return null
  return readFile(file, 'utf8')
}

const bodyText = (html) => {
  const start = html.indexOf('<div id="root">')
  if (start < 0) return ''
  const end = html.indexOf('</body>', start)
  return html.slice(start, end < 0 ? undefined : end)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// --- indexable pages ---------------------------------------------------------
const routes = buildRoutes()
for (const entry of routes) {
  const where = entry.path
  const html = await read(entry.path)
  if (!html) { fail(where, 'no prerendered document'); continue }

  const expected = `${siteUrl}${entry.path}`

  if (attr(html, /<html[^>]*>/i, 'lang') !== entry.lang) fail(where, `html lang is "${attr(html, /<html[^>]*>/i, 'lang')}", expected "${entry.lang}"`)

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim()
  if (!title) fail(where, 'empty <title>')
  else {
    const previous = seenTitles.get(title)
    if (previous && previous.split('/')[1] === entry.lang) fail(where, `title duplicated within ${entry.lang}: also on ${previous}`)
    seenTitles.set(title, where)
  }

  const description = meta(html, 'name', 'description')
  if (!description || description.length < 30) fail(where, 'missing or too short meta description')

  if (link(html, 'canonical') !== expected) fail(where, `canonical is "${link(html, 'canonical')}", expected "${expected}"`)
  if (meta(html, 'property', 'og:url') !== expected) fail(where, 'og:url does not match canonical')
  if (meta(html, 'property', 'og:title') !== title) fail(where, 'og:title does not match <title>')
  if (meta(html, 'property', 'og:description') !== description) fail(where, 'og:description does not match meta description')
  if (!meta(html, 'property', 'og:image')?.startsWith(siteUrl)) fail(where, 'og:image is not absolute')
  if (!meta(html, 'property', 'og:locale')?.startsWith(entry.lang)) fail(where, `og:locale is "${meta(html, 'property', 'og:locale')}"`)
  if (!/index/.test(meta(html, 'name', 'robots') || '')) fail(where, `robots is "${meta(html, 'name', 'robots')}"`)

  for (const code of languageCodes) {
    const expectedAlternate = `${siteUrl}${entry.route ? `/${code}/${entry.route}` : `/${code}/`}`
    if (link(html, 'alternate', code) !== expectedAlternate) fail(where, `hreflang ${code} is "${link(html, 'alternate', code)}", expected "${expectedAlternate}"`)
  }
  const xDefault = `${siteUrl}${entry.route ? `/${defaultLanguage}/${entry.route}` : `/${defaultLanguage}/`}`
  if (link(html, 'alternate', 'x-default') !== xDefault) fail(where, 'x-default is wrong')

  const text = bodyText(html)
  if (text.length < 400) fail(where, `prerendered body has only ${text.length} characters of text`)
  if (html.includes('127.0.0.1') || html.includes('localhost')) fail(where, 'preview origin leaked into the document')
}

// --- 404 pages ---------------------------------------------------------------
for (const entry of buildUtilityRoutes()) {
  const html = await read(entry.path)
  if (!html) { fail(entry.path, 'no prerendered 404'); continue }
  if (!/noindex/.test(meta(html, 'name', 'robots') || '')) fail(entry.path, '404 is not noindex')
  if (link(html, 'canonical')) fail(entry.path, '404 declares a canonical')
  if (link(html, 'alternate', 'en')) fail(entry.path, '404 declares hreflang alternates')
  if (attr(html, /<html[^>]*>/i, 'lang') !== entry.lang) fail(entry.path, 'wrong html lang')
}
if (!existsSync(join(dist, '404.html'))) fail('/404.html', 'generic fallback missing')

// --- sitemap -----------------------------------------------------------------
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8')
const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
const expectedLocs = routes.map((entry) => `${siteUrl}${entry.path}`)

for (const loc of locs) if (!expectedLocs.includes(loc)) fail('sitemap.xml', `lists an unknown URL: ${loc}`)
for (const loc of expectedLocs) if (!locs.includes(loc)) fail('sitemap.xml', `misses ${loc}`)
if (new Set(locs).size !== locs.length) fail('sitemap.xml', 'contains duplicate URLs')
if (!sitemap.includes('xmlns:xhtml')) fail('sitemap.xml', 'missing xhtml namespace for hreflang')
if ((sitemap.match(/<lastmod>/g) || []).length !== locs.length) fail('sitemap.xml', 'not every URL has a lastmod')
if ((sitemap.match(/hreflang="x-default"/g) || []).length !== locs.length) fail('sitemap.xml', 'not every URL has an x-default alternate')

const robots = await readFile(join(dist, 'robots.txt'), 'utf8')
if (!robots.includes(`${siteUrl}/sitemap.xml`)) fail('robots.txt', 'sitemap URL does not match the configured origin')

// --- report ------------------------------------------------------------------
if (failures.length) {
  console.error(`\nSEO verification FAILED — ${failures.length} problem(s):\n`)
  for (const line of failures) console.error('  ✗ ' + line)
  process.exit(1)
}
console.log(`SEO verification passed: ${routes.length} indexable pages, ${buildUtilityRoutes().length} 404 pages, ${locs.length} sitemap URLs, origin ${siteUrl}`)
