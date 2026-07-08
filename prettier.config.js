import prettierPluginVerticalize from './dist/index.js'

/** @type {import('prettier').Config} */
export default {
  semi: false,
  tabWidth: 2,
  printWidth: 90,
  singleQuote: true,
  trailingComma: 'all',
  endOfLine: 'lf',
  plugins: [prettierPluginVerticalize],
}
