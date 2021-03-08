<script setup lang="ts">
import PwaToast from './PwaToast.vue'
import { useTimeAgo } from '@vueuse/core'

const date = '__DATE__'
const timeAgo = useTimeAgo(date)
</script>

<template>
  <div>Built at: {{ date }} ({{ timeAgo }})</div>
  <PwaToast/>
</template>
