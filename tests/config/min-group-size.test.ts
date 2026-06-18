import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('配置 - minGroupSize', () => {
  formatCase({
    name: 'minGroupSize: 3',
    input: `
const a = 1 // one
const bb = 2 // two

this.x  = 123
this.yy = 1
a       = 'asdf'

const qq = 123   // one
const ww = 2     // two
const ee = 31111 // three
      `,
    options: { minGroupSize: 3 },
  })

  formatCase({
    name: 'minGroupSize: 3 作用于注释',
    input: `
const a = 1 // one
const bb = 2 // two

const qq = 123 // one
const ww = 2 // two
const ee = 31111   // three
      `,
    output: `
const a = 1 // one
const bb = 2 // two

const qq = 123   // one
const ww = 2     // two
const ee = 31111 // three
      `,
    options: { minGroupSize: 3 },
  })

  formatCase({
    name: 'minGroupSize: 3  作用于枚举',
    input: `
enum Enum {
  bb = 3,
  ccc = 4,

  axios = 10,
  wae   = 11,
  q     = 12,
}`,
    options: { minGroupSize: 3 },
  })

  formatCase({
    name: 'minGroupSize: 3  作用于变量声明',
    input: `
const a = 1
const a123 = 2

const b = 1,
      b1 = 2,
      b12 =
    // -------
    3,
      b4 = 1,
      b45 = 2

const c   = 1,
      c1  = 2,
      c12 = 3
`,
    options: { minGroupSize: 3 },
  })
})
