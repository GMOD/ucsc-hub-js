import fs from 'fs'

import { expect, test } from 'vitest'

import GenomesFile from './genomesFile.ts'

test('reads a basic genomes.txt file', () => {
  const input = fs.readFileSync('test/basic.genomes.txt', 'utf8')
  const genomesFile = new GenomesFile(input)
  expect(genomesFile).toMatchSnapshot()
})

test("throws if the file doesn't start with a genomes entry", () => {
  expect(
    () => new GenomesFile('assembly hg19\ntrackDb hg19/trackDb.txt'),
  ).toThrow(/file must begin with a line like/)
})

test('throws if a genome entry is missing a required field', () => {
  expect(
    () =>
      new GenomesFile(
        'genome hg19\ntrackDb hg19/trackDb.txt\n\ngenome hg38\norganism Homo sapiens',
      ),
  ).toThrow(/is missing required entry:/)
})
