import HubFile from './hubFile'

export default class SingleFileHub extends HubFile {
  constructor(singleFileHub: string) {
    const stanzas = singleFileHub.trimEnd().split(/(?:[\t ]*\r?\n){2,}/)
    const hubSection = stanzas[0]
    super(hubSection, { skipValidation: true })
  }
}
