import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    ignores: [
      'netlify.toml',
      '**/build/**',
      '**/dist/**',
      '**/docs/**',
      '**/dev-dist/**',
    ],
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
      'ts/no-this-alias': 'off',
      'no-restricted-globals': 'off',
      'node/handle-callback-err': 'off',
    },
  },
  {
    files: ['**/examples/**'],
    rules: {
      'no-console': 'off',
    },
  },
)
