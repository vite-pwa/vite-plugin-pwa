import { generateHtmlMarkup } from '@vite-pwa/assets-generator/api/generate-html-markup'
import type { PWAPluginContext } from '../context'
import type { AssetsGeneratorContext, PWAHtmlAssets } from './types'
import { mapLink } from './utils'

export function transformIndexHtml(
  html: string,
  ctx: PWAPluginContext,
  assetsGeneratorContext: AssetsGeneratorContext,
) {
  if (assetsGeneratorContext.injectThemeColor) {
    const manifest = ctx.options.manifest
    if (manifest && 'theme_color' in manifest && manifest.theme_color) {
      html = html.replace(
        '</head>',
          `\n<meta name="theme-color" content="${manifest.theme_color}"></head>`,
      )
    }
  }

  if (assetsGeneratorContext.includeHtmlHeadLinks) {
    const link = generateHtmlMarkup(assetsGeneratorContext.assetsInstructions)
    if (link.length)
      html = html.replace('</head>', `\n${link.join('\n')}</head>`)
  }

  return html
}

export function resolveHtmlAssets(
  ctx: PWAPluginContext,
  assetsGeneratorContext: AssetsGeneratorContext,
) {
  const header: PWAHtmlAssets = {
    links: [],
    themeColor: undefined,
  }
  if (assetsGeneratorContext.injectThemeColor) {
    const manifest = ctx.options.manifest
    if (manifest && 'theme_color' in manifest && manifest.theme_color)
      header.themeColor = { name: 'theme-color', content: manifest.theme_color }
  }

  if (assetsGeneratorContext.includeHtmlHeadLinks) {
    const includeId = assetsGeneratorContext.includeId
    const instruction = assetsGeneratorContext.assetsInstructions
    const favicon = Array.from(Object.values(instruction.favicon))
    const apple = Array.from(Object.values(instruction.apple))
    const appleSplashScreen = Array.from(Object.values(instruction.appleSplashScreen))
    favicon.forEach(icon => icon.linkObject && header.links.push(mapLink(includeId, icon.linkObject)))
    apple.forEach(icon => icon.linkObject && header.links.push(mapLink(includeId, icon.linkObject)))
    appleSplashScreen.forEach(icon => icon.linkObject && header.links.push(mapLink(includeId, icon.linkObject)))
  }

  return header
}
