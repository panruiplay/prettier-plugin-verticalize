import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('导出变量声明', () => {
  formatCase({
    name: '导出和普通混合',
    input: `
const a   = '111111111111'
const bbb = '3333333333333'
export const c = 3
export let d   = 'sdf'`,
  })

  formatCase({
    name: '导出变量声明',
    printWidth: 20,
    input: `
export const abc  = 3
export let cddddd = 3
export var c      = 3
`,
  })
})
