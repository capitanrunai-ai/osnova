import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { buildRoutes, languageCodes } from './site-routes.mjs'

const root = resolve(import.meta.dirname, '..')
const lines = [
  '# Generated from the same route source as prerender and sitemap.',
  // Forced (!): dist/index.html (the Vite SPA shell, never prerendered since
  // buildRoutes() only emits language-prefixed paths) exists as a static file
  // at "/", and Netlify serves a matching static asset before consulting this
  // file unless the rule is forced — so without "!" this redirect never fires
  // and crawlers get the empty JS-only shell directly with a 200.
  '/ /en/ 302!',
]

// No per-route trailing-slash / index.html canonicalization rules here:
// every route is prerendered as {path}/index.html, and Netlify's static
// file server already serves that directly for both "/path" and "/path/"
// with no redirect needed. Explicit "strip the slash" 301 rules turned out
// to match their own target under Netlify's edge matching and 301 a route
// back to itself (redirect loop) — simpler is safer here.

for (const lang of languageCodes) {
  lines.push(`/${lang}/* /${lang}/404/index.html 404`)
}
lines.push('/* /404.html 404')

await writeFile(resolve(root, 'dist', '_redirects'), `${lines.join('\n')}\n`, 'utf8')
console.log(`Netlify redirects: ${lines.length} rules`)
