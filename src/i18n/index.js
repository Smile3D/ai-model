import { createI18n } from 'vue-i18n'
import en from './locales/en.js'
import uk from './locales/uk.js'

export const i18n = createI18n({
  legacy: false,
  locale: 'uk',
  fallbackLocale: 'en',
  messages: { en, uk },
})
