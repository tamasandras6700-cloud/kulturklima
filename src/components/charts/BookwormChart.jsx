import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BookOpen, CloudRain, Divide } from 'lucide-react'
import { useViewMode } from '../../context/ViewModeContext'
import { useCulturalData } from '../../context/CulturalDataContext'
import { useFormattedNumbers, useLanguage } from '../../i18n/LanguageContext'
import { BAR_CHART_LAYOUT_ANIMATION, CHART_ANIMATION } from './chartAnimation'
import { SeasonalAxisTick } from './SeasonalAxisTick'
import {
  computePeakQuarter,
  formatQuarterLabel,
  formatSeasonName,
} from '../../utils/seasonalInsights'

const COLORS = {
  physical: '#c4785a',
  digital: '#7a9bb8',
}

function BookwormChartTooltip({ active, payload, label, t, formatNumber, perCapitaShort }) {
  if (!active || !payload?.length) return null

  const physical = payload.find((p) => p.dataKey === 'physical')?.value ?? 0
  const digital = payload.find((p) => p.dataKey === 'digital')?.value ?? 0
  const entry = payload[0]?.payload
  const title = entry?.periodFull ?? label

  return (
    <div className="rounded-lg border border-kultur-border bg-kultur-surface px-3 py-2 shadow-lg">
      <p className="mb-2 text-xs font-medium text-kultur-muted">{title}</p>
      <p className="text-sm text-kultur-clay">
        {t('bookworm.physical')}: {formatNumber(physical)} / {perCapitaShort}
      </p>
      <p className="text-sm text-kultur-ink">
        {t('bookworm.digital')}: {formatNumber(digital)} / {perCapitaShort}
      </p>
      <p className="mt-1 border-t border-kultur-border pt-1 text-sm font-semibold text-kultur-text">
        {t('bookworm.tooltipTotal')}: {formatNumber(physical + digital)} / {perCapitaShort}
      </p>
    </div>
  )
}

function BookwormKpi({ trend, seasonal, t, formatNumber, perCapitaShort }) {
  if (seasonal) {
    const { year, population } = seasonal
    const peakResult = computePeakQuarter(seasonal.quarters)

    if (!peakResult) return null

    const { peak, lowest, peakVsLowestPct } = peakResult
    const peakLabel = formatQuarterLabel(t, peak)
    const peakSeason = formatSeasonName(t, peak)
    const lowLabel = formatQuarterLabel(t, lowest)

    return (
      <div className="flex h-full flex-col justify-center rounded-lg border border-kultur-plum/30 bg-kultur-surface p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-kultur-plum/30 bg-kultur-plum/10">
            <CloudRain className="h-4 w-4 text-kultur-plum" strokeWidth={2} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-kultur-muted">
            {t('bookworm.seasonalKpiTitle', { year })}
          </p>
        </div>

        <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-kultur-plum">
          +{peakVsLowestPct}%
        </p>
        <p className="mt-1 text-sm text-kultur-muted">{t('bookworm.peakCultureLift')}</p>

        <div className="mt-4 space-y-2 rounded-md border border-kultur-border bg-kultur-canvas/60 px-3 py-3 font-mono text-sm">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-kultur-subtle">
            <span className="text-kultur-muted">{peakLabel}</span>
            <span className="font-semibold text-kultur-ink">
              {formatNumber(peak.totalLoansPerCapita)}
            </span>
            <Divide className="h-3.5 w-3.5 text-kultur-muted/60" aria-hidden />
            <span className="text-kultur-muted">{lowLabel}</span>
            <span>{formatNumber(lowest.totalLoansPerCapita)}</span>
          </div>
          <p className="text-xs text-kultur-muted">
            {t('bookworm.coldQuartersNote', {
              population: formatNumber(population),
            })}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded border border-kultur-plum/20 bg-kultur-plum/5 px-2 py-1.5">
            <p className="text-kultur-muted">{t('bookworm.peakQuarter')}</p>
            <p className="font-semibold tabular-nums text-kultur-ink">
              {peakLabel} · {peakSeason}
            </p>
            <p className="mt-0.5 tabular-nums text-kultur-plum">
              {formatNumber(peak.totalLoansPerCapita)} / {perCapitaShort}
            </p>
          </div>
          <div className="rounded border border-kultur-border px-2 py-1.5">
            <p className="text-kultur-muted">{t('bookworm.lowQuarter')}</p>
            <p className="font-semibold tabular-nums text-kultur-subtle">
              {lowLabel}
            </p>
            <p className="mt-0.5 tabular-nums text-kultur-muted">
              {formatNumber(lowest.totalLoansPerCapita)} / {perCapitaShort}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { kpi, currentYear } = trend

  return (
    <div className="flex h-full flex-col justify-center rounded-lg border border-kultur-border bg-kultur-surface p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-kultur-clay/30 bg-kultur-clay/10">
          <BookOpen className="h-4 w-4 text-kultur-clay" strokeWidth={2} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-kultur-muted">
          {t('bookworm.kpiTitle', { year: currentYear })}
        </p>
      </div>

      <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-kultur-text">
        {formatNumber(kpi.booksPerCitizen)}
        <span className="ml-2 text-lg font-medium text-kultur-muted">
          {t('bookworm.booksPerCitizen')}
        </span>
      </p>

      <div className="mt-4 space-y-2 rounded-md border border-kultur-border bg-kultur-canvas/60 px-3 py-3 font-mono text-sm">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-kultur-subtle">
          <span className="text-kultur-muted">[</span>
          <span>{formatNumber(kpi.totalLoans)}</span>
          <span className="text-kultur-muted">{t('bookworm.totalLoans')}]</span>
          <Divide className="h-3.5 w-3.5 text-kultur-muted/60" aria-hidden />
          <span className="text-kultur-muted">[</span>
          <span>{formatNumber(kpi.population)}</span>
          <span className="text-kultur-muted">{t('bookworm.population')}]</span>
          <span className="text-kultur-muted">=</span>
          <span className="font-semibold text-kultur-clay">
            {formatNumber(kpi.booksPerCitizen)}
          </span>
        </div>
        <p className="text-xs text-kultur-muted">
          {t('bookworm.avgLoans', { year: currentYear })}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded border border-kultur-border px-2 py-1.5">
          <p className="text-kultur-muted">{t('bookworm.physical')}</p>
          <p className="font-semibold tabular-nums text-kultur-clay">
            {formatNumber(kpi.physicalPerCitizen)} / {perCapitaShort}
          </p>
        </div>
        <div className="rounded border border-kultur-border px-2 py-1.5">
          <p className="text-kultur-muted">{t('bookworm.digital')}</p>
          <p className="font-semibold tabular-nums text-kultur-ink">
            {formatNumber(kpi.digitalPerCitizen)} / {perCapitaShort}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * @param {{ selectedMunicipality: string, trend: import('../../data/culturalMetrics').BookwormTrend | null }} props
 */
export function BookwormChart({ selectedMunicipality, trend }) {
  const { isSeasonalPulse } = useViewMode()
  const { seasonalPulse: seasonal } = useCulturalData()
  const { t } = useLanguage()
  const { formatNumber } = useFormattedNumbers()
  const perCapitaShort = t('bookworm.perCapitaShort')

  const physicalLabel = t('bookworm.physical')
  const digitalLabel = t('bookworm.digital')

  const activeSeasonal = isSeasonalPulse ? seasonal : null

  if (isSeasonalPulse && !activeSeasonal) {
    return (
      <p className="py-8 text-center text-sm text-kultur-muted">
        {t('bookworm.noSeasonalData', { municipality: selectedMunicipality })}
      </p>
    )
  }

  if (!isSeasonalPulse && !trend) {
    return (
      <p className="py-8 text-center text-sm text-kultur-muted">
        {t('bookworm.noData', { municipality: selectedMunicipality })}
      </p>
    )
  }

  const chartData = isSeasonalPulse
    ? activeSeasonal.quarters.map((q) => ({
        period: q.id,
        periodFull: t(`quarters.${q.id}.short`),
        season: t(`seasons.${q.season}`),
        quarterId: q.id,
        isColdQuarter: q.isColdQuarter,
        physical: q.physicalPerCapita,
        digital: q.digitalPerCapita,
        total: q.totalLoansPerCapita,
      }))
    : trend.timeline.map((row) => ({
        period: row.year,
        quarterId: null,
        isColdQuarter: false,
        physical: row.physical,
        digital: row.digital,
        total: row.totalPerCapita,
      }))

  const chartMode = isSeasonalPulse ? 'seasonal' : 'annual'

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px]">
      <div className="chart-view-transition">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            key={chartMode}
            data={chartData}
            margin={{ top: 8, right: 8, left: -8, bottom: 12 }}
            barCategoryGap={isSeasonalPulse ? '22%' : '12%'}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#3a3540"
              vertical={false}
            />
            <XAxis
              dataKey="period"
              tick={
                isSeasonalPulse
                  ? (props) => (
                      <SeasonalAxisTick
                        {...props}
                        season={chartData[props.index]?.season}
                        coldQuarter={chartData[props.index]?.isColdQuarter}
                      />
                    )
                  : { fill: '#9a939e', fontSize: 11 }
              }
              axisLine={{ stroke: '#3a3540' }}
              tickLine={false}
              interval={0}
              height={isSeasonalPulse ? 56 : 30}
              label={
                isSeasonalPulse
                  ? {
                      value: t('bookworm.xAxisSeasonal', {
                        year: activeSeasonal.year,
                      }),
                      position: 'insideBottom',
                      offset: -2,
                      fill: '#7a7380',
                      fontSize: 10,
                    }
                  : undefined
              }
            />
            <YAxis
              tick={{ fill: '#9a939e', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatNumber(value)}
              label={{
                value: t('bookworm.yAxis'),
                angle: -90,
                position: 'insideLeft',
                fill: '#9a939e',
                fontSize: 11,
                dx: 10,
              }}
            />
            <Tooltip
              content={
                <BookwormChartTooltip
                  t={t}
                  formatNumber={formatNumber}
                  perCapitaShort={perCapitaShort}
                />
              }
              cursor={{ fill: '#242128' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#b8b0bb', paddingTop: 12 }}
            />
            <Bar
              dataKey="physical"
              name={physicalLabel}
              stackId="loans"
              fill={COLORS.physical}
              radius={[0, 0, 0, 0]}
              maxBarSize={48}
              {...BAR_CHART_LAYOUT_ANIMATION}
            />
            <Bar
              dataKey="digital"
              name={digitalLabel}
              stackId="loans"
              fill={COLORS.digital}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
              {...BAR_CHART_LAYOUT_ANIMATION}
            />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-kultur-muted">
          {isSeasonalPulse
            ? t('bookworm.footnoteSeasonal')
            : t('bookworm.footnoteAnnual')}
        </p>
      </div>

      <BookwormKpi
        trend={trend}
        seasonal={isSeasonalPulse ? activeSeasonal : null}
        t={t}
        formatNumber={formatNumber}
        perCapitaShort={perCapitaShort}
      />
    </div>
  )
}

export default BookwormChart
