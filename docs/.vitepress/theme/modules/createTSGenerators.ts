import { dtsConfigData, tsConfigData } from './generatePWACode'

export function createTSGenerators(
  ts: { tsConfig?: boolean; dts?: boolean; dtsName?: string },
  generators: any[],
) {
  const { tsConfig = false, dts = false, dtsName = 'src/vite-env.d.ts' } = ts
  if (dts) {
    generators.push(['dts-config', () => {
      dtsConfigData.code = `
// ${dtsName}
/// <reference types="vite-plugin-pwa/client" />    
        `
    }])
  }

  if (tsConfig) {
    generators.push(['ts-config', () => {
      tsConfigData.code = `
// tsconfig.json
"compilerOptions": {
  "types": [
    "vite-plugin-pwa/client"
  ]  
}
        `
    }])
  }
}
