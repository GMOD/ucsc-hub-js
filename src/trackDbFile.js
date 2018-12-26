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

  settings(track) {
    const parentTracks = [track]
    let currTrack = track
    do {
      currTrack = this.get(currTrack).get('parent')
      if (currTrack) parentTracks.push(currTrack)
    } while (currTrack)
    const settings = new Map()
    parentTracks.reverse()
    parentTracks.forEach(parentTrack => {
      this.get(parentTrack).forEach((value, key) => {
        settings.set(key, value)
      })
    })
    return settings
  }
}

module.exports = TrackDbFile
