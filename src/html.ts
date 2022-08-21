import { DEV_SW_NAME, FILE_SW_REGISTER } from './constants'
import type { ResolvedVitePWAOptions } from './types'

export function generateSimpleSWRegister(options: ResolvedVitePWAOptions, dev: boolean) {
  const path = dev ? `${options.base}${DEV_SW_NAME}` : `${options.base}${options.filename}`

  // we are using HMR to load this script: DO NOT ADD window::load event listener
  if (dev) {
    const swType = options.devOptions.type ? options.devOptions.type : 'classic'
    return `if('serviceWorker' in navigator) navigator.serviceWorker.register('${path}', { scope: '${options.scope}', type: ${swType} })`
  }
  return `
if('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('${path}', { scope: '${options.scope}' })
})
}`.replace(/\n/g, '')
}

export function injectServiceWorker(html: string, options: ResolvedVitePWAOptions, dev: boolean) {
  const crossorigin = options.useCredentials ? ' crossorigin="use-credentials"' : ''
  let manifest: string
  if (dev) {
    const name = options.devOptions.webManifestUrl ?? `${options.base}${options.manifestFilename}`
    manifest = options.manifest ? `<link rel="manifest" href="${name}"${crossorigin}>` : ''
  }
  else {
    manifest = options.manifest ? `<link rel="manifest" href="${options.base + options.manifestFilename}"${crossorigin}>` : ''
  }

  if (!dev) {
    if (options.injectRegister === 'inline') {
      return html.replace(
        '</head>',
          `${manifest}<script>${generateSimpleSWRegister(options, dev)}</script></head>`,
      )
    }

    if (options.injectRegister === 'script') {
      return html.replace(
        '</head>',
          `${manifest}<script src="${options.base + FILE_SW_REGISTER}"></script></head>`,
      )
    }
  }

  return html.replace(
    '</head>',
    `${manifest}</head>`,
  )
}
