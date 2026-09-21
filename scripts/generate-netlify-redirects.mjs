import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { buildRoutes, languageCodes } from './site-routes.mjs'

const root = resolve(import.meta.dirname, '..')
const lines = [
  '# Generated from the same route source as prerender and sitemap.',
  '/ /en/ 302',
]

for (const lang of languageCodes) {
  lines.push(`/${lang} /${lang}/ 301!`)
  lines.push(`/${lang}/index.html /${lang}/ 301!`)
}

for (const { path, route } of buildRoutes()) {
  if (!route) continue
  lines.push(`${path}/ ${path} 301!`)
  lines.push(`${path}/index.html ${path} 301!`)
  lines.push(`${path} ${path}/index.html 200`)
}

for (const lang of languageCodes) {
  lines.push(`/${lang}/* /${lang}/404/index.html 404`)
}
lines.push('/* /404.html 404')

await writeFile(resolve(root, 'dist', '_redirects'), `${lines.join('\n')}\n`, 'utf8')
console.log(`Netlify redirects: ${lines.length} rules`)
