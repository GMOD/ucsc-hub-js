/**
 * Class representing an ra file stanza. Each stanza line is split into its key
 * and value and stored as a Map, so the usual Map methods can be used on the
 * stanza. An additional method `add()` is available to take a raw line of text
 * and break it up into a key and value and add them to the class. This should
 * be favored over `set()` when possible, as it performs more validity checks
 * than using `set()`.
 *
 * @extends Map
 * @property {undefined|string} nameKey - The key of the first line of the
 * stanza (`undefined` if the stanza has no lines yet).
 *
 * @property {undefined|string} name - The value of the first line of the
 * stanza, by which it is identified in an ra file  (`undefined` if the stanza
 * has no lines yet).
 *
 * @property {undefined|string} indent - The leading indent of the stanza,
 * which is the same for every line (`undefined` if the stanza has no lines
 * yet, `''` if there is no indent).
 *
 * @throws {Error} Throws if the stanza has blank lines, if the first line
 * doesn't have both a key and a value, if a key in the stanza is
 * duplicated, or if lines in the stanza have inconsistent indentation.
 * @param {(string|string[])} [stanza=[]] - An ra file stanza, either as a
 * string or a array of strings with one line per entry. Supports both LF and
 * CRLF line terminators.
 *
 * @param {object} options
 *
 * @param {boolean} options.checkIndent [true] - Check if a stanza is indented
 * consistently and keep track of the indentation
 */
export default class RaStanza {
  data: Record<string, string> = {}

  _continuedLine?: string

  indent?: string

  name?: string

  nameKey?: string

  constructor(
    stanza: string | string[] = [],
    options?: { checkIndent?: boolean; skipValidation?: boolean },
  ) {
    const { checkIndent = true, skipValidation = false } = options ?? {}
    let stanzaLines: string[]
    if (typeof stanza === 'string') {
      stanzaLines = stanza.trimEnd().split(/\r?\n/)
    } else if (stanza) {
      stanzaLines = stanza
    } else {
      stanzaLines = []
    }
    for (const line of stanzaLines) {
      if (line === '') {
        throw new Error('Invalid stanza, contained blank lines')
      }
      if (line.trim().startsWith('#')) {
        continue
      }
      if (line.trimEnd().endsWith('\\')) {
        const trimmedLine = line.trimEnd().slice(0, -1)
        if (this._continuedLine) {
          this._continuedLine += trimmedLine.trimStart()
        } else {
          this._continuedLine = trimmedLine
        }
        continue
      }
      let combinedLine = line
      if (this._continuedLine) {
        combinedLine = this._continuedLine + combinedLine.trimStart()
        this._continuedLine = undefined
      }
      if (this.indent ?? checkIndent) {
        const indent = combinedLine.match(/^([ \t]+)/)
        if (this.indent === undefined) {
          if (indent) {
            ;[, this.indent] = indent
          } else {
            this.indent = ''
          }
        } else if (
          (this.indent === '' && indent !== null) ||
          (this.indent && indent && this.indent !== indent[1])
        ) {
          throw new Error('Inconsistent indentation of stanza')
        }
      } else {
        this.indent = ''
      }
      const trimmedLine = combinedLine.trim()
      const sep = trimmedLine.indexOf(' ')
      if (sep === -1) {
        if (!this.nameKey) {
          throw new Error(
            'First line in a stanza must have both a key and a value',
          )
        }
        // Adding a key that already exists and has no value is a no-op
        if (this.data[trimmedLine]) {
          continue
        }
        this.data[trimmedLine] = ''
        continue
      }
      const key = trimmedLine.slice(0, sep)
      const value = trimmedLine.slice(sep + 1)
      if (this.data[key] && value !== this.data[key]) {
        throw new Error(
          'Got duplicate key with a different value in stanza: ' +
            `"${key}" key has both ${this.data[key]} and ${value}`,
        )
      }
      if (!this.nameKey) {
        this.nameKey = key
        this.name = trimmedLine.slice(sep + 1)
      }
      this.data[key] = value
    }

    if (!skipValidation) {
      this.validate()
    }
  }

  protected validate() {}
}
