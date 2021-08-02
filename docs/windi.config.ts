import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
  preflight: false,
  extract: {
    include: [
      '.vitepress/**/*.vue',
    ],
  },
  theme: {
    extend: {
      colors: {
        primary: '#2e859c',
      },
    },
  },
})
