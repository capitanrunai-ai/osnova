import { isSpam, sendTelegramLead, validateLead } from '../../server/telegram.mjs'

const json = (statusCode, body, extraHeaders = {}) => new Response(JSON.stringify(body), {
  status: statusCode,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...extraHeaders,
  },
})

export default async function contact(request) {
  if (request.method !== 'POST') {
    return json(405, { ok: false, error: 'method' }, { allow: 'POST' })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json(400, { ok: false, error: 'invalid' })
  }

  if (validateLead(body)) return json(400, { ok: false, error: 'invalid' })
  // Spam is answered as success on purpose, so a bot learns nothing. `delivered`
  // stays false so the browser does not record it as a lead conversion.
  if (isSpam(body)) return json(200, { ok: true, delivered: false })

  const token = Netlify.env.get('TELEGRAM_BOT_TOKEN')
  const chatId = Netlify.env.get('TELEGRAM_CHAT_ID')
  if (!token || !chatId) return json(500, { ok: false, error: 'server' })

  try {
    await sendTelegramLead(body, { token, chatId })
    return json(200, { ok: true, delivered: true })
  } catch {
    return json(502, { ok: false, error: 'server' })
  }
}

export const config = {
  path: '/api/contact',
}
