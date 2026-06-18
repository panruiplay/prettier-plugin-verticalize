import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('枚举对齐 - 亚洲字符', () => {
  formatCase({
    name: '亚洲字符',
    input: `
enum Enum {
  bb   = 3,
  好的 = 4,
  タワ = 5,
}
`,
  })
})
