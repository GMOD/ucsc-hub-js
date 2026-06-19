/**
 * Class representing an ra file stanza. Each line is split into its key and
 * value and stored in the `data` record. The key and value of the first line
 * are also exposed as `nameKey` and `name`.
 */
export default class RaStanza {
  data: Record<string, string> = {}

  name?: string

  nameKey?: string

  constructor(
    stanza: string | string[] = [],
    options?: { checkIndent?: boolean; skipValidation?: boolean },
  ) {
    const { checkIndent = true, skipValidation = false } = options ?? {}
    const stanzaLines =
      typeof stanza === 'string' ? stanza.trimEnd().split(/\r?\n/) : stanza

    let currentIndent: string | undefined

    let continuedLine: string | undefined
    for (const line of stanzaLines) {
      if (line === '') {
        throw new Error('Invalid stanza, contained blank lines')
      }
      if (line.trim().startsWith('#')) {
        continue
      }
      if (line.trimEnd().endsWith('\\')) {
        const trimmedLine = line.trimEnd().slice(0, -1)
        if (continuedLine) {
          continuedLine += trimmedLine.trimStart()
        } else {
          continuedLine = trimmedLine
        }
        continue
      }
      let combinedLine = line
      if (continuedLine) {
        combinedLine = continuedLine + combinedLine.trimStart()
        continuedLine = undefined
      }
      if (checkIndent) {
        const indent = /^([ \t]+)/.exec(combinedLine)?.[1] ?? ''
        if (currentIndent === undefined) {
          currentIndent = indent
        } else if (currentIndent !== indent) {
          throw new Error('Inconsistent indentation of stanza')
        }
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
        if (Object.hasOwn(this.data, trimmedLine)) {
          continue
        }
        this.data[trimmedLine] = ''
        continue
      }
      const key = trimmedLine.slice(0, sep)
      const value = trimmedLine.slice(sep + 1)
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

    if (!skipValidation) {
      this.validate()
    }
  }

  protected validate() {}
}
