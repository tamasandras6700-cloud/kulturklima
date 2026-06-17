import { Download } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

interface ExportCsvButtonProps {
  onExport: () => void
  disabled?: boolean
}

export function ExportCsvButton({ onExport, disabled = false }: ExportCsvButtonProps) {
  const { t } = useLanguage()

  return (
    <button
      type="button"
      onClick={onExport}
      disabled={disabled}
      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-kultur-border bg-kultur-raised/40 px-3 py-2 text-xs font-medium text-kultur-subtle transition-colors hover:border-kultur-muted/40 hover:bg-kultur-raised/70 hover:text-kultur-text disabled:cursor-not-allowed disabled:opacity-40"
      aria-label={t('export.csv')}
    >
      <Download className="h-3.5 w-3.5" aria-hidden />
      {t('export.csv')}
    </button>
  )
}
