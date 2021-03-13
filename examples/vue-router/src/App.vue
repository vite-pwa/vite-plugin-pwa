<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
// import ReloadPrompt from './ReloadPrompt.vue'

// replaced dyanmicaly
const date = '__DATE__'
const timeAgo = useTimeAgo(date)
</script>

<template>
  <div>Built at: {{ date }} ({{ timeAgo }})</div>
  <br>
  <router-view v-slot="{ Component }">
    <suspense>
      <template #fallback>
        <div>Loading...</div>
      </template>
      <component :is="Component" />
    </suspense>
  </router-view>
<!--  <ReloadPrompt />-->
</template>
