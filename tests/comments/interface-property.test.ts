import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('尾行注释对齐 - 接口与类型', () => {
  formatCase({
    name: '接口属性尾注释',
    input: `
export interface Options {
  minGroupSize: number // b
  maxCodeWidthDiff: number // a
  alignTrailingComments: boolean // c
  alignEnums: boolean // d
}
`,
    output: `
export interface Options {
  minGroupSize: number           // b
  maxCodeWidthDiff: number       // a
  alignTrailingComments: boolean // c
  alignEnums: boolean            // d
}
`,
  })
})
