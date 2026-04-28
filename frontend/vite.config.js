import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
port: 5173,
    hmr: {
      host: 'localhost',
      port: 5173
    },
    proxy: {
      '/api': {
        target: 'http://node1:3000',
        changeOrigin: true
      }
    }
  }
})
