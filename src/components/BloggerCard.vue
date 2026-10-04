<script setup>
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BloggerPlaceholder from './BloggerPlaceholder.vue'
import { accentPalette, getPaletteIndex } from '../utils/gradientPalette.js'
import { useTiltCard } from '../composables/useTiltCard.js'
import { useMagneticElement } from '../composables/useMagneticElement.js'
import { shouldReduceEffectsKey } from '../composables/injectionKeys.js'

const props = defineProps({
  blogger: { type: Object, required: true },
})

const emit = defineEmits(['open'])

const { t } = useI18n()
const shouldReduceEffects = inject(shouldReduceEffectsKey)

const cardRef = ref(null)
const ctaRef = ref(null)

useTiltCard(cardRef, { disabled: shouldReduceEffects })
useMagneticElement(ctaRef, { strength: 0.3, disabled: shouldReduceEffects })

const accent = computed(() => accentPalette[getPaletteIndex(props.blogger.id)])
const cardStyle = computed(() => ({ '--card-glow': accent.value.glow }))
const name = computed(() => t(`bloggers.${props.blogger.id}.name`))

const handleOpen = () => {
  emit('open', {
    blogger: props.blogger,
    originRect: cardRef.value?.getBoundingClientRect(),
  })
}
</script>

<template>
  <button
    ref="cardRef"
    type="button"
    :style="cardStyle"
    class="group blogger-card relative flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-graphite-900/60 p-4 text-left transition-colors hover:border-white/20 sm:gap-4 sm:p-5 md:p-6"
    :aria-label="t('card.openProfile', { name })"
    @click="handleOpen"
  >
    <BloggerPlaceholder :name="name" :seed="blogger.id" :image="blogger.image" />

    <div class="flex flex-col gap-1.5 sm:gap-2">
      <div class="flex flex-col">
        <h3 class="font-display text-base font-semibold text-white sm:text-lg">{{ name }}</h3>
        <span class="text-xs text-white/40 sm:text-sm">{{ blogger.handle }}</span>
      </div>

      <span
        class="w-fit rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wide sm:px-3 sm:text-xs"
        :class="[accent.border, accent.text]"
      >
        {{ t(`niches.${blogger.niche}`) }}
      </span>

      <p class="text-xs leading-relaxed text-white/60 sm:text-sm">
        {{ t(`bloggers.${blogger.id}.tagline`) }}
      </p>
    </div>

    <span
      ref="ctaRef"
      class="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-violet-500 px-4 py-2 text-xs font-medium text-white transition-colors group-hover:bg-violet-400 sm:px-5 sm:py-2.5 sm:text-sm"
    >
      {{ t('card.cta') }}
      <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.blogger-card {
  will-change: transform;
  box-shadow: 0 0 0 0 transparent;
  transition:
    box-shadow 0.4s ease,
    border-color 0.4s ease;
}

.blogger-card:hover {
  box-shadow: 0 30px 60px -20px var(--card-glow);
}
</style>
