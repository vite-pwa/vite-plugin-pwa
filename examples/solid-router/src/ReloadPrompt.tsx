import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import { pwaInfo } from 'virtual:pwa-info'
import { useRegisterSW } from 'virtual:pwa-register/solid'
import styles from './ReloadPrompt.module.css'

console.log(pwaInfo)

const ReloadPrompt: Component = () => {
  // replaced dynamically
  const reloadSW = '__RELOAD_SW__'
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker at: ${swUrl}`)
      // @ts-expect-error just ignore
      if (reloadSW === 'true') {
        r && setInterval(() => {
          console.log('Checking for sw update')
          r.update()
        }, 20000 /* 20s for testing purposes */)
      }
      else {
        console.log(`SW Registered: ${r}`)
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div class={styles.Container}>
      <Show when={offlineReady() || needRefresh()}>
        <div class={styles.Toast}>
          <div class={styles.Message}>
            <Show
              fallback={<span>New content available, click on reload button to update.</span>}
              when={offlineReady()}
            >
              <span>App ready to work offline</span>
            </Show>
          </div>
          <Show when={needRefresh()}>
            <button class={styles.ToastButton} onClick={() => updateServiceWorker(true)}>Reload</button>
          </Show>
          <button class={styles.ToastButton} onClick={() => close()}>Close</button>
        </div>
      </Show>
    </div>
  )
}

export default ReloadPrompt
