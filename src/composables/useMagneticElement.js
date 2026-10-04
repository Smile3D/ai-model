import gsap from 'gsap'
import { onMounted, onUnmounted, watch } from 'vue'

/**
 * Makes an element gently "stick" to the cursor while hovered — used on
 * primary CTA buttons. Skipped entirely when `disabled` is true (touch
 * devices, reduced motion).
 */
export function useMagneticElement(elementRef, options = {}) {
  const { strength = 0.35, disabled } = options

  let quickSetX = null
  let quickSetY = null
  let handleMouseMove = null
  let handleMouseLeave = null

  const bind = () => {
    const element = elementRef.value
    if (!element) return

    quickSetX = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' })
    quickSetY = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' })

    handleMouseMove = (event) => {
      const bounds = element.getBoundingClientRect()
      const offsetX = event.clientX - (bounds.left + bounds.width / 2)
      const offsetY = event.clientY - (bounds.top + bounds.height / 2)
      quickSetX(offsetX * strength)
      quickSetY(offsetY * strength)
    }

    handleMouseLeave = () => {
      quickSetX(0)
      quickSetY(0)
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)
  }

  const unbind = () => {
    const element = elementRef.value
    if (element && handleMouseMove) {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
    gsap.set(element, { x: 0, y: 0 })
  }

  onMounted(() => {
    if (!disabled?.value) bind()
  })

  if (disabled) {
    watch(disabled, (isDisabled) => {
      if (isDisabled) unbind()
      else bind()
    })
  }

  onUnmounted(unbind)
}
