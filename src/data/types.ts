/** Shapes mirroring Danmarks Statistik Statbank table responses */

export interface StatbankTableMeta {
  table: string
  title: string
  unit: string
  source: string
  updated: string
}

export interface StatbankRow {
  KOM: string
  KOMTitel: string
  Tid: string
  value: number
}

export interface StatbankTable {
  meta: StatbankTableMeta
  rows: StatbankRow[]
}

export interface MunicipalityStats {
  code: string
  name: string
  year: string
  population: number
  libraryLoans: number
  museumVisits: number
  loansPerCapita: number
  visitsPerCapita: number
}

export interface NationalSummary {
  year: string
  totalPopulation: number
  totalLibraryLoans: number
  totalMuseumVisits: number
  avgLoansPerCapita: number
  avgVisitsPerCapita: number
  municipalityCount: number
}
