import type { CSSProperties, ReactNode } from 'react'

interface ChartFadeInProps {
  children: ReactNode
  className?: string
  /** Stagger delay in ms */
  delay?: number
}

export function ChartFadeIn({
  children,
  className = '',
  delay = 0,
}: ChartFadeInProps) {
  const style: CSSProperties | undefined =
    delay > 0 ? { animationDelay: `${delay}ms` } : undefined

  return (
    <div className={`animate-chart-fade-in ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}
