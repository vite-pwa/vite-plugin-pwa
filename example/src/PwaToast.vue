<script setup lang="ts">
import { ref } from 'vue'
import { useRegisterSW } from 'vite-plugin-pwa-register/vue'

const hide = ref(false)
const {
  updateServiceWorker,
  offlineReady,
  needRefresh,
} = useRegisterSW({
  immediate: false,
})

const hideToast = async() => {
  hide.value = true
}
</script>

<template>
  <div
    v-if="!hide && (offlineReady || needRefresh)"
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      <span v-if="offlineReady">
        App ready to work offline
      </span>
      <span v-else>
        New content available, reload the page to update.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker">
      Reload
    </button>
    <button @click="hideToast">
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
  background-color: white;
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
