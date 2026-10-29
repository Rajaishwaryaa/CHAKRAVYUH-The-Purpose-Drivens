import { describe, expect, it } from 'vitest'
import { bit, evalGate, GATES } from './logic'

const TABLES: Record<(typeof GATES)[number], string> = {
  AND: '0001',
  OR: '0111',
  NAND: '1110',
  NOR: '1000',
  XOR: '0110',
  XNOR: '1001',
  NOT: '10',
}

describe('evalGate truth tables', () => {
  for (const gate of GATES) {
    it(`matches the canonical ${gate} table`, () => {
      if (gate === 'NOT') {
        expect(`${bit(evalGate('NOT', false))}${bit(evalGate('NOT', true))}`).toBe(TABLES.NOT)
        return
      }
      const bits = [false, true]
        .flatMap((a) => [false, true].map((b) => bit(evalGate(gate, a, b))))
        .join('')
      expect(bits).toBe(TABLES[gate])
    })
  }
})
