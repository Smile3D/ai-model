import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'

gsap.registerPlugin(ScrollTrigger)

/**
 * Pins an element for the duration of the scroll range and reports scroll
 * progress (0–1) through `onProgress`, so the caller can drive its own
 * timeline/animation off real scroll position instead of a fixed duration.
 */
export function usePinnedProgress(elementRef, onProgress, options = {}) {
  const { start = 'top top', end = '+=100%', scrub = true, disabled } = options

  let scrollTriggerInstance = null
  let resizeTimeoutId = null

  const handleResize = () => {
    clearTimeout(resizeTimeoutId)
    // Re-run on top of GSAP's own built-in resize refresh: cheap insurance
    // against the pin staying stuck at a stale fixed left/width while the
    // viewport is actively being resized (e.g. dragging DevTools' device
    // toolbar), which otherwise leaves the pinned content off-center.
    resizeTimeoutId = setTimeout(() => ScrollTrigger.refresh(), 150)
  }

  onMounted(() => {
    const element = elementRef.value
    if (!element || disabled?.value) return

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: element,
      start,
      end,
      pin: true,
      pinType: 'transform',
      invalidateOnRefresh: true,
      scrub,
      onUpdate: (self) => onProgress?.(self.progress),
    })

    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    clearTimeout(resizeTimeoutId)
    scrollTriggerInstance?.kill()
    scrollTriggerInstance = null
  })
}
