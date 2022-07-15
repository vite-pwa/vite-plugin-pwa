import { basename, resolve } from 'path'
import { existsSync, promises as fs, mkdirSync } from 'fs'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { generateSimpleSWRegister, injectServiceWorker } from '../html'
import { generateWebManifestFile } from '../assets'
import {
  DEV_SW_NAME,
  FILE_SW_REGISTER,
  VIRTUAL_MODULES_RESOLVE_PREFIX,
  VITE_PWA_PLUGIN_NAMES,
} from '../constants'
import type { ResolvedVitePWAOptions } from '../types'
import { generateServiceWorker } from '../modules'
import { normalizePath } from '../utils'
import type { PWAPluginContext } from '../context'

const DEV_SW_VIRTUAL = `${VIRTUAL_MODULES_RESOLVE_PREFIX}pwa-entry-point-loaded`
const DEV_READY_NAME = 'vite-pwa-plugin:dev-ready'
const DEV_REGISTER_SW_NAME = 'vite-plugin-pwa:register-sw'

export const swDevOptions = {
  swUrl: DEV_SW_NAME,
  swDevGenerated: false,
  workboxPaths: new Map<string, string>(),
}

export function DevPlugin(ctx: PWAPluginContext): Plugin {
  return <Plugin>{
    name: VITE_PWA_PLUGIN_NAMES.DEV,
    apply: 'serve',
    transformIndexHtml: {
      enforce: 'post',
      async transform(html) {
        const { options } = ctx
        if (options.disable || !options.manifest || !options.devOptions.enabled)
          return html

        html = injectServiceWorker(html, options, true)

        return html.replace(
          '</body>',
            `<script type="module" src="${DEV_SW_VIRTUAL}"></script></body>`,
        )
      },
    },
    configureServer(server) {
      const { options } = ctx
      if (!options.disable && options.manifest && options.devOptions.enabled) {
        server.ws.on(DEV_READY_NAME, createSWResponseHandler(server, ctx))
        const name = options.devOptions.webManifestUrl ?? `${options.base}${options.manifestFilename}`
        server.middlewares.use((req, res, next) => {
          if (req.url === name) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/manifest+json')
            res.write(generateWebManifestFile(options), 'utf-8')
            res.end()
          }
          else {
            next()
          }
        })
      }
    },
    resolveId(id) {
      if (id === DEV_SW_VIRTUAL)
        return id

      const { options } = ctx
      if (!options.disable && options.devOptions.enabled && options.strategies === 'injectManifest' && !options.selfDestroying) {
        const name = id.startsWith('/') ? id.slice(1) : id
        // the sw must be registered with .js extension on browser, here we detect that request:
        // - the .js file and source with .ts, or
        // - the .ts source file
        // in both cases we need to resolve the id to the source file to load it and add empty injection point on loadDev
        // we need tom always return the path to source file name to resolve imports on the sw
        return name === swDevOptions.swUrl || name === options.injectManifest.swSrc
          ? options.injectManifest.swSrc
          : undefined
      }

      return undefined
    },
    async load(id) {
      if (id === DEV_SW_VIRTUAL)
        return generateSWHMR()

      const { options, viteConfig } = ctx
      if (!options.disable && options.devOptions.enabled) {
        if (options.strategies === 'injectManifest' && !options.selfDestroying) {
          // we need to inject self.__WB_MANIFEST with an empty array: there is no pwa on dev
          const swSrc = normalizePath(options.injectManifest.swSrc)
          if (id === swSrc) {
            let content = await fs.readFile(options.injectManifest.swSrc, 'utf-8')
            const resolvedIP = options.injectManifest.injectionPoint
            if (resolvedIP) {
              const ip = new RegExp(resolvedIP, 'g')
              const navigateFallback = options.devOptions.navigateFallback
              // we only add the navigateFallback if using registerRoute for offline support on custom sw
              if (navigateFallback)
                content = content.replace(ip, `[{ url: '${navigateFallback}' }]`)
              else
                content = content.replace(ip, '[]')
            }
            return content
          }

          return undefined
        }
        if (id.endsWith(swDevOptions.swUrl)) {
          const globDirectory = resolve(viteConfig.root, 'dev-dist')
          if (!existsSync(globDirectory))
            mkdirSync(globDirectory)

          const swDest = resolve(globDirectory, 'sw.js')
          if (!swDevOptions.swDevGenerated || !existsSync(swDest)) {
            // we only need to generate sw on dev-dist folder and then read the content
            // the sw precache (self.__SW_MANIFEST) will be empty since we're using `dev-dist` folder
            // we only need to add the navigateFallback if configured
            const navigateFallback = options.workbox.navigateFallback
            // we need to exclude the manifest.webmanifest from the sw precache: avoid writing it to the dev-dist folder
            const webManifestUrl = options.devOptions.webManifestUrl ?? `${options.base}${options.manifestFilename}`
            const { filePaths } = await generateServiceWorker(
              Object.assign(
                {},
                options,
                {
                  swDest: options.selfDestroying ? swDest : options.swDest,
                  workbox: {
                    ...options.workbox,
                    navigateFallbackDenylist: [new RegExp(`^${webManifestUrl}$`)],
                    runtimeCaching: options.devOptions.disableRuntimeConfig ? undefined : options.workbox.runtimeCaching,
                    // we only include navigateFallback
                    additionalManifestEntries: navigateFallback ? [navigateFallback] : undefined,
                    cleanupOutdatedCaches: true,
                    globDirectory: globDirectory.replace(/\\/g, '/'),
                    swDest: swDest.replace(/\\/g, '/'),
                  },
                },
              ),
              viteConfig,
            )
            // we store workbox dependencies, and so we can then resolve them when requested: at least workbox-**.js
            filePaths.forEach((we) => {
              const name = basename(we)
              // we exclude the sw itself
              if (name !== 'sw.js')
                swDevOptions.workboxPaths.set(normalizePath(`${options.base}${name}`), we)
            })
            swDevOptions.swDevGenerated = true
          }
          return await fs.readFile(swDest, 'utf-8')
        }

        if (swDevOptions.workboxPaths.has(id))
          return await fs.readFile(swDevOptions.workboxPaths.get(id)!, 'utf-8')
      }
    },
  }
}

async function createDevRegisterSW(options: ResolvedVitePWAOptions, viteConfig: ResolvedConfig) {
  if (options.injectRegister === 'script') {
    const devDist = resolve(viteConfig.root, 'dev-dist')
    if (!existsSync(devDist))
      mkdirSync(devDist)

    const registerSW = resolve(devDist, FILE_SW_REGISTER)
    if (existsSync(registerSW))
      return

    await fs.writeFile(registerSW, generateSimpleSWRegister(options, true), { encoding: 'utf8' })
    swDevOptions.workboxPaths.set(normalizePath(`${options.base}${FILE_SW_REGISTER}`), registerSW)
  }
}

function createSWResponseHandler(server: ViteDevServer, ctx: PWAPluginContext): () => Promise<void> {
  return async () => {
    const { options, useImportRegister } = ctx
    const { injectRegister, scope, base } = options
    // don't send the sw registration if virtual imported or disabled
    if (!useImportRegister && injectRegister) {
      if (injectRegister === 'auto')
        options.injectRegister = 'script'

      await createDevRegisterSW(options, ctx.viteConfig)

      server.ws.send({
        type: 'custom',
        event: DEV_REGISTER_SW_NAME,
        data: {
          inline: options.injectRegister === 'inline',
          scope,
          inlinePath: `${base}${DEV_SW_NAME}`,
          registerPath: `${base}${FILE_SW_REGISTER}`,
        },
      })
    }
  }
}

function generateSWHMR() {
  return `import.meta.hot.on('${DEV_REGISTER_SW_NAME}', ({ inline, inlinePath, registerPath, scope }) => {
  if (inline) {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register(inlinePath, { scope });
    }
  }
  else {
    const registerSW = document.createElement('script');
    registerSW.setAttribute('src', registerPath);
    document.head.appendChild(registerSW);
  }
});

try {
  import.meta.hot.send('${DEV_READY_NAME}');
} catch (e) {
  console.error('unable to send ${DEV_READY_NAME} message to register service worker in dev mode!', e);
}`
}

