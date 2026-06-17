import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useMunicipality } from './MunicipalityContext'
import { useLanguage } from '../i18n/LanguageContext'
import type {
  BookwormTrend,
  MuseumProfile,
  MunicipalityMetrics,
  SeasonalPulse,
} from '../data/culturalMetrics'
import {
  fetchCulturalIndexMap,
  fetchMunicipalityBundle,
  getCulturalIndexFromMap,
  resolveMunicipality,
} from '../data/culturalDataService.js'

interface CulturalDataContextValue {
  loading: boolean
  indexLoading: boolean
  error: string | null
  retry: () => void
  metrics: MunicipalityMetrics | null
  bookwormTrend: BookwormTrend | null
  museumProfile: MuseumProfile | null
  seasonalPulse: SeasonalPulse | null
  getCulturalIndex: (name: string) => number
}

const CulturalDataContext = createContext<CulturalDataContextValue | null>(null)

export function CulturalDataProvider({ children }: { children: ReactNode }) {
  const { selectedMunicipality } = useMunicipality()
  const { locale, t } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [indexLoading, setIndexLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<MunicipalityMetrics | null>(null)
  const [bookwormTrend, setBookwormTrend] = useState<BookwormTrend | null>(null)
  const [museumProfile, setMuseumProfile] = useState<MuseumProfile | null>(null)
  const [seasonalPulse, setSeasonalPulse] = useState<SeasonalPulse | null>(null)
  const [indexMap, setIndexMap] = useState<Record<string, number>>({})

  const fetchVersion = useRef(0)

  const loadMunicipality = useCallback(async (bypassCache = false) => {
    const municipality = resolveMunicipality(selectedMunicipality)
    if (!municipality) {
      setMetrics(null)
      setBookwormTrend(null)
      setMuseumProfile(null)
      setSeasonalPulse(null)
      setError(null)
      setLoading(false)
      return
    }

    const version = ++fetchVersion.current
    setLoading(true)
    setError(null)

    try {
      const bundle = await fetchMunicipalityBundle(
        {
          name: municipality.name,
          code: municipality.code,
          region: municipality.region,
          lang: locale,
        },
        { bypassCache },
      )

      if (version !== fetchVersion.current) return

      setMetrics(bundle.metrics as MunicipalityMetrics)
      setBookwormTrend(bundle.bookwormTrend as BookwormTrend)
      setMuseumProfile(bundle.museumProfile as MuseumProfile)
      setSeasonalPulse(bundle.seasonalPulse as SeasonalPulse)
    } catch {
      if (version !== fetchVersion.current) return
      setMetrics(null)
      setBookwormTrend(null)
      setMuseumProfile(null)
      setSeasonalPulse(null)
      setError(t('data.fetchError'))
    } finally {
      if (version === fetchVersion.current) {
        setLoading(false)
      }
    }
  }, [selectedMunicipality, locale, t])

  const loadIndexMap = useCallback(async () => {
    setIndexLoading(true)
    try {
      const map = await fetchCulturalIndexMap(locale)
      setIndexMap(map)
    } catch {
      setIndexMap({})
    } finally {
      setIndexLoading(false)
    }
  }, [locale])

  useEffect(() => {
    loadMunicipality()
  }, [loadMunicipality])

  useEffect(() => {
    loadIndexMap()
  }, [loadIndexMap])

  const retry = useCallback(() => {
    loadMunicipality(true)
    loadIndexMap()
  }, [loadMunicipality, loadIndexMap])

  const getCulturalIndex = useCallback(
    (name: string) => getCulturalIndexFromMap(name, indexMap),
    [indexMap],
  )

  const value = useMemo(
    () => ({
      loading,
      indexLoading,
      error,
      retry,
      metrics,
      bookwormTrend,
      museumProfile,
      seasonalPulse,
      getCulturalIndex,
    }),
    [
      loading,
      indexLoading,
      error,
      retry,
      metrics,
      bookwormTrend,
      museumProfile,
      seasonalPulse,
      getCulturalIndex,
    ],
  )

  return (
    <CulturalDataContext.Provider value={value}>
      {children}
    </CulturalDataContext.Provider>
  )
}

export function useCulturalData() {
  const context = useContext(CulturalDataContext)
  if (!context) {
    throw new Error('useCulturalData must be used within CulturalDataProvider')
  }
  return context
}
