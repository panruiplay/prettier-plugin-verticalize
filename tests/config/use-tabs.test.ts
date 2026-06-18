import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('scratch', () => {
  formatCase({
    name: 'useTabs',
    useTabs: true,
    input: `
enum Enum {
  bb = 3, // a
  ccccgrgrg = 466, // b
}

{
  enum a {
    a        = 3,   // a
    cccccccc = 466, // b
  }
}
`,
    output: `
enum Enum {
\tbb        = 3,   // a
\tccccgrgrg = 466, // b
}

{
\tenum a {
\t\ta        = 3,   // a
\t\tcccccccc = 466, // b
\t}
}`,
  })
})
