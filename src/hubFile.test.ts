import fs from 'fs'

import { expect, test } from 'vitest'

import HubFile from './hubFile.ts'

test('reads a basic hub.txt file', () => {
  const input = fs.readFileSync('test/basic.hub.txt', 'utf8')
  const hubFile = new HubFile(input)
  expect(hubFile).toMatchSnapshot()
})

test("throws if the file doesn't start with a hub entry", () => {
  expect(() => new HubFile('trackHub UCSCHub\nshortLabel UCSC Hub\n')).toThrow(
    /missing required/,
  )
})

test('throws if a hub is missing a required field', () => {
  expect(() => new HubFile('hub UCSCHub\nshortLabel UCSC Hub\n')).toThrow(
    /file is missing required entr(y|ies):/,
  )
})
