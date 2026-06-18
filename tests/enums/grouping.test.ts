import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('枚举对齐 - 分组', () => {
  formatCase({
    name: '空行分隔枚举组',
    input: `
enum Enum {
  bb  = 3,
  ccc = 4,

  fawefawe = 13,
  awef     = 3,
}`,
  })
})
