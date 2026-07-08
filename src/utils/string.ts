/**
 * 计算字符串的显示宽度长度（全角 2、半角 1）。
 */
export function getStringWidth(str: string): number {
  if (typeof str !== 'string') return 0

  const isCombiningMark = (char: string): boolean => /\p{M}/u.test(char)

  const isWideChar = (codePoint: number): boolean => {
    if (codePoint <= 0x7f) return false
    if (codePoint >= 0xff00 && codePoint <= 0xffef) {
      if (codePoint >= 0xff61 && codePoint <= 0xff9f) return false
      return true
    }
    if (codePoint >= 0x4e00 && codePoint <= 0x9fff) return true
    if (codePoint >= 0x3400 && codePoint <= 0x4dbf) return true
    if (codePoint >= 0x20000 && codePoint <= 0x2ebef) return true
    if (codePoint >= 0xac00 && codePoint <= 0xd7af) return true
    if (codePoint >= 0x1100 && codePoint <= 0x11ff) return true
    if (codePoint >= 0x3130 && codePoint <= 0x318f) return true
    if (codePoint >= 0xa960 && codePoint <= 0xa97f) return true
    if (codePoint >= 0xd7b0 && codePoint <= 0xd7ff) return true
    if (codePoint >= 0x3040 && codePoint <= 0x309f) return true
    if (codePoint >= 0x30a0 && codePoint <= 0x30ff) return true
    return false
  }

  let length = 0
  for (const char of str) {
    if (isCombiningMark(char)) continue
    const codePoint = char.codePointAt(0)!
    length += isWideChar(codePoint) ? 2 : 1
  }
  return length
}

/**
 * 检测字符串中的换行符类型
 */
// export function detectLineEnding(str: string) {
//   if (typeof str !== 'string') return 'none'
//
//   const purl    = str.replace(/\r\n/g, '')
//   const pureLF  = purl.includes('\n')
//   const pureCR  = purl.includes('\r')
//   const hasCRLF = str.includes('\r\n')
//
//   const length = ([hasCRLF, pureLF, pureCR] as const).filter((v) => v).length
//
//   if (length === 0) return 'none'
//   if (length > 1) return 'mixed'
//   return hasCRLF ? 'crlf' : pureCR ? 'cr' : 'lf'
// }

export function spaces(number: number) {
  return ' '.repeat(number)
}
