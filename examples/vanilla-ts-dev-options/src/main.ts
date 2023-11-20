import { pwaInfo } from 'virtual:pwa-info'

console.log(pwaInfo)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
   <img src="/favicon.svg" alt="PWA Logo" width="60" height="60">
    <h1>Vite + TypeScript</h1>
    <p>Testing SW with <b>injectRegister=auto,inline,script</b></p>
  </div>
`
