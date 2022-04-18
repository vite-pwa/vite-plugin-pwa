/* eslint-disable no-console */
import { relative } from 'path'
import type { BuildResult } from 'workbox-build'
import type { ResolvedConfig } from 'vite'
import { cyan, dim, green, magenta, yellow } from 'kolorist'
import { version } from '../package.json'

export function logWorkboxResult(strategy: string, buildResult: BuildResult, viteOptions: ResolvedConfig) {
  const { root, logLevel = 'info' } = viteOptions

  if (logLevel === 'silent')
    return

  const { count, size, filePaths, warnings } = buildResult

  if (logLevel === 'info') {
    console.info([
      '',
      `${cyan(`PWA v${version}`)}`,
      `mode      ${magenta(strategy)}`,
      `precache  ${green(`${count} entries`)} ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}`,
      'files generated',
      ...filePaths.map(p => `  ${dim(relative(root, p))}`),
    ].join('\n'))
  }

  // log build warning
  warnings && warnings.length > 0 && console.warn(yellow([
    'warnings',
    ...warnings.map(w => `  ${w}`),
    '',
  ].join('\n')))
}
