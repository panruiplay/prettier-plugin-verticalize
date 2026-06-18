import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('覆盖配置', () => {
  formatCase({
    name: '覆盖 maxCodeWidthDiff',
    options: {
      maxWidthDiff: 20,
      alignTrailingCommentsMaxWidthDiff: 21,
      alignEnumsMaxWidthDiff: 5,
      alignAssignmentMaxWidthDiff: 6,
    },
    input: `
const a = '0'                      //
const b = '0123456789012345678901' // 离上一行差距 21

const d = '1' //
const c = '01234567890123456789012' // 离上一行差距 22

x       = 123
x123456 = 123
x1234567 = false

enum A {
  a      = 1,
  b12345 = 2,
  c123456 = 3,
}
      `,
  })

  formatCase({
    name: '覆盖 minGroupSize',
    options: {
      minGroupSize: 2,
      alignTrailingCommentsMinGroupSize: 3,
      alignEnumsMinGroupSize: 4,
      alignAssignmentMinGroupSize: 3,
    },
    input: `
const qq = 123 // one
const ww = 2 // two

let qq1 = 123   // one
let ww2 = 2     // two
let ee3 = 31111 // three

qq1 = 123 // one
ww22 = 2 // two

qq1   = 123 // one
ww22  = 2   // two
ww212 = 2   // two

enum A {
  a = '1',
  b1 = '2',
  c1 = '3',

  d1 = '4',
  f  = '5',
  k  = '6',
  i  = '7',
}
`,
  })
})
