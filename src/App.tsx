import { MunicipalityProvider } from './context/MunicipalityContext'
import { CulturalDataProvider } from './context/CulturalDataContext'
import { ViewModeProvider } from './context/ViewModeContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { Dashboard } from './components/dashboard/Dashboard'

function App() {
  return (
    <LanguageProvider>
      <MunicipalityProvider>
        <CulturalDataProvider>
          <ViewModeProvider>
            <Dashboard />
          </ViewModeProvider>
        </CulturalDataProvider>
      </MunicipalityProvider>
    </LanguageProvider>
  )
}

export default App
