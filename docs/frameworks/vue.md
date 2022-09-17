---
title: Vue | Frameworks
---

# Vue

## Vue 3

You can use the built-in `Vite` virtual module `virtual:pwa-register/vue` for `Vue 3` which will return `composition api` references (`ref<boolean>`) for `offlineReady` and `needRefresh`.

### Type declarations

::: tip
<TypeScriptError2307 />
:::

```ts
declare module 'virtual:pwa-register/vue' {
  // @ts-expect-error ignore when vue is not installed
  import type { Ref } from 'vue'

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
    needRefresh: Ref<boolean>
    offlineReady: Ref<boolean>
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
```

### Prompt for update

You can use this `ReloadPrompt.vue` component:

::: details ReloadPrompt.vue
```vue
<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      <span v-if="offlineReady">
        App ready to work offline
      </span>
      <span v-else>
        New content available, click on reload button to update.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">
      Reload
    </button>
    <button @click="close">
      Close
    </button>
  </div>
</template>

<style>
.pwa-toast {
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
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
```
:::

### Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates), you can use this code to configure this  behavior on your application with the virtual module `virtual:pwa-register/vue`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/vue'

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

## Vue 2

Since this plugin only supports `Vue 3`, you cannot use the virtual module `virtual:pwa-register/vue`.

You can copy `useRegisterSW.js` `mixin` to your `@/mixins/` directory in your application to make it working:

::: details useRegisterSW.js
```js
export default {
  name: 'useRegisterSW',
  data() {
    return {
      updateSW: undefined,
      offlineReady: false,
      needRefresh: false
    }
  },
  async mounted() {
    try {
      const { registerSW } = await import('virtual:pwa-register')
      const vm = this
      this.updateSW = registerSW({
        immediate: true,
        onOfflineReady() {
          vm.offlineReady = true
          vm.onOfflineReadyFn()
        },
        onNeedRefresh() {
          vm.needRefresh = true
          vm.onNeedRefreshFn()
        },
        onRegistered(swRegistration) {
          swRegistration && vm.handleSWManualUpdates(swRegistration)
        },
        onRegisterError(e) {
          vm.handleSWRegisterError(e)
        }
      })
    }
    catch {
      console.log('PWA disabled.')
    }

  },
  methods: {
    async closePromptUpdateSW() {
      this.offlineReady = false
      this.needRefresh = false
    },
    onOfflineReadyFn() {
      console.log('onOfflineReady')
    },
    onNeedRefreshFn() {
      console.log('onNeedRefresh')
    },
    updateServiceWorker() {
      this.updateSW && this.updateSW(true)
    },
    handleSWManualUpdates(swRegistration) {},
    handleSWRegisterError(error) {}
  }
}
```
:::

### Prompt for update

You can use this `ReloadPrompt.vue` component:

::: details ReloadPrompt.vue
```vue
<script>
import useRegisterSW from '@/mixins/useRegisterSW'

export default {
  name: 'ReloadPrompt',
  mixins: [useRegisterSW]
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      <span v-if="offlineReady">
        App ready to work offline
      </span>
      <span v-else>
        New content available, click on reload button to update.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">
      Reload
    </button>
    <button @click="close">
      Close
    </button>
  </div>
</template>

<style>
.pwa-toast {
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
}
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
```
:::

### Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates), you can use this code to configure this behavior on your application with the `useRegisterSW.js` `mixin`:

```vue
<script>
import useRegisterSW from '@/mixins/useRegisterSW'

const intervalMS = 60 * 60 * 1000

export default {
  name: 'ReloadPrompt',
  mixins: [useRegisterSW],
  methods: {
    handleSWManualUpdates(r) {
      r && setInterval(() => {
        r.update()
      }, intervalMS)
    }
  }
}
</script>
```

The interval must be in milliseconds, in the example above it is configured to check the service worker every hour.

<HeuristicWorkboxWindow />
