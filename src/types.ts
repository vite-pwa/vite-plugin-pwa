/* eslint-disable no-use-before-define */
import type { GenerateSWOptions, InjectManifestOptions, ManifestEntry } from 'workbox-build'
import type { OutputBundle } from 'rollup'

export type InjectManifestVitePlugins = string[] | ((vitePluginIds: string[]) => string[])
export type CustomInjectManifestOptions = InjectManifestOptions & {
  /**
   * `Vite` plugin ids to use on `Rollup` build.
   *
   * **WARN**: this option is for advanced usage, beware, you can break the service worker build.
   */
  vitePlugins?: InjectManifestVitePlugins
}

/**
 * Plugin options.
 */
export interface VitePWAOptions {
  /**
   * Build mode
   *
   * @default process.env.NODE_ENV or "production"
   */
  mode?: 'development' | 'production'
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
   * @default 'manifest.webmanifest'
   */
  manifestFilename?: string
  /**
   * @default 'generateSW'
   */
  strategies?: 'generateSW' | 'injectManifest'
  /**
   * The scope to register the Service Worker
   *
   * @default same as `base` of Vite's config
   */
  scope?: string
  /**
   * Inject the service worker register inlined in the index.html
   *
   * With `auto` set, depends on whether you used the `import { registerSW } from 'virtual:pwa-register'`
   * it will do nothing or use the `script` mode
   *
   * `inline` - inject a simple register, inlined with the generated html
   *
   * `script` - inject <script/> in <head>, with the `sr` to a generated simple register
   *
   * `null` - do nothing, you will need to register the sw you self, or imports from `virtual:pwa-register`
   *
   * @default 'auto'
   */
  injectRegister: 'inline' | 'script' | 'auto' | null | false
  /**
   * Mode for the virtual register.
   * Does NOT available for `injectRegister` set to `inline` or `script`
   *
   * `prompt` - you will need to show a popup/dialog to the user to confirm the reload.
   *
   * `autoUpdate` - when new content is available, the new service worker will update caches and reload all browser
   * windows/tabs with the application open automatically, it must take the control for the application to work
   * properly.
   *
   * @default 'prompt'
   */
  registerType?: 'prompt' | 'autoUpdate'
  /**
   * Minify the generated manifest
   *
   * @default true
   */
  minify: boolean
  /**
   * The manifest object
   */
  manifest: Partial<ManifestOptions> | false
  /**
   * Whether to add the `crossorigin="use-credentials"` attribute to `<link rel="manifest">`
   * @default false
   */
  useCredentials?: boolean
  /**
   * The workbox object for `generateSW`
   */
  workbox: Partial<GenerateSWOptions>
  /**
   * The workbox object for `injectManifest`
   */
  injectManifest: Partial<CustomInjectManifestOptions>
  /**
   * Override Vite's base options only for PWA
   *
   * @default "base" options from Vite
   */
  base?: string
  /**
   * `public` resources to be added to the PWA manifest.
   *
   * You don't need to add `manifest` icons here, it will be auto included.
   *
   * The `public` directory will be resolved from Vite's `publicDir` option directory.
   */
  includeAssets: string | string[] | undefined
  /**
   * By default, the icons listed on `manifest` option will be included
   * on the service worker *precache* if present under Vite's `publicDir`
   * option directory.
   *
   * @default true
   */
  includeManifestIcons: boolean
  /**
   * Disable service worker registration and generation on `build`?
   *
   * @default false
   */
  disable: boolean
  /**
   * Development options.
   */
  devOptions?: DevOptions
}

export interface ResolvedVitePWAOptions extends Required<VitePWAOptions> {
  swSrc: string
  swDest: string
  workbox: GenerateSWOptions
  injectManifest: InjectManifestOptions
  vitePlugins: InjectManifestVitePlugins
}

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
   * A string that represents the identity for the application
   */
  id: string
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
  /**
   * @default []
   */
  related_applications: {
    platform: string
    url: string
    id?: string
  }[]
  /**
   * @default false
   */
  prefer_related_applications: boolean
  /**
   * @default []
   */
  protocol_handlers: {
    protocol: string
    url: string
  }[]
  /**
   * @default []
   */
  shortcuts: {
    name: string
    short_name?: string
    url: string
    description?: string
    icons: Record<string, any>[]
  }[]
  /**
   * @default []
   */
  screenshots: {
    src: string
    sizes: string
    label?: string
    platform?: 'narrow' | 'wide' | 'android' | 'ios' | 'kaios' | 'macos' | 'windows' | 'windows10x' | 'chrome_web_store' | 'play' | 'itunes' | 'microsoft-inbox' | 'microsoft-store' | string
    type?: string
  }[]
  /**
   * @default []
   */
  categories: string[]
  /**
   * @default ''
   */
  iarc_rating_id: string
}

export interface VitePluginPWAAPI {
  /**
   * Is the plugin disabled?
   */
  disabled: boolean
  extendManifestEntries(fn: ExtendManifestEntriesHook): void
  /*
   * Explicitly generate the manifests.
   */
  generateBundle(bundle?: OutputBundle): OutputBundle
  /*
   * Explicitly generate the PWA services worker.
   */
  generateSW(): Promise<void>
}

export type ExtendManifestEntriesHook = (manifestEntries: (string | ManifestEntry)[]) => (string | ManifestEntry)[] | undefined

/**
 * Development options.
 */
export interface DevOptions {
  /**
   * Should the service worker be available on development?.
   *
   * @default false
   */
  enabled?: boolean
  /**
   * The service worker type.
   *
   * @default 'classic'
   */
  type?: WorkerType
  /**
   * This option will enable you to not use the `runtimeConfig` configured on `workbox.runtimeConfig` plugin option.
   *
   * **WARNING**: this option will only be used when using `generateSW` strategy.
   *
   * @default false
   */
  disableRuntimeConfig?: boolean
  /**
   * This option will allow you to configure the `navigateFallback` when using `registerRoute` for `offline` support:,
   * configure here the corresponding `url`, for example `navigateFallback: 'index.html'`.
   *
   * **WARNING**: this option will only be used when using `injectManifest` strategy.
   */
  navigateFallback?: string
}
