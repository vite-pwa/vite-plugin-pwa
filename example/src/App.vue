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

    const updateServiceWorker = registerSW(
      false,
      () => {
        appNeedsRefresh.value = true
      },
      () => {
        offlineAppReady.value = true
      },
    )
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
  <div>Hello World 1</div>
  <div
    v-if="showToast"
    class="toast-offline-ready"
    role="alert"
  >
    <div class="toast-offline-ready-content" :class="[{ update: appNeedsRefresh }]">
      <div>{{ toastMessage }}</div>
      <button v-if="appNeedsRefresh" aria-label="Reload page" :width="20" :height="20" @click.passive="updateServiceWorker">
        <svg
          aria-hidden="true"
          focusable="false"
          width="26px"
          height="26px"
          style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 512 512"
        ><path
          d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273c-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556c4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504C119.034 504 8.001 392.967 8 256.002C7.999 119.193 119.646 7.755 256.455 8z"
          fill="#626262"
        /></svg>
      </button>
      <button :aria-label="toastCancelAriaLabel" :width="20" :height="20" @click.passive="hideToast">
        <svg
          aria-hidden="true"
          focusable="false"
          width="32px"
          height="32px"
          style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 352 512"
        >
          <path
            d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28L75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256L9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
            fill="#626262"
          />
        </svg>
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
