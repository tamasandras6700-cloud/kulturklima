import { useMemo, useState } from 'react'
import {
  buildMunicipalityStats,
  buildNationalSummary,
  getAvailableYears,
  getTopMunicipalities,
  tables,
} from '../data'
import type { MunicipalityStats } from '../data/types'

export function useCulturalData() {
  const years = useMemo(() => getAvailableYears(), [])
  const [selectedYear, setSelectedYear] = useState(years[0] ?? '2023')
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(
    null,
  )

  const municipalities = useMemo(
    () => buildMunicipalityStats(selectedYear),
    [selectedYear],
  )

  const summary = useMemo(
    () => buildNationalSummary(selectedYear),
    [selectedYear],
  )

  const topLoans = useMemo(
    () => getTopMunicipalities(selectedYear, 'loansPerCapita'),
    [selectedYear],
  )

  const topVisits = useMemo(
    () => getTopMunicipalities(selectedYear, 'visitsPerCapita'),
    [selectedYear],
  )

  const activeMunicipality: MunicipalityStats | null = useMemo(() => {
    if (selectedMunicipality) {
      return municipalities.find((m) => m.code === selectedMunicipality) ?? null
    }
    return municipalities[0] ?? null
  }, [municipalities, selectedMunicipality])

  return {
    years,
    selectedYear,
    setSelectedYear,
    municipalities,
    summary,
    topLoans,
    topVisits,
    activeMunicipality,
    setSelectedMunicipality,
    tables,
  }
}
