// Shared lead-submission logic used by the Vite dev/preview API middleware.
// The production edge worker (scripts/prepare-sites.mjs) keeps its own
// self-contained copy of this logic since the deployed worker ships as a
// single file with no bundler step.

const MIN_ELAPSED_MS = 1200
const MAX_ELAPSED_MS = 1000 * 60 * 60

function clean(value, max = 800) {
  return String(value == null ? '' : value).trim().slice(0, max)
}

export function buildLeadMessage(fields) {
  const lines = ['НОВАЯ ЗАЯВКА — OSNOVA', '']
  lines.push(`Имя: ${fields.name}`)
  lines.push(`Компания: ${fields.company || '—'}`)
  lines.push(`Контакт: ${fields.contact}`)
  lines.push(`Выбранная услуга: ${fields.service || '—'}`)
  lines.push(`Сообщение: ${fields.message}`)
  if (fields.lang || fields.page) {
    lines.push('')
    if (fields.lang) lines.push(`Язык сайта: ${fields.lang.toUpperCase()}`)
    if (fields.page) lines.push(`Страница: ${fields.page}`)
  }
  return lines.join('\n')
}

export function validateLead(body) {
  if (!body || typeof body !== 'object') return 'invalid'
  if (!clean(body.name, 120) || !clean(body.contact, 160) || !clean(body.message, 2000)) return 'invalid'
  return null
}

export function isSpam(body) {
  if (clean(body.hp, 200)) return true
  const startedAt = Number(body.startedAt)
  if (!Number.isFinite(startedAt)) return true
  const elapsed = Date.now() - startedAt
  return elapsed < MIN_ELAPSED_MS || elapsed > MAX_ELAPSED_MS
}

export async function sendTelegramLead(body, { token, chatId }) {
  const text = buildLeadMessage({
    name: clean(body.name, 120),
    contact: clean(body.contact, 160),
    company: clean(body.company, 160),
    service: clean(body.service, 160),
    message: clean(body.message, 2000),
    lang: clean(body.lang, 8),
    page: clean(body.page, 200),
  })
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.ok) throw new Error(`telegram_${response.status}`)
}
