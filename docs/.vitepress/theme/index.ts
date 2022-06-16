import { h } from 'vue'
import Theme from 'vitepress/theme'
import './styles/main.css'
import './styles/vars.css'
import 'uno.css'
import ReloadPrompt from './components/ReloadPrompt.vue'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      // TODO: review this when https://github.com/vuejs/vitepress/issues/760 included
      'layout-bottom': () => h(ReloadPrompt),
    })
  },
}
