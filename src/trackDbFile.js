const RaFile = require('./raFile')

class TrackDbFile extends RaFile {
  constructor(trackDbFile) {
    super(trackDbFile)
    if (this.nameKey !== 'track')
      throw new Error(
        `trackDb has "${
          this.nameKey
        }" instead of "track" as the first line in each track`,
      )
  }
}

module.exports = TrackDbFile
