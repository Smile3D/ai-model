<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { splitTextReveal } from '../composables/useSplitTextReveal.js'
import { scrollRevealGroup } from '../composables/useScrollRevealGroup.js'
import { prefersReducedMotionKey } from '../composables/injectionKeys.js'

const { t, tm, rt, locale } = useI18n()
const prefersReducedMotion = inject(prefersReducedMotionKey)

const steps = computed(() =>
  tm('howItWorks.steps').map((step) => ({
    title: rt(step.title),
    description: rt(step.description),
  })),
)

const headingRef = ref(null)
const stepsRef = ref(null)

let headingSplitInstance = null

onMounted(async () => {
  await nextTick()

  headingSplitInstance = splitTextReveal(headingRef.value, {
    skipAnimation: prefersReducedMotion?.value,
    scrollTrigger: { trigger: headingRef.value, start: 'top 85%' },
  })

  if (stepsRef.value) {
    scrollRevealGroup(stepsRef.value, Array.from(stepsRef.value.children), {
      skipAnimation: prefersReducedMotion?.value,
    })
  }
})

onUnmounted(() => {
  headingSplitInstance?.revert()
})

watch(locale, async () => {
  headingSplitInstance?.revert()
  await nextTick()
  headingSplitInstance = splitTextReveal(headingRef.value, { skipAnimation: true })
})
</script>

<template>
  <section class="relative px-6 py-16 sm:py-20 lg:py-28">
    <div class="mx-auto max-w-[90rem]">
      <div class="mb-10 max-w-xl sm:mb-12">
        <p class="mb-3 text-xs uppercase tracking-[0.3em] text-white/40">
          {{ t('howItWorks.eyebrow') }}
        </p>
        <h2 ref="headingRef" class="font-display text-3xl font-semibold text-white md:text-4xl">
          {{ t('howItWorks.heading') }}
        </h2>
      </div>

      <div ref="stepsRef" class="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex flex-col gap-3 rounded-2xl border border-white/10 bg-graphite-900/60 p-6 sm:p-8"
        >
          <span class="font-display text-4xl font-semibold text-white/15 sm:text-5xl">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <h3 class="font-display text-lg font-semibold text-white">{{ step.title }}</h3>
          <p class="text-sm leading-relaxed text-white/60">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
