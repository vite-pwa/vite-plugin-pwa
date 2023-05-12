import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))

const swName = 'custom-sw.js'

const resolvePath = (...paths: string[]) => {
  return resolve(_dirname, ...paths).replace(/\\/g, '/')
}

describe('Typescript (no injection point): test-build', () => {
  it(`service worker is generated: ${swName}`, () => {
    const swPath = resolvePath(_dirname, `../dist/${swName}`)
    expect(existsSync(swPath), `${swPath} doesn't exist`).toBeTruthy()
    const webManifest = resolvePath(_dirname, '../dist/manifest.webmanifest')
    expect(existsSync(webManifest), `${webManifest} doesn't exist`).toBeTruthy()
    const swContent = readFileSync(swPath, 'utf-8')
    let match: RegExpMatchArray | null
    match = swContent.match(/"url":\s*"manifest\.webmanifest"/)
    expect(match == null, 'found manifest.webmanifest in sw precache manifest').toBeTruthy()
    match = swContent.match(/"url":\s*"index.html"/)
    expect(match == null, 'found entry point route (index.html) in sw precache manifest').toBeTruthy()
    match = swContent.match(/"url":\s*"custom-sw.js"/)
    expect(match == null, `found sw route (${swName}) in sw precache manifest`).toBeTruthy()
    match = swContent.match(/cacheName:\s*"pages"/)
    expect(match && match.length === 1, `pages cache not found in ${swName}`).toBeTruthy()
    match = swContent.match(/cacheName:\s*"assets"/)
    expect(match && match.length === 1, `assets cache not found in ${swName}`).toBeTruthy()
    match = swContent.match(/cacheName:\s*"images"/)
    expect(match && match.length === 1, `images cache not found in ${swName}`).toBeTruthy()
  })
})
