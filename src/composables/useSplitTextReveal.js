import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

/**
 * Splits text into words (masked for a clean upward reveal) and animates
 * them in. Returns the SplitText instance so callers can `.revert()` it
 * on unmount, restoring the original unsplit markup.
 */
export function splitTextReveal(element, options = {}) {
  const {
    stagger = 0.045,
    delay = 0,
    duration = 0.9,
    ease = 'power3.out',
    skipAnimation = false,
    scrollTrigger,
    onComplete,
  } = options

  if (!element) return null

  const split = SplitText.create(element, {
    type: 'words, lines',
    mask: 'words',
  })

  if (skipAnimation) {
    gsap.set(split.words, { yPercent: 0, opacity: 1 })
    onComplete?.()
    return split
  }

  gsap.from(split.words, {
    yPercent: 110,
    opacity: 0,
    duration,
    ease,
    stagger,
    delay,
    scrollTrigger,
    onComplete,
  })

  return split
}
