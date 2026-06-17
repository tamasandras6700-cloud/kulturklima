import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_LOCALE,
  translations,
  type Locale,
} from './translations'
import { createNumberFormatters, getNumberLocale } from './numberFormat'
import {
  computePeakQuarter,
  formatQuarterLabel,
  formatSeasonName,
} from '../utils/seasonalInsights'

export { getNumberLocale, createNumberFormatters } from './numberFormat'

type Params = Record<string, string | number>

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Params) => string
  numberLocale: string
}

const STORAGE_KEY = 'kulturklima-locale'

const LanguageContext = createContext<LanguageContextValue | null>(null)

function resolve(obj: Record<string, unknown>, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)

  return typeof value === 'string' ? value : path
}

function interpolate(template: string, params?: Params): string {
  if (!params) return template
  return Object.entries(params).reduce(
    (str, [key, value]) => str.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'da' || stored === 'en') return stored
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const t = useCallback(
    (key: string, params?: Params) => {
      const template = resolve(
        translations[locale] as unknown as Record<string, unknown>,
        key,
      )
      return interpolate(template, params)
    },
    [locale],
  )

  const numberLocale = getNumberLocale(locale)

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = t('meta.title')
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', t('meta.description'))
  }, [locale, t])

  const value = useMemo(
    () => ({ locale, setLocale, t, numberLocale }),
    [locale, setLocale, t, numberLocale],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export function useFormattedNumbers() {
  const { numberLocale } = useLanguage()

  return useMemo(
    () => createNumberFormatters(numberLocale),
    [numberLocale],
  )
}

export function formatSeasonalInsights(
  t: LanguageContextValue['t'],
  municipality: string,
  quarters: import('../data/culturalMetrics').SeasonalQuarter[],
  insight: {
    digitalSpikeQ4vsQ2: number
    coldVsWarmCulture: number
    museumSpikeQ1vsQ3: number
    highlightQuarter: { physicalPerCapita: number }
    baselineQuarter: { physicalPerCapita: number }
  },
  formatNumber: (value: number) => string,
) {
  const pct = (n: number) => `${Math.abs(Math.round(n))}%`

  const peakResult = computePeakQuarter(quarters)

  const primary = peakResult
    ? t('seasonal.insightPeak', {
        municipality,
        quarter: formatQuarterLabel(t, peakResult.peak),
        season: formatSeasonName(t, peakResult.peak),
        pct: pct(peakResult.peakVsLowestPct),
        lowQuarter: formatQuarterLabel(t, peakResult.lowest),
      })
    : insight.digitalSpikeQ4vsQ2 >= 10
      ? t('seasonal.insightDigital', {
          municipality,
          pct: pct(insight.digitalSpikeQ4vsQ2),
        })
      : t('seasonal.insightCold', {
          municipality,
          pct: pct(insight.coldVsWarmCulture),
        })

  const secondary =
    insight.museumSpikeQ1vsQ3 > 0
      ? t('seasonal.insightMuseum', {
          pct: pct(insight.museumSpikeQ1vsQ3),
        })
      : t('seasonal.insightPhysical', {
          q4: formatNumber(insight.highlightQuarter.physicalPerCapita),
          q2: formatNumber(insight.baselineQuarter.physicalPerCapita),
        })

  return { primary, secondary, peakResult }
}
