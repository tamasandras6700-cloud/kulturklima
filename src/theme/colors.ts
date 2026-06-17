/** Single source of truth — keep in sync with src/index.css @theme tokens. */
export const themeColors = {
  canvas: '#0f0e11',
  surface: '#1a181f',
  raised: '#242128',
  border: '#3a3540',
  muted: '#9a939e',
  subtle: '#b8b0bb',
  text: '#f4efe8',
  clay: '#c4785a',
  sage: '#6fa393',
  gold: '#c9a55c',
  ink: '#7a9bb8',
  plum: '#9b7aab',
} as const

/** MUS01 museum category mix — uses core palette only (no one-off hues). */
export const museumCategoryColors = {
  KUNST: themeColors.clay,
  KULTUR: themeColors.gold,
  NATUR: themeColors.sage,
} as const
