import gsap from 'gsap'
import { onMounted, onUnmounted } from 'vue'

/**
 * Drives a custom cursor ring that follows the pointer and scales up over
 * interactive elements. Only bound on desktop (caller decides via
 * `disabled`); the real system cursor stays hidden via the
 * `has-custom-cursor` body class while this is active.
 */
export function useCustomCursor(cursorRef, options = {}) {
  const { disabled, hoverSelector = 'a, button, [data-cursor-hover]' } = options

  let quickSetX = null
  let quickSetY = null
  let handleMouseMove = null
  let handleMouseOver = null
  let handleMouseOut = null

  const bind = () => {
    const cursor = cursorRef.value
    if (!cursor) return

    gsap.set(cursor, { opacity: 0 })
    quickSetX = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power3.out' })
    quickSetY = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power3.out' })

    let hasReceivedFirstMove = false

    handleMouseMove = (event) => {
      quickSetX(event.clientX)
      quickSetY(event.clientY)
      if (!hasReceivedFirstMove) {
        hasReceivedFirstMove = true
        gsap.set(cursor, { x: event.clientX, y: event.clientY })
        gsap.to(cursor, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      }
    }

    handleMouseOver = (event) => {
      if (event.target.closest(hoverSelector)) {
        gsap.to(cursor, { scale: 2.4, duration: 0.3, ease: 'power3.out' })
      }
    }

    handleMouseOut = (event) => {
      if (event.target.closest(hoverSelector)) {
        gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power3.out' })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.body.classList.add('has-custom-cursor')
  }

  onMounted(() => {
    if (!disabled?.value) bind()
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseover', handleMouseOver)
    document.removeEventListener('mouseout', handleMouseOut)
    document.body.classList.remove('has-custom-cursor')
  })
}
