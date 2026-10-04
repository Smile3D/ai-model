<script setup>
import { inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { splitTextReveal } from '../composables/useSplitTextReveal.js'
import { useParallaxLayers } from '../composables/useParallaxLayers.js'
import { useMagneticElement } from '../composables/useMagneticElement.js'
import {
  introCompleteKey,
  lenisInstanceKey,
  prefersReducedMotionKey,
  shouldReduceEffectsKey,
} from '../composables/injectionKeys.js'

const { t, locale } = useI18n()
const shouldReduceEffects = inject(shouldReduceEffectsKey)
const prefersReducedMotion = inject(prefersReducedMotionKey)
const lenisInstance = inject(lenisInstanceKey)
const introComplete = inject(introCompleteKey)

const parallaxContainerRef = ref(null)
const titleRef = ref(null)
const subtitleRef = ref(null)
const ctaRef = ref(null)

useParallaxLayers(parallaxContainerRef, { disabled: shouldReduceEffects })
useMagneticElement(ctaRef, { strength: 0.25, disabled: shouldReduceEffects })

let titleSplitInstance = null
let idleOrbTween = null

const runEntrance = () => {
  const skipAnimation = Boolean(prefersReducedMotion?.value)
  const entranceDuration = skipAnimation ? 0.01 : 0.9

  titleSplitInstance = splitTextReveal(titleRef.value, {
    duration: skipAnimation ? 0.01 : 1,
    stagger: 0.045,
    skipAnimation,
  })

  gsap.from(subtitleRef.value, {
    y: 24,
    opacity: 0,
    duration: entranceDuration,
    delay: skipAnimation ? 0 : 0.2,
    ease: 'power3.out',
  })

  gsap.from(ctaRef.value, {
    y: 16,
    opacity: 0,
    duration: entranceDuration,
    delay: skipAnimation ? 0 : 0.5,
    ease: 'power3.out',
  })
}

onMounted(() => {
  if (introComplete?.value) {
    runEntrance()
  } else if (introComplete) {
    watch(introComplete, (ready) => ready && runEntrance(), { once: true })
  } else {
    runEntrance()
  }

  if (!prefersReducedMotion?.value && parallaxContainerRef.value) {
    const orbs = parallaxContainerRef.value.querySelectorAll('.parallax-orb')
    idleOrbTween = gsap.to(orbs, {
      scale: 1.12,
      opacity: '+=0.08',
      duration: 5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.6,
    })
  }
})

onUnmounted(() => {
  titleSplitInstance?.revert()
  idleOrbTween?.kill()
})

// GSAP SplitText injects its own span markup into the title; re-splitting
// after a language switch keeps that markup in sync with the new text
// instead of letting Vue patch a text node SplitText already rewrote.
watch(locale, async () => {
  titleSplitInstance?.revert()
  await nextTick()
  titleSplitInstance = splitTextReveal(titleRef.value, { skipAnimation: true })
})

const handleScrollToCatalog = () => {
  const target = document.getElementById('catalog')
  if (lenisInstance?.value) {
    lenisInstance.value.scrollTo(target, { offset: -24 })
  } else {
    target?.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
  >
    <div ref="parallaxContainerRef" class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        data-parallax-speed="0.02"
        class="parallax-orb absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-700/30 blur-3xl"
      />
      <div
        data-parallax-speed="0.05"
        class="parallax-orb absolute right-0 top-1/3 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl"
      />
      <div
        data-parallax-speed="0.08"
        class="parallax-orb absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"
      />
    </div>

    <p class="relative z-10 mb-4 text-xs uppercase tracking-[0.3em] text-white/50">
      {{ t('hero.eyebrow') }}
    </p>

    <h1
      ref="titleRef"
      class="relative z-10 max-w-4xl font-display text-4xl font-semibold leading-tight text-white md:text-6xl"
    >
      {{ t('hero.title') }}
    </h1>

    <p ref="subtitleRef" class="relative z-10 mt-6 max-w-xl text-base text-white/60 md:text-lg">
      {{ t('hero.subtitle') }}
    </p>

    <a
      ref="ctaRef"
      href="#catalog"
      class="relative z-10 mt-10 inline-flex items-center gap-2 rounded-full bg-violet-500 px-8 py-4 text-base font-medium text-white transition-colors hover:bg-violet-400"
      @click.prevent="handleScrollToCatalog"
    >
      {{ t('hero.cta') }}
      <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 3v10m0 0 4-4M8 13 4 9"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
  </section>
</template>
