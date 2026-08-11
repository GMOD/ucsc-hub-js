## [2.0.13](https://github.com/GMOD/ucsc-hub-js/compare/v2.0.12...v2.0.13) (2026-08-10)

### Bug Fixes

- Parse tab separators, unterminated continuations, and stray blank lines

### Chores

- Add git-cliff for changelog generation
- Type-check the tests and enforce prettier, as @gmod/bam does
- Let npm publish stop auto-correcting repository.url
- Exempt our own packages from the release quarantine
- Bump pnpm/action-setup to v6.0.10
- Run the test suite as `pnpm test --run`
- Gate preversion on format:check, as CI does
- Gate preversion on typecheck too, as CI does
- Converge package.json on the shape its siblings use

### Documentation

- Backfill CHANGELOG.md for 0.3.0 through 2.0.12
- Mark breaking changes in the generated changelog

### Other Changes

- Revert "chore: converge package.json" — the CHANGELOG prettier step ([072808d](https://github.com/GMOD/ucsc-hub-js/commit/072808d77d141b55709ea2a510a55ef2207f912e))

# 2.0.12

- No functional changes; declares `sideEffects: false` for better tree-shaking, pins the pnpm version used in CI

# 2.0.11

- Internal refactor of stanza-parsing helpers and the `settings()` parent-chain walk; no behavior change

# 2.0.10

- Fix `settings()` looping forever on a cyclic or self-referential `parent` chain
- Fix stanza/track keys that collide with `Object.prototype` members (e.g. `toString`, `constructor`) being dropped or mis-stored instead of read/written as data
- Refresh JSDoc left over from the old Map-based API

# 2.0.9

- No functional changes; CI only, keeps the publish workflow named `publish.yml` so npm OIDC trust still resolves

# 2.0.8

- No functional changes; CI only, merges the publish workflow into the push workflow, gated on the test job

# 2.0.7

- No functional changes; dependency and CI badge updates

# 2.0.6

- Move tests out of `src/` into `test/` and exclude them from the published build output

# 2.0.5

- Fix `TrackDbFile.settings()` returning the RaStanza's own `{data, name, nameKey}` instead of a merged settings object
- Fix indentation checking being silently disabled after the first unindented line
- Fix the `include` stanza filter matching on `startsWith('include')`, which also dropped stanzas keyed `includeExtras` etc.
- Fix duplicate-key detection missing the case where the existing value was an empty string
- Simplify the `exports` field in package.json, which had accidentally doubled up as `{ import: { import: ... }, require: { require: ... } } }`

# 2.0.4

- Fix `settings()`'s parent-track walk, which used an unsafe cast and had dead code in the constructor
- Fix JSDoc typos (`hub.txt` → `genomes.txt` in GenomesFile, `genomes.txt` → `trackDb.txt` in TrackDbFile)

# 2.0.3

- Stop requiring `descriptionUrl` on single-file hubs; some published hubs (e.g. mpxvRivers) ship it with a typo, so validating it was too strict

# 2.0.2

- Fix the CommonJS build: emit `dist/package.json` with `"type": "commonjs"` so `dist/` resolves correctly under the package's `"type": "module"`

# 2.0.1

- Internal: switch relative imports to explicit `.ts` extensions; no behavior change

# 2.0.0

- **Breaking:** package is now pure ESM (`"type": "module"`), with separate `exports` entries for `import` and `require`

# 1.0.1

- Stop parsing `include` stanzas; previously threw "The first line in each stanza must have the same key. Saw both track and include"

# 1.0.0

- First stable release; no API changes since 0.3.0 beyond tightening `RaFile`/`RaStanza`'s `data` type to no longer include `undefined` values
- Migrate test suite from Jest to Vitest

# 0.3.0

- Refactor code to use objects instead of Map. This is a fairly broad sweep of
  changes, see new API docs

# 0.2.0

- Initial support for singleFile hubs

# 0.1.7

- Add ESM module build
