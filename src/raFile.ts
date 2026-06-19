import RaStanza from './raStanza.ts'

/**
 * Class representing an ra file. Each file is composed of multiple stanzas,
 * separated by one or more blank lines. Each stanza is stored in the `data`
 * record, keyed by the value of the first key-value pair in the stanza. Lines
 * that are entirely comments (`#`) and `include` directives are skipped.
 * @property {undefined|string} nameKey - The key of the first line of all the
 * stanzas (`undefined` if the file has no stanzas yet).
 * @throws {Error} Throws if an empty stanza is added, if the key in the first
 * key-value pair of each stanza isn't the same, or if two stanzas have the same
 * value for the key-value pair in their first lines.
 * @param {(string|string[])} [raFile=[]] - An ra file, either as a single
 * string or an array of strings with one stanza per entry. Supports both LF
 * and CRLF line terminators.
 * @param {object} [options]
 * @param {boolean} [options.checkIndent=true] - Check that the stanzas within
 * the file are indented consistently and keep track of the indentation
 * @param {boolean} [options.skipValidation=false] - Skip the subclass
 * validation step
 */
export default class RaFile {
  data: Record<string, RaStanza> = {}

  nameKey?: string

  constructor(
    raFile: string | string[] = [],
    options?: { checkIndent?: boolean; skipValidation?: boolean },
  ) {
    const { checkIndent = true, skipValidation = false } = options ?? {}
    const stanzas =
      typeof raFile === 'string'
        ? raFile.trimEnd().split(/(?:[\t ]*\r?\n){2,}/)
        : raFile
    for (const stanza of stanzas) {
      if (stanza === '') {
        throw new Error('Invalid stanza, was empty')
      }
      if (/^include\s/.test(stanza)) {
        continue
      }
      if (stanza.trim().startsWith('#')) {
        const stanzaLines = stanza
          .trimEnd()
          .split(/\r?\n/)
          .map(line => line.trim())
        if (stanzaLines.every(line => line.startsWith('#'))) {
          continue
        }
      }
      const raStanza = new RaStanza(stanza, { checkIndent })
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
      if (Object.hasOwn(this.data, raStanza.name)) {
        throw new Error(`Got duplicate stanza name: ${raStanza.name}`)
      }

      this.data[raStanza.name] = raStanza
    }

    if (!skipValidation) {
      this.validate()
    }
  }

  protected validate() {}
}
