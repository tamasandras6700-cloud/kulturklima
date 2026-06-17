export interface MunicipalityMetrics {
  municipality: string
  code: string
  region: string
  year: string
  population: number
  dataSource: 'statbank'
  bib1: {
    physicalBooks: number
    ebooks: number
    totalLoans: number
    perCapita: {
      physicalBooks: number
      ebooks: number
      total: number
    }
  }
  mus01: {
    artMuseums: number
    culturalHistory: number
    naturalHistory: number
    totalVisits: number
    perCapita: {
      artMuseums: number
      culturalHistory: number
      naturalHistory: number
      total: number
    }
  }
  museumContext: MuseumMetricContext
  cultureIndex: CultureIndexMetrics
  statbank: {
    BIB1: Record<string, string | number>[]
    MUS01: Record<string, string | number>[]
    FOLK1A: Record<string, string | number>[]
  }
  museumNote?: 'regional-scaled'
}

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

export interface BookwormTrendPoint {
  year: string
  physical: number
  digital: number
  physicalTotal: number
  digitalTotal: number
  totalPerCapita: number
  totalLoans: number
}

export interface BookwormTrend {
  municipality: string
  code: string
  population: number
  currentYear: string
  timeline: BookwormTrendPoint[]
  kpi: {
    totalLoans: number
    population: number
    booksPerCitizen: number
    physicalPerCitizen: number
    digitalPerCitizen: number
  }
}

export interface MuseumCategorySlice {
  id: string
  label: string
  color: string
  value: number | null
  hasData: boolean
  percentage?: number
}

export interface MuseumProfile {
  municipality: string
  code: string
  year: string
  population: number
  dataSource: 'statbank'
  categories: MuseumCategorySlice[]
  chartSlices: (MuseumCategorySlice & { value: number; percentage: number })[]
  totalVisits: number
  hasScienceData: boolean
  missingScience: boolean
  scienceFallbackMessage: string
  dominantCategory: (MuseumCategorySlice & { value: number; percentage: number }) | null
  statbankRows: Record<string, string | number>[]
  museumNote?: 'regional-scaled'
}

export interface SeasonalQuarter {
  id: string
  label: string
  shortLabel: string
  season: string
  digital: number
  physical: number
  digitalPerCapita: number
  physicalPerCapita: number
  totalLoansPerCapita: number
  museumVisits: number
  museumPerCapita: number
  artMuseums: number
  culturalHistory: number
  naturalHistory: number
  isColdQuarter: boolean
}

export interface SeasonalPulse {
  municipality: string
  year: string
  population: number
  quarters: SeasonalQuarter[]
  insight: {
    digitalSpikeQ4vsQ2: number
    coldVsWarmCulture: number
    museumSpikeQ1vsQ3: number
    highlightQuarter: SeasonalQuarter
    baselineQuarter: SeasonalQuarter
  }
}

export {
  BOOKWORM_YEARS,
  MUSEUM_CATEGORIES,
  NO_SCIENCE_MUSEUM_KOMMUNER,
  SCIENCE_FALLBACK_MESSAGE,
  SEASONAL_QUARTERS,
} from './culturalConstants.js'
