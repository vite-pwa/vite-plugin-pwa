<script setup lang="ts">
defineProps({
  showSidebar: { type: Boolean, required: true },
})
defineEmits(['toggle'])
</script>

<template>
  <header class="nav-bar" :class="{'no-toggle-btn': !showSidebar}">
    <ToggleSideBarButton v-if="showSidebar"  @toggle="$emit('toggle')" />

    <NavBarTitle />

    <div class="flex-grow" />

    <div class="nav">
      <NavLinks />
    </div>

    <div class="nav-icons">
      <div class="item">
        <a class="icon-button" href="https://github.com/antfu/vite-plugin-pwa" target="_blank" rel="noopener" aria-label="View GitHub Repo">
          <carbon-logo-github />
        </a>
      </div>

      <div class="item">
        <dark-mode-switch />
      </div>
    </div>

    <slot name="search" />
  </header>
</template>

<style scoped>
.nav-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--z-index-navbar);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--c-divider);
  padding: 0.7rem 1.5rem 0.7rem 4rem;
  height: var(--header-height);
  background-color: var(--c-bg);
}

.nav-bar.no-toggle-btn {
  padding-left: 1.5rem;
}

.nav-bar.root {
  border-color: transparent;
  background-color: var(--c-bg-semi);
}

@media (min-width: 720px) {
  .nav-bar {
    padding: 0.7rem 0.8rem 0.7rem 1.5rem;
  }
}

.flex-grow {
  flex-grow: 1;
}

.nav {
  display: none;
}

@media (min-width: 720px) {
  .nav {
    display: flex;
  }
  .navbar__dark-mode {
    display: none;
  }
}

.nav-icons {
  display: flex;
  padding: 2px 0 0;
  align-items: center;
  border-bottom: 0;
  margin-left: 12px;
}

.nav-icons .item {
  padding-left: 12px;
}
</style>
