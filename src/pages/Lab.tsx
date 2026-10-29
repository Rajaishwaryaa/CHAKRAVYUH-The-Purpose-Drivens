import { useMemo, useRef, useState, type PointerEvent } from 'react'
import {
  circuitMatchesAnd,
  circuitMatchesAndThenNot,
  evaluateLab,
  generateTruthTable,
  pinCount,
  starterAndCircuit,
} from '../lib/circuit'
import { uid } from '../lib/id'
import { bit } from '../lib/logic'
import { useDemo } from '../state/DemoProvider'
import type { CompKind, LabComponent, LabWire } from '../types'
import { Bit } from '../components/Ui'

const TOOLS: CompKind[] = ['IN', 'OUT', 'AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR']

export function Lab() {
  const { state, saveDesign } = useDemo()
  const [components, setComponents] = useState<LabComponent[]>([])
  const [wires, setWires] = useState<LabWire[]>([])
  const [sel, setSel] = useState<string | null>(null)
  const [pending, setPending] = useState<{ fromId: string } | null>(null)
  const [history, setHistory] = useState<{ c: LabComponent[]; w: LabWire[] }[]>([])
  const [future, setFuture] = useState<{ c: LabComponent[]; w: LabWire[] }[]>([])
  const [msg, setMsg] = useState('Place two inputs, an AND, and an output for the guided exercise.')
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null)
  const evald = useMemo(() => evaluateLab(components, wires), [components, wires])
  const table = useMemo(() => generateTruthTable(components, wires), [components, wires])

  const snapshot = () => {
    setHistory((h) => [...h, { c: components, w: wires }].slice(-20))
    setFuture([])
  }

  const add = (kind: CompKind) => {
    snapshot()
    setComponents((cs) => [
      ...cs,
      { id: uid(kind.toLowerCase()), kind, x: 40 + cs.length * 18, y: 40 + (cs.length % 5) * 64, on: false },
    ])
  }

  const connectPin = (id: string, pin: string) => {
    if (pin === 'out') {
      const source = components.find((component) => component.id === id)
      if (source?.kind === 'OUT') {
        setMsg('An output lamp cannot feed another component.')
        return
      }
      setPending({ fromId: id })
      setMsg('Now choose an input pin on a gate or output lamp.')
      return
    }
    if (!pin.startsWith('in') || !pending) return
    const source = components.find((component) => component.id === pending.fromId)
    const target = components.find((component) => component.id === id)
    if (!source || !target) {
      setMsg('That component is no longer on the canvas. Start the connection again.')
      setPending(null)
      return
    }
    if (source.kind === 'OUT' || target.kind === 'IN') {
      setMsg('Connect an output pin to a gate input or output lamp.')
      setPending(null)
      return
    }
    const toPin = pin === 'in1' ? 1 : 0
    const pinLimit = target.kind === 'OUT' || target.kind === 'NOT' ? 1 : 2
    if (toPin >= pinLimit) {
      setMsg(`That pin is not an input on ${target.kind}.`)
      setPending(null)
      return
    }
    if (pending.fromId === id) {
      setMsg('A part cannot feed itself.')
      setPending(null)
      return
    }
    if (wires.some((wire) => wire.toId === id && wire.toPin === toPin)) {
      setMsg('That input pin is already used.')
      setPending(null)
      return
    }
    snapshot()
    setWires((ws) => [...ws, { id: uid('w'), fromId: pending.fromId, toId: id, toPin: toPin as 0 | 1 }])
    setPending(null)
    setMsg('Wire added. Toggle inputs to see live lamps.')
  }

  const onCanvasDown = (e: PointerEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement
    const pin = t.dataset.pin
    const id = t.dataset.id
    if (pin) return
    if (id) {
      const c = components.find((x) => x.id === id)
      if (!c) return
      setSel(id)
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
      drag.current = { id, dx: e.clientX - rect.left - c.x, dy: e.clientY - rect.top - c.y }
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const { id, dx, dy } = drag.current
    const x = Math.max(0, e.clientX - rect.left - dx)
    const y = Math.max(0, e.clientY - rect.top - dy)
    setComponents((cs) => cs.map((c) => (c.id === id ? { ...c, x, y } : c)))
  }

  const selected = components.find((c) => c.id === sel)

  return (
    <div>
      <h1>AI Design Studio & Virtual Lab</h1>
      <p>
        Digital logic only. No analog, SPICE, or hardware control. Outputs are computed from the gates you placed.
      </p>
      <div className="lab-wrap">
        <div className="card">
          <h3>Toolbox</h3>
          {TOOLS.map((k) => (
            <button key={k} className="btn secondary" type="button" style={{ width: '100%', marginBottom: 6 }} onClick={() => add(k)}>
              {k === 'IN' ? 'Input switch' : k === 'OUT' ? 'Output lamp' : k}
            </button>
          ))}
        </div>
        <div>
          <div
            className="canvas"
            onPointerDown={onCanvasDown}
            onClick={(e) => {
              const pin = (e.target as HTMLElement).closest<HTMLElement>('[data-pin]')
              if (pin?.dataset.id && pin.dataset.pin) connectPin(pin.dataset.id, pin.dataset.pin)
            }}
            onPointerMove={onMove}
            onPointerUp={() => {
              drag.current = null
            }}
          >
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              {wires.map((w) => {
                const a = components.find((c) => c.id === w.fromId)
                const b = components.find((c) => c.id === w.toId)
                if (!a || !b) return null
                const x1 = a.x + 88
                const y1 = a.y + 26
                const x2 = b.x
                const y2 = b.y + (w.toPin === 1 ? 36 : 16)
                return <line key={w.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4263EB" strokeWidth="2" />
              })}
            </svg>
            {components.map((c) => (
              <div
                key={c.id}
                className="comp"
                data-id={c.id}
                style={{ left: c.x, top: c.y, outline: sel === c.id ? '3px solid #36D9F5' : undefined }}
              >
                {c.kind === 'IN' ? (
                  <button
                    type="button"
                    style={{ background: 'transparent', color: 'white', border: 0, fontWeight: 800 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setComponents((cs) => cs.map((x) => (x.id === c.id ? { ...x, on: !x.on } : x)))
                    }}
                  >
                    IN {bit(Boolean(c.on))}
                  </button>
                ) : c.kind === 'OUT' ? (
                  <span>Y {evald.values[c.id] == null ? '—' : bit(Boolean(evald.values[c.id]))}</span>
                ) : (
                  c.kind
                )}
                {c.kind !== 'IN' &&
                  Array.from({ length: pinCount(c.kind === 'OUT' ? 'NOT' : c.kind) }).map((_, i) => (
                    <button
                      type="button"
                      key={i}
                      className="pin"
                      data-id={c.id}
                      data-pin={c.kind === 'OUT' || c.kind === 'NOT' ? 'in0' : i === 0 ? 'in0' : 'in1'}
                      aria-label={`${c.kind} input ${i + 1}`}
                      style={{ left: -7, top: c.kind === 'OUT' || c.kind === 'NOT' ? 18 : 8 + i * 20 }}
                    />
                  ))}
                {c.kind !== 'OUT' && (
                  <button
                    type="button"
                    className="pin"
                    data-id={c.id}
                    data-pin="out"
                    aria-label={`${c.kind} output`}
                    style={{ right: -7, top: 18 }}
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <button
              className="btn secondary"
              type="button"
              onClick={() => {
                const prev = history.at(-1)
                if (!prev) return
                setFuture((f) => [...f, { c: components, w: wires }])
                setHistory((h) => h.slice(0, -1))
                setComponents(prev.c)
                setWires(prev.w)
              }}
            >
              Undo
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={() => {
                const n = future.at(-1)
                if (!n) return
                setHistory((h) => [...h, { c: components, w: wires }])
                setFuture((f) => f.slice(0, -1))
                setComponents(n.c)
                setWires(n.w)
              }}
            >
              Redo
            </button>
            <button
              className="btn danger"
              type="button"
              onClick={() => {
                snapshot()
                setComponents([])
                setWires([])
              }}
            >
              Reset canvas
            </button>
            {selected && (
              <button
                className="btn secondary"
                type="button"
                onClick={() => {
                  snapshot()
                  setComponents((cs) => cs.filter((c) => c.id !== selected.id))
                  setWires((ws) => ws.filter((w) => w.fromId !== selected.id && w.toId !== selected.id))
                  setSel(null)
                }}
              >
                Delete selected
              </button>
            )}
            <button
              className="btn"
              type="button"
              onClick={() => {
                saveDesign({ id: uid('d'), name: `Bench ${state.designs.length + 1}`, components, wires })
                setMsg('Saved in this browser session list — not a cloud lab notebook.')
              }}
            >
              Save design (demo)
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={() => {
                snapshot()
                const starter = starterAndCircuit()
                setComponents(starter.components)
                setWires(starter.wires)
                setMsg('Loaded a verified AND starter. Toggle the switches — Y should be 1 only when both are 1.')
              }}
            >
              Load AND starter
            </button>
          </div>
          <p className="tiny" aria-live="polite">{msg} {evald.error}</p>
        </div>
        <div className="card">
          <h3>Test panel</h3>
          {selected && (
            <p>
              Selected {selected.kind} ({selected.id}) · live {String(evald.values[selected.id])}
            </p>
          )}
          {table.error && <p role="status">{table.error}</p>}
          {!table.error && table.rows.length > 0 && (
            <table className="data">
              <thead>
                <tr>
                  {table.inputs.map((id, i) => (
                    <th key={id}>In{i + 1}</th>
                  ))}
                  <th>Y</th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r, i) => (
                  <tr key={i}>
                    {r.ins.map((v, j) => (
                      <td key={j}>
                        <Bit v={v} />
                      </td>
                    ))}
                    <td>
                      <Bit v={r.outs[0]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h4>Guided checks</h4>
          <p>{circuitMatchesAnd(components, wires) ? 'AND behaviour matches. Nice work.' : 'AND exercise not matched yet.'}</p>
          <p>
            {circuitMatchesAndThenNot(components, wires)
              ? 'AND then NOT matches (NAND pattern).'
              : 'Two-gate (AND→NOT) not matched yet.'}
          </p>
          {state.designs.length > 0 && (
            <label className="field">
              <span>Reopen saved</span>
              <select
                onChange={(e) => {
                  const d = state.designs.find((x) => x.id === e.target.value)
                  if (!d) return
                  setComponents(d.components)
                  setWires(d.wires)
                }}
              >
                <option value="">Choose…</option>
                {state.designs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>
      <Copilot />
    </div>
  )
}

function Copilot() {
  const [req, setReq] = useState('turn on an indicator when it is dark')
  const [proposal, setProposal] = useState('')
  return (
    <section className="card" style={{ marginTop: 16 }}>
      <h2>Design copilot (demo suggestions)</h2>
      <p className="tiny">Unvalidated. Passing a mission still requires the test table, not this paragraph.</p>
      <label className="field">
        <span>Requirement</span>
        <input value={req} onChange={(e) => setReq(e.target.value)} />
      </label>
      <button
        className="btn secondary"
        type="button"
        onClick={() =>
          setProposal(
            `Demo suggestion for “${req}”:
Inputs: ambient light (0–100). Outputs: lamp.
Assumption: dark means light < threshold (try 30).
Suggested logic: lampOn = light < threshold.
Tests: night 5 → on, dusk 25 → on, indoor 50 → off, noon 90 → off.
Edit the numbers. Then prove them in Missions — this text is not a verified circuit.`,
          )
        }
      >
        Propose
      </button>
      {proposal && (
        <label className="field">
          <span>Editable proposal</span>
          <textarea value={proposal} onChange={(e) => setProposal(e.target.value)} rows={8} />
        </label>
      )}
      <WhatIf />
    </section>
  )
}

function WhatIf() {
  const [a, setA] = useState(80)
  const [b, setB] = useState(30)
  const lights = [5, 25, 50, 90]
  return (
    <div>
      <h3>What-if thresholds</h3>
      <p>Compare lampOn = light &lt; T for two numbers. Computed here, not guessed.</p>
      <label>
        T1
        <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} />
      </label>
      <label>
        T2
        <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} />
      </label>
      <table className="data">
        <thead>
          <tr>
            <th>Light</th>
            <th>T1 lamp</th>
            <th>T2 lamp</th>
          </tr>
        </thead>
        <tbody>
          {lights.map((l) => (
            <tr key={l}>
              <td>{l}</td>
              <td>{l < a ? 'on' : 'off'}</td>
              <td>{l < b ? 'on' : 'off'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
