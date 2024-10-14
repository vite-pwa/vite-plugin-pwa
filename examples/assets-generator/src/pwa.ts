import { pwaInfo } from 'virtual:pwa-info'
import { pwaAssetsHead } from 'virtual:pwa-assets/head'
import { pwaAssetsIcons } from 'virtual:pwa-assets/icons'
import { registerSW } from 'virtual:pwa-register'

console.log(pwaInfo)
console.log(pwaAssetsHead)
console.log(pwaAssetsIcons)

registerSW({
  immediate: true,
  searchParams: { version: '1.0' },
  onNeedRefresh() {
    console.log('onNeedRefresh message should not appear')
  },
})
