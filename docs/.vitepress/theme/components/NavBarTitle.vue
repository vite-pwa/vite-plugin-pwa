<template>
  <a
    class="nav-bar-title"
    href="/"
    aria-label="Vite Plugin PWA, back to home`"
  >
    <span class="title">Vite Plugin</span>&#160;<PwaLogo class="logo" alt="Vite Plugin PWA Logo" />
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
  height: 3rem;
  vertical-align: middle;
}

.title {
  line-height: 2rem;
  vertical-align: middle;
}
</style>
