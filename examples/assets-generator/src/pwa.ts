import { pwaInfo } from 'virtual:pwa-info'
import { registerSW } from 'virtual:pwa-register'

console.log(pwaInfo)

registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('onNeedRefresh message should not appear')
  },
})
