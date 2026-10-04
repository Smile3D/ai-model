<script setup>
import { inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { prefersReducedMotionKey } from '../composables/injectionKeys.js'

const emit = defineEmits(['lift', 'complete'])

const { t } = useI18n()
const prefersReducedMotion = inject(prefersReducedMotionKey)

const curtainRef = ref(null)
const isVisible = ref(true)

onMounted(() => {
  if (prefersReducedMotion?.value) {
    isVisible.value = false
    emit('lift')
    emit('complete')
    return
  }

  gsap.timeline({
    delay: 0.2,
    onStart: () => emit('lift'),
    onComplete: () => {
      isVisible.value = false
      emit('complete')
    },
  }).to(curtainRef.value, {
    yPercent: -100,
    duration: 0.9,
    ease: 'power4.inOut',
  })
})
</script>

<template>
  <div
    v-if="isVisible"
    ref="curtainRef"
    class="fixed inset-0 z-[200] flex items-center justify-center bg-graphite-950"
    aria-hidden="true"
  >
    <span class="font-display text-xs uppercase tracking-[0.4em] text-white/40">{{
      t('intro.label')
    }}</span>
  </div>
</template>
