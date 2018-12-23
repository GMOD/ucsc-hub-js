const fs = require('fs')
const TrackDbFile = require('./trackDbFile')

describe('TrackDbFile', () => {
  it('does something', () => {
    const input = fs.readFileSync('test/basic.ra', 'utf8')
    const trackDb = new TrackDbFile(input)
    expect(trackDb).not.toBeNull()
  })
})
