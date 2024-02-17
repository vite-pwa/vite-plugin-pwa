import {
  DEV_PWA_ASSETS_NAME,
  DEV_READY_NAME,
  DEV_REGISTER_SW_NAME,
  DEV_SW_NAME,
  DEV_SW_VIRTUAL,
  FILE_SW_REGISTER,
} from './constants'
import type { ResolvedVitePWAOptions } from './types'

export function generateSimpleSWRegister(options: ResolvedVitePWAOptions, dev: boolean) {
  const path = dev ? `${options.base}${DEV_SW_NAME}` : `${options.buildBase}${options.filename}`

  // we are using HMR to load this script: DO NOT ADD window::load event listener
  if (dev) {
    const swType = options.devOptions.type ?? 'classic'
    return `if('serviceWorker' in navigator) navigator.serviceWorker.register('${path}', { scope: '${options.scope}', type: '${swType}' })`
  }

  return `
if('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('${path}', { scope: '${options.scope}' })
})
}`.replace(/\n/g, '')
}

export function injectServiceWorker(html: string, options: ResolvedVitePWAOptions, dev: boolean) {
  const manifest = generateWebManifest(options, dev)

  if (!dev) {
    const script = generateRegisterSW(options, dev)
    if (script) {
      return html.replace(
        '</head>',
        `${manifest}${script}</head>`,
      )
    }
  }

  return html.replace(
    '</head>',
    `${manifest}</head>`,
  )
}

export function generateWebManifest(options: ResolvedVitePWAOptions, dev: boolean) {
  const crossorigin = options.useCredentials ? ' crossorigin="use-credentials"' : ''
  if (dev) {
    const name = options.devOptions.webManifestUrl ?? `${options.base}${options.manifestFilename}`
    return options.manifest ? `<link rel="manifest" href="${name}"${crossorigin}>` : ''
  }
  else {
    return options.manifest ? `<link rel="manifest" href="${options.buildBase}${options.manifestFilename}"${crossorigin}>` : ''
  }
}

export function generateRegisterSW(options: ResolvedVitePWAOptions, dev: boolean) {
  if (options.injectRegister === 'inline') {
    return `<script id="vite-plugin-pwa:inline-sw">${generateSimpleSWRegister(options, dev)}</script>`
  }
  else if (options.injectRegister === 'script' || options.injectRegister === 'script-defer') {
    const hasDefer = options.injectRegister === 'script-defer'
    return `<script id="vite-plugin-pwa:register-sw" src="${dev ? options.base : options.buildBase}${FILE_SW_REGISTER}"${hasDefer ? ' defer' : ''}></script>`
  }

  return undefined
}

export function generateRegisterDevSW(base: string) {
  const path = `${base.endsWith('/') ? base : `${base}/`}${DEV_SW_VIRTUAL.slice(1)}`
  return `<script id="vite-plugin-pwa:register-dev-sw" type="module">
import registerDevSW from '${path}';
registerDevSW();
</script>`
}

export function generateSWHMR() {
  // defer attribute: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
  return `
import.meta.hot.on('${DEV_REGISTER_SW_NAME}', ({ mode, inlinePath, registerPath, scope, swType = 'classic' }) => {
  if (mode == 'inline') {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register(inlinePath, { scope, type: swType });
    }
  }
  else {
    const registerSW = document.createElement('script');
    registerSW.setAttribute('id', 'vite-plugin-pwa:register-sw');
    if (mode === 'script-defer') registerSW.setAttribute('defer', 'defer');
    registerSW.setAttribute('src', registerPath);
    document.head.appendChild(registerSW);
  }
});
import.meta.hot.on('${DEV_PWA_ASSETS_NAME}', ({ themeColor, links }) => {
  if (themeColor) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = themeColor.content;
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      meta.setAttribute('content', themeColor.content);
      document.head.appendChild(meta);
    }
  }
  if (links) {
    links.map((l) => {
      const link = document.querySelector(\`link[href="\${l.href}"]\`) ?? document.createElement('link');
      if (l.id) link.setAttribute('id', l.id);
      else link.removeAttribute('id');
      link.setAttribute('rel', l.rel);
      link.setAttribute('href', l.href);
      if (l.media) link.setAttribute('media', l.media);
      else link.removeAttribute('media');
      if (l.sizes) link.setAttribute('sizes', l.sizes);
      else link.removeAttribute('sizes');
      if (l.type) link.setAttribute('type', l.type);
      else link.removeAttribute('type');
      if (!link.parentNode) document.head.appendChild(link);
    });
  }  
});  
function registerDevSW() {
  try {
    import.meta.hot.send('${DEV_READY_NAME}');
  } catch (e) {
    console.error('unable to send ${DEV_READY_NAME} message to register service worker in dev mode!', e);
  }
}
export default registerDevSW;
`
}
