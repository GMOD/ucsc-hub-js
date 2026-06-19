import type RaStanza from './raStanza.ts'

// A prototype-free record, so keys that collide with Object.prototype members
// ("__proto__", "constructor", "toString", ...) are stored as plain data
// instead of being silently dropped or reparenting the object.
export function nullProtoRecord<V>(): Record<string, V> {
  return Object.create(null)
}

// Split a file into stanzas on runs of one or more blank lines (trailing
// whitespace on the blank lines is tolerated). Handles both LF and CRLF.
export function splitStanzas(text: string) {
  return text.trimEnd().split(/(?:[\t ]*\r?\n){2,}/)
}

// Split a stanza into its lines, handling both LF and CRLF.
export function splitLines(stanza: string) {
  return stanza.trimEnd().split(/\r?\n/)
}

export function isComment(line: string) {
  return line.trim().startsWith('#')
}

// validate that all required fields are present in the map
export function validateRequiredFieldsArePresent(
  map: RaStanza,
  requiredFields: string[],
  description = '',
) {
  const missingFields: string[] = []
  for (const field of requiredFields) {
    if (!map.data[field]) {
      missingFields.push(field)
    }
  }
  if (missingFields.length > 0) {
    const noun = missingFields.length === 1 ? 'entry' : 'entries'
    throw new Error(
      `${description} is missing required ${noun}: ${missingFields.join(', ')}`,
    )
  }
}
