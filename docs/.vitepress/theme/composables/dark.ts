import { useDark } from '@vueuse/core'

export const isDark = useDark({
  storage: localStorage,
  attribute: 'vitepress-theme-appearance',
  listenToStorageChanges: true,
})
