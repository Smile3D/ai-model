<script setup>
import { inject, ref } from 'vue'
import { useCustomCursor } from '../composables/useCustomCursor.js'
import { shouldReduceEffectsKey } from '../composables/injectionKeys.js'

const shouldReduceEffects = inject(shouldReduceEffectsKey)
const cursorRef = ref(null)

useCustomCursor(cursorRef, { disabled: shouldReduceEffects })
</script>

<template>
  <div
    ref="cursorRef"
    class="custom-cursor pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 mix-blend-difference"
    aria-hidden="true"
  />
</template>

<style scoped>
.custom-cursor {
  will-change: transform;
}
</style>
