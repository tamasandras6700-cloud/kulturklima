/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DST_API_BASE?: string
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.jsx' {
  import type { ComponentType } from 'react'
  const Component: ComponentType<Record<string, unknown>>
  export default Component
}
