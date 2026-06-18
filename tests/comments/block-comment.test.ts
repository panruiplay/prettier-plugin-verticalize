import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('尾行注释对齐 - 块注释', () => {
  formatCase({
    name: '块注释尾对齐',
    input: `
1 + 1;  /* q */
2 + 14; /* xb */ // xl
4 + 3323   // one
aa += 3; /* two */
123 - 1 /*
---
*/`,
    output: `
1 + 1           /* q */
2 + 14 /* xb */ // xl
4 + 3323        // one
aa += 3         /* two */
123 - 1 /*
---
*/`,
  })
})
