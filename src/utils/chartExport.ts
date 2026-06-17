import type { BookwormTrend, MuseumProfile, SeasonalPulse } from '../data/culturalMetrics'
import { downloadCsv, rowsToCsv, slugifyFilename } from './exportCsv'

type TranslateFn = (key: string, params?: Record<string, string | number>) => string

interface BookwormExportParams {
  municipality: string
  isSeasonal: boolean
  trend: BookwormTrend | null
  seasonal: SeasonalPulse | null
  t: TranslateFn
}

interface MuseumExportParams {
  municipality: string
  isSeasonal: boolean
  profile: MuseumProfile | null
  seasonal: SeasonalPulse | null
  t: TranslateFn
}

export function canExportBookworm({
  isSeasonal,
  trend,
  seasonal,
}: Pick<BookwormExportParams, 'isSeasonal' | 'trend' | 'seasonal'>) {
  if (isSeasonal) return Boolean(seasonal?.quarters?.length)
  return Boolean(trend?.timeline?.length)
}

export function canExportMuseum({
  isSeasonal,
  profile,
  seasonal,
}: Pick<MuseumExportParams, 'isSeasonal' | 'profile' | 'seasonal'>) {
  if (!profile || profile.chartSlices.length === 0) return false
  if (isSeasonal) return Boolean(seasonal?.quarters?.length)
  return true
}

export function exportBookwormCsv(params: BookwormExportParams) {
  const { municipality, isSeasonal, trend, seasonal, t } = params
  if (!canExportBookworm({ isSeasonal, trend, seasonal })) return

  const slug = slugifyFilename(municipality)
  const mode = isSeasonal ? 'seasonal' : 'annual'

  if (isSeasonal && seasonal) {
    const headers = [
      'period',
      'physical_per_capita',
      'digital_per_capita',
      'physical_total',
      'digital_total',
      'total_loans_per_capita',
    ]
    const rows = seasonal.quarters.map((q) => ({
      period: t(`quarters.${q.id}.short`),
      physical_per_capita: q.physicalPerCapita,
      digital_per_capita: q.digitalPerCapita,
      physical_total: q.physical,
      digital_total: q.digital,
      total_loans_per_capita: q.totalLoansPerCapita,
    }))

    downloadCsv(
      `kulturklima-${slug}-bookworm-${mode}-${seasonal.year}.csv`,
      rowsToCsv(headers, rows),
    )
    return
  }

  if (trend) {
    const headers = [
      'year',
      'physical_per_capita',
      'digital_per_capita',
      'physical_total',
      'digital_total',
      'total_per_capita',
      'total_loans',
    ]
    const rows = trend.timeline.map((row) => ({
      year: row.year,
      physical_per_capita: row.physical,
      digital_per_capita: row.digital,
      physical_total: row.physicalTotal,
      digital_total: row.digitalTotal,
      total_per_capita: row.totalPerCapita,
      total_loans: row.totalLoans,
    }))

    downloadCsv(
      `kulturklima-${slug}-bookworm-${mode}-${trend.currentYear}.csv`,
      rowsToCsv(headers, rows),
    )
  }
}

export function exportMuseumCsv(params: MuseumExportParams) {
  const { municipality, isSeasonal, profile, seasonal, t } = params
  if (!canExportMuseum({ isSeasonal, profile, seasonal }) || !profile) return

  const slug = slugifyFilename(municipality)
  const mode = isSeasonal ? 'seasonal' : 'annual'

  if (isSeasonal && seasonal) {
    const headers = [
      'period',
      'art_museums',
      'cultural_history',
      'natural_history',
      'museum_visits_total',
      'museum_per_capita',
    ]
    const rows = seasonal.quarters.map((q) => ({
      period: t(`quarters.${q.id}.short`),
      art_museums: q.artMuseums,
      cultural_history: q.culturalHistory,
      natural_history: q.naturalHistory,
      museum_visits_total: q.museumVisits,
      museum_per_capita: q.museumPerCapita,
    }))

    downloadCsv(
      `kulturklima-${slug}-museum-${mode}-${seasonal.year}.csv`,
      rowsToCsv(headers, rows),
    )
    return
  }

  const headers = ['category', 'category_id', 'visits', 'share_percent']
  const rows = profile.chartSlices.map((slice) => ({
    category: t(`museum.categories.${slice.id}`),
    category_id: slice.id,
    visits: slice.value,
    share_percent: slice.percentage,
  }))

  downloadCsv(
    `kulturklima-${slug}-museum-${mode}-${profile.year}.csv`,
    rowsToCsv(headers, rows),
  )
}
