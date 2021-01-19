import { GenerateSWConfig, InjectManifestConfig } from 'workbox-build'

export interface ManifestOptions {
  /**
   * @default _npm_package_name_
   */
  name: string
  /**
   * @default _npm_package_name_
   */
  short_name: string
  /**
   * @default _npm_package_description_
   */
  description: string
  /**
   *
   */
  icons: Record<string, any>[]
  /**
   * @default `routerBase + '?standalone=true'`
   */
  start_url: string
  /**
   * Restricts what web pages can be viewed while the manifest is applied
   */
  scope: string
  /**
   * Defines the default orientation for all the website's top-level
   */
  orientation: 'any' | 'natural' | 'landscape' | 'landscape-primary' | 'landscape-secondary' | 'portrait' | 'portrait-primary' | 'portrait-secondary'
  /**
   * @default `standalone`
   */
  display: string
  /**
   * @default `#ffffff`
   */
  background_color: string
  /**
   * @default '#42b883
   */
  theme_color: string
  /**
   * @default `ltr`
   */
  dir: 'ltr' | 'rtl'
  /**
   * @default `en`
   */
  lang: string
  /**
   * @default A combination of `routerBase` and `options.build.publicPath`
   */
  publicPath: string
}

/**
 * Plugin options.
 */
export interface VitePWAOptions {
  /**
   * @default 'public'
   */
  srcDir?: string
  /**
   * @default 'dist'
   */
  outDir?: string
  /**
   * @default 'sw.js'
   */
  filename?: string
  /**
   * @default 'generateSW'
   */
  strategies?: 'generateSW' | 'injectManifest'
  /**
   * Inject the service worker register inlined in the index.html
   *
   * @default true
   */
  inlineRegister: boolean
  /**
   * The manifest object
   */
  manifest: Partial<ManifestOptions>
  /**
   * The workbox object for `generateSW`
   */
  workbox: Partial<GenerateSWConfig>
  /**
   * The workbox object for `injectManifest`
   */
  injectManifest: Partial<InjectManifestConfig>
}

export interface ResolvedVitePWAOptions extends Required<VitePWAOptions> {
  swDest: string
  manifest: Partial<ManifestOptions>
  inlineRegister: boolean
  workbox: GenerateSWConfig
  injectManifest: InjectManifestConfig
  basePath: string
}
