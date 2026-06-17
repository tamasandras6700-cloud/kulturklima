import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FlaskConical, Landmark, Microscope, Palette } from 'lucide-react'
import { useViewMode } from '../../context/ViewModeContext'
import { useCulturalData } from '../../context/CulturalDataContext'
import { useFormattedNumbers, useLanguage } from '../../i18n/LanguageContext'

import { museumCategoryColors, themeColors } from '../../theme/colors'
import { BAR_CHART_LAYOUT_ANIMATION, CHART_ANIMATION } from './chartAnimation'
import { SeasonalAxisTick } from './SeasonalAxisTick'

const CATEGORY_COLORS = museumCategoryColors

const CATEGORY_ICONS = {
  KUNST: Palette,
  KULTUR: Landmark,
  NATUR: Microscope,
}

function categoryLabel(t, id) {
  return t(`museum.categories.${id}`)
}

function localizedCategories(t, categories) {
  return categories.map((cat) => ({
    ...cat,
    label: categoryLabel(t, cat.id),
  }))
}

function ChartTooltip({ active, payload, t, formatNumber }) {
  if (!active || !payload?.length) return null

  const entry = payload[0]?.payload
  if (!entry) return null

  if (entry.label) {
    return (
      <div className="rounded-lg border border-kultur-border bg-kultur-surface px-3 py-2 shadow-lg">
        <p className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.label}
        </p>
        <p className="text-sm text-kultur-text">
          {formatNumber(entry.value)} {t('museum.visits')}
        </p>
        {entry.percentage != null && (
          <p className="text-xs text-kultur-muted">
            {formatNumber(entry.percentage)}% {t('museum.ofTotal')}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-kultur-border bg-kultur-surface px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-kultur-muted">
        {entry.periodFull ?? entry.period}
      </p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm" style={{ color: p.color }}>
          {p.name}: {formatNumber(p.value)} {t('museum.visits')}
        </p>
      ))}
    </div>
  )
}

function ScienceFallback({ t }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-dashed border-kultur-sage/30 bg-kultur-sage/5 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-kultur-sage/25 bg-kultur-sage/10">
        <FlaskConical className="h-4 w-4 text-kultur-sage" aria-hidden />
      </div>
      <div>
        <p className="text-sm font-medium text-kultur-sage">
          {t('museum.categories.NATUR')}
        </p>
        <p className="mt-1 text-sm text-kultur-muted">{t('museum.noScience')}</p>
      </div>
    </div>
  )
}

function EmptyChartState({ municipality, t }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-kultur-border bg-kultur-surface/40 px-6 py-12 text-center">
      <Microscope className="mb-3 h-8 w-8 text-kultur-muted/60" aria-hidden />
      <p className="text-sm font-medium text-kultur-muted">
        {t('museum.emptyTitle', { municipality })}
      </p>
      <p className="mt-1 max-w-xs text-xs text-kultur-muted">{t('museum.emptyDesc')}</p>
    </div>
  )
}

function CategoryLegend({ categories, totalVisits, t, formatNumber }) {
  return (
    <ul className="space-y-2">
      {categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.id] ?? Landmark
        const share =
          cat.hasData && cat.value && totalVisits > 0
            ? Math.round((cat.value / totalVisits) * 1000) / 10
            : null

        return (
          <li
            key={cat.id}
            className={`flex items-center gap-3 rounded-md border px-3 py-2 ${
              cat.hasData
                ? 'border-kultur-border bg-kultur-raised/20'
                : 'border-kultur-border/60 bg-kultur-canvas/40 opacity-60'
            }`}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: cat.hasData ? cat.color : themeColors.border }}
            />
            <Icon
              className={`h-3.5 w-3.5 shrink-0 ${cat.hasData ? '' : 'text-kultur-muted'}`}
              style={cat.hasData ? { color: cat.color } : undefined}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-kultur-subtle">{cat.label}</p>
              {cat.hasData ? (
                <p className="text-sm font-semibold tabular-nums text-kultur-text">
                  {formatNumber(cat.value)} · {formatNumber(share)}%
                </p>
              ) : (
                <p className="text-xs text-kultur-muted">{t('museum.noCategoryData')}</p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function SeasonalMuseumChart({ pulse, profile, t, formatNumber }) {
  const categories = localizedCategories(t, profile.categories)

  const chartData = pulse.quarters.map((q) => ({
    period: q.id,
    periodFull: t(`quarters.${q.id}.short`),
    season: t(`seasons.${q.season}`),
    isColdQuarter: q.isColdQuarter,
    art: q.artMuseums,
    culture: q.culturalHistory,
    science: q.naturalHistory,
  }))

  return (
    <div className="chart-view-transition grid gap-6 lg:grid-cols-[1fr_240px]">
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            key="museum-seasonal"
            data={chartData}
            margin={{ top: 8, right: 8, left: -8, bottom: 12 }}
            barCategoryGap="22%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.border} vertical={false} />
            <XAxis
              dataKey="period"
              tick={(props) => (
                <SeasonalAxisTick
                  {...props}
                  season={chartData[props.index]?.season}
                  coldQuarter={chartData[props.index]?.isColdQuarter}
                  mutedColor={themeColors.muted}
                  coldColor="#b89bc4"
                />
              )}
              axisLine={{ stroke: themeColors.border }}
              tickLine={false}
              interval={0}
              height={56}
              label={{
                value: t('bookworm.xAxisSeasonal', { year: pulse.year }),
                position: 'insideBottom',
                offset: -2,
                fill: themeColors.muted,
                fontSize: 10,
              }}
            />
            <YAxis
              tick={{ fill: themeColors.muted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              content={<ChartTooltip t={t} formatNumber={formatNumber} />}
              cursor={{ fill: themeColors.raised }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: themeColors.subtle, paddingTop: 8 }} />
            <Bar
              dataKey="art"
              name={categoryLabel(t, 'KUNST')}
              stackId="visits"
              fill={CATEGORY_COLORS.KUNST}
              {...BAR_CHART_LAYOUT_ANIMATION}
            />
            <Bar
              dataKey="culture"
              name={categoryLabel(t, 'KULTUR')}
              stackId="visits"
              fill={CATEGORY_COLORS.KULTUR}
              {...BAR_CHART_LAYOUT_ANIMATION}
            />
            {profile.hasScienceData && (
              <Bar
                dataKey="science"
                name={categoryLabel(t, 'NATUR')}
                stackId="visits"
                fill={CATEGORY_COLORS.NATUR}
                radius={[4, 4, 0, 0]}
                {...BAR_CHART_LAYOUT_ANIMATION}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-1 text-center text-xs text-kultur-muted">
          {t('museum.footnoteSeasonal')}
        </p>
      </div>

      <div className="space-y-4">
        <CategoryLegend
          categories={categories}
          totalVisits={profile.totalVisits}
          t={t}
          formatNumber={formatNumber}
        />
        {profile.missingScience && <ScienceFallback t={t} />}
      </div>
    </div>
  )
}

function AnnualMuseumChart({ profile, t, formatNumber }) {
  const categories = localizedCategories(t, profile.categories)
  const chartSlices = profile.chartSlices.map((slice) => ({
    ...slice,
    label: categoryLabel(t, slice.id),
  }))

  const dominantLabel = profile.dominantCategory
    ? categoryLabel(t, profile.dominantCategory.id).split(' (')[0]
    : null

  return (
    <div className="chart-view-transition grid gap-6 lg:grid-cols-[1fr_240px]">
      <div>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart key="museum-annual">
            <Pie
              data={chartSlices}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={108}
              paddingAngle={2}
              stroke={themeColors.surface}
              strokeWidth={2}
              {...CHART_ANIMATION}
            >
              {chartSlices.map((slice) => (
                <Cell key={slice.id} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              content={<ChartTooltip t={t} formatNumber={formatNumber} />}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: themeColors.subtle, paddingTop: 8 }} />
          </PieChart>
        </ResponsiveContainer>

        {profile.dominantCategory && dominantLabel && (
          <p className="mt-1 text-center text-xs text-kultur-muted">
            {t('museum.dominant')}:{' '}
            <span
              className="font-medium"
              style={{ color: profile.dominantCategory.color }}
            >
              {dominantLabel}
            </span>{' '}
            ({formatNumber(profile.dominantCategory.percentage)}% {t('museum.ofVisits')})
          </p>
        )}
      </div>

      <div className="space-y-4">
        <CategoryLegend
          categories={categories}
          totalVisits={profile.totalVisits}
          t={t}
          formatNumber={formatNumber}
        />
        {profile.missingScience && <ScienceFallback t={t} />}
      </div>
    </div>
  )
}

/**
 * @param {{ selectedMunicipality: string, profile: import('../../data/culturalMetrics').MuseumProfile | null }} props
 */
export function MuseumProfile({ selectedMunicipality, profile }) {
  const { isSeasonalPulse } = useViewMode()
  const { seasonalPulse: pulse } = useCulturalData()
  const { t } = useLanguage()
  const { formatNumber } = useFormattedNumbers()

  if (!profile) {
    return (
      <p className="py-8 text-center text-sm text-kultur-muted">
        {t('museum.noData', { municipality: selectedMunicipality })}
      </p>
    )
  }

  if (profile.chartSlices.length === 0) {
    return <EmptyChartState municipality={profile.municipality} t={t} />
  }

  if (isSeasonalPulse && !pulse) {
    return (
      <p className="py-8 text-center text-sm text-kultur-muted">
        {t('bookworm.noSeasonalData', { municipality: selectedMunicipality })}
      </p>
    )
  }

  if (isSeasonalPulse && pulse) {
    return (
      <SeasonalMuseumChart
        key="seasonal"
        pulse={pulse}
        profile={profile}
        t={t}
        formatNumber={formatNumber}
      />
    )
  }

  return (
    <AnnualMuseumChart key="annual" profile={profile} t={t} formatNumber={formatNumber} />
  )
}

export default MuseumProfile
