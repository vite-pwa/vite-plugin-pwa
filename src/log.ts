/* eslint-disable no-console */
import { relative } from 'node:path'
import type { BuildResult } from 'workbox-build'
import type { ResolvedConfig } from 'vite'
import { cyan, dim, green, magenta, yellow } from 'kolorist'
import { version } from '../package.json'
import { normalizePath } from './utils'
import type { ResolvedVitePWAOptions } from './types'

export function logSWViteBuild(
  swName: string,
  viteOptions: ResolvedConfig,
  format: 'es' | 'iife',
) {
  const { logLevel = 'info' } = viteOptions
  if (logLevel === 'silent')
    return

  if (logLevel === 'info') {
    console.info([
      '',
      `${cyan(`PWA v${version}`)}`,
      `Building ${magenta(swName)} service worker ("${magenta(format)}" format)...`,
    ].join('\n'))
  }
}

export function logWorkboxResult(
  strategy: ResolvedVitePWAOptions['strategies'],
  buildResult: BuildResult,
  viteOptions: ResolvedConfig,
  format: 'es' | 'iife' | 'none' = 'none',
) {
  const { root, logLevel = 'info' } = viteOptions

  if (logLevel === 'silent')
    return

  const { count, size, filePaths, warnings } = buildResult

  if (logLevel === 'info') {
    const entries = [
      '',
      `${cyan(`PWA v${version}`)}`,
      `mode      ${magenta(strategy)}`,
    ]
    if (strategy === 'injectManifest')
      entries.push(`format:   ${magenta(format)}`)

    entries.push(
        `precache  ${green(`${count} entries`)} ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}`,
        'files generated',
        ...filePaths.map(p => `  ${dim(normalizePath(relative(root, p)))}`),
    )

    console.info(entries.join('\n'))
  }

  // log build warning
  warnings && warnings.length > 0 && console.warn(yellow([
    'warnings',
    ...warnings.map(w => `  ${w}`),
    '',
  ].join('\n')))
}
