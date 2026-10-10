import type { PWAPluginContext } from '../context'
import type { AssetsGeneratorContext, ColorSchemeMeta, PWAHtmlAssets } from './types'
import { generateHtmlMarkup } from '@vite-pwa/assets-generator/api/generate-html-markup'
import { checkForHtmlHead } from '../html'
import { mapLink } from './utils'

export function transformIndexHtml(
  html: string,
  ctx: PWAPluginContext,
  assetsGeneratorContext: AssetsGeneratorContext,
) {
  if (assetsGeneratorContext.injectThemeColor) {
    const themeColors = resolveThemeColors(ctx)
    if (themeColors.length) {
      html = checkForHtmlHead(html).replace(
        '</head>',
        `\n${themeColors.map(colorSchemeMetaToHtml).join('\n')}</head>`,
      )
    }
  }

  if (assetsGeneratorContext.includeHtmlHeadLinks) {
    const link = generateHtmlMarkup(assetsGeneratorContext.assetsInstructions)
    if (link.length)
      html = checkForHtmlHead(html).replace('</head>', `\n${link.join('\n')}</head>`)
  }

  return html
}

export function resolveHtmlAssets(
  ctx: PWAPluginContext,
  assetsGeneratorContext: AssetsGeneratorContext,
) {
  const header: PWAHtmlAssets = {
    links: [],
    themeColors: [],
  }
  if (assetsGeneratorContext.injectThemeColor)
    header.themeColors = resolveThemeColors(ctx)

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

function resolveThemeColors(ctx: PWAPluginContext): ColorSchemeMeta[] {
  const manifest = ctx.options.manifest
  if (!manifest || !('theme_color' in manifest) || !manifest.theme_color)
    return []

  const themeColor: ColorSchemeMeta = {
    name: 'theme-color',
    content: manifest.theme_color,
  }
  if (
    !('color_scheme_dark' in manifest)
    || !manifest.color_scheme_dark
    || !('theme_color' in manifest.color_scheme_dark)
    || !manifest.color_scheme_dark.theme_color
  ) {
    return [themeColor]
  }

  themeColor.media = '(prefers-color-scheme: light)'
  return [
    themeColor,
    {
      name: 'theme-color',
      content: manifest.color_scheme_dark.theme_color,
      media: '(prefers-color-scheme: dark)',
    },
  ]
}

function colorSchemeMetaToHtml(meta: ColorSchemeMeta) {
  return `<meta name="${meta.name}" content="${meta.content}"${meta.media ? ` media="${meta.media}"` : ''}>`
}
