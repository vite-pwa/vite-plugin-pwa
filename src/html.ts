import { join as _join } from 'path'
import { FILE_MANIFEST, FILE_SW_REGISTER } from './constants'
import { ResolvedVitePWAOptions } from './types'

function join(...args: string[]) {
  return _join(...args).replace(/\\/g, '/')
}

export function generateSimpleSWRegister(options: ResolvedVitePWAOptions) {
  return `
if('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('${join(options.base, options.filename)}', { scope: '${options.scope}' })
})
}`.replace(/\n/g, '')
}

export function injectServiceWorker(html: string, options: ResolvedVitePWAOptions) {
  const manifest = `<link rel="manifest" href="${join(options.base, FILE_MANIFEST)}">`

  if (options.injectRegister === 'inline') {
    return html.replace(
      '</head>',
      `${manifest}<script>${generateSimpleSWRegister(options)}</script></head>`,
    )
  }

  if (options.injectRegister === 'import') {
    return html.replace(
      '</head>',
      `${manifest}<script src="${join(options.base, FILE_SW_REGISTER)}"></script></head>`,
    )
  }

  return html.replace(
    '</head>',
    `${manifest}</head>`,
  )
}
