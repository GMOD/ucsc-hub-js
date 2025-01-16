import { RaFile, RaStanza } from './index'
import { describe, it, expect } from 'vitest'

describe('ucsc-hub-js', () => {
  it('imports modules', () => {
    expect(RaFile).not.toBeNull()
    expect(RaStanza).not.toBeNull()
  })
})
