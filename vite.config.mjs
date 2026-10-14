import { defineConfig } from 'vite'

export default defineConfig({
  // The test font is tiny; without this Vite would inline it as a data: URL
  // instead of emitting it to dist/assets.
  build: { assetsInlineLimit: 0 },
})
