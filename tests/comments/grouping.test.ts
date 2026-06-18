import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('尾行注释对齐 - 分组', () => {
  formatCase({
    name: '空行分隔组',
    input: `
1 + 3; // 1
12 + 33;    // 2

34 + 111;    // 3
55 + 9999; // 4
      `,
    output: `
1 + 3   // 1
12 + 33 // 2

34 + 111  // 3
55 + 9999 // 4
`,
  })

  formatCase({
    name: '其他语句分隔组',
    input: `
1 + 1; // block1
23 + 11; // block1-long
call()
foo(); // block2
pool(12 + 33); // block2-short
1 + 3
for (let i = 0; i < 10; i++); // block2
for (let wi = 0; wi < 10; wi++); // block2-short
      `,
    output: `
1 + 1   // block1
23 + 11 // block1-long
call()
foo()         // block2
pool(12 + 33) // block2-short
1 + 3
for (let i = 0; i < 10; i++);    // block2
for (let wi = 0; wi < 10; wi++); // block2-short
`,
  })
})
