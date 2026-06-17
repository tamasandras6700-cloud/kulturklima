import { MunicipalityProvider } from './context/MunicipalityContext'
import { CulturalDataProvider } from './context/CulturalDataContext'
import { ViewModeProvider } from './context/ViewModeContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { Dashboard } from './components/dashboard/Dashboard'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  return (
    <LanguageProvider>
      <MunicipalityProvider>
        <CulturalDataProvider>
          <ViewModeProvider>
            <Dashboard />
            <Analytics />
            <SpeedInsights />
          </ViewModeProvider>
        </CulturalDataProvider>
      </MunicipalityProvider>
    </LanguageProvider>
  )
}

export default App
