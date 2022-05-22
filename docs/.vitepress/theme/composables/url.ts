import { /* useData, */ withBase } from 'vitepress'

// todo@userquin: to be removed: just use withBase from vitepress
export function useUrl() {
  // const { site } = useData()

  // function withBase(path: string): string {
  //   if (!path)
  //     return ''
  //   return joinPath(site.value.base, path)
  // }
  //
  return {
    withBase,
  }
}
