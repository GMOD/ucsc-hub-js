const fs = require('fs')
const TrackDbFile = require('./trackDbFile')

describe('TrackDbFile', () => {
  it('gets settings', () => {
    const input = fs.readFileSync('test/superTrack.trackDb.txt', 'utf8')
    const trackDb = new TrackDbFile(input)
    expect(trackDb.settings('myFirstTrack')).toMatchSnapshot()
  })
})
