<script setup lang="ts">
defineProps<{ optional?: boolean }>()
</script>

<template>
  <abbr
    v-if="optional !== true"
    title="required field"
    important="cursor-help decoration-none border-none hover:cursor-help"
  >(*)&#160;</abbr>
  <slot />
</template>
