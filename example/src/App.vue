<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { registerSW } from 'vite-plugin-pwa-register'

export default defineComponent({
  setup() {
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
        return 'New content available, reload the page.'
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

    return {
      showOfflineAppReady,
      showAppNeedsRefresh,
      appNeedsRefresh,
      showToast,
      toastMessage,
      toastCancelAriaLabel,
      hideToast,
      updateServiceWorker,
    }
  },
})
</script>

<template>
  <div>Hello World 2</div>
  <div
    v-if="showToast"
    class="toast-offline-ready"
    role="alert"
  >
    <div class="toast-offline-ready-content" :class="[{ update: appNeedsRefresh }]">
      <div>{{ toastMessage }}</div>
      <button v-if="appNeedsRefresh" aria-label="Reload page" @click="updateServiceWorker">
        Reload
      </button>
      <button :aria-label="toastCancelAriaLabel" @click="hideToast">
        Close
      </button>
    </div>
  </div>
</template>

<style>
.toast-offline-ready {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 48px;
  z-index: 1;
}
.toast-offline-ready-content {
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-column-gap: 1rem;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
}
.toast-offline-ready-content.update {
  grid-template-columns: 1fr min-content min-content;
}
.toast-offline-ready-content > div {
  font-weight: bold;
  text-align: left;
}
button {
  background-color: white;
}
</style>
