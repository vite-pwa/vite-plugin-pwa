If you are using `SSR/SSG`, you need to import `virtual:pwa-register` module using dynamic import and checking if `window` is not `undefined`.

You can register the service worker on `src/pwa.ts` module:

```ts
import { registerSW } from 'virtual:pwa-register'

registerSW({ /* ... */ })
```

and then import it from your `main.ts`:

```ts
if (typeof window !== 'undefined')
  import('./pwa')
```

You can see the [FAQ](/guide/faq#navigator-window-is-undefined) entry for more info.
