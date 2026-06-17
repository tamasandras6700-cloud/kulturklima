import { Loader2 } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

export function DataLoadingSkeleton() {
  const { t } = useLanguage()

  return (
    <div className="p-4 sm:p-6 lg:p-8" aria-busy="true" aria-live="polite">
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-kultur-border bg-kultur-surface/80 p-5">
        <Loader2
          className="h-5 w-5 shrink-0 animate-spin text-kultur-clay"
          aria-hidden
        />
        <p className="text-sm text-kultur-subtle">{t('data.loading')}</p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-kultur-border bg-kultur-surface/60"
          />
        ))}
      </div>

      <div className="mb-6 h-80 animate-pulse rounded-xl border border-kultur-border bg-kultur-surface/40" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-xl border border-kultur-border bg-kultur-surface/40" />
        <div className="h-72 animate-pulse rounded-xl border border-kultur-border bg-kultur-surface/40" />
      </div>
    </div>
  )
}
