import { useEffect, useState } from 'react'
import { MapPin, X } from 'lucide-react'
import { Header } from '../layout/Header'
import { Sidebar } from '../layout/Sidebar'
import { Footer } from '../layout/Footer'
import { MainDisplay } from './MainDisplay'
import { useMunicipality } from '../../context/MunicipalityContext'
import { useLanguage } from '../../i18n/LanguageContext'

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { selectedMunicipality } = useMunicipality()
  const { t } = useLanguage()

  useEffect(() => {
    if (!sidebarOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [sidebarOpen])

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-kultur-canvas">
      <Header />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="hidden min-h-0 shrink-0 flex-col overflow-hidden lg:flex lg:h-full lg:w-72 xl:w-80">
          <Sidebar />
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <MainDisplay />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t('sidebar.title')}
        >
          <button
            type="button"
            className="absolute inset-0 bg-kultur-canvas/80 backdrop-blur-sm"
            onClick={closeSidebar}
            aria-label={t('sidebar.mobileClose')}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col border-r border-kultur-border bg-kultur-surface shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-kultur-border px-3 py-2">
              <span className="text-sm font-medium text-kultur-text">
                {t('sidebar.title')}
              </span>
              <button
                type="button"
                onClick={closeSidebar}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-kultur-muted transition-colors hover:bg-kultur-raised/60 hover:text-kultur-text"
                aria-label={t('sidebar.mobileClose')}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <Sidebar onMunicipalitySelect={closeSidebar} embedded />
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed right-4 z-40 inline-flex min-h-11 max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-kultur-clay/40 bg-kultur-surface/95 px-4 py-2.5 text-sm font-medium text-kultur-text shadow-lg backdrop-blur-sm transition-colors hover:border-kultur-clay/60 hover:bg-kultur-raised/80 lg:hidden"
        style={{ bottom: 'max(3.25rem, calc(0.75rem + env(safe-area-inset-bottom)))' }}
        aria-label={t('sidebar.mobileFab', { municipality: selectedMunicipality })}
      >
        <MapPin className="h-4 w-4 shrink-0 text-kultur-clay" aria-hidden />
        <span className="truncate">{selectedMunicipality}</span>
      </button>

      <Footer />
    </div>
  )
}
