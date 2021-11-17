/* eslint-disable react/react-in-jsx-scope,react/no-unknown-property */
import { Component, Show } from 'solid-js'
import { useRegisterSW } from 'virtual:pwa-register/solid'
import styles from './ReloadPrompt.module.css'

const ReloadPrompt: Component = () => {
  // replaced dynamically
  const reloadSW = '__RELOAD_SW__'
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(r) {
      // @ts-ignore
      if (reloadSW === 'true') {
        r && setInterval(() => {
          // eslint-disable-next-line no-console
          console.log('Checking for sw update')
          r.update()
        }, 20000 /* 20s for testing purposes */)
      }
      else {
        // eslint-disable-next-line no-console
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
