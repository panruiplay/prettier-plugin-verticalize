import {
  AlignContext,
  AssignmentGroup,
  CommentGroup,
  DeclaratorGroup,
  EnumGroup,
  HasInitDeclaratorGroup,
  SingleVariableDeclarationGroup,
} from './types'
import { visit, types } from 'recast'
import {
  AssignmentExpression,
  Token,
  TSEnumDeclaration,
  TSEnumMember,
  VariableDeclaration,
  VariableDeclarator,
} from '@babel/types'
import {
  isAlignEnum,
  isTrailingLineComment,
  isDeclarationLineType,
  isSameIndent,
  isAlignVariableDeclaration,
  isAlignVariableDeclarator,
  isAdjacentRow,
  isSpanLessThen,
  isAlignAssignment,
} from './utils/ast-guard'
import { groupBy } from './utils/group'
import { getStringWidth } from './utils/string'

type Visitor = types.Visitor

function collectNode(ctx: AlignContext) {
  const enumMembers: TSEnumMember[]         = [] // 枚举成员
  const declarations: VariableDeclaration[] = [] // 所有符合对齐条件的变量声明
  const declarators: VariableDeclarator[]   = [] // 所有符合对齐条件的变量声明成员
  const assignments: AssignmentExpression[] = [] // 所有符合对齐条件的赋值语句
  let visitTSEnumDeclaration: Visitor['visitTSEnumDeclaration']       = undefined
  let visitVariableDeclaration: Visitor['visitVariableDeclaration']   = undefined
  let visitAssignmentExpression: Visitor['visitAssignmentExpression'] = undefined

  if (ctx.getOption('alignEnums')) {
    visitTSEnumDeclaration = function (path) {
      enumMembers.push(...(path.node as TSEnumDeclaration).members)
      this.traverse(path)
    }
  }

  if (ctx.getOption('alignVariableDeclaration')) {
    visitVariableDeclaration = function (path) {
      const node = path.node as VariableDeclaration
      if (isAlignVariableDeclaration(node, ctx)) {
        declarations.push(node)
      } else if (node.declarations.length > 1) {
        declarators.push(
          ...node.declarations.filter((item) => isAlignVariableDeclarator(item, ctx)),
        )
      }
      this.traverse(path)
    }
  }

  if (ctx.getOption('alignAssignment')) {
    visitAssignmentExpression = function (path) {
      assignments.push(path.node as AssignmentExpression)
      this.traverse(path)
    }
  }

  visit(ctx.ast, {
    visitTSEnumDeclaration,
    visitVariableDeclaration,
    visitAssignmentExpression,
  })

  return {
    enumMembers,
    declarations,
    declarators,
    assignments,
  }
}

export function createCodeGroup(ctx: AlignContext) {
  const { declarators, declarations, enumMembers, assignments } = collectNode(ctx)

  const enumMaxWidthDiff       = ctx.getOption('alignEnumsMaxWidthDiff')
  const assignmentMaxWidthDiff = ctx.getOption('alignAssignmentMaxWidthDiff')
  const vdMaxWidthDiff         = ctx.getOption('alignVariableDeclarationMaxWidthDiff')
  const vdMinGroupSize         = ctx.getOption('alignVariableDeclarationMinGroupSize')

  const enumGroups: EnumGroup[] = groupBy(
    enumMembers,
    ({ item: prev }, { item: cur, info }, { meta }) => {
      return (
        // 相同缩进
        isSameIndent(prev, cur, ctx) &&
        // 是连续的行
        isAdjacentRow(prev, cur) &&
        // 控制组内枚举名称最大宽度和最小行宽度差距
        Math.abs(meta.minLeftWidth - info.leftWidth) <= enumMaxWidthDiff &&
        Math.abs(meta.maxLeftWidth - info.leftWidth) <= enumMaxWidthDiff
      )
    },
    {
      minGroupSize: ctx.getOption('alignEnumsMinGroupSize'),
      initGroup: () => ({ minLeftWidth: Infinity, maxLeftWidth: -Infinity }),
      initItemInfo: (item) => {
        const lineText = ctx.getLineText(item)
        return {
          leftWidth: getStringWidth(lineText.slice(0, item.id.loc.end.column)),
        }
      },
      onEnterGroup: (item, _, { meta }) => {
        meta.minLeftWidth = Math.min(meta.minLeftWidth, item.info.leftWidth)
        meta.maxLeftWidth = Math.max(meta.maxLeftWidth, item.info.leftWidth)
      },
      filter: isAlignEnum,
    },
  )

  const singleDeclarationGroups: SingleVariableDeclarationGroup[] = groupBy(
    declarations,
    (prev, cur, { meta }) => {
      return (
        // 相同缩进
        isSameIndent(prev.item, cur.item, ctx) &&
        // 是连续的行
        isAdjacentRow(prev.item, cur.item) &&
        // 控制组内变量名称最大宽度和最小行宽度差距
        Math.abs(meta.minLeftWidth - cur.info.leftWidth) <= vdMaxWidthDiff &&
        Math.abs(meta.maxLeftWidth - cur.info.leftWidth) <= vdMaxWidthDiff
      )
    },
    {
      minGroupSize: vdMinGroupSize,
      initGroup: () => ({ minLeftWidth: Infinity, maxLeftWidth: -Infinity }),
      initItemInfo: (item) => {
        const lineText = ctx.getLineText(item)
        const leftWidth = getStringWidth(
          lineText.slice(0, item.declarations[0].id.loc.end.column),
        )
        return {
          leftWidth,
        }
      },
      onEnterGroup: (item, _, { meta }) => {
        const leftWidth = item.info.leftWidth
        meta.minLeftWidth = Math.min(meta.minLeftWidth, leftWidth)
        meta.maxLeftWidth = Math.max(meta.maxLeftWidth, leftWidth)
      },
    },
  )

  const declaratorGroups: DeclaratorGroup[] = groupBy(
    declarators,
    (prev, cur) => {
      return (
        // 相同父元素
        ctx.getParent(prev.item) === ctx.getParent(cur.item)
      )
    },
    {
      minGroupSize: vdMinGroupSize,
      initGroup: () => ({ maxNameStart: -Infinity }),
      initItemInfo: (item) => {
        const lineText  = ctx.getLineText(item)
        const nameStart = getStringWidth(lineText.slice(0, item.id.loc.start.column))
        return { nameStart }
      },
      onEnterGroup: (item, _, { meta }) => {
        meta.maxNameStart = Math.max(meta.maxNameStart, item.info.nameStart)
      },
    },
  )

  const hasInitDeclaratorGroups: HasInitDeclaratorGroup[] = declaratorGroups.reduce((
    all,
    declaratorGroup,
  ) => {
    const groups: HasInitDeclaratorGroup[] = groupBy(
      declaratorGroup.list.map((v) => v.item),
      (prev, cur, { meta }) => {
        return (
          // 连续行
          isAdjacentRow(prev.item, cur.item) &&
          // 控制组内变量名称最大宽度和最小行宽度差距
          Math.abs(meta.minNameWidth - cur.info.nameWidth) <= vdMaxWidthDiff &&
          Math.abs(meta.maxNameWidth - cur.info.nameWidth) <= vdMaxWidthDiff
        )
      },
      {
        minGroupSize: vdMinGroupSize,
        initGroup: () => ({ minNameWidth: Infinity, maxNameWidth: -Infinity }),
        initItemInfo: (item) => {
          const lineText  = ctx.getLineText(item)
          const nameStr   = lineText.slice(item.id.loc.start.column, item.id.loc.end.column)
          const nameWidth = getStringWidth(nameStr)
          return { nameWidth }
        },
        filter: (v) => v.init && isSpanLessThen(2, v),
        onEnterGroup: (item, _, { meta }) => {
          meta.minNameWidth = Math.min(meta.minNameWidth, item.info.nameWidth)
          meta.maxNameWidth = Math.max(meta.maxNameWidth, item.info.nameWidth)
        },
      },
    )

    return all.concat(groups)
  }, [] as HasInitDeclaratorGroup[])

  const assignmentGroups: AssignmentGroup[] = groupBy(
    assignments,
    ({ item: prev }, { item: cur, info }, { meta }) => {
      return (
        // 相同缩进
        isSameIndent(prev, cur, ctx) &&
        // 是连续的行
        isAdjacentRow(prev, cur) &&
        // 控制组内赋值语句左侧最大宽度和最小行宽度差距
        Math.abs(meta.minLeftWidth - info.leftWidth) <= assignmentMaxWidthDiff &&
        Math.abs(meta.maxLeftWidth - info.leftWidth) <= assignmentMaxWidthDiff
      )
    },
    {
      minGroupSize: ctx.getOption('alignAssignmentMinGroupSize'),
      initGroup: () => ({ minLeftWidth: Infinity, maxLeftWidth: -Infinity }),
      initItemInfo: (item) => {
        const lineText = ctx.getLineText(item)
        return {
          leftWidth: getStringWidth(lineText.slice(0, item.left.loc.end.column)),
        }
      },
      onEnterGroup: (item, _, { meta }) => {
        meta.minLeftWidth = Math.min(meta.minLeftWidth, item.info.leftWidth)
        meta.maxLeftWidth = Math.max(meta.maxLeftWidth, item.info.leftWidth)
      },
      filter: (v) => isAlignAssignment(v, ctx),
    },
  )

  return {
    enumGroups,
    singleDeclarationGroups,
    declaratorGroups,
    hasInitDeclaratorGroups,
    assignmentGroups,
  }
}

export function createCommentGroup(context: AlignContext) {
  let tokenIndex     = 0
  const maxWidthDiff = context.getOption('alignTrailingCommentsMaxWidthDiff')

  const commentGroup: CommentGroup[] = groupBy(
    context.comments.filter((v) => isTrailingLineComment(v, context)),
    (prev, cur, { meta }) => {
      return (
        // 是连续的注释行
        isAdjacentRow(prev.item, cur.item) &&
        // 相同的行类型
        prev.info.lineType === cur.info.lineType &&
        // 控制组内行最大宽度和最小行宽度差距
        Math.abs(meta.minBeforeWidth - cur.info.beforeWidth) <= maxWidthDiff &&
        Math.abs(meta.maxBeforeWidth - cur.info.beforeWidth) <= maxWidthDiff
      )
    },
    {
      minGroupSize: context.getOption('alignTrailingCommentsMinGroupSize'),
      initGroup: () => ({ minBeforeWidth: Infinity, maxBeforeWidth: -Infinity }),
      initItemInfo: (comment) => {
        const line = comment.loc.start.line
        let lineFirstToken: Token
        do {
          lineFirstToken = context.tokens[tokenIndex++]
        } while (lineFirstToken && lineFirstToken.loc.start.line < line)

        const firstNode  = context.getFirstNodeByIndex(lineFirstToken.start)
        const parentNode = firstNode && context.getParent(firstNode)

        let lineType = ''
        if (isDeclarationLineType(firstNode, context)) {
          lineType = 'VariableDeclaration'
        } else if (firstNode && parentNode) {
          lineType = firstNode.type + '-' + (parentNode?.type ?? '')
        }

        const lineText    = context.getLineText(comment)
        const stringWidth = getStringWidth(lineText.slice(0, comment.loc.start.column))

        return {
          lineType,
          beforeWidth: stringWidth + context.lineWidthOffset[line - 1],
        }
      },
      onEnterGroup: ({ info }, _, { meta }) => {
        meta.minBeforeWidth = Math.min(meta.minBeforeWidth, info.beforeWidth)
        meta.maxBeforeWidth = Math.max(meta.maxBeforeWidth, info.beforeWidth)
      },
    },
  )

  return commentGroup
}
