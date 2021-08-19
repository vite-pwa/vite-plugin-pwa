<script setup lang="ts">
import { useData } from 'vitepress'
import { useLocaleLinks } from '../composables/nav'

const { site } = useData()
const localeLinks = useLocaleLinks()

const links = computed(() => site.value.themeConfig.nav)
const show = computed(() => links.value)
</script>

<template>
  <nav v-if="show" class="nav-links">
    <template v-if="links">
      <div v-for="item in links" :key="item.text" class="item">
        <NavDropdownLink v-if="item.items" :item="item" />
        <NavLink v-else :item="item" />
      </div>
    </template>

    <div v-if="localeLinks" class="item">
      <NavDropdownLink :item="localeLinks" />
    </div>
  </nav>
</template>

<style scoped>
.nav-links {
  padding: .75rem 0;
  border-bottom: 1px solid var(--c-divider);
}

@media (min-width: 780px) {
  .nav-links {
    display: flex;
    padding: 2px 0 0;
    align-items: center;
    border-bottom: 0;
  }

  .item + .item {
    padding-left: 18px;
  }
}
</style>
