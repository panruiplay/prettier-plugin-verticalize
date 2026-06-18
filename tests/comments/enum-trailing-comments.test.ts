import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('尾行注释对齐 - 枚举成员注释', () => {
  formatCase({
    name: '枚举值',
    input: `
enum EnumDemo {
 WS_1,            // 认证请求
 WS_2,       // 认证回复
 WS_3,        // 心跳包
 WS_4,  // 心跳回复
 WS_5,         // 普通消息
 WS_6,         // 人气值消息
}`,
    output: `
enum EnumDemo {
  WS_1, // 认证请求
  WS_2, // 认证回复
  WS_3, // 心跳包
  WS_4, // 心跳回复
  WS_5, // 普通消息
  WS_6, // 人气值消息
}`,
  })
})
