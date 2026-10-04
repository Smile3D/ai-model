import gsap from 'gsap'
import { onMounted, onUnmounted, watch } from 'vue'

/**
 * Applies a cursor-driven 3D tilt + lift to a card element. Skipped on
 * touch devices / reduced motion via the `disabled` ref.
 */
export function useTiltCard(elementRef, options = {}) {
  const { maxTiltDegrees = 10, perspective = 800, disabled } = options

  let quickSetRotationX = null
  let quickSetRotationY = null
  let quickSetScaleX = null
  let quickSetScaleY = null
  let handleMouseMove = null
  let handleMouseLeave = null

  const bind = () => {
    const element = elementRef.value
    if (!element) return

    gsap.set(element, { transformPerspective: perspective, transformStyle: 'preserve-3d' })
    quickSetRotationX = gsap.quickTo(element, 'rotationX', { duration: 0.4, ease: 'power3.out' })
    quickSetRotationY = gsap.quickTo(element, 'rotationY', { duration: 0.4, ease: 'power3.out' })
    quickSetScaleX = gsap.quickTo(element, 'scaleX', { duration: 0.4, ease: 'power3.out' })
    quickSetScaleY = gsap.quickTo(element, 'scaleY', { duration: 0.4, ease: 'power3.out' })

    handleMouseMove = (event) => {
      const bounds = element.getBoundingClientRect()
      const percentX = (event.clientX - bounds.left) / bounds.width - 0.5
      const percentY = (event.clientY - bounds.top) / bounds.height - 0.5
      quickSetRotationY(percentX * maxTiltDegrees * 2)
      quickSetRotationX(percentY * -maxTiltDegrees * 2)
      quickSetScaleX(1.03)
      quickSetScaleY(1.03)
    }

    handleMouseLeave = () => {
      quickSetRotationX(0)
      quickSetRotationY(0)
      quickSetScaleX(1)
      quickSetScaleY(1)
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
    if (element) gsap.set(element, { rotationX: 0, rotationY: 0, scaleX: 1, scaleY: 1 })
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
