import { UserConfig } from 'vite'
import PWA from 'vite-plugin-pwa'

const config: UserConfig = {
  plugins: [
    PWA(),
  ],
}

export default config
