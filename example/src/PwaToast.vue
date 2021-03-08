<script setup lang="ts">
import { ref, computed } from 'vue'
import { registerSW } from 'vite-plugin-pwa-register'

const offlineAppReady = ref(false)
const appNeedsRefresh = ref(false)
const hiddenOfflineAppReady = ref(false)
const hiddenAppNeedsRefresh = ref(false)
const showOfflineAppReady = computed(() => {
  return offlineAppReady.value && !hiddenOfflineAppReady.value
})
const showAppNeedsRefresh = computed(() => {
  return appNeedsRefresh.value && !hiddenAppNeedsRefresh.value
})

const toastCancelAriaLabel = computed(() => {
  if (offlineAppReady.value)
    return 'Undertood'
  if (appNeedsRefresh.value)
    return 'Cancel'
  return null
})

const showToast = computed(() => {
  return showOfflineAppReady.value || showAppNeedsRefresh.value
})

const toastMessage = computed(() => {
  if (offlineAppReady.value)
    return 'App ready to work offline'
  if (appNeedsRefresh.value)
    return 'New content available, reload the page to update.'
  return null
})

const updateServiceWorker = registerSW({
  immediate: false,
  onNeedRefresh() {
    appNeedsRefresh.value = true
  },
  onOfflineReady() {
    offlineAppReady.value = true
  },
})

const hideToast = async() => {
  if (offlineAppReady.value)
    hiddenOfflineAppReady.value = true
  if (appNeedsRefresh.value)
    hiddenAppNeedsRefresh.value = true
}
</script>

<template>
  <div
    v-if="showToast"
    class="pwa-toast"
    role="alert"
  >
    <div class="message">{{ toastMessage }}</div>
    <button v-if="appNeedsRefresh" aria-label="Reload page" @click="updateServiceWorker">
      Reload
    </button>
    <button :aria-label="toastCancelAriaLabel" @click="hideToast">
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
