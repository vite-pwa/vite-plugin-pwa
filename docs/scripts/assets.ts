import fg from 'fast-glob'
import fs from 'fs-extra'
// import critical from 'critical'

const firaFont = 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap'

const googleapis = 'https://fonts.googleapis.com'
const gstatic = 'https://fonts.gstatic.com'

const preconnect = `
    <link rel="dns-prefetch" href="${googleapis}">
    <link rel="dns-prefetch" href="${gstatic}">
    <link rel="preconnect" crossorigin="anonymous" href="${googleapis}">
    <link rel="preconnect" crossorigin="anonymous" href="${gstatic}">
`

export const optimizePages = async () => {
  const names = await fg('./.vitepress/dist/**/*.html', { onlyFiles: true })

  await Promise.all(names.map(async (i) => {
    let html = await fs.readFile(i, 'utf-8')

    let preloadImg = '\n\t<link rel="prefetch" href="/icon_light.svg">\n\t<link rel="prefetch" href="/icon_dark.svg">'

    if (i.endsWith('/dist/index.html'))
      preloadImg = `${preloadImg}\n\t<link rel="prefetch" href="/banner_light.svg">\n\t<link rel="prefetch" href="/banner_dark.svg">`

    else if (i.endsWith('/prompt-for-update.html'))
      preloadImg = `${preloadImg}\n\t<link rel="prefetch" href="/prompt-update.png">`

    html = html.replace(
      /<link rel="stylesheet" href="(.*?)">/g,
      `
    ${preconnect}
    <link rel="preload" as="style" href="$1" />
    <link rel="stylesheet" href="$1" />
    <link
      rel="preload"
      as="style"
      onload="this.onload=null;this.rel='stylesheet'"
      href="${firaFont}"
    />
    <noscript>
      <link rel="stylesheet" crossorigin="anonymous" href="${firaFont}" />
    </noscript>
    <link rel="prefetch" href="/manifest.webmanifest">${preloadImg}
    <link rel="manifest" href="/manifest.webmanifest">\n`).trim()

    // html = html.replace(
    //   '</head>',
    //   '\t<link rel="manifest" href="/manifest.webmanifest">\n<script>\n'
    //     + '    (function() {\n'
    //     + '      const prefersDark = window.matchMedia && window.matchMedia(\'(prefers-color-scheme: dark)\').matches\n'
    //     + '      const setting = localStorage.getItem(\'vueuse-color-schema\') || \'auto\'\n'
    //     + '      if (setting === \'dark\' || (prefersDark && setting !== \'light\'))\n'
    //     + '        document.documentElement.classList.toggle(\'dark\', true)\n'
    //     + '    })()\n'
    //     + '  </script></head>',
    // )
    //
    html = html.replace(/aria-hidden="true"/gi, 'tabindex="-1" aria-hidden="true"')

    await fs.writeFile(i, html, 'utf-8')

    // todo@userquin: we need to add critical again
    // await critical.generate({
    //   inline: true,
    //   base: './.vitepress/dist/',
    //   css: ['*.css'],
    //   html: i.substring(i.lastIndexOf('/') + 1),
    // })
  }))
}
