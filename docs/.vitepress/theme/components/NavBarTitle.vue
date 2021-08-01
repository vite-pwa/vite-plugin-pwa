<script setup lang="ts">
import { isDark } from '../composables/dark'
</script>

<template>
  <a
    class="nav-bar-title"
    href="/"
    aria-label="Vite Plugin PWA, back to home`"
  >
    <img
      class="logo"
      width="36"
      height="36"
      :class="isDark ? 'dark' : null"
      src="/favicon.svg"
      alt="Logo"
    >
    <span class="title">Vite Plugin PWA</span>
  </a>
</template>

<style scoped>
.nav-bar-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--c-text);
  vertical-align: center;
  white-space: nowrap;
  margin-right: 2rem;
}

.nav-bar-title:hover {
  text-decoration: none;
}

.logo {
  margin-right: .5rem;
  height: 2.2rem;
  vertical-align: middle;
  /*noinspection CssUnusedSymbol*/
  &.dark {
    filter: var(--hero-filter);
  }
}

.title {
  line-height: 2rem;
  vertical-align: middle;
}
</style>
