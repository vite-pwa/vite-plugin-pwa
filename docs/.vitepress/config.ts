import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

const Guide = [
  {
    text: 'Getting Started',
    link: '/guide/',
  },
  {
    text: 'Generate Service Worker',
    link: '/guide/generate',
  },
  {
    text: 'Prompt for update',
    link: '/guide/prompt-for-update',
  },
  {
    text: 'Automatic reload',
    link: '/guide/auto-update',
  },
  {
    text: 'Advanced (injectManifest)',
    link: '/guide/inject-manifest',
  },
  {
    text: 'Static assets handling',
    link: '/guide/static-assets',
  },
  {
    text: 'Periodic SW updates',
    link: '/guide/periodic-sw-updates',
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
  {
    text: 'îles',
    link: '/frameworks/iles',
  },
  {
    text: 'Astro (WIP)',
    link: '/frameworks/astro',
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
  {
    text: 'îles',
    link: '/examples/iles',
  },
  {
    text: 'Astro (WIP)',
    link: '/examples/astro',
  },
]

const Workbox = [
  {
    text: 'Getting Started',
    link: '/workbox/',
  },
  {
    text: 'generateSW',
    link: '/workbox/generate-sw',
  },
  {
    text: 'injectManifest',
    link: '/workbox/inject-manifest',
  },
]

export default defineConfig({
  lang: 'en-US',
  title: 'Vite Plugin PWA',
  description: 'Zero-config PWA Framework-agnostic Plugin for Vite',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ffffff' }],
    ['meta', { name: 'author', content: 'Anthony Fu' }],
    ['meta', {
      name: 'keywords',
      content: 'PWA, React, Vue, VitePress, Preact, Svelte, SvelteKit, workbox, SolidJS, Vite, vite-plugin, îles, Astro',
    }],
    ['meta', { property: 'og:title', content: 'Vite Plugin PWA' }],
    ['meta', { property: 'og:description', content: 'Zero-config PWA Framework-agnostic Plugin for Vite' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@antfu7' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
  ],
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
  themeConfig: {
    // logo: '/favicon.svg',
    editLink: {
      pattern: 'https://github.com/antfu/vite-plugin-pwa/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    /* TODO: replace it with the requested PWA repo (rn with Vitest ones for testing)
    algolia: {
      appId: 'ZTF29HGJ69',
      apiKey: '9c3ced6fed60d2670bb36ab7e8bed8bc',
      indexName: 'vitest',
    },
    */
    socialLinks: [
      { icon: 'discord', link: 'https://chat.antfu.me' },
      { icon: 'github', link: 'https://github.com/antfu/vite-plugin-pwa' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-PRESENT Anthony Fu',
    },
    nav: [
      {
        text: 'Guide',
        items: [
          {
            text: 'Getting Started',
            link: '/guide/',
          },
          {
            text: 'Frameworks',
            link: '/frameworks/',
          },
          {
            text: 'Examples',
            link: '/examples/',
          },
        ],
      },
      {
        text: 'Deploy',
        link: '/deployment/',
      },
      {
        text: 'Workbox',
        link: '/workbox/',
      },
      // {
      //   text: 'Frameworks',
      //   items: Frameworks,
      // },
      // {
      //   text: 'Examples',
      //   items: Examples,
      // },
      // {
      //   text: 'Deployment',
      //   items: Deployment,
      // },
      // {
      //   text: 'Workbox',
      //   items: Workbox,
      // },
      {
        text: `v${version}`,
        items: [
          {
            text: 'Release Notes',
            link: 'https://github.com/antfu/vite-plugin-pwa/releases',
          },
          {
            text: 'Contributing',
            link: 'https://github.com/antfu/vite-plugin-pwa/blob/main/CONTRIBUTING.md',
          },
        ],
      },
    ],
    // TODO: switch this when VitePress alpha-3 released (maybe next week?)
    // sidebar: {
    //   '/guide/': [
    //     {
    //       text: 'Guide',
    //       collapsible: true,
    //       collapsed: false,
    //       items: Guide,
    //     },
    //     {
    //       text: 'Frameworks',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Frameworks,
    //     },
    //     {
    //       text: 'Examples',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Examples,
    //     },
    //     {
    //       text: 'Deploy',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Deployment,
    //     },
    //     {
    //       text: 'Workbox',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Workbox,
    //     },
    //   ],
    //   '/frameworks/': [
    //     {
    //       text: 'Guide',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Guide,
    //     },
    //     {
    //       text: 'Frameworks',
    //       collapsible: true,
    //       collapsed: false,
    //       items: Frameworks,
    //     },
    //     {
    //       text: 'Examples',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Examples,
    //     },
    //     {
    //       text: 'Deploy',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Deployment,
    //     },
    //     {
    //       text: 'Workbox',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Workbox,
    //     },
    //   ],
    //   '/examples/': [
    //     {
    //       text: 'Guide',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Guide,
    //     },
    //     {
    //       text: 'Frameworks',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Frameworks,
    //     },
    //     {
    //       text: 'Examples',
    //       collapsible: true,
    //       collapsed: false,
    //       items: Examples,
    //     },
    //     {
    //       text: 'Deploy',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Deployment,
    //     },
    //     {
    //       text: 'Workbox',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Workbox,
    //     },
    //   ],
    //   '/deployment/': [
    //     {
    //       text: 'Guide',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Guide,
    //     },
    //     {
    //       text: 'Frameworks',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Frameworks,
    //     },
    //     {
    //       text: 'Examples',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Examples,
    //     },
    //     {
    //       text: 'Deploy',
    //       collapsible: true,
    //       collapsed: false,
    //       items: Deployment,
    //     },
    //     {
    //       text: 'Workbox',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Workbox,
    //     },
    //   ],
    //   '/workbox/': [
    //     {
    //       text: 'Guide',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Guide,
    //     },
    //     {
    //       text: 'Frameworks',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Frameworks,
    //     },
    //     {
    //       text: 'Examples',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Examples,
    //     },
    //     {
    //       text: 'Deploy',
    //       collapsible: true,
    //       collapsed: true,
    //       items: Deployment,
    //     },
    //     {
    //       text: 'Workbox',
    //       collapsible: true,
    //       collapsed: false,
    //       items: Workbox,
    //     },
    //   ],
    // },
    sidebar: [
      {
        text: 'Guide',
        collapsible: true,
        items: Guide,
      },
      {
        text: 'Frameworks',
        collapsible: true,
        items: Frameworks,
      },
      {
        text: 'Examples',
        collapsible: true,
        items: Examples,
      },
      {
        text: 'Deploy',
        collapsible: true,
        items: Deployment,
      },
      {
        text: 'Workbox',
        collapsible: true,
        items: Workbox,
      },
    ],
  },
})
