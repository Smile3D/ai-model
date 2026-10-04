<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { gradientPalette, getPaletteIndex } from '../utils/gradientPalette.js'

const { t } = useI18n()

const props = defineProps({
  name: { type: String, required: true },
  seed: { type: [String, Number], required: true },
  image: { type: String, default: undefined },
  alt: { type: String, default: '' },
})

const gradientStyle = computed(() => ({
  backgroundImage: gradientPalette[getPaletteIndex(props.seed)],
}))

const initials = computed(() =>
  props.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase(),
)
</script>

<template>
  <div class="relative aspect-square w-full overflow-hidden rounded-2xl bg-graphite-900">
    <img v-if="image" :src="image" :alt="alt || name" class="h-full w-full object-cover" />

    <div
      v-else
      class="relative h-full w-full"
      :style="gradientStyle"
      role="img"
      :aria-label="t('placeholder.ariaLabel', { name })"
    >
      <svg
        class="absolute inset-0 h-full w-full opacity-[0.16]"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="100" cy="76" r="36" fill="white" />
        <path d="M28 214 C28 142 172 142 172 214 Z" fill="white" />
      </svg>

      <span
        class="absolute inset-0 flex items-center justify-center font-display text-3xl font-semibold tracking-wide text-white/90 sm:text-5xl md:text-6xl"
        aria-hidden="true"
      >
        {{ initials }}
      </span>

      <div class="grain-overlay absolute inset-0" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.grain-overlay {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
  opacity: 0.35;
}
</style>
