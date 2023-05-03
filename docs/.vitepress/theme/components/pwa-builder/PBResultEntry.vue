<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  loading: boolean
  lang: string
}>()

const emit = defineEmits<{
  (e: 'copy'): void
}>()

const copied = ref(false)

async function copyToClipboard() {
  if (copied.value)
    return

  copied.value = true
  emit('copy')
  // use the same timeout on VitePress copy-code module
  await new Promise(resolve => setTimeout(resolve, 3000))
  copied.value = false
}
</script>

<template>
  <details class="details custom-block">
    <summary v-if="loading" grid="~ cols-[1fr_auto]" items-center>
      <span>
        <slot name="summary" />
      </span>
      <span class="i-line-md:loading-twotone-loop w-24px h-24px" />
    </summary>
    <summary v-else>
      <slot name="summary" />
    </summary>
    <div v-if="!loading" class="entry-lang" :class="`language-${lang}`">
      <span :class="{ copied }" role="button" tabindex="0" aria-label="Copy code" class="copy" @click="copyToClipboard()" />
      <pre important="px-1rem py-0">
        <slot name="code" />
      </pre>
    </div>
  </details>
</template>
