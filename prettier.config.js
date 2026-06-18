import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import * as prettierPluginTypescript from 'prettier/plugins/typescript'
import prettierPluginVerticalAlign from './dist/index.js'

/** @type {import('prettier').Config} */
export default {
  semi: false,
  tabWidth: 2,
  printWidth: 90,
  singleQuote: true,
  trailingComma: 'all',
  plugins: [
    prettierPluginEstree,
    prettierPluginTypescript,
    prettierPluginBabel,
    prettierPluginVerticalAlign,
  ],
}
