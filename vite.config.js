import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { contactApiPlugin } from './server/devApiPlugin.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), contactApiPlugin(env)],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
    },
  }
})
