import type { RegisterSWOptions } from '../type'

// __SW_AUTO_UPDATE__ will be replaced by virtual module
const autoUpdateMode = '__SW_AUTO_UPDATE__'
// __SW_SELF_DESTROYING__ will be replaced by virtual module
const selfDestroying = '__SW_SELF_DESTROYING__'

// eslint-disable-next-line ts/prefer-ts-expect-error
// @ts-ignore replace at build
const auto = autoUpdateMode === 'true'
// eslint-disable-next-line ts/prefer-ts-expect-error
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
  let registerPromise: Promise<void>
  let sendSkipWaitingMessage: () => void | undefined

  const updateServiceWorker = async (_reloadPage = true) => {
    await registerPromise
    if (!auto) {
      sendSkipWaitingMessage?.()
    }
  }

  async function register() {
    if ('serviceWorker' in navigator) {
      wb = await import('workbox-window').then(({ Workbox }) => {
        // __SW__, __SCOPE__ and __TYPE__ will be replaced by virtual module
        return new Workbox('__SW__', { scope: '__SCOPE__', type: '__TYPE__' })
      }).catch((e) => {
        onRegisterError?.(e)
        return undefined
      })

      if (!wb)
        return

      sendSkipWaitingMessage = () => {
        // Send a message to the waiting service worker,
        // instructing it to activate.
        // Note: for this to work, you have to add a message
        // listener in your service worker. See below.
        wb?.messageSkipWaiting()
      }
      if (!autoDestroy) {
        if (auto) {
          wb.addEventListener('activated', (event) => {
            if (event.isUpdate || event.isExternal)
              window.location.reload()
          })
          wb.addEventListener('installed', (event) => {
            if (!event.isUpdate) {
              onOfflineReady?.()
            }
          });
        }
        else {
          let onNeedRefreshCalled = false
          const showSkipWaitingPrompt = () => {
            onNeedRefreshCalled = true
            // \`event.wasWaitingBeforeRegister\` will be false if this is
            // the first time the updated service worker is waiting.
            // When \`event.wasWaitingBeforeRegister\` is true, a previously
            // updated service worker is still waiting.
            // You may want to customize the UI prompt accordingly.

            // Assumes your app has some sort of prompt UI element
            // that a user can either accept or reject.
            // Assuming the user accepted the update, set up a listener
            // that will reload the page as soon as the previously waiting
            // service worker has taken control.
            wb?.addEventListener('controlling', (event) => {
              if (event.isUpdate)
                window.location.reload()
            })

            onNeedRefresh?.()
          }
          wb.addEventListener('installed', (event) => {
            if (typeof event.isUpdate === 'undefined') {
              if (typeof event.isExternal !== 'undefined') {
                if (event.isExternal)
                  showSkipWaitingPrompt()
                else
                  !onNeedRefreshCalled && onOfflineReady?.()
              }
              else {
                !onNeedRefreshCalled && onOfflineReady?.()
              }
            }
            else if (!event.isUpdate) {
              onOfflineReady?.()
            }
          });
          // Add an event listener to detect when the registered
          // service worker has installed but is waiting to activate.
          wb.addEventListener('waiting', showSkipWaitingPrompt)
        }
      }

      // register the service worker
      wb.register({ immediate }).then((r) => {
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
