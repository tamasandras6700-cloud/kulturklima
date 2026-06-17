import type { SeasonalQuarter } from '../data/culturalMetrics'

/** Combined library + museum per-capita consumption for a quarter. */
export function quarterCulturePerCapita(q: SeasonalQuarter): number {
  return q.totalLoansPerCapita + q.museumPerCapita
}

export interface PeakQuarterResult {
  peak: SeasonalQuarter
  lowest: SeasonalQuarter
  peakValue: number
  lowestValue: number
  /** How much higher the peak quarter is vs the lowest quarter (%). */
  peakVsLowestPct: number
  /** How much higher the peak quarter is vs the average of the other three (%). */
  peakVsAveragePct: number
}

export function computePeakQuarter(
  quarters: SeasonalQuarter[],
): PeakQuarterResult | null {
  if (!quarters?.length) return null

  let peak = quarters[0]
  let lowest = quarters[0]
  let peakValue = quarterCulturePerCapita(peak)
  let lowestValue = peakValue

  for (const q of quarters) {
    const value = quarterCulturePerCapita(q)
    if (value > peakValue) {
      peak = q
      peakValue = value
    }
    if (value < lowestValue) {
      lowest = q
      lowestValue = value
    }
  }

  const peakVsLowestPct =
    lowestValue > 0
      ? Math.round(((peakValue - lowestValue) / lowestValue) * 100)
      : 0

  const others = quarters.filter((q) => q.id !== peak.id)
  const avgOthers =
    others.reduce((sum, q) => sum + quarterCulturePerCapita(q), 0) /
    others.length

  const peakVsAveragePct =
    avgOthers > 0 ? Math.round(((peakValue - avgOthers) / avgOthers) * 100) : 0

  return {
    peak,
    lowest,
    peakValue,
    lowestValue,
    peakVsLowestPct,
    peakVsAveragePct,
  }
}

export function formatQuarterLabel(
  t: (key: string) => string,
  quarter: SeasonalQuarter,
): string {
  return t(`quarters.${quarter.id}.short`)
}

export function formatSeasonName(
  t: (key: string) => string,
  quarter: SeasonalQuarter,
): string {
  return t(`seasons.${quarter.season}`)
}
