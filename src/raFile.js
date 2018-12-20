const RaStanza = require('./raStanza')

/**
 * Class representing an ra file stanza. Each stanza line is split into its key
 * and value and stored as a Map, so the usual Map methods can be used on the
 * stanza. The exception is `set()`, which takes a single line instead of a key
 * and a value.
 * @extends Map
 * @property {undefined|string} nameKey - The key of the first line of the
 * stanza (`undefined` if the stanza has no lines yet).
 * @property {undefined|string} name - The value of the first line of the
 * stanza, by which it is identified in an ra file  (`undefined` if the stanza
 * has no lines yet).
 * @property {undefined|string} indent - The leading indent of the stanza,
 * which is the same for every line (`undefined` if the stanza has not lines
 * yet, `''` if there is no indent).
 * @throws {Error} Throws if the stanza has blank lines, if the first line
 * doesn't have both a key and a value, if a key in the stanza is
 * duplicated, or if lines in the stanza have inconsistent indentation.
 */
class RaFile extends Map {
  /**
   * Create a stanza
   * @param {(string|string[])} [raFile=[]] - An ra file, either as a single
   * string or an array of strings with one stanza per entry. Supports both LF
   * and CRLF line terminators.
   */
  constructor(raFile) {
    super()
    let stanzas
    if (typeof raFile === 'string') {
      stanzas = raFile.trimEnd().split(/(?:\r?\n){2,}/)
    } else if (!raFile) {
      stanzas = []
    } else {
      stanzas = raFile
    }
    this._stanzaAndCommentOrder = []
    stanzas.forEach(stanza => {
      this.set(stanza)
    })
  }

  /**
   * Overrides the default Map set to take a single value, which is a single
   * stanza
   * @param {string} stanza A single stanza
   * @returns {RaFile} The RaFile object
   */
  set(stanza) {
    if (stanza === '') throw new Error('Invalid stanza, was empty')
    if (stanza.trim().startsWith('#')) {
      const stanzaLines = stanza
        .trimEnd()
        .split(/\r?\n/)
        .map(line => line.trim())
      if (stanzaLines.every(line => line.startsWith('#'))) {
        this._stanzaAndCommentOrder.push(stanzaLines.join('\n'))
        return this
      }
    }
    const raStanza = new RaStanza(stanza)
    if (!this.nameKey) this.nameKey = raStanza.nameKey
    else if (raStanza.nameKey !== this.nameKey)
      throw new Error(
        'The first line in each stanza must have the same key. ' +
          `Saw both ${this.nameKey} and ${raStanza.nameKey}`,
      )
    if (this.has(raStanza.name))
      throw new Error(`Got duplicate stanza name: ${raStanza.name}`)
    this._stanzaAndCommentOrder.push(raStanza.name)
    return super.set(raStanza.name, raStanza)
  }

  delete(stanza) {
    if (this._stanzaAndCommentOrder.includes(stanza))
      this._stanzaAndCommentOrder = this._stanzaAndCommentOrder.filter(
        value => value !== stanza,
      )
    return super.delete(stanza)
  }

  clear() {
    this._stanzaAndCommentOrder.length = 0
    this.nameKey = undefined
    super.clear()
  }

  /**
   * @returns {string} Returns the stanza as a string fit for writing to a ra
   * file. Original leading indent is preserved. It may not be the same as the
   * input stanza as lines that were joined with `\` in the input will be output
   *  as a single line and all comments will have the same indentations as the
   * rest of the stanza. Comments between joined lines will move before that
   * line.
   */
  toString() {
    if (this.size === 0) return ''
    const stanzas = []
    this._stanzaAndCommentOrder.forEach(entry => {
      if (entry.startsWith('#')) stanzas.push(`${entry}\n`)
      else stanzas.push(this.get(entry).toString())
    })
    return stanzas.join('\n')
  }
}

module.exports = RaFile
