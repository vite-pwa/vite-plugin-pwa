import { UserConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const config: UserConfig = {
  plugins: [
    VitePWA({

    }),
  ],
}

export default config
