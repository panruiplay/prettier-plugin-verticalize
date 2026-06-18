import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('变量声明 - 亚洲字符', () => {
  formatCase({
    name: '亚洲字符',
    input: `
const a你好 = '你好'
const bbbbb = '3333333333333'
let 甲一 = 1,
    乙   = 2,
    丙   = 3
`,
  })
})
