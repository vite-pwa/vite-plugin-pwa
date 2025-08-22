import { pwaInfo } from 'virtual:pwa-info'
import { registerSW } from 'virtual:pwa-register'

// eslint-disable-next-line no-undef
const date = __DATE__

console.log(pwaInfo)

const app = document.querySelector('#app')

app.innerHTML = `
  <div>
   <img src="/favicon.svg" alt="PWA Logo" width="60" height="60">
    <h1>Vite + Vanilla JavaScript Custom Service Worker</h1>
    <br/>
    <p>${date}</p>
    <br/>
  </div>
`

registerSW({
  immediate: true,
  searchParams: { version: '1.0' },
  onNeedRefresh() {
    console.log('onNeedRefresh message should not appear')
  },
  onOfflineReady() {
    console.log('onOfflineReady message should not appear')
  },
})
