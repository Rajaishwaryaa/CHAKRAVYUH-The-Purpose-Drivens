import type { GateName } from '../types'

export function evalGate(gate: GateName, a: boolean, b?: boolean): boolean {
  switch (gate) {
    case 'NOT':
      return !a
    case 'AND':
      return a && Boolean(b)
    case 'OR':
      return a || Boolean(b)
    case 'NAND':
      return !(a && Boolean(b))
    case 'NOR':
      return !(a || Boolean(b))
    case 'XOR':
      return a !== Boolean(b)
    case 'XNOR':
      return a === Boolean(b)
  }
}

export function bit(v: boolean): '0' | '1' {
  return v ? '1' : '0'
}

export const GATES: GateName[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR']


