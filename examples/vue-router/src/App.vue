<script setup lang="ts">
import { ref } from 'vue'
import { useTimeAgo } from '@vueuse/core'
// import ReloadPrompt from './ReloadPrompt.vue'

// replaced dyanmicaly
const date = '__DATE__'
const timeAgo = useTimeAgo(date)
const loaing = ref(false)
</script>

<template>
  <div>Built at: {{ date }} ({{ timeAgo }})</div>
  <br>
  <!--  <router-view />-->
  <div :class="{ loading }">
    <router-view v-slot="{ Component, route }">
      <template v-if="Component">
        <transition mode="out-in">
          <keep-alive>
            <suspense
              @pending="loading = true"
              @resolve="loading = false"
            >
              <template #default>
                <!-- this will not work: our components has more than one root -->
                <div>
                  <component :is="Component" :key="route.fullPath" />
                </div>
              </template>
              <template #fallback>
                <div>Loading...</div>
              </template>
            </suspense>
          </keep-alive>
        </transition>
      </template>
    </router-view>
  </div>
<!--  <ReloadPrompt />-->
</template>
