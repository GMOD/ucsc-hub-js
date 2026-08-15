import RaStanza from './raStanza.ts'
import { dataLines, nullProtoRecord, splitStanzas } from './util.ts'

/**
 * Class representing an ra file. Each file is composed of multiple stanzas,
 * separated by one or more blank lines. Each stanza is stored in the `data`
 * record, keyed by the value of the first key-value pair in the stanza. Lines
 * that are entirely comments (`#`) and `include` directives are skipped.
 *
 * Accepts a single string or an array of strings with one stanza per entry,
 * with either LF or CRLF line terminators. Throws if a stanza is empty, if the
 * stanzas disagree on their first-line key, or if two stanzas share a name.
 */
export default class RaFile {
  data: Record<string, RaStanza> = nullProtoRecord()

  nameKey?: string

  constructor(
    raFile: string | string[] = [],
    options?: { checkIndent?: boolean; skipValidation?: boolean },
  ) {
    const { checkIndent = true, skipValidation = false } = options ?? {}
    const stanzas = typeof raFile === 'string' ? splitStanzas(raFile) : raFile
    for (const stanza of stanzas) {
      if (stanza === '') {
        throw new Error('Invalid stanza, was empty')
      }
      // stanzas of nothing but comments and/or include directives hold no data
      const lines = dataLines(stanza)
      if (lines.length > 0) {
        const raStanza = new RaStanza(lines, { checkIndent })
        if (this.nameKey === undefined) {
          this.nameKey = raStanza.nameKey
        } else if (raStanza.nameKey !== this.nameKey) {
          throw new Error(
            'The first line in each stanza must have the same key. ' +
              `Saw both ${this.nameKey} and ${raStanza.nameKey}`,
          )
        }
        if (raStanza.name === undefined) {
          throw new Error(`No stanza name: ${lines[0]}`)
        }
        if (Object.hasOwn(this.data, raStanza.name)) {
          throw new Error(`Got duplicate stanza name: ${raStanza.name}`)
        }

        this.data[raStanza.name] = raStanza
      }
    }

    if (!skipValidation) {
      this.validate()
    }
  }

  protected validate() {}
}
