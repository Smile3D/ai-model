import { computed, onMounted, onUnmounted, ref } from 'vue'

/**
 * Reports device/display capabilities so heavy animation effects
 * (parallax, magnetic cursor, 3D tilt) can be skipped where they
 * would be janky or meaningless: touch devices, narrow viewports,
 * or when the user requested reduced motion.
 */
export function useDeviceCapabilities() {
  const prefersReducedMotion = ref(false)
  const isTouchDevice = ref(false)
  const isDesktopWidth = ref(window.innerWidth >= 1024)

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const touchQuery = window.matchMedia('(pointer: coarse)')

  const updateReducedMotion = (event) => {
    prefersReducedMotion.value = event.matches
  }
  const updateTouch = (event) => {
    isTouchDevice.value = event.matches
  }
  const updateWidth = () => {
    isDesktopWidth.value = window.innerWidth >= 1024
  }

  onMounted(() => {
    prefersReducedMotion.value = reducedMotionQuery.matches
    isTouchDevice.value = touchQuery.matches
    reducedMotionQuery.addEventListener('change', updateReducedMotion)
    touchQuery.addEventListener('change', updateTouch)
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    reducedMotionQuery.removeEventListener('change', updateReducedMotion)
    touchQuery.removeEventListener('change', updateTouch)
    window.removeEventListener('resize', updateWidth)
  })

  const shouldReduceEffects = computed(
    () => prefersReducedMotion.value || isTouchDevice.value || !isDesktopWidth.value,
  )

  return {
    prefersReducedMotion,
    isTouchDevice,
    isDesktopWidth,
    shouldReduceEffects,
  }
}
