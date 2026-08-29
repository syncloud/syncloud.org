import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { apiStub } from './stub/api'

export default defineConfig({
  plugins: [
    vue(),
    apiStub()
  ],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js']
  }
})
