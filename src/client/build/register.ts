import type { RegisterSWOptions } from '../type'

// __SW_AUTO_UPDATE__ will be replaced by virtual module
const autoUpdateMode = '__SW_AUTO_UPDATE__'
// __SW_SELF_DESTROYING__ will be replaced by virtual module
const selfDestroying = '__SW_SELF_DESTROYING__'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore replace at build
const auto = autoUpdateMode === 'true'
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore replace at build time
const autoDestroy = selfDestroying === 'true'

export type { RegisterSWOptions }

export function registerSW(options: RegisterSWOptions = {}) {
  const {
    immediate = false,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisteredSW,
    onRegisterError,
  } = options

  let wb: import('workbox-window').Workbox | undefined
  let registration: ServiceWorkerRegistration | undefined
  let registerPromise: Promise<void>
  let sendSkipWaitingMessage: () => Promise<void> | undefined

  const updateServiceWorker = async (reloadPage = true) => {
    await registerPromise
    if (!auto) {
      // Assuming the user accepted the update, set up a listener
      // that will reload the page as soon as the previously waiting
      // service worker has taken control.
      if (reloadPage) {
        wb?.addEventListener('controlling', (event) => {
          if (event.isUpdate)
            window.location.reload()
        })
      }

      await sendSkipWaitingMessage?.()
    }
  }

  async function register() {
    if ('serviceWorker' in navigator) {
      const { Workbox, messageSW } = await import('workbox-window')
      sendSkipWaitingMessage = async () => {
        if (registration && registration.waiting) {
          // Send a message to the waiting service worker,
          // instructing it to activate.
          // Note: for this to work, you have to add a message
          // listener in your service worker. See below.
          await messageSW(registration.waiting, { type: 'SKIP_WAITING' })
        }
      }
      // __SW__, __SCOPE__ and __TYPE__ will be replaced by virtual module
      wb = new Workbox('__SW__', { scope: '__SCOPE__', type: '__TYPE__' })

      wb.addEventListener('activated', (event) => {
        // this will only controls the offline request.
        // event.isUpdate will be true if another version of the service
        // worker was controlling the page when this version was registered.
        if (event.isUpdate)
          auto && window.location.reload()
        else if (!autoDestroy)
          onOfflineReady?.()
      })

      if (!auto) {
        const showSkipWaitingPrompt = () => {
          // \`event.wasWaitingBeforeRegister\` will be false if this is
          // the first time the updated service worker is waiting.
          // When \`event.wasWaitingBeforeRegister\` is true, a previously
          // updated service worker is still waiting.
          // You may want to customize the UI prompt accordingly.

          // Assumes your app has some sort of prompt UI element
          // that a user can either accept or reject.
          onNeedRefresh?.()
        }

        // Add an event listener to detect when the registered
        // service worker has installed but is waiting to activate.
        wb.addEventListener('waiting', showSkipWaitingPrompt)
        // @ts-expect-error event listener provided by workbox-window
        wb.addEventListener('externalwaiting', showSkipWaitingPrompt)
      }

      // register the service worker
      wb.register({ immediate }).then((r) => {
        registration = r
        if (onRegisteredSW)
          onRegisteredSW('__SW__', r)
        else
          onRegistered?.(r)
      }).catch((e) => {
        onRegisterError?.(e)
      })
    }
  }

  registerPromise = register()

  return updateServiceWorker
}
