import { expect, test } from 'vitest'

import { RaFile, RaStanza } from './index.ts'

test('imports modules', () => {
  expect(RaFile).not.toBeNull()
  expect(RaStanza).not.toBeNull()
})
