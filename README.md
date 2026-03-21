# ucsc-hub-js

Read and write UCSC track and assembly hub files in Node or the browser.

[![Build Status](https://img.shields.io/github/actions/workflow/status/GMOD/ucsc-hub-js/push.yml?branch=master)](https://github.com/GMOD/ucsc-hub-js/actions)
[![NPM version](https://img.shields.io/npm/v/@gmod/ucsc-hub.svg?logo=npm&style=flat-square)](https://npmjs.org/package/@gmod/ucsc-hub)
[![Coverage Status](https://img.shields.io/codecov/c/github/GMOD/ucsc-hub-js/master.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/GMOD/ucsc-hub-js/branch/master)

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
console.log(genomes.data['hg38'].data.trackDb)

const trackDb = new TrackDbFile(trackDbText)
console.log(trackDb.settings('myTrack'))

const singleHub = new SingleFileHub(hubText)
console.log(singleHub.hubData, singleHub.genome, singleHub.tracks)
```

## API

All classes accept a `string` or `string[]`. Parsed key-value pairs are on
`.data`:

- `HubFile`, `RaStanza`: `.data` is `Record<string, string>`
- `GenomesFile`, `TrackDbFile`, `RaFile`: `.data` is `Record<string, RaStanza>`

### `HubFile`

Parses hub.txt. Requires `hub`, `shortLabel`, `longLabel`, `genomesFile`, and
`email`.

### `GenomesFile`

Parses genomes.txt. Each `.data` entry is a `RaStanza` for that genome assembly.

### `TrackDbFile`

Parses trackDb.txt. Each `.data` entry is a `RaStanza` for that track.

`trackDb.settings(trackName)` returns merged settings for a track including all
ancestor tracks, with child values taking precedence.

### `SingleFileHub`

Parses a single-file hub (all sections in one file). Exposes `.hubData`,
`.genome` (both `RaStanza`), and `.tracks` (`TrackDbFile`).

## License

MIT © [Generic Model Organism Database Project](http://gmod.org/wiki/Main_Page)
