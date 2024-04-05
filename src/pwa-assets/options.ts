import type { PWAAssetsOptions, ResolvedPWAAssetsOptions } from '../types'

export function resolvePWAAssetsOptions(
  options?: PWAAssetsOptions,
) {
  if (!options)
    return false

  const {
    disabled,
    preset = 'minimal-2023',
    image = 'public/favicon.svg',
    htmlPreset = '2023',
    overrideManifestIcons = false,
    includeHtmlHeadLinks = true,
    injectThemeColor = true,
    integration,
  } = options ?? {}

  const resolvedConfiguration: ResolvedPWAAssetsOptions = {
    disabled: true,
    config: false,
    preset: false,
    images: [image],
    htmlPreset,
    overrideManifestIcons,
    includeHtmlHeadLinks,
    injectThemeColor,
    integration,
  }

  if (disabled === true)
    return resolvedConfiguration

  if ('config' in options && !!options.config) {
    resolvedConfiguration.disabled = false
    resolvedConfiguration.config = options.config
    return resolvedConfiguration
  }

  if (preset === false)
    return resolvedConfiguration

  resolvedConfiguration.disabled = false
  resolvedConfiguration.preset = preset

  return resolvedConfiguration
}
