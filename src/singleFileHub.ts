import GenomesFile from './genomesFile'
import HubFile from './hubFile'
import TrackDbFile from './trackDbFile'
import { validateRequiredFieldsArePresent } from './util'

export default class SingleFileHub extends HubFile {
  public genome: GenomesFile

  public tracks: TrackDbFile[]

  constructor(singleFileHub: string) {
    const [hubSection, genomeSection, ...trackSections] = singleFileHub
      .trimEnd()
      .split(/(?:[\t ]*\r?\n){2,}/)
    super(hubSection, { skipValidation: true })
    this.validateHub()

    this.genome = new GenomesFile(genomeSection, { skipValidation: true })
    this.validateGenomeSection()

    this.tracks = trackSections.map(
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

  public toString() {
    return [
      super.toString(),
      this.genome.toString(),
      ...this.tracks.map(track => track.toString()),
    ].join('\n')
  }
}
