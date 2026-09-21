import { isSpam, sendTelegramLead, validateLead } from '../server/telegram.mjs'

function sendJson(response, status, payload) {
  response.status(status)
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.setHeader('cache-control', 'no-store')
  response.json(payload)
}

export default async function contact(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('allow', 'POST')
    return sendJson(response, 405, { ok: false, error: 'method' })
  }

  const body = request.body
  if (validateLead(body)) return sendJson(response, 400, { ok: false, error: 'invalid' })

  // Silently accept honeypot and implausibly fast submissions. This keeps the
  // public response generic while preventing obvious bot traffic reaching Telegram.
  if (isSpam(body)) return sendJson(response, 200, { ok: true })

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return sendJson(response, 500, { ok: false, error: 'server' })

  try {
    await sendTelegramLead(body, { token, chatId })
    return sendJson(response, 200, { ok: true })
  } catch {
    return sendJson(response, 502, { ok: false, error: 'server' })
  }
}

export const config = {
  maxDuration: 10,
}
