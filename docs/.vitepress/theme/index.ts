import 'vue-global-api'

import Layout from './Layout.vue'
import NotFound from './NotFound.vue'

import './styles/vars.css'
import './styles/layout.css'
import './styles/sidebar-links.css'

import 'virtual:windi.css'

const theme = {
    Layout,
    NotFound,
    enhanceApp({ app, router }) {
        // @ts-ignore
        if  (typeof window !== 'undefined') {
            console.log(app)
            console.log(router)
        }
    },
}

export default theme
