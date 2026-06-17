import type { ReactNode } from 'react'
import { MetricInfoTooltip } from './MetricInfoTooltip'

interface StatCardProps {
  label: string
  value: string
  subtext?: string
  icon: ReactNode
  accent?: 'clay' | 'sage' | 'gold' | 'ink'
  infoTooltip?: string
  infoLabel?: string
}

const accentStyles = {
  clay: {
    bar: 'bg-kultur-clay',
    icon: 'text-kultur-clay bg-kultur-clay/10 border-kultur-clay/25',
  },
  sage: {
    bar: 'bg-kultur-sage',
    icon: 'text-kultur-sage bg-kultur-sage/10 border-kultur-sage/25',
  },
  gold: {
    bar: 'bg-kultur-gold',
    icon: 'text-kultur-gold bg-kultur-gold/10 border-kultur-gold/25',
  },
  ink: {
    bar: 'bg-kultur-ink',
    icon: 'text-kultur-ink bg-kultur-ink/10 border-kultur-ink/25',
  },
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  accent = 'clay',
  infoTooltip,
  infoLabel,
}: StatCardProps) {
  const styles = accentStyles[accent]

  return (
    <article className="relative overflow-visible rounded-xl border border-kultur-border bg-kultur-surface px-5 py-4 transition-colors hover:border-kultur-border/80 hover:bg-kultur-raised/40">
      <div
        className={`absolute inset-y-0 left-0 w-1 rounded-l-xl ${styles.bar}`}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="flex items-center text-sm font-medium leading-snug text-kultur-muted">
            {label}
            {infoTooltip && (
              <MetricInfoTooltip text={infoTooltip} label={infoLabel} />
            )}
          </p>
          <p className="font-display text-2xl font-semibold leading-tight tracking-tight text-kultur-text">
            {value}
          </p>
          {subtext && (
            <p className="text-xs leading-relaxed sm:leading-5 tabular-nums text-kultur-muted">
              {subtext}
            </p>
          )}
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${styles.icon}`}
        >
          {icon}
        </div>
      </div>
    </article>
  )
}
