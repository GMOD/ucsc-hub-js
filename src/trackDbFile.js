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
    this.forEach((track, trackName) => {
      const stanzaKeys = Array.from(track.keys())
      const missingKeys = []
      const requiredKeys = ['track', 'shortLabel', 'longLabel']
      requiredKeys.forEach(key => {
        if (!stanzaKeys.includes(key)) missingKeys.push(key)
      })
      if (missingKeys.length > 0)
        throw new Error(
          `Track ${trackName} is missing required key(s): ${missingKeys.join(
            ', ',
          )}`,
        )
      const parentTrackKeys = ['superTrack', 'compositeTrack', 'container']
      if (!stanzaKeys.some(key => parentTrackKeys.includes(key))) {
        if (!stanzaKeys.includes('bigDataUrl'))
          throw new Error(
            `Track ${trackName} is missing required key "bigDataUrl"`,
          )
        if (!stanzaKeys.includes('type')) {
          const settings = this.settings(trackName)
          const settingsKeys = Array.from(settings.keys())
          if (!settingsKeys.includes('type'))
            throw new Error(
              `Neither track ${trackName} nor any of its parent tracks have the required key "type"`,
            )
        }
      }
      let indent = ''
      let currentTrackName = trackName
      do {
        currentTrackName = this.get(currentTrackName).get('parent')
        if (currentTrackName) indent += '    '
      } while (currentTrackName)
      const currentTrack = this.get(trackName)
      currentTrack.indent = indent
      this.set(trackName, currentTrack)
    })
  }

  settings(trackName) {
    if (!this.has(trackName))
      throw new Error(`Track ${trackName}does not exist`)
    const parentTracks = [trackName]
    let currentTrackName = trackName
    do {
      currentTrackName = this.get(currentTrackName).get('parent')
      if (currentTrackName) parentTracks.push(currentTrackName)
    } while (currentTrackName)
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
