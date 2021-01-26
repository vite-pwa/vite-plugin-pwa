import { join } from 'path'
import { FILE_MANIFEST, FILE_SW_REGISTER } from './constants'
import { ResolvedVitePWAOptions } from './types'

export function generateSWRegister(options: ResolvedVitePWAOptions) {
  return options.minify ? `"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("${join(options.basePath, options.filename)}",{scope:"${options.scope}"})});` : 
`
if('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('${join(options.basePath, options.filename)}', { scope: '${options.scope}' })
})
}`.replace(/\n/g, '')
}

export function injectServiceWorker(html: string, options: ResolvedVitePWAOptions) {
  if (options.inlineRegister) {
    return html.replace(
      '</head>',
      `
<link rel="manifest" href="${join(options.basePath, FILE_MANIFEST)}">
<script>${generateSWRegister(options)}</script>
</head>`.trim(),
    )
  }
  else {
    return html.replace(
      '</head>',
      `
<link rel="manifest" href="${join(options.basePath, FILE_MANIFEST)}">
<script src="${join(options.basePath, FILE_SW_REGISTER)}"></script>
</head>`.trim(),
    )
  }
}
