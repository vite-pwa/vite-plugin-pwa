import { join as _join } from 'path'
import { FILE_MANIFEST, FILE_SW_REGISTER } from './constants'
import { ResolvedVitePWAOptions } from './types'

function join(...args: string[]) {
  return _join(...args).replace(/\\/g, '/')
}

export function generateSWRegister(options: ResolvedVitePWAOptions) {
  return `
if('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('${join(options.base, options.filename)}', { scope: '${options.scope}' })
})
}`.replace(/\n/g, '')
}

export function injectServiceWorker(html: string, options: ResolvedVitePWAOptions) {
  if (options.injectRegister === 'inline') {
    return html.replace(
      '</head>',
      `
<link rel="manifest" href="${join(options.base, FILE_MANIFEST)}">
<script>${generateSWRegister(options)}</script>
</head>`.trim(),
    )
  }
  else if(options.injectRegister === 'import') {
    return html.replace(
      '</head>',
      `
<link rel="manifest" href="${join(options.base, FILE_MANIFEST)}">
<script src="${join(options.base, FILE_SW_REGISTER)}"></script>
</head>`.trim(),
    )
  } else {
    return html.replace(
      '</head>',
      `
<link rel="manifest" href="${join(options.base, FILE_MANIFEST)}">
</head>`.trim(),
    )
  }
}
