import { useMemo } from 'react'
import { CloudRain } from 'lucide-react'
import { useCulturalData } from '../../context/CulturalDataContext'
import { useViewMode } from '../../context/ViewModeContext'
import {
  formatSeasonalInsights,
  useFormattedNumbers,
  useLanguage,
} from '../../i18n/LanguageContext'

export function SeasonalInsight() {
  const { isSeasonalPulse } = useViewMode()
  const { t } = useLanguage()
  const { formatNumber } = useFormattedNumbers()
  const { seasonalPulse, loading } = useCulturalData()

  const insights = useMemo(() => {
    if (!seasonalPulse || !isSeasonalPulse) return null
    return formatSeasonalInsights(
      t,
      seasonalPulse.municipality,
      seasonalPulse.quarters,
      seasonalPulse.insight,
      formatNumber,
    )
  }, [seasonalPulse, isSeasonalPulse, t, formatNumber])

  if (loading || !isSeasonalPulse || !seasonalPulse || !insights) return null

  return (
    <div className="animate-seasonal-insight mt-4 rounded-xl border border-kultur-plum/25 bg-kultur-plum/5 px-4 py-4 sm:px-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-kultur-plum/30 bg-kultur-plum/10">
          <CloudRain className="h-4 w-4 text-kultur-plum" aria-hidden />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-kultur-plum/90">
            {t('seasonal.cardTitle')} · {t('seasonal.analysisTitle', { year: seasonalPulse.year })}
          </p>
          <p className="text-sm leading-relaxed text-kultur-text">
            {insights.primary}
          </p>
          <p className="text-sm leading-relaxed text-kultur-muted">
            {insights.secondary}
          </p>
        </div>
      </div>
    </div>
  )
}
