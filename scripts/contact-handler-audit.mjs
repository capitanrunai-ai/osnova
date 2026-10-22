// Exercise the actual Netlify handler with a local Telegram stub, never a lead.
import assert from 'node:assert/strict'
import contact from '../netlify/functions/contact.mjs'
import { content } from '../src/data/content.js'

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
const valid = () => ({ name: 'Local QA', contact: '@local_qa', service: 'Development', hp: '', startedAt: Date.now() - 5000, lang: 'uk', page: '/uk/contact' })
const request = body => new Request('https://local.invalid/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: typeof body === 'string' ? body : JSON.stringify(body) })
let checks = 0
try {
  const method = await contact(new Request('https://local.invalid/api/contact'))
  assert.equal(method.status, 405)
  assert.equal(method.headers.get('allow'), 'POST')
  checks++
  for (const body of ['{', {}, null, [], { ...valid(), name: '' }, { ...valid(), name: '   ' }, { ...valid(), contact: '' }, { ...valid(), contact: '   ' }, { ...valid(), contact: {} }, { ...valid(), message: {} }, { ...valid(), company: [] }, { ...valid(), email: {} }, { ...valid(), email: 'invalid' }, { ...valid(), email: 'a@@b.com' }, { ...valid(), email: 'a@b com' }, { ...valid(), email: 'a'.repeat(250) + '@test.invalid' }]) {
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
    for (const [index, service] of content[lang].contact.options.entries()) {
      const primary = ['+34 600 123 456', '@local_qa', 'local_qa'][index % 3]
      const response = await contact(request({ ...valid(), contact: primary, service, lang }))
      assert.equal(response.status, 200)
      assert.deepEqual(await response.json(), { ok: true, delivered: true })
      assert.equal(response.headers.get('cache-control'), 'no-store')
      const text = deliveries.at(-1).text
      assert.ok(text.includes(`Телефон / Telegram: ${primary}`))
      assert.ok(text.includes(`Направление: ${service}`) && text.includes(lang.toUpperCase()))
      assert.ok(!/Email:|Компания:|Описание задачи:|undefined|null/.test(text), 'absent optional fields leave no lines')
      checks++
    }
    const response = await contact(request({ ...valid(), lang, contact: ' +49 (30) 123-45 ', email: ' qa@example.invalid ', company: ' Example ', message: ' A new website from scratch ' }))
    assert.equal(response.status, 200)
    const text = deliveries.at(-1).text
    assert.ok(text.includes('Телефон / Telegram: +49 (30) 123-45\nEmail: qa@example.invalid\nКомпания: Example\nНаправление: Development\nОписание задачи: A new website from scratch'))
    checks++
  }
  for (const message of ['', '   ', null]) {
    const response = await contact(request({ ...valid(), message, email: '  ', company: '  ' }))
    assert.equal(response.status, 200)
    assert.ok(!/Email:|Компания:|Описание задачи:/.test(deliveries.at(-1).text))
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
