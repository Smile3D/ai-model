import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Reveals a group of elements with a clip-path wipe + scale-up + upward
 * offset, staggered across the group — used for card grids instead of a
 * plain fade-in.
 */
export function scrollRevealGroup(container, targets, options = {}) {
  const {
    stagger = 0.12,
    duration = 1,
    ease = 'power3.out',
    start = 'top 82%',
    skipAnimation = false,
  } = options

  if (!targets || targets.length === 0) return null

  if (skipAnimation) {
    gsap.set(targets, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, scale: 1 })
    return null
  }

  gsap.set(targets, { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 48, scale: 0.94 })

  return gsap.to(targets, {
    clipPath: 'inset(0% 0% 0% 0%)',
    opacity: 1,
    y: 0,
    scale: 1,
    duration,
    ease,
    stagger,
    scrollTrigger: {
      trigger: container,
      start,
    },
  })
}
