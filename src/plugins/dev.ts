import { basename, resolve } from 'node:path'
import { existsSync, promises as fs, mkdirSync } from 'node:fs'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import {
  generateRegisterDevSW,
  generateSWHMR,
  generateSimpleSWRegister,
  injectServiceWorker,
} from '../html'
import { generateWebManifestFile } from '../assets'
import {
  DEV_READY_NAME,
  DEV_REGISTER_SW_NAME,
  DEV_SW_NAME,
  DEV_SW_VIRTUAL,
  FILE_SW_REGISTER,
  RESOLVED_DEV_SW_VIRTUAL,
} from '../constants'
import type { ResolvedVitePWAOptions } from '../types'
import { generateServiceWorker } from '../modules'
import { normalizePath } from '../utils'
import type { PWAPluginContext } from '../context'

export const swDevOptions = {
  swUrl: DEV_SW_NAME,
  swDevGenerated: false,
  workboxPaths: new Map<string, string>(),
}

export function DevPlugin(ctx: PWAPluginContext) {
  const transformIndexHtmlHandler = (html: string) => {
    const { options } = ctx
    if (options.disable || !options.manifest || !options.devOptions.enabled)
      return html

    html = injectServiceWorker(html, options, true)

    return html.replace(
      '</body>',
        `${generateRegisterDevSW(options.base)}
</body>`,
    )
  }

  return <Plugin>{
    name: 'vite-plugin-pwa:dev-sw',
    apply: 'serve',
    transformIndexHtml: {
      order: 'post',
      async handler(html) {
        return transformIndexHtmlHandler(html)
      },
      enforce: 'post', // deprecated since Vite 4
      async transform(html) { // deprecated since Vite 4
        return transformIndexHtmlHandler(html)
      },
    },
    configureServer(server) {
      ctx.devEnvironment = true
      const { options } = ctx
      if (!options.disable && options.manifest && options.devOptions.enabled) {
        server.ws.on(DEV_READY_NAME, createWSResponseHandler(server, ctx))
        const name = options.devOptions.webManifestUrl ?? `${options.base}${options.manifestFilename}`
        server.middlewares.use(async (req, res, next) => {
          if (req.url === name) {
            const assetsGenerator = await ctx.assets
            await assetsGenerator?.injectManifestIcons()
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
        return RESOLVED_DEV_SW_VIRTUAL

      const { options } = ctx
      if (!options.disable && options.devOptions.enabled && options.strategies === 'injectManifest' && !options.selfDestroying) {
        const name = id.startsWith('/') ? id.slice(1) : id
        // the sw must be registered with .js extension in the browser, here we detect that request:
        // - the .js file and source with .ts, or
        // - the .ts source file
        // in both cases we need to resolve the id to the source file to load it and add empty injection point on loadDev
        // we need to always return the path to source file name to resolve imports on the sw
        return (name === swDevOptions.swUrl || name === options.injectManifest.swSrc)
          ? options.injectManifest.swSrc
          : undefined
      }

      return undefined
    },
    async load(id) {
      if (id === RESOLVED_DEV_SW_VIRTUAL)
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

          if (swDevOptions.workboxPaths.has(id))
            return await fs.readFile(swDevOptions.workboxPaths.get(id)!, 'utf-8')

          return undefined
        }
        if (id.endsWith(swDevOptions.swUrl)) {
          const globDirectory = await resolveDevDistFolder(options, viteConfig)
          if (!existsSync(globDirectory))
            mkdirSync(globDirectory, { recursive: true })

          const swDest = resolve(globDirectory, 'sw.js')
          if (!swDevOptions.swDevGenerated || !existsSync(swDest)) {
            // add empty js file to suppress workbox-build warnings
            let suppressWarnings: string | undefined
            if (options.devOptions.suppressWarnings === true) {
              suppressWarnings = normalizePath(resolve(globDirectory, 'suppress-warnings.js'))
              await fs.writeFile(suppressWarnings, '', 'utf-8')
            }
            const globPatterns = options.devOptions.suppressWarnings === true
              ? ['*.js']
              : options.workbox.globPatterns
            // we only need to generate sw on dev-dist folder and then read the content
            // the sw precache (self.__SW_MANIFEST) will be empty since we're using `dev-dist` folder
            // we only need to add the navigateFallback if configured
            const navigateFallback = options.workbox.navigateFallback
            const { filePaths } = await generateServiceWorker(
              Object.assign(
                {},
                options,
                {
                  swDest: options.selfDestroying ? swDest : options.swDest,
                  workbox: {
                    ...options.workbox,
                    navigateFallbackAllowlist: options.devOptions.navigateFallbackAllowlist ?? [/^\/$/],
                    runtimeCaching: options.devOptions.disableRuntimeConfig ? undefined : options.workbox.runtimeCaching,
                    // we only include navigateFallback: add revision to remove workbox-build warning
                    additionalManifestEntries: navigateFallback
                      ? [{
                          url: navigateFallback,
                          revision: Math.random().toString(32),
                        }]
                      : undefined,
                    cleanupOutdatedCaches: true,
                    globDirectory: normalizePath(globDirectory),
                    globPatterns,
                    swDest: normalizePath(swDest),
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
            if (suppressWarnings) {
              swDevOptions.workboxPaths.set(
                normalizePath(`${options.base}${basename(suppressWarnings)}`),
                suppressWarnings,
              )
            }
            swDevOptions.swDevGenerated = true
          }
          return await fs.readFile(swDest, 'utf-8')
        }

        // check the entry only if the request starts with the base, otherwise ignore the request
        if (id.startsWith(options.base)) {
          const key = normalizePath(id)
          if (swDevOptions.workboxPaths.has(key))
            return await fs.readFile(swDevOptions.workboxPaths.get(key)!, 'utf-8')
        }
      }
    },
  }
}

async function resolveDevDistFolder(options: ResolvedVitePWAOptions, viteConfig: ResolvedConfig) {
  return options.devOptions.resolveTempFolder
    ? await options.devOptions.resolveTempFolder()
    : resolve(viteConfig.root, 'dev-dist')
}

async function createDevRegisterSW(options: ResolvedVitePWAOptions, viteConfig: ResolvedConfig) {
  if (options.injectRegister === 'script' || options.injectRegister === 'script-defer') {
    const devDist = await resolveDevDistFolder(options, viteConfig)
    if (!existsSync(devDist))
      mkdirSync(devDist)

    const registerSW = resolve(devDist, FILE_SW_REGISTER)
    if (existsSync(registerSW)) {
      // since we don't delete the dev-dist folder, we just add it if already exists
      if (!swDevOptions.workboxPaths.has(registerSW))
        swDevOptions.workboxPaths.set(normalizePath(`${options.base}${FILE_SW_REGISTER}`), registerSW)

      return
    }

    await fs.writeFile(registerSW, generateSimpleSWRegister(options, true), { encoding: 'utf8' })
    swDevOptions.workboxPaths.set(normalizePath(`${options.base}${FILE_SW_REGISTER}`), registerSW)
  }
}

function createWSResponseHandler(server: ViteDevServer, ctx: PWAPluginContext): () => Promise<void> {
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
          mode: options.injectRegister,
          scope,
          inlinePath: `${base}${DEV_SW_NAME}`,
          registerPath: `${base}${FILE_SW_REGISTER}`,
          swType: options.devOptions.type,
        },
      })
    }
  }
}
