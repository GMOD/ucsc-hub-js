require('./trimStartEndPolyfills')

/**
 * Class representing an ra file stanza. Each stanza line is split into its key
 * and value and stored as a Map, so the usual Map methods can be used on the
 * stanza. An additional method `add()` is available to take a raw line of text
 * and break it up into a key and value and add them to the class. This should
 * be favored over `set()` when possible, as it performs more validity checks
 * than using `set()`.
 * @extends Map
 * @property {undefined|string} nameKey - The key of the first line of the
 * stanza (`undefined` if the stanza has no lines yet).
 * @property {undefined|string} name - The value of the first line of the
 * stanza, by which it is identified in an ra file  (`undefined` if the stanza
 * has no lines yet).
 * @property {undefined|string} indent - The leading indent of the stanza,
 * which is the same for every line (`undefined` if the stanza has no lines
 * yet, `''` if there is no indent).
 * @throws {Error} Throws if the stanza has blank lines, if the first line
 * doesn't have both a key and a value, if a key in the stanza is
 * duplicated, or if lines in the stanza have inconsistent indentation.
 * @param {(string|string[])} [stanza=[]] - An ra file stanza, either as a
 * string or a array of strings with one line per entry. Supports both LF and
 * CRLF line terminators.
 * @param {object} options
 * @param {boolean} options.checkIndent [true] - Check if a stanza is indented
 * consistently and keep track of the indentation
 */
class RaStanza extends Map {
  constructor(stanza, options = { checkIndent: true }) {
    super()
    const { checkIndent } = options
    this._checkIndent = checkIndent
    let stanzaLines
    if (typeof stanza === 'string') {
      stanzaLines = stanza.trimEnd().split(/\r?\n/)
    } else if (!stanza) {
      stanzaLines = []
    } else {
      stanzaLines = stanza
    }
    this._keyAndCommentOrder = []
    stanzaLines.forEach(line => {
      this.add(line)
    })
  }

  /**
   * Add a single line to the stanza. If the exact line already exists, does
   * nothing.
   * @param {string} line A stanza line
   * @returns {RaStanza} The RaStanza object
   */
  add(line) {
    if (line === '') throw new Error('Invalid stanza, contained blank lines')
    if (line.trim().startsWith('#')) {
      this._keyAndCommentOrder.push(line.trim())
      return this
    }
    if (line.trimEnd().endsWith('\\')) {
      const trimmedLine = line.trimEnd().slice(0, -1)
      if (this._continuedLine) this._continuedLine += trimmedLine.trimStart()
      else this._continuedLine = trimmedLine
      return this
    }
    let combinedLine = line
    if (this._continuedLine) {
      combinedLine = this._continuedLine + combinedLine.trimStart()
      this._continuedLine = undefined
    }
    if (this.indent || this._checkIndent) {
      const indent = combinedLine.match(/^([ \t]+)/)
      if (this.indent === undefined) {
        if (indent) [, this.indent] = indent
        else this.indent = ''
      } else if (
        (this.indent === '' && indent !== null) ||
        (this.indent && this.indent !== indent[1])
      ) {
        throw new Error('Inconsistent indentation of stanza')
      }
    } else {
      this.indent = ''
    }
    const trimmedLine = combinedLine.trim()
    const sep = trimmedLine.indexOf(' ')
    if (sep === -1) {
      if (!this.nameKey)
        throw new Error(
          'First line in a stanza must have both a key and a value',
        )
      // Adding a key that already exists and has no value is a no-op
      if (this.has(trimmedLine)) return this
      this._keyAndCommentOrder.push(trimmedLine)
      return super.set(trimmedLine, '')
    }
    const key = trimmedLine.slice(0, sep)
    const value = trimmedLine.slice(sep + 1)
    if (this.has(key) && value !== this.get(key))
      throw new Error(
        'Got duplicate key with a different value in stanza: ' +
          `"${key}" key has both ${this.get(key)} and ${value}`,
      )
    this._keyAndCommentOrder.push(key)
    if (!this.nameKey) {
      this.nameKey = key
      this.name = trimmedLine.slice(sep + 1)
    }
    return super.set(key, value)
  }

  /**
   * Use `add()` if possible instead of this method. If using this, be aware
   * that no checks are made for comments, indentation, duplicate keys, etc.
   * @param {string} key The key of the stanza line
   * @param {string} value The value of the stanza line
   * @returns {RaStanza} The RaStanza object
   */
  set(key, value) {
    if (!(typeof value === 'string'))
      throw new Error(`Value of ${key} must be a string, got ${typeof value}`)
    return super.set(key, value)
  }

  /**
   * Delete a line
   * @param {string} key The key of the line to delete
   * @returns {boolean} true if the deleted line existed, false if it did not
   */
  delete(key) {
    if (key === this.nameKey)
      throw new Error(
        'Cannot delete the first line in a stanza (you can still overwrite it with set()).',
      )
    if (this._keyAndCommentOrder.includes(key))
      this._keyAndCommentOrder = this._keyAndCommentOrder.filter(
        value => value !== key,
      )
    return super.delete(key)
  }

  /**
   * Clear all lines and comments
   */
  clear() {
    this._keyAndCommentOrder.length = 0
    this._continuedLine = undefined
    this.indent = undefined
    this.name = undefined
    this.nameKey = undefined
    super.clear()
  }

  /**
   * @returns {string} Returns the stanza as a string fit for writing to a ra
   * file. Original leading indent is preserved. It may not be the same as the
   * input stanza as lines that were joined with `\` in the input will be output
   * as a single line and all comments will have the same indentations as the
   * rest of the stanza. Comments between joined lines will move before that
   * line.
   */
  toString() {
    if (this.size === 0) return ''
    const lines = []
    this._keyAndCommentOrder.forEach(entry => {
      if (entry.startsWith('#')) lines.push(`${this.indent}${entry}`)
      else lines.push(`${this.indent}${entry} ${this.get(entry)}`.trimEnd())
    })
    return `${lines.join('\n')}\n`
  }
}

module.exports = RaStanza
