<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const locales = [
  { code: 'uk', labelKey: 'language.uk' },
  { code: 'en', labelKey: 'language.en' },
]

const selectLocale = (code) => {
  locale.value = code
}
</script>

<template>
  <div
    class="fixed right-4 top-4 z-[110] flex items-center gap-1 rounded-full border border-white/15 bg-graphite-900/70 p-1 backdrop-blur-sm md:right-6 md:top-6"
    role="group"
    :aria-label="t('language.label')"
  >
    <button
      v-for="option in locales"
      :key="option.code"
      type="button"
      class="rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors"
      :class="
        locale === option.code
          ? 'bg-violet-500 text-white'
          : 'text-white/50 hover:text-white'
      "
      :aria-pressed="locale === option.code"
      @click="selectLocale(option.code)"
    >
      {{ t(option.labelKey) }}
    </button>
  </div>
</template>
