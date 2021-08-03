import fg from 'fast-glob'
import fs from 'fs-extra'
// import critical from 'critical'

const firaFont = 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap'

export const githubusercontent1 = 'https://repository-images.githubusercontent.com'
export const githubusercontent2 = 'https://user-images.githubusercontent.com'

export const hero = `${githubusercontent1}/290129345/d4bfc300-1866-11eb-8602-e672c9dd0e7d`
export const prompt = `${githubusercontent2}/11247099/111190584-330cf880-85f2-11eb-8dad-20ddb84456cf.png`

const googleapis = 'https://fonts.googleapis.com'
const gstatic = 'https://fonts.gstatic.com'

const preconnect = `
    <link rel="dns-prefetch" href="${googleapis}">
    <link rel="dns-prefetch" href="${gstatic}">
    <link rel="dns-prefetch" href="${githubusercontent1}">
    <link rel="dns-prefetch" href="${githubusercontent2}">
    <link rel="preconnect" crossorigin="anonymous" href="${googleapis}">
    <link rel="preconnect" crossorigin="anonymous" href="${gstatic}">
    <link rel="preconnect" crossorigin="anonymous" href="${githubusercontent1}">
    <link rel="preconnect" crossorigin="anonymous" href="${githubusercontent2}">
`

export const optimizePages = async() => {
  const names = await fg('./.vitepress/dist/**/*.html', { onlyFiles: true })

  await Promise.all(names.map(async(i) => {
    let html = await fs.readFile(i, 'utf-8')

    const home = i.endsWith('/index.html')

    const netlify = home
      ? `\n\t<link rel="prefetch" href="/netlify.svg">\n\t<link rel="prefetch" href="${hero}">\n\t<link rel="prefetch" href="${prompt}">`
      : ''

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
      <link rel="stylesheet" href="${firaFont}" />
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
