import type {
  AppleSplashScreenLink,
  FaviconLink,
  HtmlLink,
  ImageAssetsInstructions,
} from '@vite-pwa/assets-generator/api'
import type { PWAAssetsIcons, PWAHtmlLink } from './types'

export function mapLink(
  includeId: boolean,
  link: HtmlLink | FaviconLink | AppleSplashScreenLink,
) {
  const linkObject: PWAHtmlLink = {
    href: link.href,
    rel: link.rel,
  }

  if (includeId && link.id)
    linkObject.id = link.id

  if ('media' in link && link.media)
    linkObject.media = link.media

  linkObject.href = link.href

  if ('sizes' in link && link.sizes)
    linkObject.sizes = link.sizes

  if ('type' in link && link.type)
    linkObject.type = link.type

  return linkObject
}

export function extractIcons(instructions?: ImageAssetsInstructions) {
  const icons: PWAAssetsIcons = {
    favicon: {},
    transparent: {},
    maskable: {},
    apple: {},
    appleSplashScreen: {},
  }

  if (instructions) {
    Array.from(Object.values(instructions.favicon)).forEach(({ buffer: _buffer, ...rest }) => {
      if (rest.url)
        icons.favicon[rest.url] = { ...rest }
    })
    Array.from(Object.values(instructions.transparent)).forEach(({ buffer: _buffer, ...rest }) => {
      if (rest.url)
        icons.transparent[rest.url] = { ...rest }
    })
    Array.from(Object.values(instructions.maskable)).forEach(({ buffer: _buffer, ...rest }) => {
      if (rest.url)
        icons.maskable[rest.url] = { ...rest }
    })
    Array.from(Object.values(instructions.apple)).forEach(({ buffer: _buffer, ...rest }) => {
      if (rest.url)
        icons.apple[rest.url] = { ...rest }
    })
    Array.from(Object.values(instructions.appleSplashScreen)).forEach(({ buffer: _buffer, ...rest }) => {
      if (rest.url)
        icons.appleSplashScreen[rest.url] = { ...rest }
    })
  }

  return icons
}
