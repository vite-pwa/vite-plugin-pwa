import type { ResolvedConfig } from 'vite'
import type { VitePWAOptions } from './types'

export * from './types'

async function configureIntegrationOptions(
    viteOptions: ResolvedConfig,
    userOptions: Partial<VitePWAOptions>,
) {
 await userOptions?.integration?.configureOptions?.(viteOptions, userOptions)
}

export { configureIntegrationOptions }
