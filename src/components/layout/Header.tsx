import { Palette } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { LanguageToggle } from '../ui/LanguageToggle'

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="shrink-0 border-b border-kultur-border/80 bg-kultur-surface/95 pt-[max(0px,env(safe-area-inset-top))] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-kultur-clay/30 bg-kultur-clay/10">
            <Palette className="h-5 w-5 text-kultur-clay" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-xl font-semibold tracking-tight text-kultur-text sm:text-2xl">
              KulturKlima
            </h1>
            <p className="mt-0.5 text-sm text-kultur-muted">{t('header.subtitle')}</p>
            <div
              className="mt-2 inline-flex flex-wrap items-center gap-1.5"
              aria-label={t('header.audienceGroupAria')}
            >
              <span className="rounded-md border border-zinc-700 bg-transparent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {t('header.audienceCultural')}
              </span>
              <span className="rounded-md border border-zinc-700 bg-transparent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {t('header.audienceMunicipal')}
              </span>
            </div>
          </div>
        </div>
        <LanguageToggle />
      </div>
    </header>
  )
}
