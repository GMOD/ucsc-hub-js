import type RaStanza from './raStanza.ts'

// A prototype-free record, so keys that collide with Object.prototype members
// ("__proto__", "constructor", "toString", ...) are stored as plain data
// instead of being silently dropped or reparenting the object.
export function nullProtoRecord<V>(): Record<string, V> {
  return Object.create(null)
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
