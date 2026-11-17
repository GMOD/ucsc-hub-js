## [2.1.0](https://github.com/GMOD/ucsc-hub-js/compare/v2.0.13...v2.1.0) (2026-11-17)

### Chores

- Render only the commit subject, and link the commit ([1aa099d](https://github.com/GMOD/ucsc-hub-js/commit/1aa099dc359e810996e815c1082261c614018df4))
- Create a GitHub release for each published tag ([7905e57](https://github.com/GMOD/ucsc-hub-js/commit/7905e575d9599f3b38991bad905535b12e90ff05))
- Enforce type strippability in tsconfig ([c767ceb](https://github.com/GMOD/ucsc-hub-js/commit/c767ceb7e02300a9603012f93de1eeef3df222d0))
- Keep agent worktrees out of the toolchain's way ([9c0a5a8](https://github.com/GMOD/ucsc-hub-js/commit/9c0a5a8ae6ebf02f0091e2000d4b56e41f1ea518))
- Drop persisted checkout credentials and the publish job's cache ([36d5ea9](https://github.com/GMOD/ucsc-hub-js/commit/36d5ea9193f04ab6e1c01fde6eb93adfad367291))

### Documentation

- Rewrite the API section by hand and drop documentation.js ([9c48388](https://github.com/GMOD/ucsc-hub-js/commit/9c483882b660b53199bf1b919c12dd72f74e837c))
- Correct the release command and what it runs ([86c9f4f](https://github.com/GMOD/ucsc-hub-js/commit/86c9f4ff382013ad5c0b301e881f05d9c710c2bd))
- Put the README in the active voice ([7c756e6](https://github.com/GMOD/ucsc-hub-js/commit/7c756e683bc34d5fe4e80080e3be443c28fa7695))
- Correct the release command in CONTRIBUTING, and its voice ([7d80ce9](https://github.com/GMOD/ucsc-hub-js/commit/7d80ce936e3c3a4020c88c533d18e4ea1e80b0b2))
- Describe the release gate CONTRIBUTING actually runs ([d3bd851](https://github.com/GMOD/ucsc-hub-js/commit/d3bd8516c8021a87e9c6be70dfcb6d4e454a4581))
- Point remote readers at @gmod/range-cache-filehandle ([b5959cc](https://github.com/GMOD/ucsc-hub-js/commit/b5959cc9cdd5cac78763f8ab971e9148fce4598c))
- Say it in full sentences ([e9afe81](https://github.com/GMOD/ucsc-hub-js/commit/e9afe81f9bbf185bd0c447dbc3bb51d541121e92))
- Literal verbs for data (lands, says, tells, live on) ([2a1b102](https://github.com/GMOD/ucsc-hub-js/commit/2a1b1023e2dab25b37bd434f1039dc618a7067da))
- Trusted publishing adds provenance without a --provenance flag ([fa7a462](https://github.com/GMOD/ucsc-hub-js/commit/fa7a462a4e183b8584fc1c23b54b37de0831a3eb))

### Other Changes

- Rewrite AI-writing tropes in README and CONTRIBUTING ([75c691b](https://github.com/GMOD/ucsc-hub-js/commit/75c691b4472ba2a86041e5b742aa63c04a8f1b74))
- Restore wording the tropes rewrite changed without a trope ([9c6e52f](https://github.com/GMOD/ucsc-hub-js/commit/9c6e52fbfe6db7d909e51674b7632f00a1edde35))
- Trim README parsing notes and see-also ([6094330](https://github.com/GMOD/ucsc-hub-js/commit/6094330caed8d2e3961ced7becd4f89fdff5f67e))
- Bump deps, drop unused dev deps and stale ignores ([1408c73](https://github.com/GMOD/ucsc-hub-js/commit/1408c735c0ea69d13c12f8792fb37e178c19e867))
- A repeated stanza key takes its later value instead of throwing ([fdf050d](https://github.com/GMOD/ucsc-hub-js/commit/fdf050d9bd93610e231b220f9ab010f2ace61bc1))

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
