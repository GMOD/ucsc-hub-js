const fs = require('fs')
const TrackDbFile = require('./trackDbFile')

describe('TrackDbFile', () => {
  it('reads a basic trackDb.txt file', () => {
    const input = fs.readFileSync('test/basic.trackDb.txt', 'utf8')
    const trackDb = new TrackDbFile(input)
    expect(trackDb).toMatchSnapshot()
    expect(trackDb.toString()).toEqual(input)
  })

  it('gets settings', () => {
    const input = fs.readFileSync('test/superTrack.trackDb.txt', 'utf8')
    const trackDb = new TrackDbFile(input)
    expect(trackDb.settings('myFirstTrack')).toMatchSnapshot()
  })
})
