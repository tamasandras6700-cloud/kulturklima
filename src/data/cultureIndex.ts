import { PINNED_MUNICIPALITIES } from './municipalities'

/** Museum visits per resident above this are treated as tourism-skewed outliers. */
export const MUSEUM_OUTLIER_THRESHOLD = 3

/** Below this per-capita museum level, treat as a commuter / low-registry municipality. */
export const COMMUTER_MUSEUM_PER_CAPITA_MAX = 0.5

/** Cap applied to the museum component when calculating the weighted culture index. */
export const MUSEUM_INDEX_CAP = 3

const HUB_MUNICIPALITY_NAMES = new Set<string>([
  ...PINNED_MUNICIPALITIES,
  'Frederiksberg',
  'Esbjerg',
])

export type MetricDisclaimerType = 'hub' | 'commuter' | 'none'

export interface CultureIndexMetrics {
  value: number
  raw: number
  libraryComponent: number
  museumComponent: number
  museumComponentRaw: number
  isMuseumOutlier: boolean
  disclaimerType: MetricDisclaimerType
}

export interface MuseumMetricContext {
  dataAvailable: boolean
  totalVisits: number
  perCapita: number | null
  disclaimerType: MetricDisclaimerType
}

export function isHubMunicipality(
  name: string,
  museumPerCapita: number,
): boolean {
  return (
    HUB_MUNICIPALITY_NAMES.has(name) ||
    museumPerCapita > MUSEUM_OUTLIER_THRESHOLD
  )
}

export function isCommuterMunicipality(
  totalVisits: number,
  museumPerCapita: number,
): boolean {
  if (totalVisits === 0) return true
  return museumPerCapita < COMMUTER_MUSEUM_PER_CAPITA_MAX
}

export function resolveMetricDisclaimerType(
  name: string,
  totalVisits: number,
  museumPerCapita: number,
): MetricDisclaimerType {
  if (isHubMunicipality(name, museumPerCapita)) return 'hub'
  if (isCommuterMunicipality(totalVisits, museumPerCapita)) return 'commuter'
  return 'none'
}

/**
 * Weighted culture index: full library weight + museum capped at 3 when tourism-skewed.
 */
export function computeCultureIndex(
  libraryPerCapita: number,
  museumPerCapita: number,
  municipalityName: string,
  totalVisits: number,
): CultureIndexMetrics {
  const isMuseumOutlier = museumPerCapita > MUSEUM_OUTLIER_THRESHOLD
  const museumComponent = isMuseumOutlier
    ? MUSEUM_INDEX_CAP
    : museumPerCapita

  const disclaimerType = resolveMetricDisclaimerType(
    municipalityName,
    totalVisits,
    museumPerCapita,
  )

  return {
    value: libraryPerCapita + museumComponent,
    raw: libraryPerCapita + museumPerCapita,
    libraryComponent: libraryPerCapita,
    museumComponent,
    museumComponentRaw: museumPerCapita,
    isMuseumOutlier,
    disclaimerType,
  }
}

export function computeMuseumMetricContext(
  municipalityName: string,
  totalVisits: number,
  museumPerCapita: number,
  museumDataAvailable: boolean,
): MuseumMetricContext {
  const disclaimerType = museumDataAvailable
    ? resolveMetricDisclaimerType(
        municipalityName,
        totalVisits,
        museumPerCapita,
      )
    : 'none'

  return {
    dataAvailable: museumDataAvailable,
    totalVisits,
    perCapita: museumDataAvailable ? museumPerCapita : null,
    disclaimerType,
  }
}

export function isMuseumDataAvailable(
  musRecords: unknown,
  regionPopulation: number | null | undefined,
): boolean {
  return (
    Array.isArray(musRecords) &&
    musRecords.length > 0 &&
    typeof regionPopulation === 'number' &&
    regionPopulation > 0
  )
}
