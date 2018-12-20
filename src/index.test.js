const { RaFile, RaStanza } = require('.')

describe('ucsc-hub-js', () => {
  it('imports modules', () => {
    expect(RaFile).not.toBeNull()
    expect(RaStanza).not.toBeNull()
  })
})
