import GenomesFile from './genomesFile'
import HubFile from './hubFile'
import TrackDbFile from './trackDbFile'
import { validateRequiredFieldsArePresent } from './util'

/**
 * Class representing a "single-file" hub.txt file that contains all the sections
 * of a hub in a single file.
 */
export default class SingleFileHub extends HubFile {
  /** a GenomesFile object for the hub's genome section */
  public readonly genome: GenomesFile

  /** an array of TrackDbFile objects for the hub's trackDb sections */
  public readonly trackDbs: TrackDbFile[]

  constructor(hubText: string) {
    const [hubSection, genomeSection, ...trackSections] = hubText
      .trimEnd()
      .split(/(?:[\t ]*\r?\n){2,}/)
    super(hubSection, { skipValidation: true })
    this.validateHub()

    this.genome = new GenomesFile(genomeSection, { skipValidation: true })
    this.validateGenomeSection()

    this.trackDbs = trackSections.map(
      trackSection => new TrackDbFile(trackSection, { skipValidation: false }),
    )
  }

  protected validateHub() {
    if (this.nameKey !== 'hub') {
      throw new Error('Hub file must begin with a line like "hub <hub_name>"')
    }

    validateRequiredFieldsArePresent(this, [
      'hub',
      'shortLabel',
      'longLabel',
      'email',
      'descriptionUrl',
    ])
  }

  protected validateGenomeSection() {
    if (this.genome.nameKey !== 'genome') {
      throw new Error(
        'Genomes file must begin with a line like "genome <genome_name>"',
      )
    }
  }
}
