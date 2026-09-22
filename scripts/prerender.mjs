// Prerenders every public route into a real HTML document.
//
// The page metadata (title, description, canonical, hreflang, og:*, html lang)
// is produced by the app itself in src/App.jsx. Rendering the routes in a real
// browser means that logic stays the single source of truth instead of being
// reimplemented here and drifting.

import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { platform } from 'node:process'

import puppeteer from 'puppeteer-core'

import { siteUrl } from '../site.config.mjs'
import { buildRoutes, buildUtilityRoutes } from './site-routes.mjs'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon',
}

const CHROME_CANDIDATES = {
  // Forward slashes work on Windows too and avoid escaping noise.
  win32: [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    (process.env.LOCALAPPDATA || '').replaceAll(String.fromCharCode(92), '/') + '/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ],
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ],
  linux: [
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ],
}

async function findChrome() {
  const explicit = process.env.CHROME_PATH || process.env.PUPPETEER_EXECUTABLE_PATH
  if (explicit) return explicit
  for (const candidate of CHROME_CANDIDATES[platform] || []) {
    if (!candidate) continue
    try { await stat(candidate); return candidate } catch { /* keep looking */ }
  }
  throw new Error(
    'Chrome not found for prerendering. Install Chrome or set CHROME_PATH=/path/to/chrome.\n' +
    'The production build must not ship without prerendered HTML.',
  )
}

// Serves dist/ with an SPA fallback, exactly like the edge worker will.
function startServer() {
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1')
    let file = join(dist, decodeURIComponent(url.pathname))
    try {
      const info = await stat(file)
      if (info.isDirectory()) file = join(file, 'index.html')
    } catch {
      file = join(dist, 'index.html')
    }
    try {
      await stat(file)
    } catch {
      file = join(dist, 'index.html')
    }
    response.writeHead(200, { 'content-type': MIME[extname(file).toLowerCase()] || 'application/octet-stream' })
    createReadStream(file).pipe(response)
  })
  return new Promise((done) => {
    server.listen(0, '127.0.0.1', () => done({ server, origin: `http://127.0.0.1:${server.address().port}` }))
  })
}

async function snapshot(page, origin, path) {
  await page.goto(`${origin}${path}`, { waitUntil: 'domcontentloaded', timeout: 60000 })

  // The app has mounted and written its metadata.
  await page.waitForFunction(
    () => document.getElementById('root')?.children.length > 0 && document.title.length > 0,
    { timeout: 30000 },
  )

  // Walk the page so every IntersectionObserver-driven reveal has fired: the
  // snapshot then contains visible content rather than markup at opacity 0.
  await page.evaluate(async () => {
    const html = document.documentElement
    html.style.setProperty('scroll-behavior', 'auto')
    const wait = (ms) => new Promise((done) => setTimeout(done, ms))
    for (let y = 0; y < document.body.scrollHeight; y += Math.round(window.innerHeight * 0.75)) {
      window.scrollTo(0, y)
      await wait(55)
    }
    window.scrollTo(0, document.body.scrollHeight)
    await wait(180)
    window.scrollTo(0, 0)
    await wait(140)
    html.style.removeProperty('scroll-behavior')
    if (!html.getAttribute('style')) html.removeAttribute('style')
    // Reveal classes are runtime state. The inline override keeps the saved
    // document visible; the client observer will reveal visible nodes again.
    for (const node of document.querySelectorAll('.reveal.is-visible')) node.classList.remove('is-visible')
    // Audio metadata can arrive during the prerender walk. Save the player's
    // initial state so hydration matches; the client reads loaded metadata.
    for (const player of document.querySelectorAll('.voice-player')) {
      const seek = player.querySelector('.audio-seek')
      seek?.setAttribute('max', '1')
      seek?.setAttribute('value', '0')
      seek?.setAttribute('aria-valuetext', '00:00 / 00:00')
      seek?.setAttribute('disabled', '')
      player.querySelector('.audio-time span:last-child')?.replaceChildren('—:—')
    }
    // A client-rendered React tree can have adjacent text nodes (for example
    // the literal "0" followed by a number). HTML serialization merges them;
    // React's server markup uses a comment to retain the hydration boundary.
    const walker = document.createTreeWalker(document.getElementById('root'), NodeFilter.SHOW_TEXT)
    const adjacent = []
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (node.nextSibling?.nodeType === Node.TEXT_NODE) adjacent.push(node)
    }
    for (const node of adjacent) node.after(document.createComment(' '))
  })

  return `<!doctype html>\n${await page.evaluate(() => document.documentElement.outerHTML)}\n`
}

// Injected last in <head>, after the stylesheet, so it wins over `.reveal`.
// The prerendered markup already carries its content, so the page paints it
// immediately; the app removes this override once it has mounted, which keeps
// the entrance animations intact without a flash in between.
const REVEAL_OVERRIDE = '<style id="prerender-reveal">.reveal{opacity:1;transform:none;transition:none}</style>'

function finalize(html, previewOrigin, { isHome }) {
  let out = html.replaceAll(previewOrigin, siteUrl)
  if (isHome) {
    // The hero background is critical first-screen media on the homepage only.
    out = out.replace(
      '</title>',
      '</title>\n    <link rel="preload" href="/assets/system-convergence.webp" as="image" type="image/webp" fetchpriority="high" />',
    )
  }
  if (!out.includes('</head>')) throw new Error('prerendered document has no </head>')
  return out.replace('</head>', `  ${REVEAL_OVERRIDE}\n  </head>`)
}

async function write(path, html) {
  const file = path.endsWith('/') ? join(dist, path, 'index.html') : join(dist, path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html, 'utf8')
  return file
}

const routes = buildRoutes()
const utility = buildUtilityRoutes()

const { server, origin } = await startServer()
const browser = await puppeteer.launch({
  executablePath: await findChrome(),
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
})

const results = []
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])

  for (const entry of [...routes, ...utility]) {
    const html = await snapshot(page, origin, entry.path)
    results.push({
      path: entry.path,
      html: finalize(html, origin, { isHome: entry.route === '' }),
    })
    process.stdout.write(`  ${entry.path}\n`)
  }
} finally {
  await browser.close()
  server.close()
}

// Written only after the browser is closed, so the preview server always served
// the SPA shell rather than a half-finished prerender.
for (const { path, html } of results) await write(path, html)

// Generic fallback for paths that carry no language prefix.
const genericNotFound = results.find((entry) => entry.path === '/en/404')
await writeFile(resolve(dist, '404.html'), genericNotFound.html, 'utf8')

const sample = await readFile(resolve(dist, 'de', 'services', 'seo', 'index.html'), 'utf8')
if (!sample.includes('lang="de"')) throw new Error('prerender sanity check failed: /de/services/seo is not German')

console.log(`\nprerendered ${results.length} documents (+ dist/404.html)`)
