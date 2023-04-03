import fs from 'fs'
import SingleFileHub from './singleFileHub'

// test that singleFileHub can parse singleFileAssemblyHub.txt
describe('singleFileHub', () => {
  it('reads a basic singleFileAssemblyHub.txt file', () => {
    const input = fs.readFileSync(
      'test/singleFileAssemblyHub.GCF_000002985.6.hub.txt',
      'utf8',
    )
    const singleFileHub = new SingleFileHub(input)
    expect(singleFileHub).toMatchSnapshot()
  })
})
