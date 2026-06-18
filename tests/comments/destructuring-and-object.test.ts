import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('尾行注释对齐 - 解构与对象', () => {
  formatCase({
    name: '变量声明解构',
    input: `
    const {
      uid,       // VariableDeclarator
      client,    // VariableDeclarator
    } = authParams;
    const {
      ssd,                    // VariableDeclarator
      clienx, // VariableDeclarator
      xx,
      a,// VariableDeclarator
      b, // VariableDeclarator
    } = authParams; // xxx`,
    output: `
const {
  uid,    // VariableDeclarator
  client, // VariableDeclarator
} = authParams
const {
  ssd,    // VariableDeclarator
  clienx, // VariableDeclarator
  xx,
  a, // VariableDeclarator
  b, // VariableDeclarator
} = authParams // xxx`,
  })

  formatCase({
    name: '形参解构',
    input: `
function a({
  sessData = '', // 注释
  sdf = 4,           // 注释
  ua = 4,        // 注释
}){}`,
    output: `
function a({
  sessData = '', // 注释
  sdf = 4,       // 注释
  ua = 4,        // 注释
}) {}`,
  })

  formatCase({
    name: '声明对象',
    input: `
export const CONFIG = {
  webNameMaxLength: 200,       // 注释 1
  schema: 'https://',             // 注释 2
  urlReg: /https?/,                      // 注释 3
  initSchedule: SyncScheduleEnum.weekl, // 注释 4
  initWeekday: WeekdayEnum.Monday,       // 注释 5
}`,
    output: `
export const CONFIG = {
  webNameMaxLength: 200,                // 注释 1
  schema: 'https://',                   // 注释 2
  urlReg: /https?/,                     // 注释 3
  initSchedule: SyncScheduleEnum.weekl, // 注释 4
  initWeekday: WeekdayEnum.Monday,      // 注释 5
}`,
  })
})
