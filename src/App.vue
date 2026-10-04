<script setup>
import { nextTick, onMounted, provide, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Hero from './components/Hero.vue'
import ValueProps from './components/ValueProps.vue'
import HowItWorks from './components/HowItWorks.vue'
import BloggerCard from './components/BloggerCard.vue'
import ProfileModal from './components/ProfileModal.vue'
import TelegramCta from './components/TelegramCta.vue'
import CustomCursor from './components/CustomCursor.vue'
import PageIntroCurtain from './components/PageIntroCurtain.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { bloggers } from './data/bloggers.js'
import { useDeviceCapabilities } from './composables/useDeviceCapabilities.js'
import { useLenis } from './composables/useLenis.js'
import { splitTextReveal } from './composables/useSplitTextReveal.js'
import { scrollRevealGroup } from './composables/useScrollRevealGroup.js'
import {
  introCompleteKey,
  lenisInstanceKey,
  prefersReducedMotionKey,
  shouldReduceEffectsKey,
} from './composables/injectionKeys.js'

const { t, locale } = useI18n()
const { prefersReducedMotion, shouldReduceEffects } = useDeviceCapabilities()
const { lenisInstance } = useLenis(shouldReduceEffects)

const introComplete = ref(false)

provide(prefersReducedMotionKey, prefersReducedMotion)
provide(shouldReduceEffectsKey, shouldReduceEffects)
provide(lenisInstanceKey, lenisInstance)
provide(introCompleteKey, introComplete)

const catalogHeadingRef = ref(null)
const cardsContainerRef = ref(null)

const activeBlogger = ref(null)
const activeOriginRect = ref(null)
const isModalOpen = ref(false)

const handleOpenProfile = ({ blogger, originRect }) => {
  activeBlogger.value = blogger
  activeOriginRect.value = originRect
  isModalOpen.value = true
}

const handleCloseProfile = () => {
  isModalOpen.value = false
}

watch(isModalOpen, (isOpen) => {
  if (isOpen) lenisInstance.value?.stop()
  else lenisInstance.value?.start()
})

let catalogHeadingSplitInstance = null

onMounted(async () => {
  await nextTick()

  catalogHeadingSplitInstance = splitTextReveal(catalogHeadingRef.value, {
    skipAnimation: prefersReducedMotion.value,
    scrollTrigger: { trigger: catalogHeadingRef.value, start: 'top 85%' },
  })

  if (cardsContainerRef.value) {
    scrollRevealGroup(cardsContainerRef.value, Array.from(cardsContainerRef.value.children), {
      skipAnimation: prefersReducedMotion.value,
    })
  }
})

// Keep the SplitText-generated markup in sync with the heading's text
// after a language switch (see the matching watcher in Hero.vue).
watch(locale, async () => {
  catalogHeadingSplitInstance?.revert()
  await nextTick()
  catalogHeadingSplitInstance = splitTextReveal(catalogHeadingRef.value, { skipAnimation: true })
})
</script>

<template>
  <PageIntroCurtain @lift="introComplete = true" />
  <CustomCursor v-if="!shouldReduceEffects" />
  <LanguageSwitcher />

  <main class="relative">
    <Hero />

    <ValueProps />

    <section id="catalog" class="relative px-6 pb-12 pt-24 md:pb-16 md:pt-32">
      <div class="mx-auto max-w-[90rem]">
        <div class="mb-12 max-w-xl">
          <p class="mb-3 text-xs uppercase tracking-[0.3em] text-white/40">
            {{ t('catalog.eyebrow') }}
          </p>
          <h2
            ref="catalogHeadingRef"
            class="font-display text-3xl font-semibold text-white md:text-4xl"
          >
            {{ t('catalog.heading') }}
          </h2>
        </div>

        <div
          ref="cardsContainerRef"
          class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          <BloggerCard
            v-for="blogger in bloggers"
            :key="blogger.id"
            :blogger="blogger"
            @open="handleOpenProfile"
          />
        </div>
      </div>
    </section>

    <HowItWorks />

    <TelegramCta />

    <ProfileModal
      :blogger="activeBlogger"
      :origin-rect="activeOriginRect"
      :is-open="isModalOpen"
      @close="handleCloseProfile"
    />
  </main>
</template>
