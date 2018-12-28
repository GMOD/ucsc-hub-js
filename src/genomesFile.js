const RaFile = require('./raFile')

/**
 * Class representing a genomes.txt file.
 * @extends RaFile
 * @param {(string|string[])} [genomesFile=[]] - A genomes.txt file as a string
 */
class GenomesFile extends RaFile {
  constructor(genomesFile) {
    super(genomesFile)
    if (this.nameKey !== 'genome')
      throw new Error(
        'Genomes file must begin with a line like "genome <genome_name>"',
      )

    // TODO: check if genome is hosted by UCSC and if not, require twoBitPath and groups
    const requiredFields = [
      'genome',
      'trackDb',
      // 'twoBitPath',
      // 'groups',
    ]
    this.forEach((genome, genomeName) => {
      const missingFields = []
      requiredFields.forEach(field => {
        if (!genome.get(field)) missingFields.push(field)
      })
      if (missingFields.length > 0)
        throw new Error(
          `Genomes file entry ${genomeName} is missing required entr${
            missingFields.length === 1 ? 'y' : 'ies'
          }: ${missingFields.join(', ')}`,
        )
    })
  }
}

module.exports = GenomesFile
