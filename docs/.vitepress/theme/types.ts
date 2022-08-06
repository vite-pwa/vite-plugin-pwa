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
    | 'sveltekit'
    | 'javascript'
    | 'typescript'
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

export type CodeType = 'html' | 'js' | 'ts' | 'css' | 'vue' | 'jsx' | 'tsx' | 'svelte' | 'astro' | 'json'

export interface PWABuilderResult {
  title: string
  loading: boolean
  enabled: boolean
  code?: string
  codeType: CodeType
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
  typescript: boolean
  scope: string
  startUrl?: string
  addManifestMaskedIcon: boolean
  favicon: FaviconType
  generateFWComponent: boolean
  warnsUser: boolean
  periodicSWUpdates: boolean
  cleanupOldAssets: boolean
}

export type PWABuilderResultType =
    | 'entry-point'
    // | 'layout'
    | 'prompt-component'
    | 'prompt-css'
    | 'auto-sw'
    | 'prompt-sw'
    // | 'custom-config'
    | 'vite-config'
    | 'ts-config'
    | 'dts-config'

export interface PWABuilderGenerator {
  configure: (data: PWABuilderData) => void
  generate: (data: PWABuilderData) => [PWABuilderResultType, () => void][]
}
export type PWABuilderGeneratorModule = {
  default: PWABuilderGenerator
} | PWABuilderGenerator

