import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useFormattedNumbers } from '../../i18n/LanguageContext'
import type { MunicipalityStats } from '../../data/types'

interface MuseumVisitsChartProps {
  data: MunicipalityStats[]
}

function ChartTooltip({
  active,
  payload,
  label,
  formatNumber,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
  formatNumber: (value: number) => string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-nord-border bg-nord-elevated px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-nord-muted">{label}</p>
      <p className="text-sm font-semibold text-nord-teal">
        {formatNumber(payload[0].value)} besøg/indb.
      </p>
    </div>
  )
}

export function MuseumVisitsChart({ data }: MuseumVisitsChartProps) {
  const { formatNumber } = useFormattedNumbers()

  const chartData = data.map((m) => ({
    name: m.name,
    visitsPerCapita: m.visitsPerCapita,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#2a3544"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: '#8b9cb3', fontSize: 11 }}
          axisLine={{ stroke: '#2a3544' }}
          tickLine={false}
          interval={0}
          angle={-28}
          textAnchor="end"
          height={64}
        />
        <YAxis
          tick={{ fill: '#8b9cb3', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => formatNumber(value)}
        />
        <Tooltip content={<ChartTooltip formatNumber={formatNumber} />} cursor={{ fill: '#1c2533' }} />
        <Bar
          dataKey="visitsPerCapita"
          fill="#5aafa0"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
