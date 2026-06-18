import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import * as prettierPluginTypescript from 'prettier/plugins/typescript'
import { expect, it } from 'vitest'
import prettier from 'prettier'
import plugin from '../../src'
import projectPrettierConfig from '../../prettier.config.js'
import { Options } from '../../src/types'

const plugins = [
  prettierPluginEstree,
  prettierPluginTypescript,
  prettierPluginBabel,
  plugin,
]

type FormatCaseOptions = {
  input: string
  output?: string
  name: string
  options?: Partial<Options>
  useTabs?: boolean
  printWidth?: number
  jsx?: boolean
  skip?: boolean
}

export function formatCase({
  name,
  input,
  output = input,
  jsx,
  options,
  skip,
  useTabs,
  printWidth = projectPrettierConfig.printWidth,
}: FormatCaseOptions): void {
  const run = skip ? it.skip : it
  run(name, async () => {
    const formatted = await prettier.format(input, {
      ...projectPrettierConfig,
      ...options,
      useTabs: useTabs ?? projectPrettierConfig.useTabs,
      printWidth,
      parser: 'typescript',
      plugins,
      filepath: jsx ? 'example.tsx' : 'example.ts',
    })

    expect(formatted.trim()).toBe(output.trim())
  })
}
