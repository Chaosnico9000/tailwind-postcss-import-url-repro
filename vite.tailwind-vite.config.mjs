// Control: same app, but with @tailwindcss/vite instead of @tailwindcss/postcss.
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, mergeConfig } from 'vite'
import base from './vite.config.mjs'

export default mergeConfig(
  base,
  defineConfig({
    css: { postcss: { plugins: [] } },
    plugins: [tailwindcss()],
  }),
)
