import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('组合场景：变量声明+注释', () => {
  formatCase({
    name: '变量声明基础',
    input: `
const x = 1;   // comment，

const a = 1;    // one
const c = 3        // one
const bb = 2; /* two */
// 纯注释行不参与对齐
const qtt=1;// foo
const p=22;// bar
`,
    output: `
const x = 1 // comment，

const a  = 1 // one
const c  = 3 // one
const bb = 2 /* two */
// 纯注释行不参与对齐
const qtt = 1  // foo
const p   = 22 // bar
`,
  })

  formatCase({
    name: '连续声明多个',
    input: `
const xr = 3  // VariableDeclaration
const a = 332, // VariableDeclaration
  b = 4,  // VariableDeclarator
  c = // VariableDeclarator
    // ----
    1 // VariableDeclarator
      `,
    output: `
const xr = 3   // VariableDeclaration
const a = 332, // VariableDeclaration
      b = 4,   // VariableDeclarator
      c =      // VariableDeclarator
    // ----
    1 // VariableDeclarator
`,
  })
})
