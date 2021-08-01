require('esbuild-register')

const githubusercontent = 'https://repository-images.githubusercontent.com'

const hero = `${githubusercontent}/290129345/d4bfc300-1866-11eb-8602-e672c9dd0e7d`

/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: 'Vite Plugin PWA',
  description: 'Zero-config PWA for Vite',
  lang: 'en-US',
  themeConfig: {
    logo: '/favicon.svg',
    repo: 'antfu/vite-plugin-pwa',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit this page',
    lastUpdated: 'Last Updated',
  },
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ffffff' }],
    ['meta', { name: 'author', content: 'Anthony Fu' }],
    ['meta', { property: 'og:title', content: 'Vite Plugin PWA' }],
    ['meta', { property: 'og:image', content: hero }],
    ['meta', { property: 'og:description', content: 'Zero-config PWA for Vite' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@antfu7' }],
    ['meta', { name: 'twitter:image', content: hero }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: "180x180" }],
  ],
}

module.exports = config
