import { visibility as ru } from './services/ru.js'
import { visibility as en } from './services/en.js'
import { visibility as de } from './services/de.js'
import { visibility as uk } from './services/uk.js'
import { emailContent } from './emailContent.js'
import { composeServiceContent } from './serviceContentLoader.js'

export const visibilityContent = { ru, en, de, uk }

export function extendServiceContent(base, lang) {
  return composeServiceContent(base, visibilityContent[lang], emailContent[lang], lang)
}
