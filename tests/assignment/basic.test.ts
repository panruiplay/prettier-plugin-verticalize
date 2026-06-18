import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('赋值语句 - 基础', () => {
  formatCase({
    name: '基础对齐',
    input: `
bb  = 3
ccc = 4

axios = 10
wae   = 11
q     = 12
foo()
this.a = 3
ccc    = 4
`,
  })

  formatCase({
    name: '只有单行赋值语句对齐',
    printWidth: 30,
    input: `
ccc = 4
axios =
  '44444444444444444444444'

a = b = c
ccc = 1
axios += 4
`,
  })
})
