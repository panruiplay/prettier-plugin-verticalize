import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('配置 - alignTrailingComments', () => {
  formatCase({
    name: '不启用尾行注释对齐',
    input: `
const a   = 1; // 1
const bb  = 2;    // 2
const ccc  = 34;    // 3
const dddd = 44; // 4
`,
    output: `
const a    = 1 // 1
const bb   = 2 // 2
const ccc  = 34 // 3
const dddd = 44 // 4
`,
    options: { alignTrailingComments: false },
  })
})
