export type State = 'initial' | 'result'
export type FrameworkType =
    | 'vitepress'
    | 'iles'
    | 'astro'
    | 'vue'
    | 'react'
    | 'preact'
    | 'solid'
    | 'svelte'
    | 'svelteKit'
    | 'javascript'
    | 'typescript'
    | undefined
export type StrategyType = 'generateSW' | 'injectManifest' | undefined
export type BehaviorType = 'prompt' | 'autoUpdate' | undefined
export type InjectRegisterType = 'inline' | 'script' | undefined
export type FaviconType = 'ico' | 'svg' | 'both'
export type YesNoType = 'true' | 'false' | undefined

export interface BuilderError {
  key: string
  text: string
  focus: () => void
}

export interface RadioData<T> {
  value: T
  text: string
  disabled?: boolean
}

export interface ValidationResult {
  isValid: boolean
  message?: string
}

export interface BuilderElement {
  key: string
  focus: () => void
  validate: () => Promise<BuilderError[]>
  isValid: () => boolean
  withState: (withError: boolean, focusInput: boolean) => void
}

export interface PWABuilderResult {
  loading: boolean
  enabled: boolean
  code?: string
}

export interface PWABuilderData {
  title: string
  shortName?: string
  description: string
  themeColor: string
  strategy: 'generateSW' | 'injectManifest'
  behavior: 'prompt' | 'autoUpdate'
  registerType: 'inline' | 'script'
  framework: FrameworkType
  scope: string
  startUrl?: string
  addManifestMaskedIcon: boolean
  favicon: FaviconType
}
