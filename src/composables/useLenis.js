import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref, watch } from 'vue'

gsap.registerPlugin(ScrollTrigger)

/**
 * Drives Lenis smooth scrolling in lockstep with GSAP's ticker/ScrollTrigger.
 * Pass a reactive `shouldDisable` (e.g. prefersReducedMotion || isTouchDevice)
 * to fall back to native scrolling where smoothing would hurt more than help.
 * Returns a ref to the live instance (or null) so callers can trigger
 * `lenisInstance.value.scrollTo(target)` for in-page anchor links.
 */
export function useLenis(shouldDisable) {
  const lenisInstance = ref(null)
  let tickerCallback = null

  const createLenisInstance = () => {
    lenisInstance.value = new Lenis({
      duration: 1.1,
      easing: (time) => Math.min(1, 1 - Math.pow(2, -10 * time)),
      smoothWheel: true,
    })
    lenisInstance.value.on('scroll', ScrollTrigger.update)
    tickerCallback = (time) => {
      lenisInstance.value.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)
  }

  const destroyLenisInstance = () => {
    if (!lenisInstance.value) return
    gsap.ticker.remove(tickerCallback)
    lenisInstance.value.destroy()
    lenisInstance.value = null
    tickerCallback = null
  }

  onMounted(() => {
    if (!shouldDisable?.value) {
      createLenisInstance()
    }
  })

  if (shouldDisable) {
    watch(shouldDisable, (isDisabled) => {
      if (isDisabled) {
        destroyLenisInstance()
      } else {
        createLenisInstance()
      }
    })
  }

  onUnmounted(destroyLenisInstance)

  return { lenisInstance }
}
