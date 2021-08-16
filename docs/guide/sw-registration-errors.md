---
title: Service Worker Registration Errors | Guide
---

# Service Worker Registration Errors

You can handle Service Worker registration errors if you want to notify the user with following code on your `main.ts` 
or `main.js`:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onRegiterError(error) {}
})
```

and then inside `onRegisterError`, just notify the user that there was an error registering the service worker. 
