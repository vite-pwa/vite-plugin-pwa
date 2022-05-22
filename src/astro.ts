import { fileURLToPath, pathToFileURL } from 'url'
import type { Plugin, UserConfig } from 'vite'
import { buildManifestEntry } from './assets'
import type { VitePluginPWAAPI } from './types'

interface AstroIntegration<T extends UserConfig> {
  name: string
  hooks: {
    'astro:config:done': (options: {
      config: { vite: T }
    }) => void
    'astro:build:done': (options: {
      dir: URL
      routes: {
        component: string
        pathname: string
        type: 'page' | undefined
      }[]
    }) => Promise<void>
  }
}

export const astroDontCacheBustURLsMatching = /\.[a-f0-9]{8,9}\./

export function astroIntegration<T extends UserConfig>(): AstroIntegration<T> {
  let pwaPlugin: Plugin | undefined
  const isWindows = process.platform === 'win32'
  const patchWindowsImportPath = (path: string) => {
    if (path.match(/^file:\/\/\/\w+:\//))
      return `/${path.slice(8)}`
    else
      return path
  }
  return {
    name: 'vite-plugin-pwa:astro:integration',
    hooks: {
      'astro:config:done': (options) => {
        const plugins = options.config.vite.plugins ?? []
        for (const p of plugins) {
          if (Array.isArray(p)) {
            pwaPlugin = p.find(p1 =>
              p1 && typeof p1 !== 'boolean'
                && !Array.isArray(p1)
                && p1.name === 'vite-plugin-pwa',
            ) as Plugin
            break
          }
        }
      },
      'astro:build:done': async ({ dir, routes }) => {
        // eslint-disable-next-line no-console
        const api: VitePluginPWAAPI | undefined = pwaPlugin?.api
        if (routes && api && !api.isDisabled()) {
          // disambiguate the `<UNIT>:/` on windows: see nodejs/node#31710
          let distFolder = patchWindowsImportPath(dir.href)
          if (isWindows && distFolder.startsWith('/'))
            distFolder = fileURLToPath(pathToFileURL(distFolder.slice(1)).href)
          // eslint-disable-next-line no-console
          console.log(distFolder)
          const addRoutes = await Promise.all(routes.filter(r => r.type === 'page').map((r) => {
            let path = r.component.slice(9, r.component.lastIndexOf('.'))
            // eslint-disable-next-line no-console
            console.log(path)
            path = path === '/index' ? '/index.html' : (path === r.pathname ? `${path}/index.html` : `${path}/`)
            // eslint-disable-next-line no-console
            console.log(`${path} => ${r.pathname}`)
            return buildManifestEntry(distFolder, r.pathname, path.slice(1))
          }))
          api.extendManifestEntries((manifestEntries) => {
            manifestEntries.push(...addRoutes)
            return manifestEntries
          })
          await api.generateSW()
        }
      },
    },
  }
}
