import type { BuildOptions, InlineConfig, Plugin, ResolvedConfig, UserConfig } from 'vite'
import type { GenerateSWOptions, InjectManifestOptions, ManifestEntry } from 'workbox-build'
import type { OutputBundle, RollupOptions } from 'rollup'
import type { BuiltInPreset, Preset } from '@vite-pwa/assets-generator/config'
import type { HtmlLinkPreset } from '@vite-pwa/assets-generator/api'
import type { PWAAssetsGenerator } from './pwa-assets/types'

export type InjectManifestVitePlugins = string[] | ((vitePluginIds: string[]) => string[])
export type CustomInjectManifestOptions = InjectManifestOptions & {
  /**
   * Configure the format to use in the Rollup build.
   *
   * @default 'es'
   */
  rollupFormat?: 'es' | 'iife'
  /**
   * Configure the custom Vite build target option.
   *
   * @default Vite build target option
   * @since v0.18.0
   */
  target?: BuildOptions['target']
  /**
   * Configure the custom Vite build minify option.
   *
   * @default Vite build minify option
   * @since v0.18.0
   */
  minify?: BuildOptions['minify']
  /**
   * Configure the custom Vite build sourcemap option.
   *
   * @default Vite build sourcemap option
   * @since v0.18.0
   */
  sourcemap?: BuildOptions['sourcemap']
  /**
   * Should use `process.env.NODE_ENV` to remove dead code?
   *
   * If you want to keep logs from `workbox` modules, you can set this option to `true`,
   * the plugin will configure `process.env.NODE_ENV` to `"development"`.
   *
   * If this option is not configured, the plugin will use `process.env.NODE_ENV`.
   *
   * @default `process.env.NODE_ENV === 'production'`
   * @since v0.18.0
   */
  enableWorkboxModulesLogs?: true
  /**
   * `Vite` plugin ids to use on `Rollup` build.
   *
   * **WARN**: this option is for advanced usage, beware, you can break your application build.
   *
   * @deprecated use `plugins` instead
   */
  vitePlugins?: InjectManifestVitePlugins
  /**
   * Since `v0.15.0` you can add plugins to build your service worker.
   *
   * When using `injectManifest` there are 2 builds, your application and the service worker.
   * If you're using custom configuration for your service worker (for example custom plugins) you can use this option to configure the service worker build.
   * Both configurations cannot be shared, and so you'll need to duplicate the configuration, with the exception of `define`.
   *
   * **WARN**: this option is for advanced usage, beware, you can break your application build.
   *
   * This option will be ignored if `buildPlugins.rollup` is configured.
   *
   * @deprecated use `buildPlugins` instead
   */
  plugins?: Plugin[]
  /**
   * Since `v0.18.0` you can add custom Rollup and/or Vite plugins to build your service worker.
   *
   * **WARN**: don't share plugins between the application and the service worker build, you need to include new plugins for each configuration.
   *
   * If you are using `plugins` option, use this option to configure the Rollup plugins or move them to `vite` option.
   *
   * **WARN**: this option is for advanced usage, beware, you can break your application build.
   */
  buildPlugins?: {
    rollup?: RollupOptions['plugins']
    vite?: UserConfig['plugins']
  }
  /**
   * Since `v0.15.0` you can add custom Rollup options to build your service worker: we expose the same configuration to build a worker using Vite.
   */
  rollupOptions?: Omit<RollupOptions, 'plugins' | 'output'>

  /**
   * Environment options.
   *
   * @since v0.19.6
   */
  envOptions?: {
    /**
     * Configure Vite `envDir` option.
     *
     * @default Vite `envDir`.
     */
    envDir?: UserConfig['envDir']
    /**
     * Configure Vite `envPrefix` option.
     *
     * @default Vite `envPrefix`.
     */
    envPrefix?: UserConfig['envPrefix']
  }
}

export interface PWAIntegration {
  beforeBuildServiceWorker?: (options: ResolvedVitePWAOptions) => void | Promise<void>
  closeBundleOrder?: 'pre' | 'post' | null
  configureOptions?: (
    viteOptions: ResolvedConfig,
    options: Partial<VitePWAOptions>,
  ) => void | Promise<void>
  /**
   * Allow integrations to configure Vite options for custom service worker build.
   *
   * @param options Vite options for custom service worker build.
   * @see src/vite-build.ts module
   * @since v0.19.6
   */
  configureCustomSWViteBuild?: (options: InlineConfig) => void | Promise<void>
}

/**
 * PWA assets generation and injection options.
 */
export interface PWAAssetsOptions {
  disabled?: boolean
  /**
   * PWA assets generation and injection.
   *
   * By default, the plugin will search for the pwa assets generator configuration file in the root directory of your project:
   * - pwa-assets.config.js
   * - pwa-assets.config.mjs
   * - pwa-assets.config.cjs
   * - pwa-assets.config.ts
   * - pwa-assets.config.cts
   * - pwa-assets.config.mts
   *
   * If using a string path, it should be relative to the root directory of your project.
   *
   * Setting to `false` will disable config resolving.
   *
   * **WARNING**: You can use only one image in the configuration file.
   *
   * @default false
   * @see https://vite-pwa-org.netlify.app/assets-generator/cli.html#configurations
   */
  config?: string | boolean
  /**
   * Preset to use.
   *
   * If the `config` option is enabled, this option will be ignored.
   *
   * Setting this option `false` will disable PWA assets generation (if the `config` option is also disabled).
   *
   * @default 'minimal-2023'
   */
  preset?: false | BuiltInPreset | Preset
  /**
   * Path relative to `root` folder where to find the image to use for generating PWA assets.
   *
   * If the `config` option is enabled, this option will be ignored.
   *
   * @default `public/favicon.svg`
   */
  image?: string
  /**
   * The preset to use for head links (favicon links).
   *
   * If the `config` option is enabled, this option will be ignored.
   *
   * @see https://vite-pwa-org.netlify.app/assets-generator/#preset-minimal-2023
   * @see https://vite-pwa-org.netlify.app/assets-generator/#preset-minimal
   * @default '2023'
   */
  htmlPreset?: HtmlLinkPreset
  /**
   * Should the plugin include html head links?
   *
   * @default true
   */
  includeHtmlHeadLinks?: boolean
  /**
   * Should the plugin override the PWA web manifest icons' entry?
   *
   * The plugin will auto-detect the icons from the manifest, if missing, then the plugin will ignore this option and will include the icons.
   *
   * @default false
   */
  overrideManifestIcons?: boolean
  /**
   * Should the PWA web manifest `theme_color` be injected in the html head?
   *
   * @default true
   */
  injectThemeColor?: boolean
  /**
   * PWA Assets integration support.
   *
   * This option should be only used by integrations, it is not meant to be used by end users.
   */
  integration?: {
    /**
     * The base url for the PWA assets.
     *
     * @default `vite.base`
     */
    baseUrl?: string
    /**
     * The public directory to resolve the image: should be an absolute path.
     *
     * @default `vite.root/vite.publicDir`
     */
    publicDir?: string
    /**
     * The output directory: should be an absolute path.
     *
     * @default `vite.root/vite.build.outDir`
     */
    outDir?: string
  }
}

export interface ResolvedPWAAssetsOptions extends Required<Omit<PWAAssetsOptions, 'image' | 'integration'>> {
  integration?: PWAAssetsOptions['integration']
  images: string[]
}

/**
 * Plugin options.
 */
export interface VitePWAOptions {
  /**
   * Build mode.
   *
   * From `v0.18.0` this option is ignored when using `injectManifest` strategy:
   * - the new Vite build will use the same mode as the application when using `injectManifest` strategy.
   * - if you don't want to minify your service worker, configure `injectManifest.minify = false` in your PWA configuration.
   * - if you want the sourcemap only for the service worker, configure `injectManifest.sourcemap = true` in your PWA configuration.
   * - if you want workbox logs in your service worker when using production build, configure `injectManifest.enableWorkboxModulesLogs = true` in your PWA configuration.
   * - you can use `import.meta.env.MODE` to access the Vite mode inside your service worker.
   * - you can use `import.meta.env.DEV` or `import.meta.env.PROD` to check if the service worker is
   *   running on development or production (equivalent to `process.env.NODE_ENV`),
   *   check Vite [NODE_ENV and Modes](https://vitejs.dev/guide/env-and-mode#node-env-and-modes) docs.
   *
   * @see https://vitejs.dev/guide/env-and-mode#node-env-and-modes
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
   * `script` - inject `<script/>` in `<head>` with `src` attribute to a generated script to register the service worker
   *
   * `script-defer` - inject `<script defer />` in `<head>`, with `src` attribute to a generated script to register the service worker
   *
   * `null` - deprecated, use `false` instead
   *
   * `false` - do nothing, you will need to register the sw you self, or imports from `virtual:pwa-register`
   *
   * @default 'auto'
   */
  injectRegister: 'inline' | 'script' | 'script-defer' | 'auto' | null | false
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
  /**
   * When Vite's build folder is not the same as your base root folder, configure it here.
   *
   * This option will be useful for integrations like `vite-plugin-laravel` where Vite's build folder is `public/build` but Laravel's base path is `public`.
   *
   * This option will be used to configure the path for the `service worker`, `registerSW.js` and the web manifest assets.
   *
   * For example, if your base path is `/`, then, in your Laravel PWA configuration use `buildPath: '/build/'`.
   *
   * @default `vite.base`.
   */
  buildBase?: string

  /**
   * PWA assets generation and injection.
   *
   * @experimental
   */
  pwaAssets?: PWAAssetsOptions
}

export interface ResolvedServiceWorkerOptions {
  format: 'es' | 'iife'
  plugins?: Plugin[]
  rollupOptions: RollupOptions
}

export interface ResolvedVitePWAOptions extends Required<Omit<VitePWAOptions, 'pwaAssets'>> {
  swSrc: string
  swDest: string
  workbox: GenerateSWOptions
  injectManifest: InjectManifestOptions
  rollupFormat: 'es' | 'iife'
  vitePlugins: InjectManifestVitePlugins
  buildPlugins?: CustomInjectManifestOptions['buildPlugins']
  injectManifestRollupOptions: ResolvedServiceWorkerOptions
  injectManifestBuildOptions: {
    target?: BuildOptions['target']
    minify?: BuildOptions['minify']
    sourcemap?: BuildOptions['sourcemap']
    enableWorkboxModulesLogs?: true
  }
  injectManifestEnvOptions: {
    envDir: ResolvedConfig['envDir']
    envPrefix: ResolvedConfig['envPrefix']
  }
  pwaAssets: false | ResolvedPWAAssetsOptions
}

export interface ShareTargetFiles {
  name: string
  accept: string | string[]
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Manifest/launch_handler#launch_handler_item_values
 */
export type LaunchHandlerClientMode = 'auto' | 'focus-existing' | 'navigate-existing' | 'navigate-new'

export type Display = 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser'
export type DisplayOverride = Display | 'window-controls-overlay'
export type IconPurpose = 'monochrome' | 'maskable' | 'any'

interface Nothing {}

/**
 * type StringLiteralUnion<'maskable'> = 'maskable' | string
 * This has auto completion whereas `'maskable' | string` doesn't
 * Adapted from https://github.com/microsoft/TypeScript/issues/29729
 */
export type StringLiteralUnion<T extends U, U = string> = T | (U & Nothing)

/**
 * @see https://w3c.github.io/manifest/#manifest-image-resources
 */
export interface IconResource {
  sizes?: string
  src: string
  type?: string
  /**
   * **NOTE**: string values for backward compatibility with the old type.
   */
  purpose?: StringLiteralUnion<IconPurpose> | IconPurpose[]
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
   * @default []
   * @see https://developer.mozilla.org/en-US/docs/Web/Manifest/icons
   * @see https://w3c.github.io/manifest/#icons-member
   */
  icons: IconResource[]
  /**
   * @default []
   * @see https://developer.mozilla.org/en-US/docs/Web/Manifest/file_handlers
   * @see https://wicg.github.io/manifest-incubations/#file_handlers-member
   */
  file_handlers: {
    action: string
    accept: Record<string, string[]>
  }[]
  /**
   * @default `routerBase`
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
   * @see https://developer.mozilla.org/en-US/docs/Web/Manifest/display
   * @see https://w3c.github.io/manifest/#display-member
   */
  display: Display
  /**
   * @default []
   * @see https://developer.mozilla.org/en-US/docs/Web/Manifest/display_override
   * @see https://wicg.github.io/manifest-incubations/#display_override-member
   */
  display_override: DisplayOverride[]
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
   * @see https://developer.mozilla.org/en-US/docs/Web/Manifest/shortcuts
   * @see https://w3c.github.io/manifest/#shortcuts-member
   */
  shortcuts: {
    name: string
    short_name?: string
    url: string
    description?: string
    icons?: IconResource[]
  }[]
  /**
   * @default []
   * @see https://developer.mozilla.org/en-US/docs/Web/Manifest/screenshots
   */
  screenshots: {
    src: string
    sizes: string
    label?: string
    platform?: 'android' | 'ios' | 'kaios' | 'macos' | 'windows' | 'windows10x' | 'chrome_web_store' | 'play' | 'itunes' | 'microsoft-inbox' | 'microsoft-store' | string
    form_factor?: 'narrow' | 'wide'
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
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/Manifest/share_target
   * @see https://w3c.github.io/web-share-target/level-2/#share_target-member
   */
  share_target: {
    action: string
    method?: 'GET' | 'POST'
    enctype?: string
    params: {
      title?: string
      text?: string
      url?: string
      files?: ShareTargetFiles | ShareTargetFiles[]
    }
  }
  /**
   * @see https://github.com/WICG/pwa-url-handler/blob/main/handle_links/explainer.md#handle_links-manifest-member
   */
  handle_links?: 'auto' | 'preferred' | 'not-preferred'
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/Manifest/launch_handler#launch_handler_item_values
   */
  launch_handler?: {
    client_mode: LaunchHandlerClientMode | LaunchHandlerClientMode[]
  }
  /**
   * @see https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/sidebar#enable-sidebar-support-in-your-pwa
   */
  edge_side_panel?: {
    preferred_width?: number
  }
  /**
   * @see https://github.com/WICG/manifest-incubations/blob/gh-pages/scope_extensions-explainer.md
   * @default []
   */
  scope_extensions: {
    origin: string
  }[]
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
   * When this flag is `true` the service worker must be registered via inline script otherwise registered via script with src attribute `registerSW.js`.
   *
   * @deprecated From `v0.17.2` this flag is deprecated, use `mode` instead.
   */
  inline: boolean
  /**
   * When this flag is `inline` the service worker must be registered via inline script otherwise registered via script with src attribute `registerSW.js`.
   */
  mode: 'inline' | 'script' | 'script-defer'
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
   * Returns the PWA web manifest url for the manifest link:
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
  pwaAssetsGenerator(): Promise<PWAAssetsGenerator | undefined>
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
  /**
   * Where to store generated service worker in development when using `generateSW` strategy.
   *
   * Use it with caution, it should be used only by framework integrations.
   *
   * @default resolve(viteConfig.root, 'dev-dist')
   */
  resolveTempFolder?: () => string | Promise<string>
  /**
   * Suppress workbox-build warnings?.
   *
   * **WARNING**: this option will only be used when using `generateSW` strategy.
   * If enabled, `globPatterns` will be changed to `[*.js]` and a new empty `suppress-warnings.js` file will be created in `dev-dist` folder.
   *
   * @default false
   */
  suppressWarnings?: boolean
}
