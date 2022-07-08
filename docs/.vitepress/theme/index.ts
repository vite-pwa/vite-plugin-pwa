import { h } from 'vue'
import Theme from 'vitepress/theme'

import './styles/main.css'
import './styles/vars.css'

import 'uno.css'

import HomePage from './components/HomePage.vue'
import ReloadPrompt from './components/ReloadPrompt.vue'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'home-features-after': () => h(HomePage),
      'layout-bottom': () => h(ReloadPrompt),
    })
  },
}
