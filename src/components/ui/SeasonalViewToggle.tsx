import { CalendarRange, CloudRain } from 'lucide-react'
import { useViewMode, type ViewMode } from '../../context/ViewModeContext'
import { useLanguage } from '../../i18n/LanguageContext'

export function SeasonalViewToggle() {
  const { viewMode, setViewMode } = useViewMode()
  const { t } = useLanguage()

  const modes: { id: ViewMode; labelKey: string; icon: typeof CalendarRange }[] =
    [
      { id: 'annual', labelKey: 'viewMode.annual', icon: CalendarRange },
      { id: 'seasonal', labelKey: 'viewMode.seasonal', icon: CloudRain },
    ]

  return (
    <div
      className="inline-flex rounded-xl border border-kultur-border bg-kultur-surface p-1"
      role="group"
      aria-label={t('viewMode.aria')}
    >
      {modes.map(({ id, labelKey, icon: Icon }) => {
        const active = viewMode === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => setViewMode(id)}
            aria-pressed={active}
            className={`flex min-h-11 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? id === 'seasonal'
                  ? 'bg-kultur-plum/15 text-kultur-plum ring-1 ring-kultur-plum/35'
                  : 'bg-kultur-raised text-kultur-text ring-1 ring-kultur-border'
                : 'text-kultur-muted hover:text-kultur-subtle'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {t(labelKey)}
          </button>
        )
      })}
    </div>
  )
}
