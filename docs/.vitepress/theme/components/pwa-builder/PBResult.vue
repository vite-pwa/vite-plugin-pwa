<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { nextTick } from 'vue'
import { entrypointData, viteConfigData } from '../../modules/generatePWACode'
import PBResultEntry from './PBResultEntry.vue'

const { copy } = useClipboard()

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
    <PBResultEntry v-if="entrypointData.enabled" :lang="entrypointData.codeType" :loading="entrypointData.loading" @copy="copyToClipboard(entrypointData.code)">
      <template #summary>
        Entry Point (index.html)
      </template>
      <template #code>
        {{ entrypointData.code ?? '' }}
      </template>
    </PBResultEntry>
    <PBResultEntry v-if="viteConfigData.enabled" :lang="viteConfigData.codeType" :loading="viteConfigData.loading" @copy="copyToClipboard(viteConfigData.code)">
      <template #summary>
        Vite Plugin PWA Configuration
      </template>
      <template #code>
        {{ viteConfigData.code ?? '' }}
      </template>
    </PBResultEntry>
    <slot />
  </section>
</template>
