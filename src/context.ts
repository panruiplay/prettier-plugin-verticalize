import { parse } from 'recast'
import BabelTsParser from 'recast/parsers/babel-ts.js'
import { Node, Program, Comment } from '@babel/types'
import { AlignContext, Options } from './types'
import MagicString from 'magic-string'
import { getOption } from './utils/option'

const SKIP_KEYS = new Set([
  'start',
  'end',
  'parent',
  'loc',
  'range',
  'leadingComments',
  'trailingComments',
  'comments',
  'tokens',
  'original',
  'errors',
])

function astTraversal(program: Program) {
  const parentMap = new Map<Node, Node | null>()
  const indexMap  = new Map<number, Node | null>()
  const comments  = [] as Comment[]
  const visited   = new WeakSet<Node>()

  function walk(node: Node, parent: Node | null) {
    /* v8 ignore if -- @preserve */
    if (visited.has(node)) return
    if (parent) parentMap.set(node, parent)
    if (node.start != null && !indexMap.has(node.start) && node.type !== 'Program') {
      indexMap.set(node.start, node)
    }
    visited.add(node)

    for (const key of Object.keys(node)) {
      if (SKIP_KEYS.has(key)) {
        if (key === 'comments') comments.push(...node[key])
        continue
      }
      const value = (node as unknown as Record<string, unknown>)[key]
      if (!value) continue
      if (Array.isArray(value)) {
        for (const child of value) {
          if (child && typeof child === 'object' && 'type' in child) {
            walk(child as Node, node)
          }
        }
      } else if (typeof value === 'object' && 'type' in value) {
        walk(value as Node, node)
      }
    }
  }

  walk(program, null)

  comments.sort((a, b) => (a.start || 0) - (b.start || 0))

  return [parentMap, indexMap, comments] as const
}

export function createAlignContext(
  sourceCode: string,
  options: Options,
  useTabs = false,
): AlignContext {
  const ast = parse(sourceCode, {
    parser: BabelTsParser,
    useTabs,
    ...(useTabs ? { tabWidth: 1 } : null),
  })
  const [parentMap, indexMap, comments] = astTraversal(ast.program)

  const context: AlignContext = {
    ast,
    magicString: new MagicString(sourceCode),
    tokens: ast.tokens || [],
    comments,
    lineWidthOffset: Array(ast.loc.lines.infos.length).fill(0),
    getLine: ({ loc }) => {
      const idx = loc.start.line - 1
      return {
        idx,
        ...ast.loc.lines.infos[idx],
      }
    },
    getLineText: ({ loc }) => ast.loc.lines.infos[loc.start.line - 1].line,
    getParent: (node: Node) => parentMap.get(node) || null,
    getFirstNodeByIndex: (index: number) => indexMap.get(index) || null,
    getOption: (key) => getOption(options, key),
  }

  return context
}
