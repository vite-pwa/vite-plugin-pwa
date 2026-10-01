import type { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

const autoUpdateMode = '__SW_AUTO_UPDATE__'
const selfDestroying = '__SW_SELF_DESTROYING__'

const auto = autoUpdateMode === 'true'
const autoDestroy = selfDestroying === 'true'

export function registerSW(options: RegisterSWOptions = {}) {
  const {
    immediate = false,
    onNeedReload,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisteredSW,
    onRegisterError,
  } = options

  let wb: import('workbox-window').Workbox | undefined
  let registerPromise: Promise<void>
  let sendSkipWaitingMessage: () => void | undefined

  // Track whether the controlling event has fired (Safari/iOS fallback)
  let controllingReceived = false

  const updateServiceWorker = async (reloadPage = true) => {
    await registerPromise
    if (!auto) {
      sendSkipWaitingMessage?.()
      // Safari/iOS fallback: the controllerchange event (surfaced as Workbox
      // 'controlling') may never fire on WebKit-based browsers. If it hasn't
      // fired within 2 seconds after requesting skipWaiting, force the reload.
      if (reloadPage) {
        setTimeout(() => {
          if (!controllingReceived) {
            if (onNeedReload)
              onNeedReload()
            else
              window.location.reload()
          }
        }, 2000)
      }
    }
  }

  async function register() {
    if ('serviceWorker' in navigator) {
      wb = await import('workbox-window').then(({ Workbox }) => {
        return new Workbox('__SW__', { scope: '__SCOPE__', type: '__TYPE__' })
      }).catch((e) => {
        onRegisterError?.(e)
        return undefined
      })

      if (!wb)
        return

      sendSkipWaitingMessage = () => {
        wb?.messageSkipWaiting()
      }

      if (!autoDestroy) {
        if (auto) {
          wb.addEventListener('activated', (event) => {
            if (event.isUpdate || event.isExternal) {
              if (onNeedReload)
                onNeedReload()
              else
                window.location.reload()
            }
          })
          wb.addEventListener('installed', (event) => {
            if (!event.isUpdate)
              onOfflineReady?.()
          })
        }
        else {
          let onNeedRefreshCalled = false

          const showSkipWaitingPrompt = () => {
            onNeedRefreshCalled = true

            wb?.addEventListener('controlling', (event) => {
              if (event.isUpdate) {
                controllingReceived = true
                if (onNeedReload)
                  onNeedReload()
                else
                  window.location.reload()
              }
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
          })

          wb.addEventListener('waiting', showSkipWaitingPrompt)

          // External SW detected — show prompt
          wb.addEventListener('externalwaiting', showSkipWaitingPrompt)
        }
      }

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