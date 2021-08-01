import { useData, joinPath } from 'vitepress'

export function useUrl() {
  const { site } = useData()

  function withBase(path: string): string {
    return joinPath(site.value.base, path)
  }

  return {
    withBase,
  }
}
