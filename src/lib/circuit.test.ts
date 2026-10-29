import { describe, expect, it } from 'vitest'
import {
  circuitMatchesAnd,
  circuitMatchesAndThenNot,
  evaluateLab,
  generateTruthTable,
  starterAndCircuit,
} from './circuit'
import type { LabComponent, LabWire } from '../types'

describe('evaluateLab', () => {
  it('computes AND from actual wiring', () => {
    const { components, wires } = starterAndCircuit()
    const on = components.map((c) => (c.id === 'in-a' || c.id === 'in-b' ? { ...c, on: true } : c))
    const { values, error } = evaluateLab(on, wires)
    expect(error).toBeUndefined()
    expect(values['out-y']).toBe(true)
    expect(circuitMatchesAnd(components, wires)).toBe(true)
  })

  it('rejects a cycle', () => {
    const components: LabComponent[] = [
      { id: 'a', kind: 'AND', x: 0, y: 0 },
      { id: 'b', kind: 'OR', x: 0, y: 0 },
    ]
    const wires: LabWire[] = [
      { id: 'w1', fromId: 'a', toId: 'b', toPin: 0 },
      { id: 'w2', fromId: 'b', toId: 'a', toPin: 0 },
      { id: 'w3', fromId: 'a', toId: 'b', toPin: 1 },
      { id: 'w4', fromId: 'b', toId: 'a', toPin: 1 },
    ]
    const { error } = evaluateLab(components, wires)
    expect(error).toMatch(/loop/i)
  })

  it('rejects two wires on the same input pin', () => {
    const components: LabComponent[] = [
      { id: 'in1', kind: 'IN', x: 0, y: 0, on: true },
      { id: 'in2', kind: 'IN', x: 0, y: 0, on: false },
      { id: 'g', kind: 'AND', x: 0, y: 0 },
      { id: 'y', kind: 'OUT', x: 0, y: 0 },
    ]
    const wires: LabWire[] = [
      { id: 'w1', fromId: 'in1', toId: 'g', toPin: 0 },
      { id: 'w2', fromId: 'in2', toId: 'g', toPin: 0 },
      { id: 'w3', fromId: 'g', toId: 'y', toPin: 0 },
    ]
    expect(evaluateLab(components, wires).error).toMatch(/more than one wire/)
  })

  it('AND then NOT matches NAND behaviour', () => {
    const components: LabComponent[] = [
      { id: 'in-a', kind: 'IN', x: 0, y: 0, on: false },
      { id: 'in-b', kind: 'IN', x: 0, y: 0, on: false },
      { id: 'g-and', kind: 'AND', x: 0, y: 0 },
      { id: 'g-not', kind: 'NOT', x: 0, y: 0 },
      { id: 'out-y', kind: 'OUT', x: 0, y: 0 },
    ]
    const wires: LabWire[] = [
      { id: 'w1', fromId: 'in-a', toId: 'g-and', toPin: 0 },
      { id: 'w2', fromId: 'in-b', toId: 'g-and', toPin: 1 },
      { id: 'w3', fromId: 'g-and', toId: 'g-not', toPin: 0 },
      { id: 'w4', fromId: 'g-not', toId: 'out-y', toPin: 0 },
    ]
    expect(circuitMatchesAndThenNot(components, wires)).toBe(true)
    const table = generateTruthTable(components, wires)
    expect(table.rows.map((r) => r.outs[0])).toEqual([true, true, true, false])
  })
})
