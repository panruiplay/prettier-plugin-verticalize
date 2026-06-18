import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('尾行注释对齐 - JSX', () => {
  formatCase({
    name: 'jsx测试1',
    input: `
a = [
    <span></span>,  // 行
    <div></div>,  // 行
    <i></i>,  // 行
]
    `,
    output: `
a = [
  <span></span>, // 行
  <div></div>,   // 行
  <i></i>,       // 行
]
    `,
    jsx: true,
  })

  formatCase({
    name: 'jsx测试2',
    input: `
div = <div>
   {/*<i></i>*/}
</div>       // 行
div222 = <div></div> // 行
div3 = <div></div>       // 行
    `,
    output: `
div    = <div>{/*<i></i>*/}</div> // 行
div222 = <div></div>              // 行
div3   = <div></div>              // 行
`,
    jsx: true,
  })
})
