import { AlertCircle, RefreshCw } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

interface DataErrorBannerProps {
  onRetry?: () => void
  message?: string | null
}

export function DataErrorBanner({ onRetry, message }: DataErrorBannerProps) {
  const { t } = useLanguage()

  return (
    <div
      className="mx-4 my-6 rounded-xl border border-kultur-clay/30 bg-kultur-clay/5 p-5 sm:mx-6 lg:mx-8"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-kultur-clay" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-kultur-text">
            {t('data.fetchError')}
          </p>
          {message && (
            <p className="mt-1 text-xs text-kultur-muted">{message}</p>
          )}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-kultur-border bg-kultur-raised/50 px-3 py-2 text-sm font-medium text-kultur-subtle transition-colors hover:text-kultur-text"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              {t('data.retry')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
