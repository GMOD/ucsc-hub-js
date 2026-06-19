import RaFile from './raFile.ts'
import { validateRequiredFieldsArePresent } from './util.ts'

import type RaStanza from './raStanza.ts'

const PARENT_TRACK_KEYS = new Set([
  'superTrack',
  'compositeTrack',
  'container',
  'view',
])

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

      if (!trackKeys.some(key => PARENT_TRACK_KEYS.has(key))) {
        if (!trackKeys.includes('bigDataUrl')) {
          throw new Error(
            `Track ${trackName} is missing required key "bigDataUrl"`,
          )
        }
        if (
          !trackKeys.includes('type') &&
          !('type' in this.settings(trackName))
        ) {
          throw new Error(
            `Neither track ${trackName} nor any of its parent tracks have the required key "type"`,
          )
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
    if (!Object.hasOwn(this.data, trackName)) {
      throw new Error(`Track ${trackName} does not exist`)
    }
    const chain: RaStanza[] = []
    const seen = new Set<string>()
    let name: string | undefined = trackName
    while (name && !seen.has(name)) {
      seen.add(name)
      const stanza: RaStanza | undefined = this.data[name]
      if (stanza) {
        chain.push(stanza)
        name = stanza.data.parent?.split(' ')[0]
      } else {
        name = undefined
      }
    }
    // Merge root-first so closer (child) entries override more distant ones
    const settings: Record<string, string> = {}
    for (const stanza of chain.reverse()) {
      Object.assign(settings, stanza.data)
    }
    return settings
  }
}
