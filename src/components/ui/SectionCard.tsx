import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className = '',
}: SectionCardProps) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-kultur-border bg-kultur-surface ${className}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-kultur-border/80 bg-kultur-raised/30 px-5 py-4">
        <div>
          <h2 className="font-display text-base font-semibold text-kultur-text">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm leading-relaxed text-kultur-muted">
              {description}
            </p>
          )}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}
