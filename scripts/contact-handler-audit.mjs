// Exercise the actual Netlify handler with a local Telegram stub, never a lead.
import assert from 'node:assert/strict'
import contact from '../netlify/functions/contact.mjs'

const originalFetch = globalThis.fetch
const originalNetlify = globalThis.Netlify
let configured = true
let telegramStatus = 200
const deliveries = []
globalThis.Netlify = { env: { get: name => configured ? `local-test-${name}` : undefined } }
globalThis.fetch = async (url, options) => {
  assert.equal(new URL(url).hostname, 'api.telegram.org')
  deliveries.push(JSON.parse(options.body))
  return new Response(JSON.stringify({ ok: telegramStatus === 200 }), { status: telegramStatus })
}
const valid = () => ({ name: 'Local QA', contact: 'test@example.invalid', company: '', service: 'Development', message: 'Local handler verification', hp: '', startedAt: Date.now() - 5000, lang: 'uk', page: '/uk/#contact-form' })
const request = body => new Request('https://local.invalid/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: typeof body === 'string' ? body : JSON.stringify(body) })
let checks = 0
try {
  const method = await contact(new Request('https://local.invalid/api/contact'))
  assert.equal(method.status, 405)
  assert.equal(method.headers.get('allow'), 'POST')
  checks++
  for (const body of ['{', {}, null, { ...valid(), name: '' }, { ...valid(), contact: '' }, { ...valid(), message: '' }]) {
    assert.equal((await contact(request(body))).status, 400)
    checks++
  }
  for (const body of [{ ...valid(), hp: 'spam' }, { ...valid(), startedAt: Date.now() }, { ...valid(), startedAt: 0 }, { ...valid(), startedAt: 'invalid' }]) {
    const response = await contact(request(body))
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { ok: true, delivered: false })
    checks++
  }
  assert.equal(deliveries.length, 0)
  configured = false
  assert.equal((await contact(request(valid()))).status, 500)
  configured = true
  for (const lang of ['uk', 'en', 'de', 'ru']) {
    const response = await contact(request({ ...valid(), lang }))
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { ok: true, delivered: true })
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.ok(deliveries.at(-1).text.includes(lang.toUpperCase()))
    checks++
  }
  telegramStatus = 500
  assert.equal((await contact(request(valid()))).status, 502)
  checks++
  console.log(`Contact handler passed: ${checks + 1} local checks; no external requests sent.`)
} finally {
  globalThis.fetch = originalFetch
  if (originalNetlify === undefined) delete globalThis.Netlify
  else globalThis.Netlify = originalNetlify
}
