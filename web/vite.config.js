import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { apiStub } from './stub/api'

export default defineConfig({
  plugins: [
    vue(),
    apiStub()
  ],
  build: {
    cssCodeSplit: false
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js']
  }
})
