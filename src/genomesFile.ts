import RaFile from './raFile.ts'
import { validateRequiredFieldsArePresent } from './util.ts'

/**
 * Class representing a genomes.txt file. Throws unless every stanza keys on
 * "genome" and carries the required entries.
 */
export default class GenomesFile extends RaFile {
  public validate(requiredFields = ['genome', 'trackDb']) {
    // TODO: check if genome is hosted by UCSC and if not, require twoBitPath and groups

    if (this.nameKey !== 'genome') {
      throw new Error(
        'Genomes file must begin with a line like "genome <genome_name>"',
      )
    }

    for (const [genomeName, genome] of Object.entries(this.data)) {
      validateRequiredFieldsArePresent(
        genome,
        requiredFields,
        `genome ${genomeName}`,
      )
    }
  }
}
