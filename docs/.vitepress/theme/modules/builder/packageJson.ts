import type { PWABuilderData, PWABuilderGenerator, PWABuilderResultType } from '../../types'
import { packageData } from '../generatePWACode'
import { version } from '../../../../../package.json'

const ilesVersion = '^0.8.3'
const workboxVersion = '^6.5.3'

export default <PWABuilderGenerator>{
  configure() {
    packageData.enabled = true
  },
  generate(data: PWABuilderData) {
    const generators: [PWABuilderResultType, () => void][] = [
      ['package-json', () => {
        const devDependencies: Record<string, string> = {}
        if (data.framework === 'iles') {
          devDependencies['@islands/pwa'] = ilesVersion
        }
        else {
          devDependencies['vite-plugin-pwa'] = `^${version}`
          if (data.generateFWComponent) {
            // include workbox-xxx node only for custom sw
            if (data.strategy === 'injectManifest') {
              if (data.behavior === 'autoUpdate')
                devDependencies['workbox-core'] = workboxVersion

              devDependencies['workbox-precaching'] = workboxVersion
              devDependencies['workbox-routing'] = workboxVersion
            }
            devDependencies['workbox-window'] = workboxVersion
          }
        }

        packageData.code = `
// dont forget to install dependencies: npm i, yarn, pnpm i
${JSON.stringify({ devDependencies }, null, 2)}
        `
      }],
    ]
    return generators
  },
}
