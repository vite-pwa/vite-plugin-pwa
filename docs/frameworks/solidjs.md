---
title: SolidJS | Frameworks
---

# SolidJS

You can use the built-in `Vite` virtual module `virtual:pwa-register/solid` for `SolidJS` which will return
`createSignal` stateful values (`createSignal<boolean>`) for `offlineReady` and `needRefresh`.

> You will need to add `workbox-window` as a `dev` dependency to your `Vite` project.

## Type declarations

```ts
declare module 'virtual:pwa-register/solid' {
  // @ts-ignore ignore when react is not installed
  import { Accessor, Setter } from 'solid-js'

  export type RegisterSWOptions = {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [Accessor<boolean>, Setter<boolean>]
    offlineReady: [Accessor<boolean>, Setter<boolean>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
```

## Prompt for update

You can use this `ReloadPrompt.tsx` component:

<details>
  <summary><strong>ReloadPrompt.tsx</strong> code</summary>

```tsx
// eslint-disable-next-line no-use-before-define
import { Component } from "solid-js";
import styles from './ReloadPrompt.module.css'

import { useRegisterSW } from 'virtual:pwa-register/solid'

const ReloadPrompt: Component = () => {  
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
```
</details>

and its corresponding `ReloadPrompt.module.css` styles module:

<details>
  <summary><strong>ReloadPrompt.module.css</strong> code</summary>

```css
.Container {
  padding: 0;
  margin: 0;
  width: 0;
  height: 0;
}
.Toast {
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
.ToastMessage {
  margin-bottom: 8px;
}
.ToastButton {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
```
</details>

## Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates.html), you can use this code to configure this
behavior on your application with the virtual module `virtual:pwa-register/solid`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/solid';

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
