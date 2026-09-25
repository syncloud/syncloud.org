import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        console: 'readonly'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    files: ['tests/**/*.js', 'e2e/**/*.js', 'tools/**/*.js', '*.config.js', '*.config.mjs'],
    languageOptions: {
      globals: {
        global: 'readonly',
        globalThis: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        Buffer: 'readonly'
      }
    }
  }
]
