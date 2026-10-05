// Compatibility export for tools that inspect all locales. The browser uses
// serviceContentLoader.js so inactive languages stay outside its initial JS.
import { base as ru } from './services/ru.js'
import { base as en } from './services/en.js'
import { base as de } from './services/de.js'
import { base as uk } from './services/uk.js'

export const serviceContent = { ru, en, de, uk }
