# Vuejs

## Vue 3

You can use the builtin `Vite` virtual module `virtual:pwa-register/vue` for `Vuejs 3` which will return
`composition api` references (`ref<boolean>`) for `offlineReady` and `needRefresh`.

You can use this `ReloadPrompt.vue` component:

```vue
<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = async() => {
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

### Manual Service Worker Updates

As explained in [Manual Service Worker Updates](/guide/manual-sw-updates.html), you can use this code to configure this 
behavior on your application with the virtual module `virtual:pwa-register/vue`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/vue'

const updateServiceWorker = registerSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, 60 * 60 * 1000 /* 1 hour: interval in milliseconds */)
  }
})
```

## Vue 2

Since this plugin only supports `Vuejs 3`, you cannot use the virtual module `virtual:pwa-register/vue`.

You can copy `useRegisterSW.js` `mixin` in your application to make it working:

```js
export default {
  name: "useRegisterSW",
  data() {
    return {
      updateSW: undefined,
      offlineReady: false,
      needRefresh: false  
    }
  },
  async mounted() {
    try {
      const { registerSW } = await import("virtual:pwa-register")
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
    } catch {
      console.log("PWA disabled.")
    }

  },
  methods: {
    async closePromptUpdateSW() {
      this.offlineReady = false
      this.needRefresh = false
    },
    onOfflineReadyFn() {
      console.log("onOfflineReady")
    },
    onNeedRefreshFn() {
      console.log("onNeedRefresh")
    },
    updateServiceWorker() {
      this.updateSW && this.updateSW(true)
    },
    handleSWManualUpdates(swRegistration) {}, 
    handleSWRegisterError(error) {} 
  }
}
```

You can use this `ReloadPrompt.vue` component:

```vue
<script>
import useRegisterSW from './useRegisterSW'

export default {
  name: "reload-prompt",
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

### Manual Service Worker Updates

As explained in [Manual Service Worker Updates](/guide/manual-sw-updates.html), you can use this code to configure this
behavior on your application with the `` `mixin`:

```vue
<script>
import useRegisterSW from './useRegisterSW'

export default {
  name: "reload-prompt",
  mixins: [useRegisterSW],
  methods: {
    handleSWManualUpdates(r) {
      r && setInterval(() => {
        r.update()
      }, 60 * 60 * 1000 /* 1 hour: interval in milliseconds */)
    }
  }
}
</script>

```

