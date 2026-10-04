<script setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { useMagneticElement } from '../composables/useMagneticElement.js'
import { usePinnedProgress } from '../composables/usePinnedProgress.js'
import { prefersReducedMotionKey, shouldReduceEffectsKey } from '../composables/injectionKeys.js'

const { t, tm, rt } = useI18n()
const shouldReduceEffects = inject(shouldReduceEffectsKey)
const prefersReducedMotion = inject(prefersReducedMotionKey)

const pinnedRef = ref(null)
const contentRef = ref(null)
const ctaRef = ref(null)
const marqueeRef = ref(null)

const marqueeWords = computed(() => tm('cta.marquee').map((word) => rt(word)))

useMagneticElement(ctaRef, { strength: 0.3, disabled: shouldReduceEffects })

usePinnedProgress(
  pinnedRef,
  (progress) => {
    gsap.set(contentRef.value, {
      scale: gsap.utils.interpolate(0.85, 1, progress),
      opacity: gsap.utils.interpolate(0.3, 1, progress),
    })
  },
  { disabled: shouldReduceEffects, end: '+=60%' },
)

let marqueeTween = null

onMounted(() => {
  if (prefersReducedMotion?.value) return
  marqueeTween = gsap.to(marqueeRef.value, {
    xPercent: -50,
    duration: 22,
    ease: 'linear',
    repeat: -1,
  })
})

onUnmounted(() => {
  marqueeTween?.kill()
})
</script>

<template>
  <section
    id="telegram-cta"
    ref="pinnedRef"
    class="relative flex flex-col items-center gap-10 overflow-hidden px-6 pt-8 text-center sm:gap-14 sm:pt-10 lg:min-h-screen lg:pt-24"
  >
    <div ref="contentRef" class="flex flex-col items-center gap-6">
      <h2 class="max-w-2xl font-display text-3xl font-semibold text-white md:text-5xl">
        {{ t('cta.heading') }}
      </h2>
      <p class="max-w-lg text-white/60">
        {{ t('cta.subtitle') }}
      </p>

      <a
        ref="ctaRef"
        href="https://t.me/ai_bloggers_showcase"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 inline-flex items-center gap-3 rounded-full bg-violet-500 px-10 py-5 text-lg font-medium text-white transition-colors hover:bg-violet-400"
      >
        {{ t('cta.button') }}
        <svg class="h-5 w-5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
    </div>

    <div
      class="marquee-mask mt-auto w-full overflow-hidden border-y border-white/10 py-4"
      aria-hidden="true"
    >
      <div ref="marqueeRef" class="flex w-max gap-10 whitespace-nowrap">
        <span v-for="group in 2" :key="group" class="flex gap-10">
          <span
            v-for="(word, index) in marqueeWords"
            :key="index"
            class="text-sm uppercase tracking-[0.3em] text-white/30"
          >
            {{ word }} ·
          </span>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-mask {
  mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
}
</style>
