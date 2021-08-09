<template>
  <main class="home">
    <HomeHero />
    <slot name="hero" />
    <HomeFeatures />
    <slot name="features" />
    <HomeFooter />
    <slot name="footer" />
  </main>
</template>

<style scoped>
.home {
  padding-top: var(--header-height);
}
.home :deep(.home-hero) {
  width: clamp(800px, 100%, 100%);
}

@media (min-width: 421px) and (max-width: 890px) {
  .home :deep(.home-hero) {
    width: clamp(421px, 100%, 890px);
  }
}
@media (max-width: 420px) {
  .home :deep(.home-hero) {
    width: clamp(100px, 100%, 420px);
  }
}
</style>
