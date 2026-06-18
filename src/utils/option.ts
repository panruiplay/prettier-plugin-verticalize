import { Options } from '../types'

const defaultOptions: Options = {
  minGroupSize: 2,
  maxWidthDiff: 20,
  alignTrailingComments: true,
  alignEnums: true,
  alignVariableDeclaration: true,
  alignAssignment: true,
}

export function getOption<K extends keyof Options>(
  userOptions: Options,
  key: K,
): NonNullable<Options[K]> {
  const ImproveKeyMap: { [key in keyof Options]?: keyof Options } = {
    alignTrailingCommentsMinGroupSize: 'minGroupSize',
    alignTrailingCommentsMaxWidthDiff: 'maxWidthDiff',
    alignEnumsMinGroupSize: 'minGroupSize',
    alignEnumsMaxWidthDiff: 'maxWidthDiff',
    alignVariableDeclarationMinGroupSize: 'minGroupSize',
    alignVariableDeclarationMaxWidthDiff: 'maxWidthDiff',
    alignAssignmentMinGroupSize: 'minGroupSize',
    alignAssignmentMaxWidthDiff: 'maxWidthDiff',
  }

  const value = userOptions[key]

  if (value === null || value === undefined) {
    const improveKey = ImproveKeyMap[key]
    if (improveKey) {
      return (userOptions[improveKey] ?? defaultOptions[improveKey]) as NonNullable<
        Options[K]
      >
    }
    return defaultOptions[key] as NonNullable<Options[K]>
  }

  return value
}
