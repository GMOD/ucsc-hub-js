import assert from 'assert'
import RaStanza from './raStanza'

describe('RaStanza reader', () => {
  it('creates an empty stanza', () => {
    const stanza = new RaStanza()
    expect(stanza).toMatchSnapshot()
    expect(stanza.name).toBeUndefined()
    expect(stanza.nameKey).toBeUndefined()
    expect(stanza.indent).toBeUndefined()
  })

  it('populates an empty stanza', () => {
    const input1 = 'key1 value1\n'
    const input2 = 'key2 value2\n'
    const stanza = new RaStanza([input1, input2].join(''))
    expect(stanza).toMatchSnapshot()
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
  })

  it('parses a single line stanza', () => {
    const input = 'key1 value1'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
  })

  it('parses a multiple line stanza', () => {
    const input = 'key1 value1\nkey2 value2\nkey3\n'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
  })

  it('handles CRLF newlines', () => {
    const input = 'key1 value1\r\nkey2 value2\r\n'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
  })

  it('parses a list of strings', () => {
    const input = ['key1 value1', 'key2 value2']
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
  })

  it('handles commented lines', () => {
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
    expect(stanza.indent).toEqual('')
  })

  it('handles indented lines', () => {
    const input = '    key1 value1\n    key2 value\n'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('    ')
  })

  it('ignores indentation with checkIndent false', () => {
    const input = '    key1 value1\n\tkey2 value\n'
    const stanza = new RaStanza(input, { checkIndent: false })
    expect(stanza).toMatchSnapshot()
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
  })

  it('handles continued lines', () => {
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
    expect(stanza.indent).toEqual('  ')
  })

  it('throws with duplicate keys and different values', () => {
    expect(() => new RaStanza('key1 value1\nkey1 value2\n')).toThrow(
      /duplicate key with a different value/,
    )
    expect(() => new RaStanza('key1 value1\nkey1 value1\n')).not.toThrow()
  })

  it('throws on encountering blank lines', () =>
    expect(() => new RaStanza('key1 value1\n\nkey2 value2')).toThrow(
      /contained blank lines/,
    ))

  it("throws if the first line doesn't have a value", () =>
    expect(() => new RaStanza('key1\nkey2 value2\n')).toThrow(
      /must have both a key and a value/,
    ))

  it('throws on inconsistent indentation', () => {
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
})
