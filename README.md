# ucsc-hub-js

Parse UCSC track and assembly hub files in Node or the browser.

[![NPM version](https://img.shields.io/npm/v/@gmod/ucsc-hub.svg?logo=npm&style=flat-square)](https://npmjs.org/package/@gmod/ucsc-hub)
[![Build Status](https://img.shields.io/github/actions/workflow/status/GMOD/ucsc-hub-js/publish.yml?branch=main)](https://github.com/GMOD/ucsc-hub-js/actions/workflows/publish.yml)

## Install

```sh
npm install @gmod/ucsc-hub
```

## Usage

See the
[UCSC track hub documentation](https://genome.ucsc.edu/goldenpath/help/hgTrackHubHelp.html)
for the hub.txt, genomes.txt, and trackDb.txt file formats.

```js
import {
  HubFile,
  GenomesFile,
  TrackDbFile,
  SingleFileHub,
} from '@gmod/ucsc-hub'

const hub = new HubFile(hubText)
console.log(hub.data.shortLabel)

const genomes = new GenomesFile(genomesText)
console.log(genomes.data.hg38.data.trackDb)

const trackDb = new TrackDbFile(trackDbText)
console.log(trackDb.settings('myTrack'))

const singleHub = new SingleFileHub(hubText)
console.log(singleHub.hubData, singleHub.genome, singleHub.tracks)
```

## API

Every class parses in its constructor and throws on invalid input, so a
successfully constructed object is a valid one. This library reads hub files; it
does not write them.

Pass text as a single string, or as an array of strings holding one stanza (for
a file) or one line (for a stanza) per entry.

### `RaStanza`

`RaStanza` parses one stanza, which is a run of `key value` lines. `HubFile`
extends it, and `RaFile` holds one per stanza.

```js
new RaStanza(text, { checkIndent = true, skipValidation = false })
```

| Property  | Type                     |                                            |
| --------- | ------------------------ | ------------------------------------------ |
| `data`    | `Record<string, string>` | The stanza's key-value pairs               |
| `nameKey` | `string \| undefined`    | The key of the first line, e.g. `'track'`  |
| `name`    | `string \| undefined`    | The value of the first line, i.e. its name |

`checkIndent` requires every line to share the same leading whitespace.
`skipValidation` skips the subclass's required-field check.

### `RaFile`

`RaFile` parses a whole ra file, whose stanzas are separated by one or more
blank lines.

```js
new RaFile(text, { checkIndent = true, skipValidation = false })
```

| Property  | Type                       |                                        |
| --------- | -------------------------- | -------------------------------------- |
| `data`    | `Record<string, RaStanza>` | Stanzas keyed by `name`                |
| `nameKey` | `string \| undefined`      | First-line key, shared by every stanza |

Throws if the stanzas disagree on their first-line key, or if two share a name.

### `HubFile` extends `RaStanza`

`HubFile` parses a hub.txt file and requires `hub`, `shortLabel`, `longLabel`,
`genomesFile`, and `email`.

### `GenomesFile` extends `RaFile`

`GenomesFile` parses a genomes.txt file. Every stanza must key on `genome` and
requires `genome` and `trackDb`. Pass a different list to `validate()` to
require other keys.

### `TrackDbFile` extends `RaFile`

`TrackDbFile` parses a trackDb.txt file. Every stanza must key on `track` and
requires `track` and `shortLabel`. A track that is not a container
(`superTrack`, `compositeTrack`, `container`, or `view`) also requires
`bigDataUrl`, plus a `type` set on the track itself or inherited from a parent.
`TrackDbFile` skips the indentation check, since subtracks are conventionally
indented under their parent.

- **`settings(trackName)`** — returns the track's entries merged with those of
  its parents, where a closer entry overrides a more distant one. Throws if the
  track does not exist.

### `SingleFileHub`

`SingleFileHub` parses a hub.txt that holds every section of a hub in one file.
The first section is the hub, the second the genome, and the rest are tracks.

```js
new SingleFileHub(hubText)
```

| Property  | Type          |                                                    |
| --------- | ------------- | -------------------------------------------------- |
| `hubData` | `RaStanza`    | Requires `hub`, `shortLabel`, `longLabel`, `email` |
| `genome`  | `RaStanza`    | Must key on `genome`                               |
| `tracks`  | `TrackDbFile` | Everything after the genome section                |

### Parsing notes

- The parser recognizes `include` directives but does not follow them, because
  this library does no I/O and so never fetches the included file.
  (`includeSomething value` is an ordinary key, not a directive.)
- Lines beginning with `#` are comments. The parser drops a stanza that contains
  only comments and `include` directives.
- A line ending in `\` continues onto the next one, and the parser joins the
  two.
- Both LF and CRLF line endings work.
- Any run of whitespace separates a key from its value, tabs included.
- Repeating a key is fine if the value matches; a conflicting value throws.
- `data` objects have a null prototype, so keys like `constructor` and
  `toString` are stored as ordinary data rather than colliding with
  `Object.prototype`.

## See also

A hub file lists its data files, and a separate parser reads each one:
[@gmod/bbi](https://github.com/GMOD/bbi-js),
[@gmod/bam](https://github.com/GMOD/bam-js) or
[@gmod/tabix](https://github.com/GMOD/tabix-js), depending on the format. A
hub's files are almost always remote, so it is worth having whichever one you
use read through a filehandle from
[`@gmod/range-cache-filehandle`](https://github.com/GMOD/range-cache-filehandle),
which caches the byte ranges it fetches.

## License

MIT © [Generic Model Organism Database Project](http://gmod.org/wiki/Main_Page)
