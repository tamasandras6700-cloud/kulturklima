import bib1 from './mock/bib1.json'
import mus01 from './mock/mus01.json'
import folk1a from './mock/folk1a.json'
import type {
  MunicipalityStats,
  NationalSummary,
  StatbankTable,
} from './types'

export const tables = {
  bib1: bib1 as StatbankTable,
  mus01: mus01 as StatbankTable,
  folk1a: folk1a as StatbankTable,
}

export function perCapita(total: number, population: number): number {
  if (population <= 0) return 0
  return Math.round((total / population) * 10) / 10
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('da-DK').format(value)
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('da-DK', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function getAvailableYears(): string[] {
  const years = new Set(tables.folk1a.rows.map((r) => r.Tid))
  return [...years].sort((a, b) => Number(b) - Number(a))
}

export function buildMunicipalityStats(year: string): MunicipalityStats[] {
  const populationByKom = new Map(
    tables.folk1a.rows.filter((r) => r.Tid === year).map((r) => [r.KOM, r]),
  )
  const loansByKom = new Map(
    tables.bib1.rows.filter((r) => r.Tid === year).map((r) => [r.KOM, r]),
  )
  const visitsByKom = new Map(
    tables.mus01.rows.filter((r) => r.Tid === year).map((r) => [r.KOM, r]),
  )

  const codes = [...populationByKom.keys()].filter(
    (code) => loansByKom.has(code) && visitsByKom.has(code),
  )

  return codes
    .map((code) => {
      const pop = populationByKom.get(code)!
      const loans = loansByKom.get(code)!
      const visits = visitsByKom.get(code)!

      return {
        code,
        name: pop.KOMTitel,
        year,
        population: pop.value,
        libraryLoans: loans.value,
        museumVisits: visits.value,
        loansPerCapita: perCapita(loans.value, pop.value),
        visitsPerCapita: perCapita(visits.value, pop.value),
      }
    })
    .sort((a, b) => b.loansPerCapita - a.loansPerCapita)
}

export function buildNationalSummary(year: string): NationalSummary {
  const stats = buildMunicipalityStats(year)
  const totalPopulation = stats.reduce((s, m) => s + m.population, 0)
  const totalLibraryLoans = stats.reduce((s, m) => s + m.libraryLoans, 0)
  const totalMuseumVisits = stats.reduce((s, m) => s + m.museumVisits, 0)

  return {
    year,
    totalPopulation,
    totalLibraryLoans,
    totalMuseumVisits,
    avgLoansPerCapita: perCapita(totalLibraryLoans, totalPopulation),
    avgVisitsPerCapita: perCapita(totalMuseumVisits, totalPopulation),
    municipalityCount: stats.length,
  }
}

export function getTopMunicipalities(
  year: string,
  metric: 'loansPerCapita' | 'visitsPerCapita',
  limit = 8,
): MunicipalityStats[] {
  return [...buildMunicipalityStats(year)]
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, limit)
}

export function getYearOverYearChange(
  code: string,
  metric: 'libraryLoans' | 'museumVisits',
): number | null {
  const years = getAvailableYears()
  if (years.length < 2) return null

  const [currentYear, previousYear] = years
  const table = metric === 'libraryLoans' ? tables.bib1 : tables.mus01

  const current = table.rows.find((r) => r.KOM === code && r.Tid === currentYear)
  const previous = table.rows.find(
    (r) => r.KOM === code && r.Tid === previousYear,
  )

  if (!current || !previous || previous.value === 0) return null
  return Math.round(((current.value - previous.value) / previous.value) * 1000) / 10
}
