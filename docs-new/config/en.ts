import { type DefaultTheme, defineConfig } from 'vitepress'

import { version } from '../../package.json'

const Guide = [
  {
    text: 'Getting Started',
    link: '/guide/',
  },
  {
    text: 'Register Service Worker',
    link: '/guide/register-service-worker',
  },
  {
    text: 'Service Worker Precache',
    link: '/guide/service-worker-precache',
  },
  {
    text: 'PWA Minimal Requirements',
    link: '/guide/pwa-minimal-requirements',
  },
  {
    text: 'Service Worker Strategies And Behaviors',
    link: '/guide/service-worker-strategies-and-behaviors',
  },
  {
    text: 'Automatic reload',
    link: '/guide/auto-update',
  },
  {
    text: 'Prompt for update',
    link: '/guide/prompt-for-update',
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
    text: 'Unregister Service Worker',
    link: '/guide/unregister-service-worker',
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

function prepareSidebar(idx: number) {
  return [
    {
      text: 'Guide',
      collapsible: true,
      collapsed: true,
      items: Guide,
    },
    {
      text: 'Frameworks',
      collapsible: true,
      collapsed: true,
      items: Frameworks,
    },
    {
      text: 'Examples',
      collapsible: true,
      collapsed: true,
      items: Examples,
    },
    {
      text: 'Deploy',
      collapsible: true,
      collapsed: true,
      items: Deployment,
    },
    {
      text: 'Workbox',
      collapsible: true,
      collapsed: true,
      items: Workbox,
    },
  ].map((entry, i) => {
    if (idx === i)
      entry.collapsed = false

    return entry
  })
}

export const en = defineConfig({
  lang: 'en-US',
  description: 'Zero-config PWA Framework-agnostic Plugin for Vite',
  themeConfig: {
    // logo: '/favicon.svg',
    editLink: {
      pattern: 'https://github.com/antfu/vite-plugin-pwa/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    algolia: {
      appId: 'TTO9T0AE3F',
      apiKey: '71bd3d3c7274205843267bb1ccb6b1a8',
      indexName: 'vite-plugin-pwa',
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
    sidebar: {
      '/guide/': prepareSidebar(0),
      '/frameworks/': prepareSidebar(1),
      '/examples/': prepareSidebar(2),
      '/deployment/': prepareSidebar(3),
      '/workbox/': prepareSidebar(4),
    },
  },
})
