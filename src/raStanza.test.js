const RaStanza = require('./raStanza')

describe('RaStanza reader', () => {
  it('can create an empty stanza', () => {
    const stanza = new RaStanza()
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual([])
    expect(stanza.name).toBeUndefined()
    expect(stanza.nameKey).toBeUndefined()
    expect(stanza.indent).toBeUndefined()
    expect(stanza.toString()).toEqual('')
  })

  it('can populate an empty stanza', () => {
    const stanza = new RaStanza()
    expect(stanza).toMatchSnapshot()
    const input1 = 'key1 value1\n'
    const input2 = 'key2 value2\n'
    stanza.set(input1)
    stanza.set(input2)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key2'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(`${input1}${input2}`)
  })

  it('can parse a single line stanza', () => {
    const input = 'key1 value1'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(`${input}\n`)
  })

  it('can parse a multiple line stanza', () => {
    const input = 'key1 value1\nkey2 value2\n'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key2'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(input)
  })

  it('can handle CRLF newlines', () => {
    const input = 'key1 value1\r\nkey2 value2\r\n'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key2'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(input.replace(/\r/g, ''))
  })

  it('can parse a list of strings', () => {
    const input = ['key1 value1', 'key2 value2']
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key2'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(`${input.join('\n')}\n`)
  })

  it('can handle commented lines', () => {
    const input =
      '# A comment\n' +
      'key1 value1\n' +
      'key2 value2\n' +
      '  # Another comment\n' +
      'key3 value3\n'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual([
      '# A comment',
      'key1',
      'key2',
      '# Another comment',
      'key3',
    ])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(input.replace(/^\s*/gm, ''))
  })

  it('handles indented lines', () => {
    const input = '    key1 value1\n    key2 value\n'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key2'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('    ')
    expect(stanza.toString()).toEqual(input)
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
    expect(stanza._keyAndCommentOrder).toEqual([
      'key1',
      'key2',
      'key3',
      '# A comment',
      'key4',
    ])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('  ')
    // expect(stanza.toString()).toEqual(input)
  })

  it('throws with duplicate keys', () => {
    expect(() => new RaStanza('key1 value1\nkey1 value2\n')).toThrow(
      /duplicate key in stanza/,
    )
    expect(() => new RaStanza('key1 value1\nkey1\n')).toThrow(
      /duplicate key in stanza/,
    )
  })

  it('throws on encountering blank lines', () =>
    expect(() => new RaStanza('key1 value1\n\nkey2 value2')).toThrow(
      /contained blank lines/,
    ))

  it("throws if the first line doesn't have a value", () =>
    expect(() => new RaStanza('key1\nkey2 value2\n')).toThrow(
      /must have both a key and a value/,
    ))

  it('throws on inconsistent indentation', () =>
    expect(() => new RaStanza('    key1 value1\n  key2 value2\n')).toThrow(
      /Inconsistent indentation of stanza/,
    ))
})
