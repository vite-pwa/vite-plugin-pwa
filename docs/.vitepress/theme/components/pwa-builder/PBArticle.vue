<script setup lang="ts">
defineProps<{
  id: string
  title: string
}>()
</script>

<template>
  <article :id="id" :aria-labelledby="`${id}-label`" grid="~ cols-[1fr] gap-y-1rem">
    <h2 :id="`${id}-label`" important="border-none m-0 p-0">
      {{ title }}
    </h2>
    <slot />
  </article>
</template>
