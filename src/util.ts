import type RaStanza from './raStanza.ts'

// A prototype-free record, so keys that collide with Object.prototype members
// ("__proto__", "constructor", "toString", ...) are stored as plain data
// instead of being silently dropped or reparenting the object.
export function nullProtoRecord<V>(): Record<string, V> {
  return Object.create(null)
}

// Split a file into stanzas on runs of one or more blank lines (trailing
// whitespace on the blank lines is tolerated). Leading and trailing blank
// lines are dropped. Handles both LF and CRLF.
export function splitStanzas(text: string) {
  return text
    .replace(/^(?:[\t ]*\r?\n)+/, '')
    .trimEnd()
    .split(/(?:[\t ]*\r?\n){2,}/)
}

// Split a stanza into its lines, handling both LF and CRLF.
export function splitLines(stanza: string) {
  return stanza.trimEnd().split(/\r?\n/)
}

export function isComment(line: string) {
  return line.trim().startsWith('#')
}

// An `include` directive points at another file, which this parser does not
// fetch. Note "includeSomething value" is a normal key, not a directive.
function isInclude(line: string) {
  return /^[\t ]*include\s/.test(line)
}

// The lines of a stanza that carry data: comments and include directives don't
export function dataLines(stanza: string | string[]) {
  const lines = typeof stanza === 'string' ? splitLines(stanza) : stanza
  return lines.filter(line => !isComment(line) && !isInclude(line))
}

// validate that all required fields are present in the stanza
export function validateRequiredFieldsArePresent(
  stanza: RaStanza,
  requiredFields: string[],
  description = '',
) {
  const missingFields = requiredFields.filter(field => !stanza.data[field])
  if (missingFields.length > 0) {
    const noun = missingFields.length === 1 ? 'entry' : 'entries'
    throw new Error(
      `${description} is missing required ${noun}: ${missingFields.join(', ')}`,
    )
  }
}
