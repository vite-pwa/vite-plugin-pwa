<script setup lang="ts">
import {
  useData,
  useRoute,
} from 'vitepress'
import {
  onClickOutside,
  useDebounceFn,
} from '@vueuse/core'

// generic state
const route = useRoute()
const { site, page, theme } = useData()

// custom layout
const isCustomLayout = computed(() => !!route.data.frontmatter.customLayout)
// home
const enableHome = computed(() => !!route.data.frontmatter.home)

// navbar
const showNavbar = computed(() => {
  const { themeConfig } = site.value
  const { frontmatter } = route.data
  if (frontmatter.navbar === false || themeConfig.navbar === false)
    return false

  return (
    page.value.title
      || themeConfig.logo
      || themeConfig.repo
      || themeConfig.nav
  )
})

const isHome = computed(() => route.path === '/' || route.path === '/index.html')

// sidebar
const sideBarRef = ref(null)
const openSideBar = ref(false)

const showSidebar = computed(() => {
  const { frontmatter } = route.data
  const { themeConfig } = site.value
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

const debounceClickOutside = useDebounceFn(() => {
  openSideBar.value = false
}, 128)

onClickOutside(sideBarRef, () => {
  // we need only debounce if shown
  // if the toggleSidebar clicked when hidden and we don't debounce
  // the sidebar will be closed
  if (showNavbar.value && openSideBar.value)
    debounceClickOutside()
})

const hideSidebar = toggleSidebar.bind(null, false)
// close the sidebar when navigating to a different location
watch(route, hideSidebar)
// TODO: route only changes when the pathname changes
// listening to hashchange does nothing because it's prevented in router

// page classes
const pageClasses = computed(() => {
  return [
    {
      'no-navbar': !showNavbar.value,
      'sidebar-open': openSideBar.value,
      'no-sidebar': !showSidebar.value,
    },
  ]
})
</script>

<template>
  <div class="theme" :class="pageClasses">
    <NavBar
      v-if="showNavbar"
      :show-sidebar="showSidebar"
      @toggle="toggleSidebar"
    >
      <!--      <template #search>
        <slot name="navbar-search">
          <AlgoliaSearchBox v-if="theme.algolia" :options="theme.algolia" />
        </slot>
      </template> -->
    </NavBar>

    <SideBar ref="sideBarRef" :open="openSideBar">
      <template #sidebar-top>
        <slot name="sidebar-top" />
      </template>
      <template #sidebar-bottom>
        <slot name="sidebar-bottom" />
      </template>
    </SideBar>

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

  <!--  <Debug /> -->

  <ClientOnly>
    <ReloadPrompt />
  </ClientOnly>
</template>
