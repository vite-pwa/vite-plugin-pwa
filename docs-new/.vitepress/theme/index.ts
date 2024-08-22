// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import './styles/main.css'
import './styles/vars.css'

import 'uno.css'

import HomePage from './components/HomePage.vue'
import ReloadPrompt from './components/ReloadPrompt.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(HomePage),
      'layout-bottom': () => h(ReloadPrompt),
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
} satisfies Theme
