import RaStanza from './raStanza.ts'
import TrackDbFile from './trackDbFile.ts'
import {
  dataLines,
  splitStanzas,
  validateRequiredFieldsArePresent,
} from './util.ts'

/**
 * Class representing a "single-file" hub.txt file that contains all the
 * sections of a hub in a single file.
 */
export default class SingleFileHub {
  public genome: RaStanza

  public tracks: TrackDbFile

  public hubData: RaStanza

  constructor(hubText: string) {
    // sections of nothing but comments carry no data and would otherwise be
    // mistaken for the hub or genome section
    const [hubSection, genomeSection, ...trackSections] = splitStanzas(
      hubText,
    ).filter(section => dataLines(section).length > 0)
    this.hubData = new RaStanza(hubSection)
    this.validateHub()

    this.genome = new RaStanza(genomeSection)
    this.validateGenomeSection()

    this.tracks = new TrackDbFile(trackSections)
  }

  protected validateHub() {
    if (this.hubData.nameKey !== 'hub') {
      throw new Error('Hub file must begin with a line like "hub <hub_name>"')
    }

    validateRequiredFieldsArePresent(
      this.hubData,
      [
        'hub',
        'shortLabel',
        'longLabel',
        'email',
        // 'descriptionUrl', mpxvRivers has a typo
      ],
      'Hub file',
    )
  }

  protected validateGenomeSection() {
    if (this.genome.nameKey !== 'genome') {
      throw new Error(
        'Genomes file must begin with a line like "genome <genome_name>"',
      )
    }
  }
}
