require('esbuild-register')

const Guide = [
  {
    text: 'Getting Started',
    link: '/guide/',
  },
  {
    text: 'Generate Service Worker',
    link: '/guide/generate'
  },
  {
    text: 'Prompt for update',
    link: '/guide/prompt-for-update'
  },
  {
    text: 'Automatic reload',
    link: '/guide/auto-update'
  },
  {
    text: 'Advanced (injectManifest)',
    link: '/guide/inject-manifest'
  },
  {
    text: 'Static assets handling',
    link: '/guide/static-assets'
  },
  {
    text: 'Periodic SW updates',
    link: '/guide/periodic-sw-updates'
  },
  {
    text: 'SW Registration Errors',
    link: '/guide/sw-registration-errors'
  },
  {
    text: 'IDE Support',
    link: '/guide/ide',
  },
  {
    text: 'Testing Service Worker',
    link: '/guide/testing',
  },
]

const Deployment = [
  {
    text: 'Deployment',
    link: '/deployment/',
  },
  {
    text: 'Netlify',
    link: '/deployment/netlify',
  },
  {
    text: 'AWS Amplify',
    link: '/deployment/aws',
  },
  {
    text: 'Vercel',
    link: '/deployment/vercel',
  },
  {
    text: 'NGINX',
    link: '/deployment/nginx',
  },
  {
    text: 'Apache Http Server 2.4+',
    link: '/deployment/apache',
  },
]

const Frameworks = [
  {
    text: 'Vite',
    link: '/frameworks/',
  },
  {
    text: 'Vue',
    link: '/frameworks/vue',
  },
  {
    text: 'React',
    link: '/frameworks/react',
  },
  {
    text: 'Svelte',
    link: '/frameworks/svelte',
  },
  {
    text: 'Vitepress',
    link: '/frameworks/vitepress',
  },
]

const Examples = [
  {
    text: 'Examples',
    link: '/examples/',
  },
  {
    text: 'Vue',
    link: '/examples/vue',
  },
  {
    text: 'React',
    link: '/examples/react',
  },
  {
    text: 'Svelte',
    link: '/examples/svelte',
  },
  {
    text: 'Vitepress',
    link: '/examples/vitepress',
  },
]

const Workbox = [
  {
    text: 'Workbox',
    link: '/workbox/',
  },
  {
    text: 'generateWS',
    link: '/workbox/generate-ws',
  },
  {
    text: 'injectManifest',
    link: '/workbox/inject-manifest',
  },
]

const slidebars = [
  {
    text: 'Guide',
    children: Guide,
  },
  {
    text: 'Frameworks',
    children: Frameworks,
  },
  {
    text: 'Examples',
    children: Examples,
  },
  {
    text: 'Deployment',
    children: Deployment,
  },
  {
    text: 'Workbox',
    children: Workbox,
  },
]


/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  title: 'Vite Plugin PWA',
  description: 'Zero-config PWA for Vite',
  lang: 'en-US',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ffffff' }],
    ['meta', { name: 'author', content: 'Anthony Fu' }],
    ['meta', { property: 'og:title', content: 'Vite Plugin PWA' }],
    ['meta', { property: 'og:description', content: 'Zero-config PWA for Vite' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@antfu7' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: "180x180" }],
  ],
  themeConfig: {
    logo: '/favicon.svg',
    repo: 'antfu/vite-plugin-pwa',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit this page',
    lastUpdated: 'Last Updated',
    /*
      algolia: {
        apiKey: 'todo@antfu: replace this',
        indexName: 'vite-plugin-pwa',
        searchParameters: {
          // for translations maintainers: change the filter to your locale code (subdomain name)
          facetFilters: ['language:en']
        }
      },
    */
    nav: [
      {
        text: 'Guide',
        items: Guide,
      },
      {
        text: 'Frameworks',
        items: Frameworks,
      },
      {
        text: 'Examples',
        items: Examples,
      },
      {
        text: 'Deployment',
        items: Deployment,
      },
      {
        text: 'Workbox',
        items: Workbox,
      },
    ],
    sidebar: {
      '/guide/': slidebars,
      '/frameworks/': slidebars,
      '/examples/': slidebars,
      '/deployment/': slidebars,
      '/workbox/': slidebars,
      '/': slidebars,
    },
  },
}

module.exports = config
