import { useEffect, useId, useRef, useState } from 'react'
import { Info } from 'lucide-react'

interface MetricInfoTooltipProps {
  text: string
  label?: string
}

export function MetricInfoTooltip({ text, label }: MetricInfoTooltipProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLSpanElement>(null)
  const tooltipId = useId()

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const visible = open

  return (
    <span ref={rootRef} className="group/info relative inline-flex align-middle">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="-my-2 ml-1 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-kultur-muted transition-colors hover:text-kultur-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kultur-ink/40"
        aria-label={label ?? text}
        aria-expanded={open}
        aria-describedby={visible ? tooltipId : undefined}
      >
        <Info className="h-4 w-4" aria-hidden />
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 w-56 -translate-x-1/2 rounded-lg border border-kultur-border bg-kultur-raised px-3 py-2 text-left text-xs leading-relaxed text-kultur-subtle shadow-lg transition-opacity duration-200 sm:w-64 ${
          visible
            ? 'opacity-100'
            : 'opacity-0 group-hover/info:opacity-100 group-focus-within/info:opacity-100'
        }`}
      >
        {text}
        <span
          aria-hidden
          className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-kultur-border"
        />
        <span
          aria-hidden
          className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-kultur-raised"
          style={{ marginTop: '-1px' }}
        />
      </span>
    </span>
  )
}
