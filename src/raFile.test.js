const fs = require('fs')
const RaFile = require('./raFile')
require('./trimStartEndPolyfills')

describe('RaFile reader', () => {
  it('creates an empty ra file', () => {
    const raFile = new RaFile()
    expect(raFile).toMatchInlineSnapshot(`Map {}`)
    expect(raFile._stanzaAndCommentOrder).toEqual([])
    expect(raFile.nameKey).toBeUndefined()
    expect(raFile.toString()).toEqual('')
  })

  it('populates an empty ra file', () => {
    const raFile = new RaFile()
    const input1 = 'key1 valueA\nkey2 valueB\n'
    const comment = '# A comment\n'
    const input2 = 'key1 valueC\nkey2 valueD\n'
    raFile.add(input1)
    raFile.add(comment)
    raFile.add(input2)
    expect(raFile).toMatchSnapshot()
    expect(raFile._stanzaAndCommentOrder).toEqual([
      'valueA',
      '# A comment',
      'valueC',
    ])
    expect(raFile.nameKey).toEqual('key1')
    expect(raFile.toString()).toEqual(`${input1}\n${comment}\n${input2}`)
  })

  it('parses a simple three stanza file', () => {
    const input = fs.readFileSync('test/basic.ra', 'utf8')
    const raFile = new RaFile(input)
    expect(raFile).toMatchSnapshot()
    expect(raFile._stanzaAndCommentOrder).toEqual(['valA', 'valD', 'valG'])
    expect(raFile.nameKey).toEqual('key1')
    expect(raFile.toString()).toEqual(input)
  })

  it('parses a file with comments', () => {
    const input = fs.readFileSync('test/comments.ra', 'utf8')
    const raFile = new RaFile(input)
    expect(raFile).toMatchSnapshot()
    expect(raFile._stanzaAndCommentOrder).toEqual([
      '#comment1\n#comment2',
      'valA',
      'valD',
    ])
    expect(raFile.nameKey).toEqual('key1')
    expect(raFile.toString()).toEqual(input)
  })

  it('handles CRLF newlines', () => {
    const input =
      'key1 valueA\r\n' +
      'key2 valueB\r\n\r\n' +
      '# A comment\r\n\r\n' +
      'key1 valueC\r\n' +
      'key2 valueD\r\n'
    const raFile = new RaFile(input)
    expect(raFile).toMatchSnapshot()
    expect(raFile._stanzaAndCommentOrder).toEqual([
      'valueA',
      '# A comment',
      'valueC',
    ])
    expect(raFile.nameKey).toEqual('key1')
    expect(raFile.toString()).toEqual(input.replace(/\r/g, ''))
  })

  it('parses a list of stanzas', () => {
    const input = [
      'key1 valueA\nkey2 valueB\n',
      '# A comment\n',
      'key1 valueC\nkey2 valueD\n',
    ]
    const raFile = new RaFile(input)
    expect(raFile).toMatchSnapshot()
    expect(raFile._stanzaAndCommentOrder).toEqual([
      'valueA',
      '# A comment',
      'valueC',
    ])
    expect(raFile.nameKey).toEqual('key1')
    expect(raFile.toString()).toEqual(input.join('\n'))
  })

  it('handles indented stanzas', () => {
    const input = fs.readFileSync('test/indented.ra', 'utf8')
    const raFile = new RaFile(input)
    expect(raFile).toMatchSnapshot()
    expect(raFile._stanzaAndCommentOrder).toEqual(['valA', 'valD', 'valG'])
    expect(raFile.nameKey).toEqual('key1')
    expect(raFile.toString()).toEqual(input)
  })

  it('adds a stanza', () => {
    const raFile = new RaFile(fs.readFileSync('test/basic.ra', 'utf8'))
    raFile.add('key1 valJ\nkey2 valK\nkey3 valL\n')
    expect(raFile).toMatchSnapshot()
    expect(raFile._stanzaAndCommentOrder).toEqual([
      'valA',
      'valD',
      'valG',
      'valJ',
    ])
    expect(raFile.nameKey).toEqual('key1')
    expect(raFile.toString()).toEqual(
      fs.readFileSync('test/afterAdd.ra', 'utf8'),
    )
  })

  it('deletes a stanza', () => {
    const raFile = new RaFile(fs.readFileSync('test/basic.ra', 'utf8'))
    raFile.delete('valD')
    raFile.delete('nonexistent')
    expect(raFile).toMatchSnapshot()
    expect(raFile._stanzaAndCommentOrder).toEqual(['valA', 'valG'])
    expect(raFile.nameKey).toEqual('key1')
    expect(raFile.toString()).toEqual(
      fs.readFileSync('test/afterDelete.ra', 'utf8'),
    )
  })

  it('clears', () => {
    const raFile = new RaFile(fs.readFileSync('test/basic.ra', 'utf8'))
    raFile.clear()
    expect(raFile).toMatchSnapshot()
    expect(raFile._stanzaAndCommentOrder).toEqual([])
    expect(raFile.nameKey).toBeUndefined()
    expect(raFile.toString()).toEqual('')
  })

  it('updates a stanza', () => {
    const input = fs.readFileSync('test/basic.ra', 'utf8')
    const raFile = new RaFile(input)
    const updatedStanza = raFile.get('valD')
    updatedStanza.indent = '    '
    raFile.set('valD', updatedStanza)
    expect(raFile).toMatchSnapshot()
    expect(raFile._stanzaAndCommentOrder).toEqual(['valA', 'valD', 'valG'])
    expect(raFile.nameKey).toEqual('key1')
    expect(raFile.toString()).toEqual(
      input
        .replace('key1 valD', '    key1 valD')
        .replace('key2 valE', '    key2 valE')
        .replace('key3 valF', '    key3 valF'),
    )
  })

  it('throws on an empty stanza', () => {
    expect(() => new RaFile('')).toThrow(/Invalid stanza, was empty/)
    const raFile = new RaFile()
    expect(() => raFile.add('')).toThrow(/Invalid stanza, was empty/)
  })

  it('throws if stanzas have mismatched keys', () =>
    expect(
      () => new RaFile(fs.readFileSync('test/mismatchKeys.ra', 'utf8')),
    ).toThrow(/must have the same key/))

  it('throws if stanzas have duplicate names', () =>
    expect(
      () => new RaFile(fs.readFileSync('test/duplicateName.ra', 'utf8')),
    ).toThrow(/duplicate stanza name/))
})
