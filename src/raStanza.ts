import { isComment, nullProtoRecord, splitLines } from './util.ts'

/**
 * Class representing an ra file stanza. Each line is split into its key and
 * value and stored in the `data` record. The key and value of the first line
 * are also exposed as `nameKey` and `name`.
 */
export default class RaStanza {
  data: Record<string, string> = nullProtoRecord()

  name?: string

  nameKey?: string

  constructor(
    stanza: string | string[] = [],
    options?: { checkIndent?: boolean; skipValidation?: boolean },
  ) {
    const { checkIndent = true, skipValidation = false } = options ?? {}
    const stanzaLines = typeof stanza === 'string' ? splitLines(stanza) : stanza

    let currentIndent: string | undefined
    let continuedLine: string | undefined
    for (const line of stanzaLines) {
      if (line === '') {
        throw new Error('Invalid stanza, contained blank lines')
      }
      if (!isComment(line)) {
        const trimmedEnd = line.trimEnd()
        if (trimmedEnd.endsWith('\\')) {
          const withoutSlash = trimmedEnd.slice(0, -1)
          continuedLine = continuedLine
            ? continuedLine + withoutSlash.trimStart()
            : withoutSlash
        } else {
          const combinedLine = continuedLine
            ? continuedLine + line.trimStart()
            : line
          continuedLine = undefined
          if (checkIndent) {
            const indent = /^[\t ]+/.exec(combinedLine)?.[0] ?? ''
            if (currentIndent === undefined) {
              currentIndent = indent
            } else if (currentIndent !== indent) {
              throw new Error('Inconsistent indentation of stanza')
            }
          }
          this.addLine(combinedLine)
        }
      }
    }
    // a stanza ending on a "\" leaves a line unterminated: keep it instead of
    // silently dropping it
    if (continuedLine) {
      this.addLine(continuedLine)
    }

    if (!skipValidation) {
      this.validate()
    }
  }

  private addLine(line: string) {
    const trimmedLine = line.trim()
    // key and value are separated by any run of whitespace, not just a space
    const sep = /\s/.exec(trimmedLine)?.index
    if (sep === undefined) {
      if (!this.nameKey) {
        throw new Error(
          'First line in a stanza must have both a key and a value',
        )
      }
      // Adding a key that already exists and has no value is a no-op
      if (!Object.hasOwn(this.data, trimmedLine)) {
        this.data[trimmedLine] = ''
      }
    } else {
      const key = trimmedLine.slice(0, sep)
      const value = trimmedLine.slice(sep + 1).trimStart()
      if (Object.hasOwn(this.data, key) && this.data[key] !== value) {
        throw new Error(
          'Got duplicate key with a different value in stanza: ' +
            `"${key}" key has both ${this.data[key]} and ${value}`,
        )
      }
      if (!this.nameKey) {
        this.nameKey = key
        this.name = value
      }
      this.data[key] = value
    }
  }

  protected validate() {}
}
