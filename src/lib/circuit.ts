import type { CompKind, LabComponent, LabWire } from '../types'
import { evalGate } from './logic'
import type { GateName } from '../types'

export function pinCount(kind: CompKind): number {
  if (kind === 'IN' || kind === 'OUT' || kind === 'NOT') return 1
  return 2
}

export function evaluateLab(
  components: LabComponent[],
  wires: LabWire[],
): { values: Record<string, boolean | null>; error?: string } {
  const byId = new Map(components.map((c) => [c.id, c]))
  const incoming = new Map<string, LabWire[]>()
  const occupiedPins = new Set<string>()
  for (const w of wires) {
    const source = byId.get(w.fromId)
    const target = byId.get(w.toId)
    if (!source || !target) return { values: {}, error: 'A wire points to a component that is not on the canvas.' }
    if (source.kind === 'OUT' || target.kind === 'IN') {
      return { values: {}, error: 'Connect an output pin to a gate input or output lamp.' }
    }
    const pinLimit = target.kind === 'OUT' || target.kind === 'NOT' ? 1 : 2
    if (!Number.isInteger(w.toPin) || w.toPin < 0 || w.toPin >= pinLimit) {
      return { values: {}, error: `That connection does not match an input pin on ${target.kind}.` }
    }
    const pinKey = `${w.toId}:${w.toPin}`
    if (occupiedPins.has(pinKey)) return { values: {}, error: `Input ${w.toPin + 1} on ${target.kind} has more than one wire.` }
    occupiedPins.add(pinKey)
    const list = incoming.get(w.toId) ?? []
    list.push(w)
    incoming.set(w.toId, list)
  }

  for (const component of components) {
    if (component.kind === 'IN') continue
    const needed: (0 | 1)[] = component.kind === 'OUT' || component.kind === 'NOT' ? [0] : [0, 1]
    const connected = new Set((incoming.get(component.id) ?? []).map((wire) => wire.toPin))
    const missing = needed.find((pin) => !connected.has(pin))
    if (missing !== undefined) {
      return { values: {}, error: `Connect input ${missing + 1} on ${component.kind} before testing the circuit.` }
    }
  }

  const deps = new Map<string, string[]>()
  for (const c of components) {
    const ins = incoming.get(c.id) ?? []
    deps.set(
      c.id,
      ins.map((w) => w.fromId),
    )
  }

  const values: Record<string, boolean | null> = {}
  const visiting = new Set<string>()
  const done = new Set<string>()
  let cycle = false

  const visit = (id: string) => {
    if (done.has(id) || cycle) return
    if (visiting.has(id)) {
      cycle = true
      return
    }
    visiting.add(id)
    for (const d of deps.get(id) ?? []) visit(d)
    visiting.delete(id)
    done.add(id)

    const c = byId.get(id)
    if (!c) return
    if (c.kind === 'IN') {
      values[id] = Boolean(c.on)
      return
    }
    const ins = (incoming.get(id) ?? []).slice().sort((x, y) => x.toPin - y.toPin)
    const needed = pinCount(c.kind)
    if (c.kind === 'OUT') {
      if (!ins.length) {
        values[id] = null
        return
      }
      const src = values[ins[0].fromId]
      values[id] = src ?? null
      return
    }
    if (ins.length < needed) {
      values[id] = null
      return
    }
    const a = values[ins.find((w) => w.toPin === 0)?.fromId ?? ins[0].fromId]
    if (c.kind === 'NOT') {
      values[id] = a == null ? null : evalGate('NOT', a)
      return
    }
    const bWire = ins.find((w) => w.toPin === 1) ?? ins[1]
    const b = values[bWire?.fromId ?? '']
    if (a == null || b == null) {
      values[id] = null
      return
    }
    values[id] = evalGate(c.kind as GateName, a, b)
  }

  for (const c of components) visit(c.id)
  if (cycle) return { values, error: 'This circuit has a loop. Digital eval needs an acyclic net.' }
  return { values }
}

export function generateTruthTable(
  components: LabComponent[],
  wires: LabWire[],
): { inputs: string[]; rows: { ins: boolean[]; outs: (boolean | null)[] }[]; error?: string } {
  const inputs = components.filter((c) => c.kind === 'IN')
  const outputs = components.filter((c) => c.kind === 'OUT')
  if (!inputs.length || !outputs.length) {
    return { inputs: [], rows: [], error: 'Add at least one input switch and one output lamp.' }
  }
  const n = inputs.length
  if (n > 3) {
    return { inputs: inputs.map((i) => i.id), rows: [], error: 'Truth table supports up to 3 inputs in this demo lab.' }
  }
  const rows: { ins: boolean[]; outs: (boolean | null)[] }[] = []
  const total = 2 ** n
  for (let mask = 0; mask < total; mask++) {
    const ins: boolean[] = []
    const comps = components.map((c) => ({ ...c }))
    inputs.forEach((inp, i) => {
      const bitv = Boolean(mask & (1 << (n - 1 - i)))
      ins.push(bitv)
      const found = comps.find((c) => c.id === inp.id)
      if (found) found.on = bitv
    })
    const { values, error } = evaluateLab(comps, wires)
    if (error) return { inputs: inputs.map((i) => i.id), rows, error }
    rows.push({
      ins,
      outs: outputs.map((o) => values[o.id] ?? null),
    })
  }
  return { inputs: inputs.map((i) => i.id), rows }
}

export function circuitMatchesAnd(components: LabComponent[], wires: LabWire[]): boolean {
  const table = generateTruthTable(components, wires)
  if (table.error || table.inputs.length !== 2 || table.rows.length !== 4) return false
  const want = [false, false, false, true]
  return table.rows.every((r, i) => r.outs[0] === want[i])
}

export function circuitMatchesAndThenNot(components: LabComponent[], wires: LabWire[]): boolean {
  const table = generateTruthTable(components, wires)
  if (table.error || table.inputs.length !== 2 || table.rows.length !== 4) return false
  const want = [true, true, true, false]
  return table.rows.every((r, i) => r.outs[0] === want[i])
}

export function starterAndCircuit(): { components: LabComponent[]; wires: LabWire[] } {
  const a: LabComponent = { id: 'in-a', kind: 'IN', x: 24, y: 40, on: false }
  const b: LabComponent = { id: 'in-b', kind: 'IN', x: 24, y: 140, on: false }
  const g: LabComponent = { id: 'g-and', kind: 'AND', x: 180, y: 88 }
  const y: LabComponent = { id: 'out-y', kind: 'OUT', x: 340, y: 88 }
  return {
    components: [a, b, g, y],
    wires: [
      { id: 'w1', fromId: a.id, toId: g.id, toPin: 0 },
      { id: 'w2', fromId: b.id, toId: g.id, toPin: 1 },
      { id: 'w3', fromId: g.id, toId: y.id, toPin: 0 },
    ],
  }
}
