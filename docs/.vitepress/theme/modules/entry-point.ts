import type { PWABuilderData, PWABuilderResult } from '../types'

export function generateEntryPoint(
  { title, description, themeColor }: PWABuilderData,
  pwaBuilderResult: PWABuilderResult,
) {
  pwaBuilderResult.code = `
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="mask-icon" href="/mask-icon.svg" color="${themeColor}">
  <meta name="theme-color" content="${themeColor}">
</head>
`
}
