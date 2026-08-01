import fs from 'fs'

import { expect, test } from 'vitest'

import SingleFileHub from '../src/singleFileHub.ts'

// test that singleFileHub can parse singleFileAssemblyHub.txt
test('single-file hub', () => {
  // NOTE: this file was slightly modified from the
  // original to fix inconsistent indentation
  const input = fs.readFileSync(
    'test/singleFileAssemblyHub.GCF_000002985.6.hub.txt',
    'utf8',
  )
  const singleFileHub = new SingleFileHub(input)
  expect(singleFileHub).toMatchSnapshot()
  expect(singleFileHub.genome).toMatchSnapshot()
  expect(singleFileHub.tracks).toMatchSnapshot()
})

test('skips comment-only sections when finding the hub and genome', () => {
  const hub = new SingleFileHub(
    '# a leading comment\n\n' +
      'hub h\nshortLabel s\nlongLabel l\nemail e\n\n' +
      'genome g\ntwoBitPath g.2bit\n\n' +
      'track t\nshortLabel t\ntype bigBed\nbigDataUrl t.bb\n',
  )
  expect(hub.hubData.name).toEqual('h')
  expect(hub.genome.name).toEqual('g')
  expect(Object.keys(hub.tracks.data)).toEqual(['t'])
})

test('handles a hub with no track sections', () => {
  const hub = new SingleFileHub(
    'hub h\nshortLabel s\nlongLabel l\nemail e\n\ngenome g\ntwoBitPath g.2bit\n',
  )
  expect(Object.keys(hub.tracks.data)).toEqual([])
})
