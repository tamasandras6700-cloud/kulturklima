import { useMemo, useState } from 'react'
import { MapPin, Pin, Search } from 'lucide-react'
import {
  MUNICIPALITIES,
  sortMunicipalitiesForSidebar,
} from '../../data/municipalities'
import { useMunicipality } from '../../context/MunicipalityContext'
import { useCulturalData } from '../../context/CulturalDataContext'
import { useLanguage } from '../../i18n/LanguageContext'

interface SidebarProps {
  onMunicipalitySelect?: () => void
  /** When true, sidebar is rendered inside the mobile drawer (no outer border). */
  embedded?: boolean
}

export function Sidebar({ onMunicipalitySelect, embedded = false }: SidebarProps) {
  const { selectedMunicipality, setSelectedMunicipality } = useMunicipality()
  const { getCulturalIndex } = useCulturalData()
  const { t } = useLanguage()
  const [query, setQuery] = useState('')

  const { pinned, rest } = useMemo(
    () => sortMunicipalitiesForSidebar(MUNICIPALITIES, query),
    [query],
  )

  const rankedRest = useMemo(
    () =>
      [...rest].sort(
        (a, b) => getCulturalIndex(b.name) - getCulturalIndex(a.name),
      ),
    [rest, getCulturalIndex],
  )

  const regionLabel = (region: string) =>
    t(`regions.${region}` as 'regions.Hovedstaden')

  return (
    <aside
      className={`flex h-full min-h-0 w-full flex-col overflow-hidden bg-kultur-surface/60 ${
        embedded ? '' : 'border-r border-kultur-border/80'
      }`}
    >
      <div className="shrink-0 border-b border-kultur-border/80 p-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-kultur-muted">
          {t('sidebar.title')}
        </h2>
        <p className="mt-0.5 text-sm text-kultur-subtle">
          {t('sidebar.count', { count: MUNICIPALITIES.length })}
        </p>
        <div className="relative mt-3">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-kultur-muted"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('sidebar.searchPlaceholder')}
            className="w-full min-h-11 rounded-lg border border-kultur-border bg-kultur-raised/50 py-2.5 pr-3 pl-9 text-sm text-kultur-text placeholder:text-kultur-muted/60 outline-none focus:border-kultur-ink/50 focus:ring-1 focus:ring-kultur-ink/30"
            aria-label={t('sidebar.searchAria')}
          />
        </div>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-2 pb-4"
        aria-label={t('sidebar.listAria')}
      >
        {pinned.length > 0 && (
          <div className="mb-2">
            <p className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-kultur-muted">
              <Pin className="h-3 w-3 text-kultur-gold/80" aria-hidden />
              {t('sidebar.pinned')}
            </p>
            <ul className="space-y-0.5">
              {pinned.map((m) => (
                <MunicipalityItem
                  key={m.code}
                  name={m.name}
                  region={regionLabel(m.region)}
                  rank={getCulturalIndex(m.name)}
                  isSelected={selectedMunicipality === m.name}
                  onSelect={() => {
                    setSelectedMunicipality(m.name)
                    onMunicipalitySelect?.()
                  }}
                  pinned
                />
              ))}
            </ul>
          </div>
        )}

        {rankedRest.length > 0 && (
          <div>
            {!query && (
              <p className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-kultur-muted">
                {t('sidebar.all')}
              </p>
            )}
            <ul className="space-y-0.5">
              {rankedRest.map((m, index) => (
                <MunicipalityItem
                  key={m.code}
                  name={m.name}
                  region={regionLabel(m.region)}
                  rank={index + 1}
                  isSelected={selectedMunicipality === m.name}
                  onSelect={() => {
                    setSelectedMunicipality(m.name)
                    onMunicipalitySelect?.()
                  }}
                />
              ))}
            </ul>
          </div>
        )}

        {pinned.length === 0 && rankedRest.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-kultur-muted">
            {t('sidebar.noResults', { query })}
          </p>
        )}
      </nav>
    </aside>
  )
}

interface MunicipalityItemProps {
  name: string
  region: string
  rank: number
  isSelected: boolean
  onSelect: () => void
  pinned?: boolean
}

function MunicipalityItem({
  name,
  region,
  rank,
  isSelected,
  onSelect,
  pinned,
}: MunicipalityItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`flex min-h-11 w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
          isSelected
            ? 'border-kultur-clay/30 bg-kultur-clay/10 text-kultur-text'
            : 'border-transparent text-kultur-subtle hover:border-kultur-border/60 hover:bg-kultur-raised/40'
        }`}
        aria-current={isSelected ? 'true' : undefined}
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold tabular-nums ${
            isSelected
              ? 'bg-kultur-clay/20 text-kultur-clay'
              : 'bg-kultur-raised text-kultur-muted'
          }`}
        >
          {pinned ? <MapPin className="h-3 w-3" /> : rank}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{name}</span>
          <span className="block truncate text-[11px] text-kultur-muted">
            {region}
          </span>
        </span>
      </button>
    </li>
  )
}
