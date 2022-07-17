<script setup lang="ts">
import { nextTick, ref } from 'vue'

const props = defineProps<{
  loading: boolean
  lang: string
}>()

const emit = defineEmits<{
  (e: 'copy'): void
}>()

const copied = ref<boolean>(false)

async function copyToClipboard() {
  emit('copy')
  copied.value = true
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 2000))
  copied.value = false
}
</script>

<template>
  <details class="details custom-block">
    <summary v-if="loading" grid="~ cols-[1fr_auto]" items-center>
      <span>
        <slot name="summary" />
      </span>
      <span
        class="i-line-md:loading-twotone-loop w-28px h-28px"
      ><span />
      </span>
    </summary>
    <summary v-else>
      <slot name="summary" />
    </summary>
    <div v-if="!loading" :class="`language-${lang}`">
      <span :class="{ copied }" role="button" tabindex="0" aria-label="Copy code" class="copy" @click="copyToClipboard()" />
      <pre important="px-1rem py-0">
        <slot name="code" />
      </pre>
    </div>
  </details>
</template>

