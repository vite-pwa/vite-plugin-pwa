import { join } from 'path'
import { ResolvedVitePWAOptions } from './types'

export function injectServiceWorker(html: string, base: string, options: ResolvedVitePWAOptions) {
  const basePath = base.startsWith('/') ? `/${base}` : base
  return html.replace(
    '</head>',
    `
<link rel="manifest" href="${join(basePath, 'manifest.webmanifest')}">
  <script>
    if('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('${join(basePath, options.filename)}', { scope: './' })
      })
    }
  </script>
</head>`,
  )
}
