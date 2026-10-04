import gsap from 'gsap'
import { onMounted, onUnmounted, watch } from 'vue'

/**
 * Moves elements marked with `data-parallax-speed="0.03"` inside a
 * container at different speeds as the cursor moves across it, via
 * gsap.quickTo. Disabled on touch devices / reduced motion.
 */
export function useParallaxLayers(containerRef, options = {}) {
  const { layerSelector = '[data-parallax-speed]', disabled } = options

  let quickSetters = []
  let handleMouseMove = null

  const bind = () => {
    const container = containerRef.value
    if (!container) return

    const layers = Array.from(container.querySelectorAll(layerSelector))
    quickSetters = layers.map((layer) => ({
      setX: gsap.quickTo(layer, 'x', { duration: 0.8, ease: 'power3.out' }),
      setY: gsap.quickTo(layer, 'y', { duration: 0.8, ease: 'power3.out' }),
      speed: parseFloat(layer.dataset.parallaxSpeed || '0.05'),
    }))

    handleMouseMove = (event) => {
      const bounds = container.getBoundingClientRect()
      const offsetX = event.clientX - (bounds.left + bounds.width / 2)
      const offsetY = event.clientY - (bounds.top + bounds.height / 2)
      quickSetters.forEach(({ setX, setY, speed }) => {
        setX(offsetX * speed)
        setY(offsetY * speed)
      })
    }

    container.addEventListener('mousemove', handleMouseMove)
  }

  const unbind = () => {
    const container = containerRef.value
    if (container && handleMouseMove) {
      container.removeEventListener('mousemove', handleMouseMove)
    }
    quickSetters = []
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
