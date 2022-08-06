<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { computed, nextTick } from 'vue'
import { PWABuilderResultData } from '../../modules/generatePWACode'
import PBResultEntry from './PBResultEntry.vue'

const { copy } = useClipboard()

const entries = computed(() => {
  return Object.entries(PWABuilderResultData).filter(([, v]) => v.enabled)
})

async function copyToClipboard(code?: string) {
  if (code) {
    await nextTick()
    await copy(code)
  }
}
</script>

<template>
  <section aria-labelledby="pwa-code">
    <h2 id="pwa-code">
      PWA Code
    </h2>
    <PBResultEntry
      v-for="[k, v] of entries"
      :key="k"
      :lang="v.codeType"
      :loading="v.loading"
      @copy="copyToClipboard(v.code)"
    >
      <template #summary>
        {{ v.title }}
      </template>
      <template #code>
        {{ v.code ?? '' }}
      </template>
    </PBResultEntry>
    <slot />
  </section>
</template>
