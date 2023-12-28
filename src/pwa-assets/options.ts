import type { PWAAssetsOptions, ResolvedPWAAssetsOptions } from '../types'

export function resolvePWAAssetsOptions(
  options?: PWAAssetsOptions,
) {
  const {
    disabled: useDisabled,
    config,
    preset,
    image = 'public/favicon.svg',
    htmlPreset = '2023',
    overrideManifestIcons = false,
    includeHtmlHeadLinks = true,
    injectThemeColor = true,
  } = options ?? {}

  const disabled = useDisabled || (!config && !preset)

  return {
    disabled,
    config: disabled || !config ? false : config,
    preset: disabled || config ? false : preset ?? 'minimal-2023',
    images: [image],
    htmlPreset,
    overrideManifestIcons,
    includeHtmlHeadLinks,
    injectThemeColor,
  } satisfies ResolvedPWAAssetsOptions
}
