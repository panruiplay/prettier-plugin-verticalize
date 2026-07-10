import {
  AssignmentExpression,
  Comment,
  Node,
  SourceLocation,
  VariableDeclaration,
  VariableDeclarator,
} from '@babel/types'
import { AlignContext } from '../types'

const isSingleLine = (log?: SourceLocation | null): log is SourceLocation => {
  return !!log && log.start.line === log.end.line
}

export function isSpanLessThen(number: number, node: Node) {
  return node.loc.end.line - node.loc.start.line < number
}

export function inNormalBlock(node: Node, ctx: AlignContext) {
  return ['Program', 'BlockStatement', 'SwitchCase', 'StaticBlock'].includes(
    ctx.getParent(node)?.type as string,
  )
}

export function isAdjacentRow(node1: Node | Comment, node2: Node | Comment) {
  return Math.abs(node1.loc.start.line - node2.loc.start.line) === 1
}

export function isSameIndent(
  nodeA: { loc: SourceLocation },
  nodeB: { loc: SourceLocation },
  context: AlignContext,
) {
  return context.getLine(nodeA).indent === context.getLine(nodeB).indent
}

export function isExportDeclaration(node: VariableDeclaration, ctx: AlignContext) {
  return ctx.getParent(node)?.type === 'ExportNamedDeclaration'
}

export function isTrailingLineComment(comment: Comment, ctx: AlignContext) {
  // 必须是单行注释
  if (!isSingleLine(comment.loc)) return false
  const lineText = ctx.getLineText(comment)
  return (
    // 注释前要有代码（不能是纯注释行）
    lineText.slice(0, comment.loc.start.column).trim().length > 0 &&
    // 注释后不能有别的代码
    lineText.slice(comment.loc.end.column).trim().length === 0
  )
}

export function isAlignEnum(node: Node) {
  return (
    node.type === 'TSEnumMember' &&
    // 单行枚举
    isSingleLine(node.loc) &&
    // 需要初始化字段
    node.initializer
  )
}

export function isAlignVariableDeclaration(node: VariableDeclaration, ctx: AlignContext) {
  const parent = ctx.getParent(node)

  if (parent?.type === 'ExportNamedDeclaration' && !parent.specifiers.length) {
    // export const a = 1
    if (!inNormalBlock(parent, ctx)) return false
    if (!isSingleLine(parent.loc)) return false
  } else {
    // const a = 1
    if (!inNormalBlock(node, ctx)) return false
    if (!isSingleLine(node.loc)) return false
  }

  if (node.declarations.length !== 1) return false
  if (!node.declarations[0].init) return false
  return true
}

export function isAlignVariableDeclarator(node: VariableDeclarator, ctx: AlignContext) {
  const parent = ctx.getParent(node)! as VariableDeclaration
  if (!inNormalBlock(parent, ctx)) return false

  if (
    parent.declarations.some(
      (declaration) =>
        declaration !== node && declaration.loc.start.line === node.loc.start.line,
    )
  ) {
    return false
  }

  return true
}

export function isAlignAssignment(node: AssignmentExpression, ctx: AlignContext) {
  const parent = ctx.getParent(node)!

  if (node.operator !== '=') return false
  if (!isSingleLine(node.loc)) return false
  if (node.right.type === 'AssignmentExpression') return false
  if (parent.type !== 'ExpressionStatement') return false
  if (!inNormalBlock(parent, ctx)) return false

  return true
}

export function isDeclarationLineType(node: Node | null, ctx: AlignContext) {
  if (!node) return false
  return (
    node.type === 'VariableDeclaration' ||
    node.type === 'VariableDeclarator' ||
    ctx.getParent(node)?.type === 'VariableDeclarator'
  )
}
