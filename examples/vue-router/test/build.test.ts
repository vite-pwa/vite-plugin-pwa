import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))

const injectManifest = process.env.SW === 'true'
const swName = `${injectManifest ? 'claims-sw.js' : 'sw.js'}`

const resolvePath = (...paths: string[]) => {
  return resolve(_dirname, ...paths).replace(/\\/g, '/')
}

describe('Vue 3: test-build', () => {
  it(`service worker is generated: ${swName}`, () => {
    const swPath = resolvePath(_dirname, `../dist/${swName}`)
    expect(existsSync(swPath), `${swPath} doesn't exist`).toBeTruthy()
    const webManifest = resolvePath(_dirname, '../dist/manifest.webmanifest')
    expect(existsSync(webManifest), `${webManifest} doesn't exist`).toBeTruthy()
    const swContent = readFileSync(swPath, 'utf-8')
    let match: RegExpMatchArray | null
    if (!injectManifest) {
      match = swContent.match(/define\(\['\.\/(workbox-\w+)'/)
      expect(match && match.length === 2, `workbox-***.js entry not found in ${swName}`).toBeTruthy()
      const workboxName = resolvePath(_dirname, `../dist/${match?.[1]}.js`)
      expect(existsSync(workboxName), `${workboxName} doesn't exist`).toBeTruthy()
    }
    match = swContent.match(/"url":\s*"manifest\.webmanifest"/)
    expect(match && match.length === 1, 'missing manifest.webmanifest in sw precache manifest').toBeTruthy()
    match = swContent.match(/"url":\s*"index.html"/)
    expect(match && match.length === 1, 'missing entry point route (index.html) in sw precache manifest').toBeTruthy()
    match = injectManifest ? swContent.match(/"url":\s*"claims-sw.js"/) : swContent.match(/"url":\s*"sw.js"/)
    expect(match == null, `found sw route (${swName}) in sw precache manifest`).toBeTruthy()
  })
})
