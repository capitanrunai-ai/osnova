import { sendTelegramLead, validateLead, isSpam } from './telegram.mjs'

async function readJsonBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(data))
}

function contactMiddleware(env) {
  return async (req, res, next) => {
    if (req.url.split('?')[0] !== '/api/contact') return next()
    if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method' })

    let body
    try {
      body = await readJsonBody(req)
    } catch {
      return sendJson(res, 400, { ok: false, error: 'invalid' })
    }

    if (validateLead(body)) return sendJson(res, 400, { ok: false, error: 'invalid' })
    if (isSpam(body)) return sendJson(res, 200, { ok: true, delivered: false })

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      console.error('[contact] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID — check .env.local')
      return sendJson(res, 500, { ok: false, error: 'server' })
    }

    try {
      await sendTelegramLead(body, { token: env.TELEGRAM_BOT_TOKEN, chatId: env.TELEGRAM_CHAT_ID })
      return sendJson(res, 200, { ok: true, delivered: true })
    } catch (error) {
      console.error('[contact] Failed to deliver lead to Telegram:', error.message)
      return sendJson(res, 502, { ok: false, error: 'server' })
    }
  }
}

export function contactApiPlugin(env) {
  return {
    name: 'osnova-contact-api',
    configureServer(server) {
      server.middlewares.use(contactMiddleware(env))
    },
    configurePreviewServer(server) {
      server.middlewares.use(contactMiddleware(env))
    },
  }
}
