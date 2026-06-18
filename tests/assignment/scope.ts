import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('赋值语句 - 作用域', () => {
  formatCase({
    name: '不同作用域下',
    input: `
call(a = 3)
foo(b = 3)
1,a = 3
1,bb = 3
{
  a.ab = '111111111111'
  bbb  = '3333333333333'
}
dd = 4
switch (true) {
  case 3: {
    b  = 3
    bb = 4
  }
  default:
    c  = 4
    eq = 6
}
class B {
  static {
    awee = 1
    bwe  = 2
  }
}
for (i = 0; i < 10; i++) {}
for (bc = 0; i < 10; i++) {}
`,
  })
})
