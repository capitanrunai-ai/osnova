// Local-only static preview of dist and the generated Netlify redirect rules.
// This models documented file shadowing; it does not contact or deploy Netlify.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'

export async function startProductionAuditServer() {
  const dist = resolve(import.meta.dirname, '../dist')
  const rules = (await readFile(resolve(dist, '_redirects'), 'utf8')).split(/\r?\n/)
    .filter(line => line.trim() && !line.startsWith('#')).map(line => {
      const [from, to, status] = line.trim().split(/\s+/)
      return { from, to, status: Number.parseInt(status), force: status.endsWith('!') }
    })
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain' }
  const fileFor = async path => {
    const file = resolve(dist, `.${decodeURIComponent(path)}`)
    if (!file.startsWith(dist + sep) && file !== dist) return null
    try {
      const info = await stat(file)
      if (info.isFile()) return file
      const index = resolve(file, 'index.html')
      return (await stat(index)).isFile() ? index : null
    } catch { return null }
  }
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://127.0.0.1')
      const file = await fileFor(url.pathname)
      const rule = rules.find(rule => {
        const match = rule.from.endsWith('*') ? url.pathname.startsWith(rule.from.slice(0, -1)) : url.pathname === rule.from
        return match && (rule.force || !file)
      })
      if (rule && rule.status >= 300 && rule.status < 400) {
        response.writeHead(rule.status, { location: rule.to + url.search })
        return response.end()
      }
      const target = rule ? await fileFor(rule.to) : file
      response.writeHead(rule?.status || (target ? 200 : 404), { 'content-type': types[extname(target || '')] || 'application/octet-stream' })
      if (request.method === 'HEAD') return response.end()
      response.end(target ? await readFile(target) : 'Not found')
    } catch {
      response.writeHead(400)
      response.end('Bad request')
    }
  })
  await new Promise(done => server.listen(0, '127.0.0.1', done))
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(done => server.close(done)) }
}
