import type { Plugin } from 'vite'

export default function LayoutSlotFix(): Plugin {
  return {
    name: 'vitepress-layout-slots-fix',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('Layout.vue') && !id.endsWith('.css'))
        return code.replace('<VPFooter />', '<VPFooter />\n<slot name="layout-bottom" />')
    },
  }
}
