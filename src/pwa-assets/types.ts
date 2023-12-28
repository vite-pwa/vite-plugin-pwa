import type {
  AppleSplashScreenLink,
  FaviconLink,
  HtmlLink,
  IconAsset,
  ImageAssetsInstructions,
} from '@vite-pwa/assets-generator/api'

export interface PWAHtmlLink {
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

export interface ResolvedIconAsset {
  path: string
  mimeType: string
  // eslint-disable-next-line node/prefer-global/buffer
  buffer: Promise<Buffer>
  age: number
  lastModified: number
}

export interface PWAHtmlAssets {
  links: PWAHtmlLink[]
  themeColor?: ColorSchemeMeta
}

export interface AssetsGeneratorContext {
  lastModified: number
  assetsInstructions: ImageAssetsInstructions
  cache: Map<string, ResolvedIconAsset>
  useImage: string
  imageFile: string
  publicDir: string
  outDir: string
  imageName: string
  imageOutDir: string
  xhtml: boolean
  includeId: boolean
  sources: string[]
  injectThemeColor: boolean
  includeHtmlHeadLinks: boolean
  overrideManifestIcons: boolean
}

export interface PWAAssetsIcons {
  favicon: Record<string, Omit<IconAsset<FaviconLink>, 'buffer'>>
  transparent: Record<string, Omit<IconAsset<HtmlLink>, 'buffer'>>
  maskable: Record<string, Omit<IconAsset<HtmlLink>, 'buffer'>>
  apple: Record<string, Omit<IconAsset<HtmlLink>, 'buffer'>>
  appleSplashScreen: Record<string, Omit<IconAsset<AppleSplashScreenLink>, 'buffer'>>
}

export interface PWAAssetsGenerator {
  generate: () => Promise<void>
  findIconAsset: (path: string) => Promise<ResolvedIconAsset | undefined>
  resolveHtmlAssets: () => PWAHtmlAssets
  transformIndexHtml: (html: string) => string
  injectManifestIcons: () => void
  instructions: () => ImageAssetsInstructions
  icons: () => PWAAssetsIcons
  checkHotUpdate: (path: string) => Promise<boolean>
}
