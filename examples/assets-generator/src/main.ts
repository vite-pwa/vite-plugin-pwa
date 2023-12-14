const date = __DATE__

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

window.addEventListener('load', () => {
  import('./pwa.ts')
})
