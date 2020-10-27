import { GenerateSWConfig } from 'workbox-build'

export interface ManifestOptions {
  /**
   * Default: _npm_package_name_
   */
  name: string
  /**
   * Default: _npm_package_name_
   */
  short_name: string
  /**
   * Default: _npm_package_description_
   */
  description: string
  /**
   *
   */
  icons: Record<string, any>[]
  /**
   * Default: `routerBase + '?standalone=true'`
   */
  start_url: string
  /**
   * Default: `standalone`
   */
  display: string
  /**
   * Default: `#ffffff`
   */
  background_color: string
  /**
   * Default: '#42b883
   */
  theme_color: string
  /**
   * Default: `ltr`
   */
  dir: 'ltr' | 'rtl'
  /**
   * Default: `en`
   */
  lang: string
  /**
   * Default: `false`
   */
  useWebmanifestExtension: boolean
  /**
   * Default: A combination of `routerBase` and `options.build.publicPath`
   */
  publicPath: string
}

/**
 * Plugin options.
 */
export interface VitePWAOptions {
  root?: string
  manifest: Partial<ManifestOptions>
  workbox: Partial<GenerateSWConfig>
}
