import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('配置 - align', () => {
  formatCase({
    name: 'alignAssignment: false',
    input: `
bb = 3     // a
ccc = 4    // b
axios = 10 // c
wae = 11   // d
q = 12     // e
`,
    options: { alignAssignment: false },
  })
})
