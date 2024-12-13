<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

// replaced dyanmicaly
const date = '__DATE__'
const timeAgo = useTimeAgo(date)

const router = useRouter()
</script>

<template>
  <div>Demo of dynamic route, built at: {{ date }} ({{ timeAgo }})</div>
  <p>
    {{ `Hi: ${props.name}` }}
  </p>
  <br>
  <div>
    <button @click="router.back()">
      BACK
    </button>
  </div>
</template>
