import RaStanza from './raStanza'

// validate that all required fields are present in the map
export function validateRequiredFieldsArePresent(
  map: RaStanza,
  requiredFields: string[],
  description = '',
) {
  const missingFields: string[] = []
  requiredFields.forEach(field => {
    if (!map.get(field)) {
      missingFields.push(field)
    }
  })
  if (missingFields.length > 0) {
    throw new Error(
      `${description} is missing required entr${
        missingFields.length === 1 ? 'y' : 'ies'
      }: ${missingFields.join(', ')}`,
    )
  }
}
