---
title: Preact | Frameworks
---

# Preact

You can use the built-in `Vite` virtual module `virtual:pwa-register/preact` for `Preact` which will return `useState` stateful values (`useState<boolean>`) for `offlineReady` and `needRefresh`.

::: warning
You will need to add `workbox-window` as a `dev` dependency to your `Vite` project.
:::

## Type declarations

::: tip
<TypeScriptError2307 />
:::

```ts
declare module 'virtual:pwa-register/preact' {
  // @ts-expect-error ignore when preact/hooks is not installed
  import type { StateUpdater } from 'preact/hooks'

  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    /**
     * Called only if `onRegisteredSW` is not provided.
     *
     * @deprecated Use `onRegisteredSW` instead.
     * @param registration The service worker registration if available.
     */
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    /**
     * Called once the service worker is registered (requires version `0.12.8+`).
     *
     * @param swScriptUrl The service worker script url.
     * @param registration The service worker registration if available.
     */
    onRegisteredSW?: (swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, StateUpdater<boolean>]
    offlineReady: [boolean, StateUpdater<boolean>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
```

## Prompt for update

You can use this `ReloadPrompt.tsx` component:

::: details ReloadPrompt.tsx
```tsx
import './ReloadPrompt.css'

import { useRegisterSW } from 'virtual:pwa-register/preact'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="ReloadPrompt-container">
      { (offlineReady || needRefresh)
        && <div className="ReloadPrompt-toast">
            <div className="ReloadPrompt-message">
              { offlineReady
                ? <span>App ready to work offline</span>
                : <span>New content available, click on reload button to update.</span>
              }
            </div>
            { needRefresh && <button className="ReloadPrompt-toast-button" onClick={() => updateServiceWorker(true)}>Reload</button> }
            <button className="ReloadPrompt-toast-button" onClick={() => close()}>Close</button>
        </div>
      }
    </div>
  )
}

export default ReloadPrompt
```
:::

and its corresponding `ReloadPrompt.css` styles file:

::: details ReloadPrompt.css
```css
.ReloadPrompt-container {
    padding: 0;
    margin: 0;
    width: 0;
    height: 0;
}
.ReloadPrompt-toast {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 16px;
    padding: 12px;
    border: 1px solid #8885;
    border-radius: 4px;
    z-index: 1;
    text-align: left;
    box-shadow: 3px 4px 5px 0 #8885;
    background-color: white;
}
.ReloadPrompt-toast-message {
    margin-bottom: 8px;
}
.ReloadPrompt-toast-button {
    border: 1px solid #8885;
    outline: none;
    margin-right: 5px;
    border-radius: 2px;
    padding: 3px 10px;
}
```
:::

## Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates), you can use this code to configure this behavior on your application with the virtual module `virtual:pwa-register/preact`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/preact'

const intervalMS = 60 * 60 * 1000

const updateServiceWorker = useRegisterSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  }
})
```

The interval must be in milliseconds, in the example above it is configured to check the service worker every hour.

<HeuristicWorkboxWindow />
