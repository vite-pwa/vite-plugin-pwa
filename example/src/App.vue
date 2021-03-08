<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import PwaToast from './PwaToast.vue'

const date = '__DATE__'
const timeAgo = useTimeAgo(date)
</script>

<template>
  <div>Built at: {{ date }} ({{ timeAgo }})</div>
  <PwaToast />
</template>
