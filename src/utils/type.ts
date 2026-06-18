import { AlignGroup } from '../types'
import {
  BooleanSupportOption,
  ChoiceSupportOption,
  IntSupportOption,
  StringSupportOption,
} from 'prettier'

export type ArrayItem<T> = T extends (infer U)[] ? U : never

export type AlignGroupItem<T> = T extends AlignGroup<infer U, any, any> ? U : never
export type AlignGroupItemInfo<T> = T extends AlignGroup<any, infer U, any> ? U : never
export type AlignGroupMeta<T> = T extends AlignGroup<any, any, infer U> ? U : never

export type interface2PrettierOptions<T> = {
  [key in keyof T]: T[key] extends number
    ? IntSupportOption
    : T[key] extends boolean
      ? BooleanSupportOption
      : T[key] extends string
        ? StringSupportOption | ChoiceSupportOption
        : never
}
