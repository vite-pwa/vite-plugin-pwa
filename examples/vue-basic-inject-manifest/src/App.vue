<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import ReloadPrompt from './ReloadPrompt.vue'

// replaced dyanmicaly
const date = '__DATE__'
const timeAgo = useTimeAgo(date)
</script>

<template>
  <img src="/favicon.svg" width="60" height="60">
  <br>
  <div>Built at: {{ date }} ({{ timeAgo }})</div>
  <ReloadPrompt />
</template>
