<script setup lang="ts">
import { useRoute } from 'vitepress'

// generic state
const route = useRoute()

// home
const enableHome = computed(() => {
  return route.data?.frontmatter?.home || false
})
/*

// sidebar
const openSideBar = ref(false)

const showSidebar = computed(() => {
  const { frontmatter } = route.data
  const { themeConfig } = siteRouteData.value
  return (
      !frontmatter.home
      && frontmatter.sidebar !== false
      && ((typeof themeConfig.sidebar === 'object'
              && Object.keys(themeConfig.sidebar).length !== 0)
          || (Array.isArray(themeConfig.sidebar) && themeConfig.sidebar.length !== 0))
  )
})

const toggleSidebar = (to?: boolean) => {
  openSideBar.value = typeof to === 'boolean' ? to : !openSideBar.value
}

const hideSidebar = toggleSidebar.bind(null, false)
// close the sidebar when navigating to a different location
watch(route, hideSidebar)
*/

</script>

<template>
  <div class="theme">

<!--    <NavBar v-if="showNavbar" @toggle="toggleSidebar">-->
    <NavBar>
<!--      <template #search>
        <slot name="navbar-search">
          <AlgoliaSearchBox v-if="theme.algolia" :options="theme.algolia" />
        </slot>
      </template>-->
    </NavBar>

    <Home v-if="enableHome">
      <template #hero>
        <slot name="home-hero" />
      </template>
      <template #features>
        <slot name="home-features" />
      </template>
      <template #footer>
        <slot name="home-footer" />
      </template>
    </Home>

    <Page v-else>
      <template #top>
        <slot name="page-top" />
      </template>
      <template #bottom>
        <slot name="page-bottom" />
      </template>
    </Page>

  </div>

  <ClientOnly>
    <ReloadPrompt />
  </ClientOnly>

</template>
