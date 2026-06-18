import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('尾行注释对齐 - 亚洲字符', () => {
  formatCase({
    name: '中日文',
    input: `
const {
  Hello_世界,  // a
  タワ,          // a
  one,        // a
  你好,       // a
} = params;`,
    output: `
const {
  Hello_世界, // a
  タワ,       // a
  one,        // a
  你好,       // a
} = params`,
  })

  formatCase({
    name: '亚洲字符 + JSX',
    input: `
你好(<div></div>)  // 行
div2(<div></div>) // 行
哈(<div></div>) // 行
    `,
    output: `
你好(<div></div>) // 行
div2(<div></div>) // 行
哈(<div></div>)   // 行
`,
    jsx: true,
  })
})
