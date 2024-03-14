import type { PWAAssetsOptions, ResolvedPWAAssetsOptions } from '../types'

export function resolvePWAAssetsOptions(
  options?: PWAAssetsOptions,
) {
  if (!options)
    return false

  const {
    disabled: useDisabled,
    image = 'public/favicon.svg',
    htmlPreset = '2023',
    overrideManifestIcons = false,
    includeHtmlHeadLinks = true,
    injectThemeColor = true,
    integration,
  } = options ?? {}

  const configIncluded = 'config' in options && options.config !== undefined && options.config
  const presetIncluded = 'preset' in options && options.preset !== undefined && options.preset
  const usePreset = !configIncluded && !presetIncluded ? 'minimal-2023' : false

  const disabled = useDisabled || (!configIncluded && !usePreset)

  return {
    disabled,
    config: disabled || !configIncluded ? false : configIncluded,
    preset: disabled || configIncluded ? false : usePreset,
    images: [image],
    htmlPreset,
    overrideManifestIcons,
    includeHtmlHeadLinks,
    injectThemeColor,
    integration,
  } satisfies ResolvedPWAAssetsOptions
}
