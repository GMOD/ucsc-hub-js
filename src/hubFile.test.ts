import fs from 'fs'
import HubFile from './hubFile'

describe('HubFile', () => {
  it('reads a basic hub.txt file', () => {
    const input = fs.readFileSync('test/basic.hub.txt', 'utf8')
    const hubFile = new HubFile(input)
    expect(hubFile).toMatchSnapshot()
    expect(hubFile.toString()).toEqual(input)
  })

  it("throws if the file doesn't start with a hub entry", () =>
    expect(
      () => new HubFile('trackHub UCSCHub\nshortLabel UCSC Hub\n'),
    ).toThrow(/file must begin with a line like/))

  it('throws if a hub is missing a required field', () =>
    expect(() => new HubFile('hub UCSCHub\nshortLabel UCSC Hub\n')).toThrow(
      /file is missing required entr(y|ies):/,
    ))

  it('throws if a hub has an invalid field', () =>
    expect(() => new HubFile('hub UCSCHub\ninvalid invalid Label\n')).toThrow(
      /file has invalid entr(y|ies):/,
    ))
})
