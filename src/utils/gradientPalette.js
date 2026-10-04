// Single source of truth for the four premium placeholder gradients and
// their matching accent colors, so a card's badge/glow always agrees with
// its portrait gradient instead of being picked independently.
export const gradientPalette = [
  'linear-gradient(135deg, #1a1a1f 0%, #4b2596 100%)',
  'linear-gradient(135deg, #26262c 0%, #d4a24c 100%)',
  'linear-gradient(135deg, #0a0a0c 0%, #1f8a73 100%)',
  'linear-gradient(135deg, #2c1654 0%, #e8c179 100%)',
]

export const accentPalette = [
  { border: 'border-violet-400/40', text: 'text-violet-300', glow: 'rgba(124, 58, 237, 0.35)' },
  { border: 'border-amber-400/40', text: 'text-amber-300', glow: 'rgba(212, 162, 76, 0.35)' },
  { border: 'border-emerald-400/40', text: 'text-emerald-300', glow: 'rgba(31, 138, 115, 0.35)' },
  { border: 'border-white/30', text: 'text-white/80', glow: 'rgba(255, 255, 255, 0.18)' },
]

const hashStringToNumber = (value) => {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 100000
  }
  return hash
}

export const getPaletteIndex = (seed) => {
  const numericSeed = typeof seed === 'number' ? seed : hashStringToNumber(String(seed))
  return Math.abs(numericSeed) % gradientPalette.length
}
