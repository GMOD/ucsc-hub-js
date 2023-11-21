import RaStanza from './raStanza'

/**
 * Class representing a hub.txt file.
 * @extends RaStanza
 * @param {(string|string[])} [hubFile=[]] - A hub.txt file as a string
 * @throws {Error} Throws if the first line of the hub.txt file doesn't start
 * with "hub <hub_name>", if it has invalid entries, or is missing required
 * entries
 */
export default class HubFile extends RaStanza {
  protected validate() {
    const missingFields = [] as string[]
    const requiredFields = [
      'hub',
      'shortLabel',
      'longLabel',
      'genomesFile',
      'email',
      'descriptionUrl',
    ]

    for (const field of requiredFields) {
      if (!this.data[field]) {
        missingFields.push(field)
      }
    }
    if (missingFields.length > 0) {
      throw new Error(
        `Hub file is missing required entr${
          missingFields.length === 1 ? 'y' : 'ies'
        }: ${missingFields.join(', ')}`,
      )
    }
  }
}
