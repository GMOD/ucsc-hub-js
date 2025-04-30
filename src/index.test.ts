import { RaFile, RaStanza } from './index.ts'
import { test, expect } from 'vitest'

test('imports modules', () => {
  expect(RaFile).not.toBeNull()
  expect(RaStanza).not.toBeNull()
})
