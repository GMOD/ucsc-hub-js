const RaStanza = require('./raStanza')

/**
 * Class representing a hub.txt file.
 * @extends RaStanza
 * @param {(string|string[])} [hubFile=[]] - A hub.txt file as a string
 */
class HubFile extends RaStanza {
  constructor(hubFile) {
    super(hubFile)
    if (this.nameKey !== 'hub')
      throw new Error(
        'hub.txt file must begin with a line like "hub <hub_name>"',
      )
    const hubTxtFields = [
      'hub',
      'shortLabel',
      'longLabel',
      'genomesFile',
      'email',
      'descriptionUrl',
    ]
    const extraFields = []
    this.forEach((value, key) => {
      if (!hubTxtFields.includes(key)) extraFields.push(key)
    })
    if (extraFields.length > 0)
      throw new Error(
        `Hub file has invalid entr${
          extraFields.length === 1 ? 'y' : 'ies'
        }: ${extraFields.join(', ')}`,
      )
    const missingFields = []
    hubTxtFields.forEach(field => {
      if (field !== 'descriptionUrl' && !this.get(field))
        missingFields.push(field)
    })
    if (missingFields.length > 0)
      throw new Error(
        `Hub file is missing required entr${
          missingFields.length === 1 ? 'y' : 'ies'
        }: ${missingFields.join(', ')}`,
      )
  }
}

module.exports = HubFile
