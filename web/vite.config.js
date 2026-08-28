import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { imageStub } from './stub/image'

export default defineConfig({
  plugins: [
    vue(),
    imageStub()
  ],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js']
  }
})
