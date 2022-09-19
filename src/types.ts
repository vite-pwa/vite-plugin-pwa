import type { ResolvedConfig } from 'vite'
import type { GenerateSWOptions, InjectManifestOptions, ManifestEntry } from 'workbox-build'
import type { OutputBundle } from 'rollup'

export type InjectManifestVitePlugins = string[] | ((vitePluginIds: string[]) => string[])
export type CustomInjectManifestOptions = InjectManifestOptions & {
  /**
   * Configure the format to use in the Rollup build.
   *
   * @default 'es'
   */
  rollupFormat?: 'es' | 'iife'
  /**
   * `Vite` plugin ids to use on `Rollup` build.
   *
   * **WARN**: this option is for advanced usage, beware, you can break the service worker build.
   */
  vitePlugins?: InjectManifestVitePlugins
}

export interface PWAIntegration {
  closeBundleOrder?: 'pre' | 'post' | null
  configureOptions?: (
    viteOptions: ResolvedConfig,
    options: Partial<VitePWAOptions>,
  ) => void | Promise<void>
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
   * Vite PWA Integration.
   */
  integration?: PWAIntegration
  /**
   * Development options.
   */
  devOptions?: DevOptions
  /**
   * Unregister the service worker?
   *
   * @default false
   */
  selfDestroying?: boolean
}

export interface ResolvedVitePWAOptions extends Required<VitePWAOptions> {
  swSrc: string
  swDest: string
  workbox: GenerateSWOptions
  injectManifest: InjectManifestOptions
  rollupFormat: 'es' | 'iife'
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
   *
   */
  file_handlers: Record<string, any>[]
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
   * @default []
   */
  display_override: string[]
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

export interface WebManifestData {
  href: string
  useCredentials: boolean
  /**
   * Returns the corresponding link tag: `<link rel="manifest" href="<webManifestUrl>" />`.
   */
  toLinkTag: () => string
}

export interface RegisterSWData {
  shouldRegisterSW: boolean
  /**
   * When this flag is `true` the service worker must be registered via inline script otherwise registered via script with src attribute `registerSW.js` .
   */
  inline: boolean
  /**
   * The path for the inline script: will contain the service worker url.
   */
  inlinePath: string
  /**
   * The path for the src script for `registerSW.js`.
   */
  registerPath: string
  /**
   * The scope for the service worker: only required for `inline: true`.
   */
  scope: string
  /**
   * The type for the service worker: only required for `inline: true`.
   */
  type: WorkerType
  /**
   * Returns the corresponding script tag if `shouldRegisterSW` returns `true`.
   */
  toScriptTag: () => string | undefined
}

export interface VitePluginPWAAPI {
  /**
   * Is the plugin disabled?
   */
  disabled: boolean
  /**
   * Running on dev server?
   */
  pwaInDevEnvironment: boolean
  /**
   * Returns the PWA webmanifest url for the manifest link:
   * <link rel="manifest" href="<webManifestUrl>" />
   *
   * Will also return if the manifest will require credentials:
   * <link rel="manifest" href="<webManifestUrl>" crossorigin="use-credentials" />
   */
  webManifestData(): WebManifestData | undefined
  /**
   * How the service worker is being registered in the application.
   *
   * This option will help some integrations to inject the corresponding script in the head.
   */
  registerSWData(): RegisterSWData | undefined
  extendManifestEntries(fn: ExtendManifestEntriesHook): void
  /*
   * Explicitly generate the manifests.
   */
  generateBundle(bundle?: OutputBundle): OutputBundle | undefined
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
   * This option will allow you to configure the `navigateFallback` when using `registerRoute` for `offline` support:
   * configure here the corresponding `url`, for example `navigateFallback: 'index.html'`.
   *
   * **WARNING**: this option will only be used when using `injectManifest` strategy.
   */
  navigateFallback?: string

  /**
   * This option will allow you to configure the `navigateFallbackAllowlist`: new option from version `v0.12.4`.
   *
   * Since we need at least the entry point in the service worker's precache manifest, we don't want the rest of the assets to be intercepted by the service worker.
   *
   * If you configure this option, the plugin will use it instead the default.
   *
   * **WARNING**: this option will only be used when using `generateSW` strategy.
   *
   * @default [/^\/$/]
   */
  navigateFallbackAllowlist?: RegExp[]

  /**
   * On dev mode the `manifest.webmanifest` file can be on other path.
   *
   * For example, **SvelteKit** will request `/_app/manifest.webmanifest`, when `webmanifest` added to the output bundle, **SvelteKit** will copy it to the `/_app/` folder.
   *
   * **WARNING**: this option will only be used when using `generateSW` strategy.
   *
   * @default `${vite.base}${pwaOptions.manifestFilename}`
   * @deprecated This option has been deprecated from version `v0.12.4`, the plugin will use navigateFallbackAllowlist instead.
   * @see navigateFallbackAllowlist
   */
  webManifestUrl?: string
}
