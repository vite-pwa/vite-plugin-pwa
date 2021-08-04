<script setup lang="ts">
import { isDark } from '../composables/dark'

const icon = computed(() => {
  return isDark ? '/icon_dark.svg' : '/icon_light.svg'
})
</script>

<template>
  <img :src="icon" width="50" height="50" class="align-middle" alt="Vite Plugin PWA Logo"/>
</template>
