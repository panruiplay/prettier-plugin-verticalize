import type { Plugin, Printer } from 'prettier'
import docPkg from 'prettier/doc.js'
import * as prettierEstree from 'prettier/plugins/estree'
import { interface2PrettierOptions } from './utils/type'
import { verticalAlign } from './apply'
import { Options } from './types'

type EstreePrinter = Printer & { print: NonNullable<Printer['print']> }

const docPrinter        = docPkg.printer
const baseEstreePrinter = prettierEstree.printers.estree
const basePrint         = baseEstreePrinter.print.bind(baseEstreePrinter)

const estreePrinter: EstreePrinter = {
  ...baseEstreePrinter,
  print(path, options, print) {
    const doc = basePrint(path, options, print)

    if (path.isRoot && (path.node.type === 'Program' || path.node.type === 'File')) {
      const { formatted } = docPrinter.printDocToString(doc, {
        printWidth: options.printWidth,
        tabWidth: options.tabWidth,
        useTabs: options.useTabs,
        parentParser: options.parentParser,
        __embeddedInHtml: options.__embeddedInHtml,
      })

      return verticalAlign(
        formatted,
        options as any as Options,
        !!options.useTabs,
        // (options.filepath ?? options.filePath) as string,
      )
    }

    return doc
  },
}

const plugin: Plugin = {
  printers: {
    estree: estreePrinter,
  },
  options: {
    minGroupSize: { type: 'int', category: 'align' },
    maxWidthDiff: { type: 'int', category: 'align' },
    alignTrailingComments: { type: 'boolean', category: 'align', description: '' },
    alignTrailingCommentsMinGroupSize: { type: 'int', category: 'align' },
    alignTrailingCommentsMaxWidthDiff: { type: 'int', category: 'align' },
    alignEnums: { type: 'boolean', category: 'align', description: '' },
    alignEnumsMinGroupSize: { type: 'int', category: 'align' },
    alignEnumsMaxWidthDiff: { type: 'int', category: 'align' },
    alignVariableDeclaration: { type: 'boolean', category: 'align', description: '' },
    alignVariableDeclarationMinGroupSize: { type: 'int', category: 'align' },
    alignVariableDeclarationMaxWidthDiff: { type: 'int', category: 'align' },
    alignAssignment: { type: 'boolean', category: 'align', description: '' },
    alignAssignmentMinGroupSize: { type: 'int', category: 'align' },
    alignAssignmentMaxWidthDiff: { type: 'int', category: 'align' },
  } satisfies interface2PrettierOptions<Required<Options>>,
}

export default plugin
