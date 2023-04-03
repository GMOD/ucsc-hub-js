import RaStanza from './raStanza'

/**
 * Class representing an ra file. Each file is composed of multiple stanzas, and
 * each stanza is separated by one or more blank lines. Each stanza is stored in
 * a Map with the key being the value of the first key-value pair in the stanza.
 * The usual Map methods can be used on the file. An additional method `add()`
 * is available to take a raw line of text and break it up into a key and value
 * and add them to the class. This should be favored over `set()` when possible,
 * as it performs more validity checks than using `set()`.
 * @extends Map
 * @property {undefined|string} nameKey - The key of the first line of all the
 * stanzas (`undefined` if the stanza has no lines yet).
 * @throws {Error} Throws if an empty stanza is added, if the key in the first
 * key-value pair of each stanze isn't the same, or if two stanzas have the same
 * value for the key-value pair in their first lines.
 * @param {(string|string[])} [raFile=[]] - An ra file, either as a single
 * string or an array of strings with one stanza per entry. Supports both LF
 * and CRLF line terminators.
 * @param {object} options
 * @param {boolean} options.checkIndent [true] - Check if a the stanzas within
 * the file are indented consistently and keep track of the indentation
 */
export default class RaFile extends Map<string, RaStanza> {
  _checkIndent: boolean

  _stanzaAndCommentOrder: string[]

  nameKey?: string

  constructor(raFile: string | string[] = [], options = { checkIndent: true }) {
    super()
    const { checkIndent } = options
    this._checkIndent = checkIndent
    let stanzas: string[]
    if (typeof raFile === 'string') {
      stanzas = raFile.trimEnd().split(/(?:[\t ]*\r?\n){2,}/)
    } else if (!raFile) {
      stanzas = []
    } else {
      stanzas = raFile
    }
    this._stanzaAndCommentOrder = []
    stanzas.forEach(stanza => {
      this.add(stanza)
    })
  }

  /**
   * Add a single stanza to the file
   * @param {string} stanza A single stanza
   * @returns {RaFile} The RaFile object
   */
  add(stanza: string) {
    if (stanza === '') {
      throw new Error('Invalid stanza, was empty')
    }
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
    const raStanza = new RaStanza(stanza, { checkIndent: this._checkIndent })
    if (!this.nameKey) {
      this.nameKey = raStanza.nameKey
    } else if (raStanza.nameKey !== this.nameKey) {
      throw new Error(
        'The first line in each stanza must have the same key. ' +
          `Saw both ${this.nameKey} and ${raStanza.nameKey}`,
      )
    }
    if (!raStanza.name) {
      throw new Error(`No stanza name: ${raStanza.name}`)
    }
    if (this.has(raStanza.name)) {
      throw new Error(`Got duplicate stanza name: ${raStanza.name}`)
    }

    this._stanzaAndCommentOrder.push(raStanza.name)
    return super.set(raStanza.name, raStanza)
  }

  /**
   * Use `add()` if possible instead of this method. If using this, be aware
   * that no checks are made for comments, empty stanzas, duplicate keys, etc.
   * @param {string} key The key of the RaFile stanza
   * @param {RaStanza} value The RaFile stanza used to replace the prior one
   */
  update(key: string, value: RaStanza) {
    if (!(value instanceof RaStanza)) {
      throw new Error(`Value of ${key} is not an RaStanza`)
    }
    super.set(key, value)
  }

  /**
   * Delete a stanza
   * @param {string} stanza The name of the stanza to delete (the value in its
   * first key-value pair)
   * @returns {boolean} true if the deleted stanza existed, false if it did not
   */
  delete(stanza: string) {
    if (this._stanzaAndCommentOrder.includes(stanza)) {
      this._stanzaAndCommentOrder = this._stanzaAndCommentOrder.filter(
        value => value !== stanza,
      )
    }
    return super.delete(stanza)
  }

  /**
   * Clear all stanzas and comments
   */
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
    if (this.size === 0) {
      return ''
    }
    const stanzas = [] as string[]
    this._stanzaAndCommentOrder.forEach(entry => {
      if (entry.startsWith('#')) {
        stanzas.push(`${entry}\n`)
      } else {
        const e = this.get(entry)
        if (e) {
          stanzas.push(e.toString())
        }
      }
    })
    return stanzas.join('\n')
  }
}
