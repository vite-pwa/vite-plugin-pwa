<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const needRefresh = ref(false)

let updateServiceWorker: (() => Promise<void>) | undefined

const onNeedRefresh = () => {
  needRefresh.value = true
}
const close = async () => {
  needRefresh.value = false
}

onBeforeMount(async () => {
  const { registerSW } = await import('virtual:pwa-register')
  updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh,
  })
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="needRefresh"
      class="pwa-toast z-100 bg-$vp-c-bg border border-$pwa-divider fixed right-0 bottom-0 m-6 px-6 py-4 rounded shadow-xl"
      role="alertdialog"
      aria-labelledby="pwa-message"
    >
      <div id="pwa-message" class="mb-3">
        New content available, click the reload button to update.
      </div>
      <button
        type="button"
        class="border border-$pwa-divider bg-$vp-c-brand text-black mr-2 px-3 py-1 rounded hover:bg-$c-brand-light"
        @click="updateServiceWorker?.()"
      >
        Reload
      </button>
      <button
        type="button"
        class="border border-$pwa-divider text-black mr-2 px-3 py-1 rounded hover:bg-$c-brand-light"
        @click="close"
      >
        Close
      </button>
    </div>
  </Teleport>
</template>
