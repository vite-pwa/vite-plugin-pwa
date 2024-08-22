import type { Plugin } from 'vite'

export default function NavbarFix(): Plugin {
  return {
    name: 'vitepress-sidebar-logo-fix',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('VPNavBarTitle.vue') && !id.endsWith('.css') && !id.includes('&setup=')) {
        return `
<script setup lang="ts">
import { useData } from 'vitepress'
import { useSidebar } from '../composables/sidebar'

const { site, theme } = useData()
const { hasSidebar } = useSidebar()
</script>

<template>
  <div class="VPNavBarTitle" :class="{ 'has-sidebar': hasSidebar }">
    <a class="title" :href="site.base">
      Vite Plugin&#160;
      <img dark-logo class="logo" src="/icon_dark.svg" alt="Vite PWA Plugin dark logo" width="50" height="50">
      <img light-logo class="logo" src="/icon_light.svg" alt="Vite PWA Plugin light logo" width="50" height="50">
    </a>
  </div>
</template>

<style scoped>
.VPNavBarTitle {
  flex-shrink: 0;
  border-bottom: 1px solid transparent;
}

@media (min-width: 960px) {
  .VPNavBarTitle.has-sidebar {
    margin-right: 32px;
    width: calc(var(--vp-sidebar-width) - 64px);
    border-bottom-color: var(--vp-c-divider-light);
    background-color: var(--vp-c-bg-alt);
  }
}

.title {
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--vp-nav-height);
  font-size: 1.3rem;
  line-height: 2rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: opacity 0.25s;
}

@media (min-width: 960px) {
  .title {
    flex-shrink: 0;
  }
}

.logo {
  width: 50px;
  height: 50px;
}
</style>
`
      }
    },
  }
}
