import type { RouteDataFunc } from '@solidjs/router'

const HiData: RouteDataFunc = (args) => {
  const name = args.params.name || ''
  return {
    name: decodeURI(name),
  }
}

export default HiData
