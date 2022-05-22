<script setup lang="ts">
import { isDark } from '../composables/dark'
</script>

<template>
  <img v-show="!isDark" src="/icon_light.svg" width="50" height="50" class="align-middle" alt="Vite Plugin PWA Logo">
  <img v-show="isDark" src="/icon_dark.svg" width="50" height="50" class="align-middle" alt="Vite Plugin PWA Logo">
</template>
