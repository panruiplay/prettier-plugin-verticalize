import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('配置 - alignEnums', () => {
  formatCase({
    name: 'alignEnums: false - 枚举不对齐',
    input: `
enum Enum {
  bb = 3,
  ccc = 4,
  axios = 10,
  wae = 11,
  q = 12,
}`,
    options: { alignEnums: false },
  })
})
