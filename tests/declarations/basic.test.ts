import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('变量声明基础', () => {
  formatCase({
    name: '单成员声明语句',
    printWidth: 38,
    input: `
const a   = '111111111111'
const bbb = '3333333333333'
var c
const d = 4

const e = 5
let f   = 6
var g =
  '6666666666666666666666666666666'
let q = 5
const a1 = 1,
      a2 = 2
let xx  = 6
let xxx = 6
let a3, b4
let qq  = 6
let qxx = 6
for (let i = 0; i < 10; i++) {}
let qqqqq = 7
`,
  })

  formatCase({
    name: '多成员声明语句',
    printWidth: 20,
    input: `
const a11111 = 1,
      a2     = 2,
      b333   = 3
const gap = 'gap'
var c1 = 3,
    c2,
    c333  = 3,
    c4444 = 4
const d1  = 4,
      d22 = 2,
      d3  = 3
let q1,
    q2  = 3,
    q33 =
    'sdfwefwefwefwefwefwef'
`,
  })

  formatCase({
    name: '解构声明',
    printWidth: 45,
    input: `
const a                 = 1
const [value, setValue] = useState(1)
const { x, q }          = foo()
const [g, setG] = useState(
  '1111111113423423423423411111',
)
`,
  })

  formatCase({
    name: 'typescript 类型',
    input: `
const singleDeclarations: VariableDeclaration[] = []
const declarators: VariableDeclarator[]         = []
const a: string   = 4,
      bbe: number = 3
`,
  })
})
