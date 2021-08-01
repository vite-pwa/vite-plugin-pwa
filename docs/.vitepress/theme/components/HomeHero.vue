<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter: data } = useData()

const heroImage = computed(() => data.value.heroImage)
</script>

<template>
  <header class="home-hero">

    <p class="hero-img">
      <a href="https://github.com/antfu/vite-plugin-pwa" target="_blank" rel="noopener">
        <img :src="heroImage" alt="Zero-config PWA for Vite" width="840" height="420">
      </a>
      <br>
    </p>
    <div class="description">
      <!-- todo@userquin: replace with version? -->
      Zero-config PWA for Vite
    </div>

    <div class="nav-link action">
      <a href="/guide" class="item action mx-2">Get Started </a>
    </div>

<!--    <NavLink-->
<!--      :item="{ link: data.actionLink, text: data.actionText }"-->
<!--      class="action mx-2"-->
<!--    />-->

  </header>
</template>

<style scoped>
.home-hero {
  margin: 0 0 2.75rem;
  padding: 0 1.5rem;
  text-align: center;
  .hero-img {
    text-align: center;
    img {
      object-fit: scale-down;
      filter: var(--hero-filter);
    }
  }
}

@media (min-width: 421px) and (max-width: 890px) {
  .home-hero {
    margin: 0 0 4.25rem;
  }
}

@media (max-width: 420px) {
  .home-hero {
    margin: 0 0;
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
  margin-top: 1.5rem;
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
  color: #ffffff;
  background-color: var(--c-brand);
  transition: background-color 0.1s ease;
}

.action :deep(.item:hover) {
  text-decoration: none;
  color: #ffffff;
  background-color: var(--c-brand-light);
}

.action.alt :deep(.item) {
  background-color: #476582;
}

.action.alt :deep(.item:hover) {
  background-color: #304a64;
}
</style>
