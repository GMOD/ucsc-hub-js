import RaFile from './raFile.ts'
import { validateRequiredFieldsArePresent } from './util.ts'

/**
 * Class representing a trackDb.txt file.
 * @extends RaFile
 * @param {(string|string[])} [trackDbFile=[]] - A trackDb.txt file as a string
 * @throws {Error} Throws if "track" is not the first key in each track or if a
 * track is missing required keys
 */
export default class TrackDbFile extends RaFile {
  constructor(
    trackDbFile: string,
    options?: ConstructorParameters<typeof RaFile>[1],
  ) {
    super(trackDbFile, { ...options, checkIndent: false })
  }

  protected validate() {
    if (this.nameKey !== 'track') {
      throw new Error(
        `trackDb has "${this.nameKey}" instead of "track" as the first line in each track`,
      )
    }
    for (const [trackName, track] of Object.entries(this.data)) {
      const trackKeys = Object.keys(track.data)
      validateRequiredFieldsArePresent(
        track,
        ['track', 'shortLabel'],
        `Track ${trackName}`,
      )

      const parentTrackKeys = new Set([
        'superTrack',
        'compositeTrack',
        'container',
        'view',
      ])
      if (!trackKeys.some(key => parentTrackKeys.has(key))) {
        if (!trackKeys.includes('bigDataUrl')) {
          throw new Error(
            `Track ${trackName} is missing required key "bigDataUrl"`,
          )
        }
        if (!trackKeys.includes('type')) {
          const settingsKeys = Object.keys(this.settings(trackName))
          if (!settingsKeys.includes('type')) {
            throw new Error(
              `Neither track ${trackName} nor any of its parent tracks have the required key "type"`,
            )
          }
        }
      }
    }
  }

  /**
   * Gets all track entries including those of parent tracks, with closer
   * entries overriding more distant ones
   * @param {string} trackName The name of a track
   * @throws {Error} Throws if track name does not exist in the trackDb
   */
  settings(trackName: string) {
    if (!this.data[trackName]) {
      throw new Error(`Track ${trackName} does not exist`)
    }
    const parentTracks = [trackName]
    let currentTrackName: string = trackName
    let parent = this.data[currentTrackName]?.data.parent
    while (parent) {
      currentTrackName = parent.split(' ')[0] ?? currentTrackName
      parentTracks.push(currentTrackName)
      parent = this.data[currentTrackName]?.data.parent
    }
    const settings = {} as Record<string, unknown>
    parentTracks.reverse()
    for (const parentTrack of parentTracks) {
      const ret = this.data[parentTrack]
      if (ret) {
        for (const [key, value] of Object.entries(ret)) {
          settings[key] = value
        }
      }
    }
    return settings
  }
}
