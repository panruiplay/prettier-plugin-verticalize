import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('变量声明基础 - 作用域', () => {
  formatCase({
    name: '不同作用域下',
    input: `
{
  const a   = '111111111111'
  const bbb = '3333333333333'
}
const d = 4
switch (true) {
  case 3: {
    let b  = 3
    let bb = 4
  }
  default:
    const c = 4
    let q   = 6
}
class B {
  static {
    var awe   = 1
    const bwe = 2
  }
}
for (let i = 0; i < 10; i++) {}
for (const bc = 0; i < 10; i++) {}
`,
  })
})
