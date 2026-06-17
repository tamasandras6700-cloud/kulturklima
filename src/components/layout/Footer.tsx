import { useLanguage } from '../../i18n/LanguageContext'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="shrink-0 border-t border-kultur-border/60 bg-kultur-surface/90 pb-[max(0px,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-center px-4 py-2 sm:px-6 lg:px-8">
        <p className="max-w-4xl text-center text-xs leading-snug text-zinc-500">
          {t('footer.attribution')}
        </p>
      </div>
    </footer>
  )
}
