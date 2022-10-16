import { pwaInfo } from 'virtual:pwa-info'
import { registerSW } from 'virtual:pwa-register'

const date = __DATE__

// eslint-disable-next-line no-console
console.log(pwaInfo)

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div>
   <img src="/favicon.svg" alt="PWA Logo" width="60" height="60">
    <h1>Vite + TypeScript</h1>
    <p>Testing SW without <b>Injection Point (self.__WB_MANIFEST)</b></p>
    <br/>
    <p>${date}</p>
    <br/>
  </div>
`

const reload = registerSW({
  immediate: true,
  onNeedRefresh,
})

function onNeedRefresh() {
  const btn = document.createElement('button')
  btn.addEventListener('click', () => reload())
  btn.textContent = 'New version available, click to ReloadX'
  app.append(btn)
}

