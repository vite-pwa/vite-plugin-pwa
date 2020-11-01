import { IndexHtmlTransform } from 'vite/dist/node/transform'
import { VitePWAOptions } from '../types'

export const HTMLTransformer = (options: VitePWAOptions): IndexHtmlTransform => ({
  apply: 'post',
  transform({ code, isBuild }) {
    if (!isBuild)
      return code

    const manifestExtension = options.manifest.useWebmanifestExtension ? 'webmanifest' : 'json'
    return code.replace(
      '</head>',
      `
<link rel='manifest' href='manifest.${manifestExtension}'>
<script>
  if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js', { scope: './' })
    })
  }
</script>
</head>`,
    )
  },
})
