<script setup>
import { computed, inject, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import BloggerPlaceholder from './BloggerPlaceholder.vue'
import { accentPalette, getPaletteIndex } from '../utils/gradientPalette.js'
import { prefersReducedMotionKey } from '../composables/injectionKeys.js'

const props = defineProps({
  blogger: { type: Object, default: null },
  originRect: { type: Object, default: null },
  isOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const { t, tm, rt, locale } = useI18n()
const prefersReducedMotion = inject(prefersReducedMotionKey)

const accent = computed(() =>
  props.blogger ? accentPalette[getPaletteIndex(props.blogger.id)] : accentPalette[0],
)

const name = computed(() => (props.blogger ? t(`bloggers.${props.blogger.id}.name`) : ''))

const postCaptions = computed(() =>
  props.blogger ? tm(`bloggers.${props.blogger.id}.posts`).map((caption) => rt(caption)) : [],
)

const formatLikes = (likes) =>
  likes.toLocaleString(locale.value === 'uk' ? 'uk-UA' : 'en-US')

const panelRef = ref(null)

const handleKeydown = (event) => {
  if (event.key === 'Escape') emit('close')
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeydown)
      nextTick(() => panelRef.value?.focus())
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const computeOriginTransform = (panel) => {
  const rect = props.originRect
  if (!rect) return null

  const panelRect = panel.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2 - (panelRect.left + panelRect.width / 2),
    y: rect.top + rect.height / 2 - (panelRect.top + panelRect.height / 2),
    scaleX: rect.width / panelRect.width,
    scaleY: rect.height / panelRect.height,
  }
}

const onEnter = (el, done) => {
  const backdrop = el.querySelector('.modal-backdrop')
  const panel = el.querySelector('.modal-panel')
  const revealItems = el.querySelectorAll('.modal-reveal-item')
  const skipAnimation = Boolean(prefersReducedMotion?.value)

  if (skipAnimation) {
    gsap.set(backdrop, { opacity: 1 })
    gsap.set(panel, { x: 0, y: 0, scale: 1, opacity: 1 })
    gsap.set(revealItems, { y: 0, opacity: 1 })
    done()
    return
  }

  const origin = computeOriginTransform(panel)
  gsap.set(backdrop, { opacity: 0 })
  gsap.set(panel, origin ? { ...origin, opacity: 0 } : { scale: 0.92, y: 24, opacity: 0 })
  gsap.set(revealItems, { y: 16, opacity: 0 })

  const timeline = gsap.timeline({ onComplete: done })
  timeline.to(backdrop, { opacity: 1, duration: 0.3, ease: 'power2.out' })
  timeline.to(
    panel,
    { x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.55, ease: 'power3.out' },
    '<',
  )
  timeline.to(
    revealItems,
    { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08 },
    '-=0.25',
  )
}

const onLeave = (el, done) => {
  const backdrop = el.querySelector('.modal-backdrop')
  const panel = el.querySelector('.modal-panel')
  const skipAnimation = Boolean(prefersReducedMotion?.value)

  if (skipAnimation) {
    done()
    return
  }

  const origin = computeOriginTransform(panel)
  const timeline = gsap.timeline({ onComplete: done })
  timeline.to(
    panel,
    origin
      ? { ...origin, opacity: 0, duration: 0.4, ease: 'power3.in' }
      : { scale: 0.92, y: 24, opacity: 0, duration: 0.4, ease: 'power3.in' },
  )
  timeline.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '<0.05')
}

const handleBackdropClick = () => emit('close')
</script>

<template>
  <Teleport to="body">
    <Transition :css="false" @enter="onEnter" @leave="onLeave">
      <div
        v-if="isOpen && blogger"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      >
        <div
          class="modal-backdrop absolute inset-0 bg-graphite-950/80 backdrop-blur-sm"
          @click="handleBackdropClick"
        />

        <div
          ref="panelRef"
          class="modal-panel relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-graphite-900"
          role="dialog"
          aria-modal="true"
          :aria-label="t('modal.ariaProfile', { name })"
          tabindex="-1"
        >
          <button
            type="button"
            class="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-graphite-900/80 text-white/60 backdrop-blur-sm transition-colors hover:border-white/30 hover:text-white"
            :aria-label="t('modal.closeLabel')"
            @click="emit('close')"
          >
            <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <!-- Dedicated scroll container: the rounded/bordered frame above
               stays put and clips via overflow-hidden, so the scrollbar and
               scrolled content never visually breach the rounded corners. -->
          <div class="modal-scroll-area min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
            <div class="modal-reveal-item flex flex-col gap-6 md:flex-row md:items-start">
              <div class="w-36 shrink-0 md:w-44">
                <BloggerPlaceholder :name="name" :seed="blogger.id" :image="blogger.image" />
              </div>
              <div class="flex flex-col gap-3 pt-2">
                <h2 class="font-display text-2xl font-semibold text-white">{{ name }}</h2>
                <p class="text-sm text-white/40">{{ blogger.handle }}</p>
                <span
                  class="w-fit rounded-full border px-3 py-1 text-xs uppercase tracking-wide"
                  :class="[accent.border, accent.text]"
                >
                  {{ t(`niches.${blogger.niche}`) }}
                </span>
                <p class="text-sm leading-relaxed text-white/70">
                  {{ t(`bloggers.${blogger.id}.bio`) }}
                </p>
              </div>
            </div>

            <div class="modal-reveal-item mt-8">
              <h3 class="mb-3 text-xs uppercase tracking-wide text-white/40">
                {{ t('modal.postsHeading') }}
              </h3>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div v-for="(post, index) in blogger.posts" :key="index" class="flex flex-col gap-2">
                  <BloggerPlaceholder
                    :name="name"
                    :seed="blogger.id + '-' + index"
                    :image="post.image"
                    :alt="postCaptions[index]"
                  />
                  <p class="line-clamp-2 text-xs text-white/50">{{ postCaptions[index] }}</p>
                  <p class="text-xs text-white/30">❤ {{ formatLikes(post.likes) }}</p>
                </div>
              </div>
            </div>

            <a
              :href="blogger.telegramUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="modal-reveal-item mt-8 inline-flex w-fit items-center gap-2 self-start rounded-full bg-violet-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-400"
            >
              {{ t('modal.telegramCta') }}
              <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
