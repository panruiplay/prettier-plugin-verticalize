import { AlignContext, Options } from './types'
import { createAlignContext } from './context'
import { createCodeGroup, createCommentGroup } from './group'
import { spaces } from './utils/string'

function applyCodeAlignment(context: AlignContext) {
  const {
    enumGroups,
    singleDeclarationGroups,
    declaratorGroups,
    hasInitDeclaratorGroups,
    assignmentGroups,
  } = createCodeGroup(context)

  for (const { list, meta } of enumGroups) {
    for (const { item, info } of list) {
      const lineIdx     = item.loc.start.line - 1
      const leftWidth   = info.leftWidth
      const appendWidth = meta.maxLeftWidth - leftWidth

      if (appendWidth <= 0) continue

      context.lineWidthOffset[lineIdx] += appendWidth
      context.magicString.appendLeft(item.id.end!, spaces(appendWidth))
    }
  }

  for (const { list, meta } of singleDeclarationGroups) {
    for (const declaration of list) {
      const lineIdx     = context.getLine(declaration.item.declarations[0]).idx
      const leftWidth   = declaration.info.leftWidth
      const appendWidth = meta.maxLeftWidth - leftWidth

      if (appendWidth <= 0) continue

      context.lineWidthOffset[lineIdx] += appendWidth
      context.magicString.appendLeft(
        declaration.item.declarations[0].id.end!,
        spaces(appendWidth),
      )
    }
  }

  for (const { list, meta } of hasInitDeclaratorGroups) {
    for (const declarator of list) {
      const lineIdx     = declarator.item.loc.start.line - 1
      const appendWidth = meta.maxNameWidth - declarator.info.nameWidth

      if (appendWidth <= 0) continue

      context.lineWidthOffset[lineIdx] += appendWidth
      context.magicString.appendLeft(declarator.item.id.end!, spaces(appendWidth))
    }
  }

  for (const { list, meta } of declaratorGroups) {
    for (const declarator of list) {
      const lineIdx     = declarator.item.loc.start.line - 1
      const nameStart   = declarator.info.nameStart
      const appendWidth = meta.maxNameStart - nameStart

      if (appendWidth <= 0) continue

      context.lineWidthOffset[lineIdx] += appendWidth
      context.magicString.appendLeft(declarator.item.id.start!, spaces(appendWidth))
    }
  }

  for (const { list, meta } of assignmentGroups) {
    for (const { item, info } of list) {
      const lineIdx     = context.getLine(item).idx
      const leftWidth   = info.leftWidth
      const appendWidth = meta.maxLeftWidth - leftWidth

      if (appendWidth <= 0) continue

      context.lineWidthOffset[lineIdx] += appendWidth
      context.magicString.appendLeft(item.left.end!, spaces(appendWidth))
    }
  }
}

function applyCommentAlignment(context: AlignContext) {
  if (!context.getOption('alignTrailingComments')) return

  const groups = createCommentGroup(context)

  for (const { list, meta } of groups) {
    for (let i = 0; i < list.length; i++) {
      const { item, info } = list[i]
      const appendWidth    = meta.maxBeforeWidth - info.beforeWidth

      if (appendWidth <= 0) continue

      context.magicString.appendLeft(item.start!, spaces(appendWidth))
    }
  }
}

export function verticalAlign(sourceCode: string, options: Options, useTabs = false) {
  const context = createAlignContext(sourceCode, options, useTabs)

  // 对齐代码（枚举、变量声明等）
  applyCodeAlignment(context)
  // 对齐注释
  applyCommentAlignment(context)

  return context.magicString.toString()
}
