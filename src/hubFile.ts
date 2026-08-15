import RaStanza from './raStanza.ts'
import { validateRequiredFieldsArePresent } from './util.ts'

/**
 * Class representing a hub.txt file. Throws if it is missing any required
 * entry.
 */
export default class HubFile extends RaStanza {
  protected validate() {
    validateRequiredFieldsArePresent(
      this,
      ['hub', 'shortLabel', 'longLabel', 'genomesFile', 'email'],
      'Hub file',
    )
  }
}
