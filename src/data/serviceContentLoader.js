import { closingContent } from './closingContent.js'

// Load only the service copy for the active language. All routes in that
// language share this cached data, so page navigation needs no extra fetch.
const loaders = {
  ru: () => import('./services/ru.js'),
  en: () => import('./services/en.js'),
  de: () => import('./services/de.js'),
  uk: () => import('./services/uk.js'),
}
const loaded = new Map()
const pending = new Map()

export function composeServiceContent(base, extension, email, lang) {
  return {
    ...base,
    ...extension,
    meta: { ...base.meta, ...extension.meta, 'email-deliverability': email.meta },
    email,
    directions: [...base.directions, ...extension.directions, {
      id: 'email-deliverability', number: '06', name: 'Email Deliverability',
      short: closingContent[lang].emailShort, statement: closingContent[lang].emailShort,
      items: closingContent[lang].emailItems,
    }],
  }
}

export function loadServiceContent(language) {
  const lang = Object.prototype.hasOwnProperty.call(loaders, language) ? language : 'en'
  if (loaded.has(lang)) return Promise.resolve(loaded.get(lang))
  if (!pending.has(lang)) {
    pending.set(lang, loaders[lang]().then(({ base, visibility, email }) => {
      const data = composeServiceContent(base, visibility, email, lang)
      loaded.set(lang, data)
      pending.delete(lang)
      return data
    }, error => {
      // A transient network failure must not poison later retries.
      pending.delete(lang)
      throw error
    }))
  }
  return pending.get(lang)
}

export function getServiceContent(lang) {
  if (!loaded.has(lang)) throw new Error(`Service content not loaded: ${lang}`)
  return loaded.get(lang)
}
