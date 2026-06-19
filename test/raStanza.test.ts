import { expect, test } from 'vitest'

import RaStanza from '../src/raStanza.ts'

test('creates an empty stanza', () => {
  const stanza = new RaStanza()
  expect(stanza).toMatchSnapshot()
  expect(stanza.name).toBeUndefined()
  expect(stanza.nameKey).toBeUndefined()
})

test('populates an empty stanza', () => {
  const input1 = 'key1 value1\n'
  const input2 = 'key2 value2\n'
  const stanza = new RaStanza([input1, input2].join(''))
  expect(stanza).toMatchSnapshot()
  expect(stanza.name).toEqual('value1')
  expect(stanza.nameKey).toEqual('key1')
})

test('parses a single line stanza', () => {
  const input = 'key1 value1'
  const stanza = new RaStanza(input)
  expect(stanza).toMatchSnapshot()
  expect(stanza.name).toEqual('value1')
  expect(stanza.nameKey).toEqual('key1')
})

test('parses a multiple line stanza', () => {
  const input = 'key1 value1\nkey2 value2\nkey3\n'
  const stanza = new RaStanza(input)
  expect(stanza).toMatchSnapshot()
  expect(stanza.name).toEqual('value1')
  expect(stanza.nameKey).toEqual('key1')
})

test('handles CRLF newlines', () => {
  const input = 'key1 value1\r\nkey2 value2\r\n'
  const stanza = new RaStanza(input)
  expect(stanza).toMatchSnapshot()
  expect(stanza.name).toEqual('value1')
  expect(stanza.nameKey).toEqual('key1')
})

test('parses a list of strings', () => {
  const input = ['key1 value1', 'key2 value2']
  const stanza = new RaStanza(input)
  expect(stanza).toMatchSnapshot()
  expect(stanza.name).toEqual('value1')
  expect(stanza.nameKey).toEqual('key1')
})

test('handles commented lines', () => {
  const input =
    '# A comment\n' +
    'key1 value1\n' +
    'key2 value2\n' +
    '  # Another comment\n' +
    'key3 value3\n'
  const stanza = new RaStanza(input)
  expect(stanza).toMatchSnapshot()

  expect(stanza.name).toEqual('value1')
  expect(stanza.nameKey).toEqual('key1')
})

test('handles indented lines', () => {
  const input = '    key1 value1\n    key2 value\n'
  const stanza = new RaStanza(input)
  expect(stanza).toMatchSnapshot()
  expect(stanza.name).toEqual('value1')
  expect(stanza.nameKey).toEqual('key1')
})

test('ignores indentation with checkIndent false', () => {
  const input = '    key1 value1\n\tkey2 value\n'
  const stanza = new RaStanza(input, { checkIndent: false })
  expect(stanza).toMatchSnapshot()
  expect(stanza.name).toEqual('value1')
  expect(stanza.nameKey).toEqual('key1')
})

test('handles continued lines', () => {
  const input =
    '  key1 value1\n' +
    '  key2 a really long value \\\n' +
    '  that continues\n' +
    '  key3 another really \\\n' +
    'long value \\\n' +
    'that continues a lot\n' +
    '  key4 yet another really \\\n' +
    '  long value \\\n' +
    '  # A comment\n' +
    '  that continues with a comment in it\n'
  const stanza = new RaStanza(input)
  expect(stanza).toMatchSnapshot()

  expect(stanza.name).toEqual('value1')
  expect(stanza.nameKey).toEqual('key1')
})

test('throws with duplicate keys and different values', () => {
  expect(() => new RaStanza('key1 value1\nkey1 value2\n')).toThrow(
    /duplicate key with a different value/,
  )
  expect(() => new RaStanza('key1 value1\nkey1 value1\n')).not.toThrow()
})

test('treats a repeated bare key as a no-op rather than overwriting', () => {
  const stanza = new RaStanza('key1 value1\nkey2 value2\nkey2\n')
  expect(stanza.data.key2).toEqual('value2')
})

test('handles keys that collide with Object.prototype members', () => {
  const stanza = new RaStanza(
    'key1 value1\ntoString custom\nconstructor ctor\n__proto__ p\n',
  )
  expect(Object.hasOwn(stanza.data, 'toString')).toBe(true)
  expect(Object.hasOwn(stanza.data, 'constructor')).toBe(true)
  expect(Object.hasOwn(stanza.data, '__proto__')).toBe(true)
  expect(stanza.data).toMatchObject({
    toString: 'custom',
    constructor: 'ctor',
    ['__proto__']: 'p',
  })
})

test('throws on encountering blank lines', () => {
  expect(() => new RaStanza('key1 value1\n\nkey2 value2')).toThrow(
    /contained blank lines/,
  )
})

test("throws if the first line doesn't have a value", () => {
  expect(() => new RaStanza('key1\nkey2 value2\n')).toThrow(
    /must have both a key and a value/,
  )
})

test('throws on inconsistent indentation', () => {
  expect(() => new RaStanza('    key1 value1\n  key2 value2\n')).toThrow(
    /Inconsistent indentation of stanza/,
  )
  expect(
    () =>
      new RaStanza('    key1 value1\n  key2 value2\n', {
        checkIndent: false,
      }),
  ).not.toThrow()
})
