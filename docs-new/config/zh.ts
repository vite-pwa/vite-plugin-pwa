import { type DefaultTheme, defineConfig } from 'vitepress'

import { version } from '../../package.json'

const Guide = [
  {
    text: '开始',
    link: '/zh/guide/',
  },
  {
    text: 'Register Service Worker',
    link: '/zh/guide/register-service-worker',
  },
  {
    text: 'Service Worker Precache',
    link: '/zh/guide/service-worker-precache',
  },
  {
    text: 'PWA Minimal Requirements',
    link: '/zh/guide/pwa-minimal-requirements',
  },
  {
    text: 'Service Worker Strategies And Behaviors',
    link: '/zh/guide/service-worker-strategies-and-behaviors',
  },
  {
    text: 'Automatic reload',
    link: '/zh/guide/auto-update',
  },
  {
    text: 'Prompt for update',
    link: '/zh/guide/prompt-for-update',
  },
  {
    text: 'Advanced (injectManifest)',
    link: '/zh/guide/inject-manifest',
  },
  {
    text: 'Static assets handling',
    link: '/zh/guide/static-assets',
  },
  {
    text: 'Periodic SW updates',
    link: '/zh/guide/periodic-sw-updates',
  },
  {
    text: 'Development',
    link: '/zh/guide/development',
  },
  {
    text: 'Unregister Service Worker',
    link: '/zh/guide/unregister-service-worker',
  },
  {
    text: 'FAQ',
    link: '/zh/guide/faq',
  },
]

const Deployment = [
  {
    text: '开始',
    link: '/zh/deployment/',
  },
  {
    text: 'Netlify',
    link: '/zh/deployment/netlify',
  },
  {
    text: 'AWS Amplify',
    link: '/zh/deployment/aws',
  },
  {
    text: 'Vercel',
    link: '/zh/deployment/vercel',
  },
  {
    text: 'NGINX',
    link: '/zh/deployment/nginx',
  },
  {
    text: 'Apache Http Server 2.4+',
    link: '/zh/deployment/apache',
  },
]

const Frameworks = [
  {
    text: '开始',
    link: '/zh/frameworks/',
  },
  {
    text: 'Vue',
    link: '/zh/frameworks/vue',
  },
  {
    text: 'React',
    link: '/zh/frameworks/react',
  },
  {
    text: 'Svelte',
    link: '/zh/frameworks/svelte',
  },
  {
    text: 'SvelteKit',
    link: '/zh/frameworks/sveltekit',
  },
  {
    text: 'SolidJS',
    link: '/zh/frameworks/solidjs',
  },
  {
    text: 'Preact',
    link: '/zh/frameworks/preact',
  },
  {
    text: 'VitePress',
    link: '/zh/frameworks/vitepress',
  },
  {
    text: 'îles',
    link: '/zh/frameworks/iles',
  },
  {
    text: 'Astro (WIP)',
    link: '/zh/frameworks/astro',
  },
]

const Examples = [
  {
    text: '开始',
    link: '/zh/examples/',
  },
  {
    text: 'Vue',
    link: '/zh/examples/vue',
  },
  {
    text: 'React',
    link: '/zh/examples/react',
  },
  {
    text: 'Svelte',
    link: '/zh/examples/svelte',
  },
  {
    text: 'SvelteKit',
    link: '/zh/examples/sveltekit',
  },
  {
    text: 'SolidJS',
    link: '/zh/examples/solidjs',
  },
  {
    text: 'Preact',
    link: '/zh/examples/preact',
  },
  {
    text: 'VitePress',
    link: '/zh/examples/vitepress',
  },
  {
    text: 'îles',
    link: '/zh/examples/iles',
  },
  {
    text: 'Astro (WIP)',
    link: '/zh/examples/astro',
  },
]

const Workbox = [
  {
    text: '开始',
    link: '/zh/workbox/',
  },
  {
    text: 'generateSW',
    link: '/zh/workbox/generate-sw',
  },
  {
    text: 'injectManifest',
    link: '/zh/workbox/inject-manifest',
  },
]

function prepareSidebar(idx: number) {
  return [
    {
      text: '指南',
      collapsible: true,
      collapsed: true,
      items: Guide,
    },
    {
      text: '框架',
      collapsible: true,
      collapsed: true,
      items: Frameworks,
    },
    {
      text: '案例',
      collapsible: true,
      collapsed: true,
      items: Examples,
    },
    {
      text: '部署',
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

export const zh = defineConfig({
  lang: 'zh-Hans',
  description: '零配置与框架无关的Vite PWA插件',
  themeConfig: {
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: {
      label: '页面导航',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    editLink: {
      pattern: 'https://github.com/antfu/vite-plugin-pwa/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },
    algolia: {
      appId: 'TTO9T0AE3F',
      apiKey: '71bd3d3c7274205843267bb1ccb6b1a8',
      indexName: 'vite-plugin-pwa',
    },
    nav: [
      {
        text: '指南',
        items: [
          {
            text: '开始',
            link: '/zh/guide/',
          },
          {
            text: '框架',
            link: '/zh/frameworks/',
          },
          {
            text: '案例',
            link: '/zh/examples/',
          },
        ],
      },
      {
        text: '部署',
        link: '/zh/deployment/',
      },
      {
        text: 'Workbox',
        link: '/zh/workbox/',
      },
      {
        text: `v${version}`,
        items: [
          {
            text: '更新日志',
            link: 'https://github.com/antfu/vite-plugin-pwa/releases',
          },
          {
            text: '参与贡献',
            link: 'https://github.com/antfu/vite-plugin-pwa/blob/main/CONTRIBUTING.md',
          },
        ],
      },
    ],
    sidebar: {
      '/zh/guide/': prepareSidebar(0),
      '/zh/frameworks/': prepareSidebar(1),
      '/zh/examples/': prepareSidebar(2),
      '/zh/deployment/': prepareSidebar(3),
      '/zh/workbox/': prepareSidebar(4),
    },
  },
})

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  zh: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档',
      },
      modal: {
        searchBox: {
          resetButtonTitle: '清除查询条件',
          resetButtonAriaLabel: '清除查询条件',
          cancelButtonText: '取消',
          cancelButtonAriaLabel: '取消',
        },
        startScreen: {
          recentSearchesTitle: '搜索历史',
          noRecentSearchesText: '没有搜索历史',
          saveRecentSearchButtonTitle: '保存至搜索历史',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          favoriteSearchesTitle: '收藏',
          removeFavoriteSearchButtonTitle: '从收藏中移除',
        },
        errorScreen: {
          titleText: '无法获取结果',
          helpText: '你可能需要检查你的网络连接',
        },
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
          searchByText: '搜索提供者',
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          suggestedQueryText: '你可以尝试查询',
          reportMissingResultsText: '你认为该查询应该有结果？',
          reportMissingResultsLinkText: '点击反馈',
        },
      },
    },
  },
}
