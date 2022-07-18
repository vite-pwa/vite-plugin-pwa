import type { PWABuilderData, PWABuilderResult } from '../types'

export function generateEntryPoint(
  { scope, title, description, themeColor, favicon }: PWABuilderData,
  pwaBuilderResult: PWABuilderResult,
) {
  const favicons: string[] = []
  if (favicon === 'both') {
    favicons.push(
        `<link rel="icon" href="${scope}favicon.svg" type="image/svg+xml">`,
        `<link rel="alternate icon" href="${scope}favicon.ico" type="image/png" sizes="16x16">`,
    )
  }
  else {
    favicons.push(
      favicon === 'ico'
        ? `<link rel="icon" href="${scope}favicon.ico">`
        : `<link rel="icon" href="${scope}favicon.svg" type="image/svg+xml">`,
    )
  }
  pwaBuilderResult.code = `
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  ${favicons.join('\n  ')}  
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="mask-icon" href="/mask-icon.svg" color="${themeColor}">
  <meta name="theme-color" content="${themeColor}">
</head>
`
}
