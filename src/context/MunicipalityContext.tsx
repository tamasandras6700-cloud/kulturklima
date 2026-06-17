import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_MUNICIPALITY } from '../data/municipalities'

interface MunicipalityContextValue {
  selectedMunicipality: string
  setSelectedMunicipality: (name: string) => void
}

const MunicipalityContext = createContext<MunicipalityContextValue | null>(
  null,
)

export function MunicipalityProvider({ children }: { children: ReactNode }) {
  const [selectedMunicipality, setSelectedMunicipalityState] = useState(
    DEFAULT_MUNICIPALITY,
  )

  const setSelectedMunicipality = useCallback((name: string) => {
    setSelectedMunicipalityState(name)
  }, [])

  const value = useMemo(
    () => ({ selectedMunicipality, setSelectedMunicipality }),
    [selectedMunicipality, setSelectedMunicipality],
  )

  return (
    <MunicipalityContext.Provider value={value}>
      {children}
    </MunicipalityContext.Provider>
  )
}

export function useMunicipality() {
  const context = useContext(MunicipalityContext)
  if (!context) {
    throw new Error('useMunicipality must be used within MunicipalityProvider')
  }
  return context
}
