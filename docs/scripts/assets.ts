import fg from 'fast-glob'
import fs from 'fs-extra'
// import critical from 'critical'

const fireFont = 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap'

const githubusercontent = 'https://repository-images.githubusercontent.com'

const hero = `${githubusercontent}/290129345/d4bfc300-1866-11eb-8602-e672c9dd0e7d`

const googleapis = 'https://fonts.googleapis.com'
const gstatic = 'https://fonts.gstatic.com'

const preconnectHome = `
    <link rel="dns-prefetch" href="${googleapis}">
    <link rel="dns-prefetch" href="${gstatic}">
    <link rel="dns-prefetch" href="${githubusercontent}">
    <link rel="preconnect" crossorigin="anonymous" href="${googleapis}">
    <link rel="preconnect" crossorigin="anonymous" href="${gstatic}">
    <link rel="preconnect" crossorigin="anonymous" href="${githubusercontent}">
`

const preconnectOther = `
    <link rel="dns-prefetch" href="${googleapis}">
    <link rel="dns-prefetch" href="${gstatic}">
    <link rel="preconnect" crossorigin="anonymous" href="${googleapis}">
    <link rel="preconnect" crossorigin="anonymous" href="${gstatic}">
`

const preconnect = (home: boolean) => {
  return home ? preconnectHome : preconnectOther
}

export const optimizePages = async() => {
  const names = await fg('./.vitepress/dist/**/*.html', { onlyFiles: true })

  await Promise.all(names.map(async(i) => {
    let html = await fs.readFile(i, 'utf-8')

    const home = i.endsWith('/index.html')

    const netlify = home
      ? `\n\t<link rel="prefetch" href="/netlify.svg">\n\t<link rel="prefetch" href="${hero}">`
      : ''

    html = html.replace(
      /<link rel="stylesheet" href="(.*?)">/g,
      `
    ${preconnect(home)}
    <link rel="preload" as="style" href="$1" />
    <link rel="stylesheet" href="$1" />
    <link
      rel="preload"
      as="style"
      onload="this.onload=null;this.rel='stylesheet'"
      href="${fireFont}"
    />
    <noscript>
      <link rel="stylesheet" href="${fireFont}" />
    </noscript>
    <link rel="prefetch" href="/manifest.webmanifest">${netlify}\n`).trim()

    html = html.replace(
      '</head>',
      '\t<link rel="manifest" href="/manifest.webmanifest">\n<script>\n'
        + '    (function() {\n'
        + '      const prefersDark = window.matchMedia && window.matchMedia(\'(prefers-color-scheme: dark)\').matches\n'
        + '      const setting = localStorage.getItem(\'color-schema\') || \'auto\'\n'
        + '      if (setting === \'dark\' || (prefersDark && setting !== \'light\'))\n'
        + '        document.documentElement.classList.toggle(\'dark\', true)\n'
        + '    })()\n'
        + '  </script></head>',
    )

    await fs.writeFile(i, html, 'utf-8')

    // await critical.generate({
    //   inline: true,
    //   base: './.vitepress/dist/',
    //   css: ['*.css'],
    //   html: i.substring(i.lastIndexOf('/') + 1),
    // })
  }))
}
