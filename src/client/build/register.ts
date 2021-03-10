import { Workbox, messageSW } from 'workbox-window'
import { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function registerSW(options: RegisterSWOptions = {}) {
  const {
    auto = false,
    immediate = false,
    onNeedRefresh,
    onOfflineReady,
  } = options

  let wb: Workbox | undefined
  let registration: ServiceWorkerRegistration | undefined

  const updateServiceWorker = async(reloadPage = true) => {
    // Assuming the user accepted the update, set up a listener
    // that will reload the page as soon as the previously waiting
    // service worker has taken control.
    if (reloadPage) {
      wb?.addEventListener('controlling', (event) => {
        if (event.isUpdate)
          window.location.reload()
      })
    }

    if (registration && registration.waiting) {
      // Send a message to the waiting service worker,
      // instructing it to activate.
      // Note: for this to work, you have to add a message
      // listener in your service worker. See below.
      await messageSW(registration.waiting, { type: 'SKIP_WAITING' })
    }
  }

  if ('serviceWorker' in navigator) {
    // __SW__ and __SCOPE__ will be replaced by virtual module
    wb = new Workbox('__SW__', { scope: '__SCOPE__' })

    wb.addEventListener('activated', (event) => {
      // this will only controls the offline request.
      // event.isUpdate will be true if another version of the service
      // worker was controlling the page when this version was registered.
      if (!event.isUpdate)
        onOfflineReady?.()

      /* TODO@clientsClaim
      if (event.isUpdate) {
        console.log(`WARNING: another service worker is controlling the page => ${auto}`)
        if (auto)
          window.location.reload()
        else
          onNeedRefresh?.()
      }
      else {
        onOfflineReady?.()
      }
      */
    })

    const showSkipWaitingPrompt = () => {
      // \`event.wasWaitingBeforeRegister\` will be false if this is
      // the first time the updated service worker is waiting.
      // When \`event.wasWaitingBeforeRegister\` is true, a previously
      // updated service worker is still waiting.
      // You may want to customize the UI prompt accordingly.

      // Assumes your app has some sort of prompt UI element
      // that a user can either accept or reject.
      auto ? updateServiceWorker() : onNeedRefresh?.()

      /* TODO@clientsClaim
      onNeedRefresh?.()
      */
    }

    // Add an event listener to detect when the registered
    // service worker has installed but is waiting to activate.
    wb.addEventListener('waiting', showSkipWaitingPrompt)
    // @ts-ignore
    wb.addEventListener('externalwaiting', showSkipWaitingPrompt)
    // register the service worker
    wb.register({ immediate }).then(r => registration = r)
  }

  return updateServiceWorker
}
