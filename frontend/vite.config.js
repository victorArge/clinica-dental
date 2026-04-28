import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    allowedHosts: ['frontend', 'nginx', 'localhost', '127.0.0.1'],
    proxy: {
      '/api': {
        target: 'http://node1:3000',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:5173',
        ws: true
      }
    }
  }
})
