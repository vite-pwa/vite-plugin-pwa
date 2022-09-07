import { OutputBundle } from 'rollup'
import type { GenerateSWOptions, InjectManifestOptions, ManifestEntry } from 'workbox-build'
import type { InjectManifestVitePlugins as VitePlugins, VitePWAOptions as UserOptions } from '@vite-pwa/core'

export * from '@vite-pwa/core'

export interface ResolvedVitePWAOptions extends Required<UserOptions> {
  swSrc: string
  swDest: string
  workbox: GenerateSWOptions
  injectManifest: InjectManifestOptions
  vitePlugins: VitePlugins
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
  generateBundle(bundle?: OutputBundle): OutputBundle | undefined
  /*
   * Explicitly generate the PWA services worker.
   */
  generateSW(): Promise<void>
}

export type ExtendManifestEntriesHook = (manifestEntries: (string | ManifestEntry)[]) => (string | ManifestEntry)[] | undefined
