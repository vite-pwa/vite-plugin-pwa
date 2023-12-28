declare module 'virtual:pwa-assets/head' {
  export interface PWAAssetHeadLink {
    id?: string
    rel: 'apple-touch-startup-image' | 'apple-touch-icon' | 'icon'
    href: string
    media?: string
    sizes?: string
    type?: string
  }

  export interface ColorSchemeMeta {
    name: string
    content: string
  }

  export interface PWAAssetsHead {
    links: PWAAssetHeadLink[]
    themeColor?: ColorSchemeMeta
  }

  export const pwaAssetsHead: PWAAssetsHead
}

declare module 'virtual:pwa-assets/icons' {
  import type {
    AppleSplashScreenLink,
    FaviconLink,
    HtmlLink,
    IconAsset,
  } from '@vite-pwa/assets-generator/api'

  export interface PWAAssetsIcons {
    favicon: Record<string, Omit<IconAsset<FaviconLink>, 'buffer'>>
    transparent: Record<string, Omit<IconAsset<HtmlLink>, 'buffer'>>
    maskable: Record<string, Omit<IconAsset<HtmlLink>, 'buffer'>>
    apple: Record<string, Omit<IconAsset<HtmlLink>, 'buffer'>>
    appleSplashScreen: Record<string, Omit<IconAsset<AppleSplashScreenLink>, 'buffer'>>
  }

  export const pwaAssetsIcons: PWAAssetsIcons
}
