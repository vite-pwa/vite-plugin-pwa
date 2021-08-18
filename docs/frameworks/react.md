---
title: React | Frameworks
---

# React

You can use the built-in `Vite` virtual module `virtual:pwa-register/react` for `React` which will return
`useState` stateful values (`useState<boolean>`) for `offlineReady` and `needRefresh`.

> You will need to add `workbox-window` as a `dev` dependency to your `Vite` project.

## Prompt for update

You can use this `ReloadPrompt.tsx` component:

<details>
  <summary><strong>ReloadPrompt.tsx</strong> code</summary>

```tsx
// eslint-disable-next-line no-use-before-define
import React from 'react'
import './ReloadPrompt.css'

import { useRegisterSW } from 'virtual:pwa-register/react'

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
</details>

and its corresponding `ReloadPrompt.css` styles file:

<details>
  <summary><strong>ReloadPrompt.css</strong> code</summary>

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
</details>

## Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates.html), you can use this code to configure this
behavior on your application with the virtual module `virtual:pwa-register/react`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/react';

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

> Since `workbox-window` uses a time-based `heuristic` algorithm to handle service worker updates, if you
build your service worker and register it again, if the time between last registration and the new one is less than
1 minute, then, `workbox-window` will handle the `service worker update found` event as an external event, and so the
behavior could be strange (for example, if using `prompt`, instead showing the dialog for new content available, the
ready  to work offline dialog will be shown; if using `autoUpdate`, the ready to work offline dialog will be shown and
shouldn't be shown).

## SW Registration Errors

As explained in [SW Registration Errors](/guide/sw-registration-errors.html), you can notify the user with
following code:

```ts
import { useRegisterSW } from 'virtual:pwa-register/react';

const updateServiceWorker = useRegisterSW({
  onRegisterError(error) {}
})
```

and then inside `onRegisterError`, just notify the user that there was an error registering the service worker.


