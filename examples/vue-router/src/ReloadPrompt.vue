<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { pwaInfo } from 'virtual:pwa-info'

const beginUpdateServiceWorker = ref(false)
const lastBeginUpdateServiceWorkerTime = ref(0)

console.log(pwaInfo)

// replaced dyanmicaly
const reloadSW: any = '__RELOAD_SW__'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    console.log(`Service Worker at: ${swUrl}`)
    if (reloadSW === 'true') {
      r && setInterval(async () => {
        console.log('Checking for sw update')
        await r.update()
      }, 20000 /* 20s for testing purposes */)
    }
    else {
      console.log(`SW Registered: ${r}`)
    }
  },
  onBeginUpdate() {
    console.log('Begin sw update message')
    beginUpdateServiceWorker.value = true
    lastBeginUpdateServiceWorkerTime.value = Date.now()
  },
})

watch(() => [offlineReady.value, needRefresh.value], ([offlineReadyVal, needRefreshVal]) => {
  if (offlineReadyVal || needRefreshVal)
    beginUpdateServiceWorker.value = false
})

async function close() {
  offlineReady.value = false
  needRefresh.value = false
  beginUpdateServiceWorker.value = false
}
</script>

<template>
  <div v-if="offlineReady || needRefresh || beginUpdateServiceWorker" class="pwa-toast" role="alert">
    <div class="message">
      <span v-if="offlineReady">
        App ready to work offline
      </span>
      <span v-else>
        New content available, click on reload button to update.
      </span>
      <div>
        <span v-if="beginUpdateServiceWorker">
          Updating...
        </span>
        <span v-else-if="lastBeginUpdateServiceWorkerTime">
          Last detect new version: {{ new Date(lastBeginUpdateServiceWorkerTime).toLocaleString() }}
        </span>
      </div>
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
  box-shadow: 3px 4px 5px 0px #8885;
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
