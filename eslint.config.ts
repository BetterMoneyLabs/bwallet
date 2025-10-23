import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
      rules: {
          "@typescript-eslint/no-explicit-any": "error",
          "@typescript-eslint/no-unsafe-assignment": "error",
          "@typescript-eslint/no-unsafe-call": "error",
          "@typescript-eslint/no-unsafe-member-access": "error",
          "@typescript-eslint/no-unsafe-return": "error",
          "@typescript-eslint/explicit-function-return-type": "error",
          "@typescript-eslint/explicit-module-boundary-types": "error"
        }
  }
)
