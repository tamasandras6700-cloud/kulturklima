import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { tables } from '../../data'
import { useFormattedNumbers } from '../../i18n/LanguageContext'
import type { MunicipalityStats } from '../../data/types'

interface PerCapitaChartProps {
  municipality: MunicipalityStats
}

function ChartTooltip({
  active,
  payload,
  label,
  formatNumber,
}: {
  active?: boolean
  payload?: { value: number; name: string; color: string }[]
  label?: string
  formatNumber: (value: number) => string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-nord-border bg-nord-elevated px-3 py-2 shadow-lg">
      <p className="mb-2 text-xs font-medium text-nord-muted">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-sm font-medium"
          style={{ color: entry.color }}
        >
          {entry.name}: {formatNumber(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function PerCapitaChart({ municipality }: PerCapitaChartProps) {
  const { formatNumber } = useFormattedNumbers()

  const years = [
    ...new Set([
      ...tables.bib1.rows.map((r) => r.Tid),
      ...tables.mus01.rows.map((r) => r.Tid),
      ...tables.folk1a.rows.map((r) => r.Tid),
    ]),
  ].sort()

  const chartData = years.map((year) => {
    const pop =
      tables.folk1a.rows.find(
        (r) => r.KOM === municipality.code && r.Tid === year,
      )?.value ?? 0
    const loans =
      tables.bib1.rows.find(
        (r) => r.KOM === municipality.code && r.Tid === year,
      )?.value ?? 0
    const visits =
      tables.mus01.rows.find(
        (r) => r.KOM === municipality.code && r.Tid === year,
      )?.value ?? 0

    return {
      year,
      loansPerCapita: pop > 0 ? Math.round((loans / pop) * 10) / 10 : 0,
      visitsPerCapita: pop > 0 ? Math.round((visits / pop) * 10) / 10 : 0,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a3544" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fill: '#8b9cb3', fontSize: 12 }}
          axisLine={{ stroke: '#2a3544' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#8b9cb3', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => formatNumber(value)}
        />
        <Tooltip content={<ChartTooltip formatNumber={formatNumber} />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#8b9cb3', paddingTop: 12 }}
        />
        <Line
          type="monotone"
          dataKey="loansPerCapita"
          name="Biblioteksudlån"
          stroke="#7eb8da"
          strokeWidth={2}
          dot={{ fill: '#7eb8da', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="visitsPerCapita"
          name="Museumsbesøg"
          stroke="#5aafa0"
          strokeWidth={2}
          dot={{ fill: '#5aafa0', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
