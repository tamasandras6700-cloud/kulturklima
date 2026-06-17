/** Shared Recharts animation settings for annual ↔ seasonal transitions. */
export const CHART_ANIMATION = {
  isAnimationActive: true,
  animationBegin: 0,
  animationDuration: 550,
  animationEasing: 'ease-out' as const,
}

export const BAR_CHART_LAYOUT_ANIMATION = {
  ...CHART_ANIMATION,
  animationDuration: 600,
}
