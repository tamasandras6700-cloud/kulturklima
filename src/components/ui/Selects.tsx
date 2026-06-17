import { ChevronDown } from 'lucide-react'

interface YearSelectProps {
  years: string[]
  value: string
  onChange: (year: string) => void
}

export function YearSelect({ years, value, onChange }: YearSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-nord-border bg-nord-elevated py-2 pr-9 pl-3 text-sm font-medium text-nord-text outline-none transition-colors hover:border-nord-muted/40 focus:border-nord-frost/50 focus:ring-2 focus:ring-nord-frost/20"
        aria-label="Vælg år"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-nord-muted"
        aria-hidden
      />
    </div>
  )
}

interface MunicipalitySelectProps {
  municipalities: { code: string; name: string }[]
  value: string
  onChange: (code: string) => void
}

export function MunicipalitySelect({
  municipalities,
  value,
  onChange,
}: MunicipalitySelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-nord-border bg-nord-elevated py-2 pr-9 pl-3 text-sm font-medium text-nord-text outline-none transition-colors hover:border-nord-muted/40 focus:border-nord-frost/50 focus:ring-2 focus:ring-nord-frost/20 sm:w-auto sm:min-w-[200px]"
        aria-label="Vælg kommune"
      >
        {municipalities.map((m) => (
          <option key={m.code} value={m.code}>
            {m.name}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-nord-muted"
        aria-hidden
      />
    </div>
  )
}
