import type { UserConfig } from 'vitepress'

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
    text: 'Development',
    link: '/guide/development',
  },
  {
    text: 'Testing Service Worker',
    link: '/guide/testing',
  },
  {
    text: 'FAQ',
    link: '/guide/faq',
  },
]

const Deployment = [
  {
    text: 'Getting Started',
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
    text: 'Getting Started',
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
    text: 'SvelteKit',
    link: '/frameworks/sveltekit',
  },
  {
    text: 'SolidJS',
    link: '/frameworks/solidjs',
  },
  {
    text: 'Preact',
    link: '/frameworks/preact',
  },
  {
    text: 'VitePress',
    link: '/frameworks/vitepress',
  },
]

const Examples = [
  {
    text: 'Getting Started',
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
    text: 'SvelteKit',
    link: '/examples/sveltekit',
  },
  {
    text: 'SolidJS',
    link: '/examples/solidjs',
  },
  {
    text: 'Preact',
    link: '/examples/preact',
  },
  {
    text: 'VitePress',
    link: '/examples/vitepress',
  },
]

const Workbox = [
  {
    text: 'Getting Started',
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
    children: Guide.map((e) => {
      (e as any).useLinkText = `${e.text} | Guide`
      return e
    }),
  },
  {
    text: 'Frameworks',
    children: Frameworks.map((e) => {
      (e as any).useLinkText = `${e.text} | Frameworks`
      return e
    }),
  },
  {
    text: 'Examples',
    children: Examples.map((e) => {
      (e as any).useLinkText = `${e.text} | Examples`
      return e
    }),
  },
  {
    text: 'Deployment',
    children: Deployment.map((e) => {
      (e as any).useLinkText = `${e.text} | Deployment`
      return e
    }),
  },
  {
    text: 'Workbox',
    children: Workbox.map((e) => {
      (e as any).useLinkText = `${e.text} | Workbox`
      return e
    }),
  },
]

const config: UserConfig = {
  title: 'Vite Plugin PWA',
  description: 'Zero-config PWA Framework-agnostic Plugin for Vite',
  lang: 'en-US',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ffffff' }],
    ['meta', { name: 'author', content: 'Anthony Fu' }],
    ['meta', { name: 'keywords', content: 'react, pwa, vue, vitepress, preact, svelte, sveltekit, workbox, solidjs, vite, vite-plugin' }],
    ['meta', { property: 'og:title', content: 'Vite Plugin PWA' }],
    ['meta', { property: 'og:description', content: 'Zero-config PWA Framework-agnostic Plugin for Vite' }],
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

export default config
