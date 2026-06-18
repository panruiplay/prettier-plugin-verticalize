import {
  File,
  Node,
  Token,
  Comment,
  TSEnumMember,
  VariableDeclaration,
  VariableDeclarator,
  SourceLocation,
  AssignmentExpression,
} from '@babel/types'
import MagicString from 'magic-string'
import { LineInfo } from 'recast/lib/parser'

export interface Options {
  minGroupSize: number
  maxWidthDiff: number
  alignTrailingComments: boolean
  alignTrailingCommentsMinGroupSize?: number
  alignTrailingCommentsMaxWidthDiff?: number
  alignEnums: boolean
  alignEnumsMinGroupSize?: number
  alignEnumsMaxWidthDiff?: number
  alignVariableDeclaration: boolean
  alignVariableDeclarationMinGroupSize?: number
  alignVariableDeclarationMaxWidthDiff?: number
  alignAssignment: boolean
  alignAssignmentMinGroupSize?: number
  alignAssignmentMaxWidthDiff?: number
}

export interface AlignContext {
  ast: File
  magicString: MagicString
  tokens: Token[]
  comments: Comment[]
  lineWidthOffset: number[]

  getLine(node: { loc: SourceLocation }): LineInfo & { idx: number }
  getLineText(node: { loc: SourceLocation }): string
  getFirstNodeByIndex(index: number): Node | null
  getParent(node: Node): Node | null
  getOption<K extends keyof Options>(key: K): NonNullable<Options[K]>
}

export type AlignGroup<Item, Info, Meta = undefined> = {
  list: { item: Item; info: Info }[]
  meta: Meta
}

export type EnumGroup = AlignGroup<
  TSEnumMember,
  { leftWidth: number },
  { minLeftWidth: number; maxLeftWidth: number }
>

export type SingleVariableDeclarationGroup = AlignGroup<
  VariableDeclaration,
  { leftWidth: number },
  { minLeftWidth: number; maxLeftWidth: number }
>

export type DeclaratorGroup = AlignGroup<
  VariableDeclarator,
  { nameStart: number },
  { maxNameStart: number }
>

export type HasInitDeclaratorGroup = AlignGroup<
  VariableDeclarator,
  { nameWidth: number },
  { minNameWidth: number; maxNameWidth: number }
>

export type CommentGroup = AlignGroup<
  Comment,
  { lineType: string; beforeWidth: number },
  { minBeforeWidth: number; maxBeforeWidth: number }
>

export type AssignmentGroup = AlignGroup<
  AssignmentExpression,
  { leftWidth: number },
  { minLeftWidth: number; maxLeftWidth: number }
>
