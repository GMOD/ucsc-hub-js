import RaFile from './raFile'

/**
 * Class representing a genomes.txt file.
 * @extends RaFile
 * @param {(string|string[])} [trackDbFile=[]] - A trackDb.txt file as a string
 * @throws {Error} Throws if "track" is not the first key in each track or if a
 * track is missing required keys
 */
export default class TrackDbFile extends RaFile {
  constructor(trackDbFile: string) {
    super(trackDbFile, { checkIndent: false })
    if (this.nameKey !== 'track') {
      throw new Error(
        `trackDb has "${this.nameKey}" instead of "track" as the first line in each track`,
      )
    }
    this.forEach((track, trackName) => {
      const trackKeys = Array.from(track.keys())
      const missingKeys = [] as string[]
      const requiredKeys = ['track', 'shortLabel']
      requiredKeys.forEach(key => {
        if (!trackKeys.includes(key)) {
          missingKeys.push(key)
        }
      })
      if (missingKeys.length > 0) {
        throw new Error(
          `Track ${trackName} is missing required key(s): ${missingKeys.join(
            ', ',
          )}`,
        )
      }
      const parentTrackKeys = [
        'superTrack',
        'compositeTrack',
        'container',
        'view',
      ]
      if (!trackKeys.some(key => parentTrackKeys.includes(key))) {
        if (!trackKeys.includes('bigDataUrl')) {
          throw new Error(
            `Track ${trackName} is missing required key "bigDataUrl"`,
          )
        }
        if (!trackKeys.includes('type')) {
          const settings = this.settings(trackName)
          const settingsKeys = Array.from(settings.keys())
          if (!settingsKeys.includes('type')) {
            throw new Error(
              `Neither track ${trackName} nor any of its parent tracks have the required key "type"`,
            )
          }
        }
      }
      let indent = ''
      let currentTrackName: string | undefined = trackName
      do {
        currentTrackName = this.get(currentTrackName)?.get('parent')
        if (currentTrackName) {
          ;[currentTrackName] = currentTrackName.split(' ')
          indent += '    '
        }
      } while (currentTrackName)
      const currentTrack = this.get(trackName)
      if (currentTrack) {
        currentTrack.indent = indent
        this.set(trackName, currentTrack)
      }
    })
  }

  /**
   * Gets all track entries including those of parent tracks, with closer
   * entries overriding more distant ones
   * @param {string} trackName The name of a track
   * @throws {Error} Throws if track name does not exist in the trackDb
   */
  settings(trackName: string) {
    if (!this.has(trackName)) {
      throw new Error(`Track ${trackName} does not exist`)
    }
    const parentTracks = [trackName]
    let currentTrackName: string | undefined = trackName
    do {
      currentTrackName = this.get(currentTrackName)?.get('parent')
      if (currentTrackName) {
        parentTracks.push(currentTrackName)
      }
    } while (currentTrackName)
    const settings = new Map()
    parentTracks.reverse()
    parentTracks.forEach(parentTrack => {
      this.get(parentTrack)?.forEach((value, key) => {
        settings.set(key, value)
      })
    })
    return settings
  }
}
