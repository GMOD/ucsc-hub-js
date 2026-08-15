import RaFile from './raFile.ts'
import { nullProtoRecord, validateRequiredFieldsArePresent } from './util.ts'

import type RaStanza from './raStanza.ts'

const PARENT_TRACK_KEYS = new Set([
  'superTrack',
  'compositeTrack',
  'container',
  'view',
])

// a track's container name, dropping the trailing `on`/`off` visibility flag
function parentName(stanza: RaStanza) {
  return stanza.data.parent?.split(' ')[0]
}

/**
 * Class representing a trackDb.txt file. Throws unless every stanza keys on
 * "track" and carries the required entries.
 */
export default class TrackDbFile extends RaFile {
  constructor(
    trackDbFile: string | string[],
    options?: ConstructorParameters<typeof RaFile>[1],
  ) {
    super(trackDbFile, { ...options, checkIndent: false })
  }

  protected validate() {
    // an undefined nameKey means the file has no tracks at all, which is valid
    if (this.nameKey !== undefined && this.nameKey !== 'track') {
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
   * entries overriding more distant ones. Throws if the track does not exist.
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
        name = parentName(stanza)
      } else {
        name = undefined
      }
    }
    // Merge root-first so closer (child) entries override more distant ones
    const settings = nullProtoRecord<string>()
    for (const stanza of chain.reverse()) {
      Object.assign(settings, stanza.data)
    }
    return settings
  }
}
