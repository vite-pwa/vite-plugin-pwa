<template>
  <a
    class="nav-bar-title"
    href="/"
    aria-label="Vite Plugin PWA, back to home`"
  >
    <span class="title">Vite Plugin</span>&#160;<PwaLogo />
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

.title {
  line-height: 2rem;
  vertical-align: middle;
}
</style>
