/* eslint-disable react/react-in-jsx-scope,react/no-unknown-property */
import { Component } from 'solid-js'
import { useRegisterSW } from 'virtual:pwa-register/solid'
import styles from './ReloadPrompt.module.css'

const ReloadPrompt: Component = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(swr) {
      // eslint-disable-next-line no-console
      console.log(`service worker registered: ${swr}`)
    },
    onRegisterError(err) {
      console.error('service worker registration error', err)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div class={styles.Container}>
      { (offlineReady() || needRefresh())
          && <div class={styles.Toast}>
            <div class={styles.Message}>
              { offlineReady()
                ? <span>App ready to work offline</span>
                : <span>New content available, click on reload button to update.</span>
              }
            </div>
            { needRefresh() && <button class={styles.ToastButton} onClick={() => updateServiceWorker(true)}>Reload</button> }
            <button class={styles.ToastButton} onClick={() => close()}>Close</button>
          </div>
      }
    </div>
  )
}

export default ReloadPrompt
