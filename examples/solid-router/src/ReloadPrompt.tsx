/* eslint-disable react/react-in-jsx-scope,react/no-unknown-property */
import { Component } from 'solid-js'
import { useRegisterSW } from 'virtual:pwa-register/solid'
import styles from './ReloadPrompt.module.css'

const ReloadPrompt: Component = () => {
  // replaced dyanmicaly
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
    <div className={styles.Container}>
      { (offlineReady() || needRefresh())
          && <div className={styles.Toast}>
            <div className={styles.Message}>
              { offlineReady()
                ? <span>App ready to work offline</span>
                : <span>New content available, click on reload button to update.</span>
              }
            </div>
            { needRefresh() && <button className={styles.ToastButton} onClick={() => updateServiceWorker(true)}>Reload</button> }
            <button className={styles.ToastButton} onClick={() => close()}>Close</button>
          </div>
      }
    </div>
  )
}

export default ReloadPrompt
