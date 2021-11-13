import type { RouteDataFunc } from 'solid-app-router'

const HiData: RouteDataFunc = (args) => {
  const name = args.params.name || ''
  return {
    name: decodeURI(name),
  }
}

export default HiData
