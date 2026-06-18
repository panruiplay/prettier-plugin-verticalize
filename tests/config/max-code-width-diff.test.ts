import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('配置 - maxCodeWidthDiff', () => {
  formatCase({
    name: 'maxCodeWidthDiff: 差距大于默认值 20 不触发对齐',
    options: { maxWidthDiff: 20 },
    input: `
const a = '0' //
const b = '0123456789012345678901' // 离上一行差距 21

const d = '1'                     //
const c = '012345678901234567890' // 离上一行差距 20
      `,
  })

  formatCase({
    name: 'maxCodeWidthDiff: 5 格式化',
    input: `
const a = 1    // 1
const b = 1237  // 2
const c = 11111111111111111111 // 3
const d = 1     // 4
const e = 23 // 5
      `,
    output: `
const a = 1    // 1
const b = 1237 // 2
const c = 11111111111111111111 // 3
const d = 1  // 4
const e = 23 // 5
      `,
    options: { maxWidthDiff: 5 },
  })

  formatCase({
    name: 'maxCodeWidthDiff 作用于枚举',
    input: `
enum Enum {
  a      = 1,
  a12345 = 2,

  b = 3,
  b123456 = 4,
}`,
    options: { maxWidthDiff: 5 },
  })

  formatCase({
    name: 'maxCodeWidthDiff 作用于变量声明',
    printWidth: 15,
    input: `
let a12345 = true
let a      = true
const a123 = true
let a123456 = false

const b      = true,
      b1     = true,
      b12345 =
    '123123123123123123123123',
      c      = true,
      c12345 = true,
      c123456 = false
`,
    options: { maxWidthDiff: 5 },
  })

  formatCase({
    name: 'maxCodeWidthDiff 作用于赋值',
    printWidth: 15,
    input: `
a12345 = true
a      = true
a123   = true
a123456 = false

b  = true
b1 = true
b12345 =
  '123123123123123123123123'
c      = true
c12345 = true
c123456 = false
`,
    options: { maxWidthDiff: 5 },
  })
})
