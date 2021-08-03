<script setup lang="ts">
import { isDark } from '../composables/dark'
</script>

<template>
  <header class="home-hero">

    <p class="hero-img">
      <a href="https://github.com/antfu/vite-plugin-pwa" target="_blank" rel="noopener">
        <img v-show="isDark" src="/banner_dark.svg" alt="Zero-config PWA for Vite" width="700">
        <img v-show="!isDark" src="/banner_light.svg" alt="Zero-config PWA for Vite" width="700">
      </a>
    </p>

    <!-- <p class="version-img">
      <a href="https://www.npmjs.com/package/vite-plugin-pwa" target="_blank" rel="noopener">
        <img src="https://img.shields.io/npm/v/vite-plugin-pwa?color=2e859c&label="  alt="Zero-config PWA for Vite NPM" width="45" height="20">
      </a>
      <br>
    </p> -->

    <div class="-mt-10 mb-40">
      <NavLink :item="{ link: '/guide/', text: 'Get Started' }" class="action mx-2" />
    </div>
  </header>
</template>

<style scoped lang="postcss">
.home-hero {
  margin: 0 0 1rem;
  padding: 0;
  text-align: center;
  .hero-img {
    text-align: center;
    img {
      object-fit: scale-down;
    }
  }
}

@media (max-width: 420px) {
  .home-hero {
    margin: 0 0;
  }
  .version-img {
    margin-bottom: 0;
  }
}

.figure {
  padding: 0 1.5rem;
}

.image {
  display: block;
  margin: 0 auto;
  width: auto;
  max-width: 100%;
  max-height: 280px;
}

.title {
  margin-top: 1.5rem;
  font-size: 2rem;
}

@media (min-width: 420px) {
  .title {
    font-size: 3rem;
  }
}

@media (min-width: 720px) {
  .title {
    margin-top: 2rem;
  }
}

.description {
  margin: 0;
  line-height: 1.3;
  font-size: 1.2rem;
  color: var(--c-text-light);
}

.action {
  margin-top: 1rem;
  display: inline-block;
}

.action.alt {
  margin-left: 1.5rem;
}

@media (min-width: 420px) {
  .action {
    margin-top: 2rem;
    display: inline-block;
  }
}

.action :deep(.item) {
  display: inline-block;
  border-radius: 6px;
  padding: 0 18px;
  line-height: 40px;
  font-size: 1.1rem;
  font-weight: 500;
  border: 0;
  color: var(--c-bg);
  background-color: var(--c-brand);
  transition: background-color 0.1s ease;
}

.action :deep(.item:hover) {
  text-decoration: none;
  color: var(--c-bg);
  background-color: var(--c-brand-light);
}

.action.alt :deep(.item) {
  background-color: #476582;
}

.action.alt :deep(.item:hover) {
  background-color: #304a64;
}
</style>
