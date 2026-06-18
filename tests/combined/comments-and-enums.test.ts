import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('组合场景：枚举+注释', () => {
  formatCase({
    name: '同时有注释和枚举',
    input: `
enum Enum {
  bb = 3, // a
  ccccc = 4, // b
  asdf = 111, // c
}`,
    output: `
enum Enum {
  bb    = 3,   // a
  ccccc = 4,   // b
  asdf  = 111, // c
}`,
  })

  formatCase({
    name: '交叉分组',
    input: `
enum Enum {
  a = 'a',
  bbb = 'b', // b
  cc = 'c', // c
  d, // d
  e = 'eeeeeee', // e
  ff = 'fff',
}`,
    output: `
enum Enum {
  a   = 'a',
  bbb = 'b',      // b
  cc  = 'c',      // c
  d,              // d
  e  = 'eeeeeee', // e
  ff = 'fff',
}`,
  })

  formatCase({
    name: '枚举对齐后，注释差距过大',
    options: { maxWidthDiff: 4 },
    input: `
enum Enum {
  a     = 'a12345', // a
  b1234 = 'b', // b

  c     = 'c1234', // a
  d1234 = 'd',     // b

  e = 'c1234',  // a
  f12345 = 'd', // b
}`,
  })
})
