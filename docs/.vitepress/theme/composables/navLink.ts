import type { Ref } from 'vue'
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import type { DefaultTheme } from '../config'
import { isExternal as isExternalCheck } from '../utils'

export function useNavLink(item: Ref<DefaultTheme.NavItemWithLink>) {
  const route = useRoute()

  const isExternal = isExternalCheck(item.value.link)

  const props = computed(() => {
    const link = interpret(item.value.link)
    const routePath = normalizePath(`/${route.data.relativePath}`)

    let active = false
    if (item.value.activeMatch) {
      active = new RegExp(item.value.activeMatch).test(routePath)
    }
    else {
      const itemPath = normalizePath(withBase(link))
      active
        = itemPath === '/'
          ? itemPath === routePath
          : routePath.startsWith(itemPath)
      // fix /frameworks/sveltekit and /frameworks/svelte
      if (routePath === '/frameworks/sveltekit' && itemPath === '/frameworks/svelte' && active)
        active = false
      // fix /examples/sveltekit and /examples/svelte
      if (routePath === '/examples/sveltekit' && itemPath === '/examples/svelte' && active)
        active = false
    }

    return {
      'class': {
        active,
        isExternal,
      },
      'href': isExternal ? link : withBase(link),
      'target': item.value.target || isExternal ? '_blank' : null,
      'rel': item.value.rel || isExternal ? 'noopener noreferrer' : null,
      'aria-label': item.value.ariaLabel,
    }
  })

  return {
    props,
    isExternal,
  }
}

function interpret(path = '') {
  return path
    .replace(/{{pathname}}/, typeof window === 'undefined' ? '/' : location.pathname)
}

function normalizePath(path: string): string {
  return path
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/\.(html|md)$/, '')
    .replace(/\/index$/, '/')
}
