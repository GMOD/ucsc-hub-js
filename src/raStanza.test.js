import RaStanza from './raStanza'

describe('RaStanza reader', () => {
  it('creates an empty stanza', () => {
    const stanza = new RaStanza()
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual([])
    expect(stanza.name).toBeUndefined()
    expect(stanza.nameKey).toBeUndefined()
    expect(stanza.indent).toBeUndefined()
    expect(stanza.toString()).toEqual('')
  })

  it('populates an empty stanza', () => {
    const stanza = new RaStanza()
    expect(stanza).toMatchSnapshot()
    const input1 = 'key1 value1\n'
    const input2 = 'key2 value2\n'
    stanza.add(input1)
    stanza.add(input2)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key2'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(`${input1}${input2}`)
  })

  it('parses a single line stanza', () => {
    const input = 'key1 value1'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(`${input}\n`)
  })

  it('parses a multiple line stanza', () => {
    const input = 'key1 value1\nkey2 value2\nkey3\n'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key2', 'key3'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(input)
  })

  it('handles CRLF newlines', () => {
    const input = 'key1 value1\r\nkey2 value2\r\n'
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key2'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(input.replace(/\r/g, ''))
  })

  it('parses a list of strings', () => {
    const input = ['key1 value1', 'key2 value2']
    const stanza = new RaStanza(input)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key2'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(`${input.join('\n')}\n`)
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

  it('ignores indentation with checkIndent false', () => {
    const input = '    key1 value1\n\tkey2 value\n'
    const stanza = new RaStanza(input, { checkIndent: false })
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key2'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(
      input.replace('    ', '').replace('\t', ''),
    )
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
    const output =
      '  key1 value1\n' +
      '  key2 a really long value that continues\n' +
      '  key3 another really long value that continues a lot\n' +
      '  # A comment\n' +
      '  key4 yet another really long value that continues with a comment in it\n'
    expect(stanza.toString()).toEqual(output)
  })

  it('clears', () => {
    const input = 'key1 value1\nkey2 value2\nkey3\n'
    const stanza = new RaStanza(input)
    stanza.clear()
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual([])
    expect(stanza.name).toBeUndefined()
    expect(stanza.nameKey).toBeUndefined()
    expect(stanza.indent).toBeUndefined()
    expect(stanza.toString()).toEqual('')
  })

  it('removes a line', () => {
    const input = 'key1 value1\nkey2 value2\nkey3\n'
    const stanza = new RaStanza(input)
    stanza.delete('nonexistent')
    stanza.delete('key2')
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key3'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(input.replace('key2 value2\n', ''))
  })

  it('updates a line', () => {
    const input = 'key1 value1\nkey2 value2\nkey3\n'
    const stanza = new RaStanza(input)
    let updatedValue = stanza.get('key2')
    updatedValue += '_new'
    stanza.set('key2', updatedValue)
    expect(stanza).toMatchSnapshot()
    expect(stanza._keyAndCommentOrder).toEqual(['key1', 'key2', 'key3'])
    expect(stanza.name).toEqual('value1')
    expect(stanza.nameKey).toEqual('key1')
    expect(stanza.indent).toEqual('')
    expect(stanza.toString()).toEqual(
      input.replace('key2 value2\n', 'key2 value2_new\n'),
    )
  })

  it('throws when trying to delete the first line', () => {
    const stanza = new RaStanza('key1 value1\nkey2 value2\n')
    expect(() => stanza.delete('key1')).toThrow(/Cannot delete the first line/)
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
