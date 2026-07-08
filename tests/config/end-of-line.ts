import { describe } from 'vitest'
import { formatCase } from '../helpers/format-case'

describe('endOfLine', () => {
  const arrString = [
    'const a   = 111',
    'const bb  = 222',
    'const ccc = 333',
    'const ccc = 444',
    '{',
    '  const x   = 1',
    '  const xxx = 1',
    '}',
  ]

  formatCase({
    name: 'ln -> cr',
    endOfLine: 'cr',
    input: arrString.join('\n'),
    output: arrString.join('\r'),
  })

  formatCase({
    name: 'cr -> cr | useTabs',
    useTabs: true,
    endOfLine: 'cr',
    input: arrString.join('\r'),
    output: arrString.join('\r'),
  })

  formatCase({
    name: 'cr -> crlf',
    endOfLine: 'crlf',
    input: arrString.join('\r'),
    output: arrString.join('\r\n'),
  })
})
