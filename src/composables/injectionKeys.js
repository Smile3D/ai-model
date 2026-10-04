// Combined gate for cursor-dependent / perf-sensitive effects: parallax,
// magnetic elements, 3D tilt, custom cursor, pinned scroll, smooth scroll.
// True on touch devices, narrow viewports, or when reduced motion is set.
export const shouldReduceEffectsKey = Symbol('shouldReduceEffects')

// OS-level accessibility preference alone — gates simple entrance/reveal
// animations (split-text, fades, clip-path stagger), which otherwise run
// everywhere, including mobile.
export const prefersReducedMotionKey = Symbol('prefersReducedMotion')

export const lenisInstanceKey = Symbol('lenisInstance')

// Flips true once the intro curtain has started lifting — gates the Hero's
// entrance timeline so split-text reveal is timed to the curtain, not to
// whenever Hero happens to mount.
export const introCompleteKey = Symbol('introComplete')
