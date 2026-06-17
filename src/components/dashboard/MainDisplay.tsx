import { type ReactNode } from 'react'
import {
  BookMarked,
  BookOpen,
  Landmark,
  Smartphone,
  Users,
} from 'lucide-react'
import { useMunicipality } from '../../context/MunicipalityContext'
import { useCulturalData } from '../../context/CulturalDataContext'
import { useViewMode } from '../../context/ViewModeContext'
import { useFormattedNumbers, useLanguage } from '../../i18n/LanguageContext'
import { SectionCard } from '../ui/SectionCard'
import { StatCard } from '../ui/StatCard'
import { SeasonalViewToggle } from '../ui/SeasonalViewToggle'
import { DataLoadingSkeleton } from '../ui/DataLoadingSkeleton'
import { DataErrorBanner } from '../ui/DataErrorBanner'
import { ExportCsvButton } from '../ui/ExportCsvButton'
import { ChartFadeIn } from '../ui/ChartFadeIn'
import BookwormChart from '../charts/BookwormChart.jsx'
import MuseumProfile from '../charts/MuseumProfile.jsx'
import { SeasonalInsight } from './SeasonalInsight'
import {
  canExportBookworm,
  canExportMuseum,
  exportBookwormCsv,
  exportMuseumCsv,
} from '../../utils/chartExport'
import type { MetricDisclaimerType } from '../../data/culturalMetrics'

function regionLabel(t: (key: string) => string, region: string) {
  return t(`regions.${region}` as 'regions.Hovedstaden')
}

function metricDisclaimerText(
  type: MetricDisclaimerType,
  region: string,
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  if (type === 'hub') return t('stats.hubMuseumNote')
  if (type === 'commuter') {
    return t('stats.commuterMuseumNote', { region: regionLabel(t, region) })
  }
  return undefined
}

export function MainDisplay() {
  const { selectedMunicipality } = useMunicipality()
  const { isSeasonalPulse, viewMode } = useViewMode()
  const { t } = useLanguage()
  const { formatCompact, formatNumber } = useFormattedNumbers()
  const {
    loading,
    error,
    retry,
    metrics,
    bookwormTrend,
    museumProfile,
    seasonalPulse,
  } = useCulturalData()

  if (loading) {
    return <DataLoadingSkeleton />
  }

  if (error) {
    return <DataErrorBanner message={error} onRetry={retry} />
  }

  if (!metrics) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">
        <p className="text-sm text-kultur-muted">
          {t('main.noData', { municipality: selectedMunicipality })}
        </p>
      </div>
    )
  }

  const museumTooltip = metricDisclaimerText(
    metrics.museumContext.disclaimerType,
    metrics.region,
    t,
  )
  const cultureIndexTooltip = metricDisclaimerText(
    metrics.cultureIndex.disclaimerType,
    metrics.region,
    t,
  )
  const museumKpiValue = metrics.museumContext.dataAvailable
    ? formatCompact(metrics.mus01.totalVisits)
    : t('stats.notAvailable')
  const museumKpiSubtext = metrics.museumContext.dataAvailable
    ? `${formatNumber(metrics.mus01.perCapita.total)} ${t('main.perCapita')}`
    : t('stats.museumDataUnavailable')

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 rounded-xl border border-kultur-border bg-kultur-surface/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-kultur-text sm:text-3xl">
            {metrics.municipality}
          </h2>
          <span className="rounded-md border border-kultur-ink/25 bg-kultur-ink/10 px-2 py-0.5 font-mono text-xs font-medium text-kultur-ink">
            KOM {metrics.code}
          </span>
        </div>
        <p className="mt-2 text-sm text-kultur-subtle">
          {metrics.year} · {formatNumber(metrics.population)}{' '}
          {t('main.residents')}
          <span className="ml-2 rounded-md border border-kultur-sage/25 bg-kultur-sage/10 px-1.5 py-0.5 text-[11px] text-kultur-sage">
            {t('main.statbankLive')}
          </span>
          {metrics.museumNote === 'regional-scaled' && (
            <span className="ml-2 rounded-md border border-kultur-border px-1.5 py-0.5 text-[11px] text-kultur-muted">
              {t('main.statbankRegional')}
            </span>
          )}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <SeasonalViewToggle />
        {isSeasonalPulse && (
          <p className="text-xs text-kultur-plum/90">{t('main.seasonalActive')}</p>
        )}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t('stats.libraryLoans')}
          value={formatCompact(metrics.bib1.totalLoans)}
          subtext={`${formatNumber(metrics.bib1.perCapita.total)} ${t('main.perCapita')}`}
          icon={<BookOpen className="h-5 w-5" strokeWidth={2} />}
          accent="clay"
        />
        <StatCard
          label={t('stats.museumVisits')}
          value={museumKpiValue}
          subtext={museumKpiSubtext}
          icon={<Landmark className="h-5 w-5" strokeWidth={2} />}
          accent="sage"
          infoTooltip={museumTooltip}
          infoLabel={t('stats.metricInfoLabel')}
        />
        <StatCard
          label={t('stats.population')}
          value={formatCompact(metrics.population)}
          subtext={t('stats.populationSub')}
          icon={<Users className="h-5 w-5" strokeWidth={2} />}
          accent="ink"
        />
        <StatCard
          label={t('stats.cultureIndex')}
          value={formatNumber(metrics.cultureIndex.value)}
          subtext={
            metrics.cultureIndex.isMuseumOutlier
              ? t('stats.cultureIndexSubWeighted')
              : t('stats.cultureIndexSub')
          }
          icon={<BookMarked className="h-5 w-5" strokeWidth={2} />}
          accent="gold"
          infoTooltip={cultureIndexTooltip}
          infoLabel={t('stats.metricInfoLabel')}
        />
      </div>

      <div className="mb-6">
        <SectionCard
          title={t('bookworm.title')}
          description={
            isSeasonalPulse ? t('bookworm.descSeasonal') : t('bookworm.descAnnual')
          }
          action={
            <ExportCsvButton
              disabled={
                !canExportBookworm({
                  isSeasonal: isSeasonalPulse,
                  trend: bookwormTrend,
                  seasonal: seasonalPulse,
                })
              }
              onExport={() =>
                exportBookwormCsv({
                  municipality: metrics.municipality,
                  isSeasonal: isSeasonalPulse,
                  trend: bookwormTrend,
                  seasonal: seasonalPulse,
                  t,
                })
              }
            />
          }
        >
          <ChartFadeIn key={`bookworm-${viewMode}`}>
            <BookwormChart
              selectedMunicipality={selectedMunicipality}
              trend={bookwormTrend}
            />
          </ChartFadeIn>
        </SectionCard>
        <SeasonalInsight />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title={t('bib1.title')}
          description={t('bib1.description')}
        >
          <div className="space-y-3">
            <MetricRow
              icon={<BookOpen className="h-4 w-4" />}
              label={t('bib1.physical')}
              total={metrics.bib1.physicalBooks}
              perCapita={metrics.bib1.perCapita.physicalBooks}
              perCapitaLabel={t('main.perResident')}
              formatNumber={formatNumber}
              color="text-kultur-clay"
              barWidth={
                (metrics.bib1.physicalBooks / metrics.bib1.totalLoans) * 100
              }
              barColor="bg-kultur-clay/70"
            />
            <MetricRow
              icon={<Smartphone className="h-4 w-4" />}
              label={t('bib1.digital')}
              total={metrics.bib1.ebooks}
              perCapita={metrics.bib1.perCapita.ebooks}
              perCapitaLabel={t('main.perResident')}
              formatNumber={formatNumber}
              color="text-kultur-ink"
              barWidth={(metrics.bib1.ebooks / metrics.bib1.totalLoans) * 100}
              barColor="bg-kultur-ink/60"
            />
          </div>
        </SectionCard>

        <SectionCard
          title={t('museum.title')}
          description={
            isSeasonalPulse ? t('museum.descSeasonal') : t('museum.descAnnual')
          }
          action={
            <ExportCsvButton
              disabled={
                !canExportMuseum({
                  isSeasonal: isSeasonalPulse,
                  profile: museumProfile,
                  seasonal: seasonalPulse,
                })
              }
              onExport={() =>
                exportMuseumCsv({
                  municipality: metrics.municipality,
                  isSeasonal: isSeasonalPulse,
                  profile: museumProfile,
                  seasonal: seasonalPulse,
                  t,
                })
              }
            />
          }
        >
          <ChartFadeIn key={`museum-${viewMode}`} delay={80}>
            <MuseumProfile
              selectedMunicipality={selectedMunicipality}
              profile={museumProfile}
            />
          </ChartFadeIn>
        </SectionCard>
      </div>
    </div>
  )
}

interface MetricRowProps {
  icon: ReactNode
  label: string
  total: number
  perCapita: number
  perCapitaLabel: string
  formatNumber: (value: number) => string
  color: string
  barWidth: number
  barColor: string
}

function MetricRow({
  icon,
  label,
  total,
  perCapita,
  perCapitaLabel,
  formatNumber,
  color,
  barWidth,
  barColor,
}: MetricRowProps) {
  return (
    <div className="rounded-lg border border-kultur-border/80 bg-kultur-raised/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className={`mt-0.5 ${color}`}>{icon}</span>
          <div>
            <p className="text-sm text-kultur-subtle">{label}</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-kultur-text">
              {formatNumber(total)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-kultur-muted">
            {perCapitaLabel}
          </p>
          <p className={`text-sm font-semibold tabular-nums ${color}`}>
            {formatNumber(perCapita)}
          </p>
        </div>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-kultur-border/60">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(barWidth, 100)}%` }}
        />
      </div>
    </div>
  )
}
