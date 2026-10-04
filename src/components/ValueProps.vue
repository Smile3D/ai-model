<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { splitTextReveal } from '../composables/useSplitTextReveal.js'
import { scrollRevealGroup } from '../composables/useScrollRevealGroup.js'
import { prefersReducedMotionKey } from '../composables/injectionKeys.js'

const { t, tm, rt, locale } = useI18n()
const prefersReducedMotion = inject(prefersReducedMotionKey)

const items = computed(() =>
  tm('valueProps.items').map((item) => ({
    title: rt(item.title),
    description: rt(item.description),
  })),
)

const headingRef = ref(null)
const gridRef = ref(null)

let headingSplitInstance = null

onMounted(async () => {
  await nextTick()

  headingSplitInstance = splitTextReveal(headingRef.value, {
    skipAnimation: prefersReducedMotion?.value,
    scrollTrigger: { trigger: headingRef.value, start: 'top 85%' },
  })

  if (gridRef.value) {
    scrollRevealGroup(gridRef.value, Array.from(gridRef.value.children), {
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
          {{ t('valueProps.eyebrow') }}
        </p>
        <h2 ref="headingRef" class="font-display text-3xl font-semibold text-white md:text-4xl">
          {{ t('valueProps.heading') }}
        </h2>
      </div>

      <div
        ref="gridRef"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8"
      >
        <div
          class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-graphite-900/60 p-6"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-full border border-violet-400/40 text-violet-300"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="8" cy="12" r="4.5" stroke="currentColor" stroke-width="1.5" />
              <circle cx="16" cy="12" r="4.5" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </div>
          <h3 class="font-display text-lg font-semibold text-white">{{ items[0]?.title }}</h3>
          <p class="text-sm leading-relaxed text-white/60">{{ items[0]?.description }}</p>
        </div>

        <div
          class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-graphite-900/60 p-6"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/40 text-amber-300"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
          </div>
          <h3 class="font-display text-lg font-semibold text-white">{{ items[1]?.title }}</h3>
          <p class="text-sm leading-relaxed text-white/60">{{ items[1]?.description }}</p>
        </div>

        <div
          class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-graphite-900/60 p-6"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/40 text-emerald-300"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2.5l2.1 6.4 6.4 2.1-6.4 2.1-2.1 6.4-2.1-6.4-6.4-2.1 6.4-2.1 2.1-6.4Z"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3 class="font-display text-lg font-semibold text-white">{{ items[2]?.title }}</h3>
          <p class="text-sm leading-relaxed text-white/60">{{ items[2]?.description }}</p>
        </div>

        <div
          class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-graphite-900/60 p-6"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/80"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3l7 2.5v5.2c0 4.6-3 7.9-7 9.3-4-1.4-7-4.7-7-9.3V5.5L12 3Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path
                d="M8.8 12l2.2 2.2 4.2-4.2"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3 class="font-display text-lg font-semibold text-white">{{ items[3]?.title }}</h3>
          <p class="text-sm leading-relaxed text-white/60">{{ items[3]?.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
