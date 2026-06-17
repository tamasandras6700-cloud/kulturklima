import { Languages } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Locale } from '../../i18n/translations'

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage()

  const nextLocale: Locale = locale === 'da' ? 'en' : 'da'
  const label = locale === 'da' ? t('language.switchToEn') : t('language.switchToDa')

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-700/80 bg-transparent px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-200 ease-out hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-200 min-h-11"
      aria-label={`${t('language.label')}: ${label}`}
    >
      <Languages className="h-4 w-4" aria-hidden />
      {label}
    </button>
  )
}
