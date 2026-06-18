import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('枚举对齐 - 基础', () => {
  formatCase({
    name: '枚举声明基础',
    input: `
enum Enum {
  bb  = 3,
  ccc = 4,

  axios = 10,
  wae   = 11,
  q     = 12,
}

enum X {
  aaaaaa = 3,
  ccc    = 4,
}
`,
  })

  formatCase({
    name: '无初始值与有初始值混合',
    input: `
enum Enum {
  a,
  bb = 3,
  c,
  ccc = 4,
  dxxxxxxxx,
  axios = 10,
  wae   = 11,
  q     = 12,
}`,
  })
})
