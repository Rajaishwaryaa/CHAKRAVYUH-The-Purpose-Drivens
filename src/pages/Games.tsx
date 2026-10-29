import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { evalGate, GATES, bit } from '../lib/logic'
import { uid } from '../lib/id'
import { XP } from '../lib/xp'
import { useDemo } from '../state/DemoProvider'
import type { GateName } from '../types'

const LOBBY = [
  { slug: 'jumble', name: 'Jumble Circuits', blurb: 'Place series parts in a working order.' },
  { slug: 'dungeon', name: 'Logic Gate Dungeon', blurb: 'AND through XNOR, graded by truth tables.' },
  { slug: 'predict', name: 'Predict & Play', blurb: 'Lock a prediction before the reveal.' },
  { slug: 'rush', name: 'Circuit Rush', blurb: 'Real 45s timer. Score = correct × leftover seconds bonus.' },
  { slug: 'fault', name: 'Fault Hunter / ECHO', blurb: 'Diagnose a wrong gate on a known puzzle.' },
  { slug: 'match', name: 'Component Match', blurb: 'Pair names with behaviour.' },
  { slug: 'boss', name: 'Boss Puzzle', blurb: 'Two-gate circuit, no peeking.' },
  { slug: 'creator', name: 'Student Challenge Creator', blurb: 'Needs Creator capability (demo toggle).' },
]

export function GamesLobby() {
  const { state } = useDemo()
  return (
    <div>
      <h1>Circuit Games & Puzzle Arena</h1>
      <p>Short practice. For full write-ups and submission history, use Challenge Arena.</p>
      <div className="grid cols-2">
        {LOBBY.map((g) => (
          <article className="card" key={g.slug}>
            <h3>{g.name}</h3>
            <p>{g.blurb}</p>
            {g.slug === 'creator' && !state.creatorEnabled ? (
              <p className="tiny">Turn on the demo Creator toggle to open the publisher.</p>
            ) : (
              <Link className="btn" to={`/app/games/${g.slug}`}>
                Play
              </Link>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

export function GamePage() {
  const { slug } = useParams()
  if (slug === 'dungeon') return <Dungeon />
  if (slug === 'predict') return <Predict />
  if (slug === 'fault') return <Fault />
  if (slug === 'rush') return <Rush />
  if (slug === 'jumble') return <Jumble />
  if (slug === 'match') return <Match />
  if (slug === 'boss') return <Boss />
  if (slug === 'creator') return <CreatorPuzzle />
  return <p>Unknown game.</p>
}

function Award({ k, amount, ready }: { k: string; amount: number; ready: boolean }) {
  const { awardOnce, state } = useDemo()
  const done = Boolean(state.completions[k])
  useEffect(() => {
    if (ready && !state.completions[k]) awardOnce(k, amount)
  }, [ready, k, amount, awardOnce, state.completions])
  if (!ready && !done) return null
  return (
    <p className="tiny" role="status">
      {done
        ? `Verified in this demo session. ${amount} XP is already on your ledger for this puzzle.`
        : `Recording ${amount} demo XP once…`}
    </p>
  )
}

function Dungeon() {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy')
  const pool = useMemo(() => buildDungeon(level), [level])
  const [i, setI] = useState(0)
  const [guess, setGuess] = useState('')
  const [msg, setMsg] = useState('')
  const [solved, setSolved] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const q = pool[i]
  const check = () => {
    setAttempts((n) => n + 1)
    if (guess !== bit(q.y)) {
      setMsg(`Not quite. Expected ${bit(q.y)}, you entered ${guess || 'blank'}. Check the second input.`)
      return
    }
    setMsg('Nice work — that matches the truth table.')
    setSolved((rows) => (rows.includes(i) ? rows : [...rows, i]))
    setChecked(true)
  }
  return (
    <GameFrame title="Logic Gate Dungeon" onReset={() => { setI(0); setSolved([]); setAttempts(0); setChecked(false); setGuess(''); setMsg('') }}>
      <label className="field">
        <span>Level</span>
        <select
          value={level}
          onChange={(e) => {
            setLevel(e.target.value as typeof level)
            setI(0)
            setSolved([])
            setAttempts(0)
            setChecked(false)
            setGuess('')
            setMsg('')
          }}
        >
          <option value="easy">Easy — AND/OR/NOT</option>
          <option value="medium">Medium — NAND/NOR</option>
          <option value="hard">Hard — XOR/XNOR mix</option>
        </select>
      </label>
      <p>
        Gate <strong>{q.gate}</strong> · A={bit(q.a)}
        {q.gate !== 'NOT' ? ` · B=${bit(q.b)}` : ''}
      </p>
      <p>
        Case {i + 1}/{pool.length} · solved {solved.length}/{pool.length} · attempts {attempts}
      </p>
      <label className="field">
        <span>Predicted output</span>
        <input value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="0 or 1" aria-label="Output guess" disabled={checked} />
      </label>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        <button className="btn" type="button" onClick={check} disabled={checked || !['0', '1'].includes(guess)}>
          Check
        </button>
        <button className="btn secondary" type="button" onClick={() => setMsg(hintGate(q.gate))}>
          Hint
        </button>
        <button
          className="btn secondary"
          type="button"
          disabled={!checked || i === pool.length - 1}
          onClick={() => {
            setI((x) => x + 1)
            setGuess('')
            setMsg('')
            setChecked(false)
          }}
        >
          Next
        </button>
      </div>
      <p aria-live="polite">{msg}</p>
      {solved.length === pool.length && (
        <section className="card" aria-live="polite">
          <h2>Truth table complete</h2>
          <p>Every distinct case passed in {attempts} attempts. Nice work checking the whole gate set.</p>
          <Award
            k={`game:dungeon:${level}`}
            amount={level === 'hard' ? XP.gameHard : level === 'medium' ? XP.gameMedium : XP.gameEasy}
            ready
          />
        </section>
      )}
    </GameFrame>
  )
}

function buildDungeon(level: 'easy' | 'medium' | 'hard') {
  const gates: GateName[] =
    level === 'easy' ? ['AND', 'OR', 'NOT'] : level === 'medium' ? ['NAND', 'NOR', 'AND'] : ['XOR', 'XNOR', 'NAND']
  const qs = []
  for (const g of gates) {
    for (const a of [false, true]) {
      if (g === 'NOT') {
        qs.push({ gate: g, a, b: false, y: evalGate('NOT', a) })
        continue
      }
      for (const b of [false, true]) qs.push({ gate: g, a, b, y: evalGate(g, a, b) })
    }
  }
  return qs
}

function hintGate(g: GateName) {
  const map: Record<GateName, string> = {
    AND: 'AND is 1 only when every input is 1.',
    OR: 'OR is 0 only when every input is 0.',
    NOT: 'NOT flips a single bit.',
    NAND: 'NAND is AND, then flip.',
    NOR: 'NOR is OR, then flip.',
    XOR: 'XOR is 1 when the bits disagree.',
    XNOR: 'XNOR is 1 when the bits match.',
  }
  return map[g]
}

const PREDICT_SET = [
  { gate: 'XOR' as GateName, a: true, b: true },
  { gate: 'AND' as GateName, a: true, b: false },
  { gate: 'NOR' as GateName, a: false, b: false },
  { gate: 'NAND' as GateName, a: true, b: true },
]

function Predict() {
  const [i, setI] = useState(0)
  const [locked, setLocked] = useState<string | null>(null)
  const [reveal, setReveal] = useState(false)
  const [hits, setHits] = useState(0)
  const q = PREDICT_SET[i]
  const y = q.gate === 'NOT' ? evalGate('NOT', q.a) : evalGate(q.gate, q.a, q.b)
  const ok = locked === bit(y)
  return (
    <GameFrame
      title="Predict & Play"
      onReset={() => {
        setI(0)
        setLocked(null)
        setReveal(false)
        setHits(0)
      }}
    >
      <p>
        Case {i + 1}/{PREDICT_SET.length}: lock Y for {q.gate} with A={bit(q.a)}
        {q.gate !== 'NOT' ? ` · B=${bit(q.b)}` : ''} before the result is shown.
      </p>
      {['0', '1'].map((b) => (
        <button key={b} className={`btn ${locked === b ? '' : 'secondary'}`} type="button" disabled={reveal} onClick={() => setLocked(b)}>
          Predict {b}
        </button>
      ))}
      <p>
        <button className="btn" type="button" disabled={!locked || reveal} onClick={() => {
          setReveal(true)
          if (locked === bit(y)) setHits((h) => h + 1)
        }}>
          Reveal result
        </button>
      </p>
      {reveal && locked && (
        <p>
          Actual Y={bit(y)}. {ok ? 'You called it.' : `Not quite — ${q.gate} of those inputs is ${bit(y)}.`}
        </p>
      )}
      {reveal && i < PREDICT_SET.length - 1 && (
        <button
          className="btn secondary"
          type="button"
          onClick={() => {
            setI((n) => n + 1)
            setLocked(null)
            setReveal(false)
          }}
        >
          Next prediction
        </button>
      )}
      {reveal && i === PREDICT_SET.length - 1 && (
        <>
          <p>
            Score {hits}/{PREDICT_SET.length} locked correctly. XP only if every prediction matched.
          </p>
          <Award k="game:predict" amount={XP.gameEasy} ready={hits === PREDICT_SET.length} />
        </>
      )}
    </GameFrame>
  )
}

function Fault() {
  const [choice, setChoice] = useState('')
  const [hints, setHints] = useState(0)
  const hintsList = [
    'The designer wanted AND behaviour.',
    'Observed 10 → lamp 1, which AND would never do.',
    'The fitted part is OR.',
  ]
  const ok = choice.toUpperCase() === 'OR'
  return (
    <GameFrame title="Fault Hunter / ECHO" onReset={() => { setChoice(''); setHints(0) }}>
      <p>
        Intended: lamp on only if Enable and Ready are both 1. Observed: lamp on if either is 1. Diagnose the wrong
        gate before asking for more hint.
      </p>
      <input value={choice} onChange={(e) => setChoice(e.target.value)} placeholder="AND, OR, XOR…" />
      <p>
        {ok ? 'That’s the fault — OR was fitted instead of AND. Expected AND table 0001, actual 0111.' : choice ? 'Keep going. Compare 10.' : ''}
      </p>
      <button className="btn secondary" type="button" onClick={() => setHints((h) => Math.min(3, h + 1))}>
        Progressive hint
      </button>
      <ul>
        {hintsList.slice(0, hints).map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      {ok && <Award k="game:fault" amount={XP.gameMedium} ready />}
    </GameFrame>
  )
}

function Rush() {
  const [t, setT] = useState(45)
  const [running, setRunning] = useState(false)
  const [n, setN] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [guess, setGuess] = useState('')
  const q = useMemo(() => {
    const g: GateName = GATES[n % GATES.length]
    const a = n % 2 === 0
    const b = n % 3 === 0
    return { g, a, b, y: g === 'NOT' ? evalGate('NOT', a) : evalGate(g, a, b) }
  }, [n])
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setT((x) => {
        if (x <= 1) {
          setRunning(false)
          return 0
        }
        return x - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running])
  return (
    <GameFrame
      title="Circuit Rush"
      onReset={() => {
        setT(45)
        setRunning(false)
        setN(0)
        setCorrect(0)
        setGuess('')
      }}
    >
      <p>
        Timer {t}s · correct {correct} · score {correct * 10}
      </p>
      <p>
        {q.g} A={bit(q.a)} {q.g !== 'NOT' && `B=${bit(q.b)}`}
      </p>
      {!running && t === 45 && (
        <button className="btn" type="button" onClick={() => setRunning(true)}>
          Start
        </button>
      )}
      {running && t > 0 && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!['0', '1'].includes(guess)) return
              if (guess === bit(q.y)) setCorrect((c) => c + 1)
              setN((x) => x + 1)
              setGuess('')
            }}
          >
            <input value={guess} onChange={(e) => setGuess(e.target.value)} aria-label="rush answer" placeholder="0 or 1" />
            <button className="btn" type="submit">
              Submit
            </button>
          </form>
          <button className="btn secondary" type="button" onClick={() => setRunning(false)}>
            Pause
          </button>
        </>
      )}
      {!running && t > 0 && t < 45 && (
        <button className="btn" type="button" onClick={() => setRunning(true)}>
          Resume
        </button>
      )}
      {t === 0 && (
        <>
          <p>Time. Score is verified correct answers × 10 ({correct * 10}). Need 5 correct for XP.</p>
          <Award k="game:rush" amount={XP.gameHard} ready={correct >= 5} />
        </>
      )}
    </GameFrame>
  )
}

function Jumble() {
  const correct = ['Battery', 'Switch', 'Resistor', 'LED']
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null])
  const [hand, setHand] = useState(['LED', 'Battery', 'Resistor', 'Switch'])
  const filled = slots.every(Boolean)
  const ok = filled && slots.join() === correct.join()
  return (
    <GameFrame
      title="Jumble Circuits"
      onReset={() => {
        setSlots([null, null, null, null])
        setHand(['LED', 'Battery', 'Resistor', 'Switch'])
      }}
    >
      <p>A simple series lamp: energy source, then control, then current limit, then lamp. Click a part, then a slot.</p>
      <p className="tiny">Conceptual order only — not a wiring simulator and not a safety check.</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {hand.map((h) => (
          <button
            key={h}
            className="btn secondary"
            type="button"
            onClick={() => {
              const i = slots.findIndex((s) => !s)
              if (i < 0) return
              const next = [...slots]
              next[i] = h
              setSlots(next)
              setHand(hand.filter((x) => x !== h))
            }}
          >
            {h}
          </button>
        ))}
      </div>
      <div className="grid cols-4" style={{ marginTop: 12 }}>
        {slots.map((s, i) => (
          <button
            className="card"
            type="button"
            key={i}
            onClick={() => {
              if (!s) return
              const next = [...slots]
              next[i] = null
              setSlots(next)
              setHand([...hand, s])
            }}
          >
            Slot {i + 1}: {s ?? 'empty'} {s ? '(click to return)' : ''}
          </button>
        ))}
      </div>
      {ok && <p>That order will at least tell a story a lab partner understands.</p>}
      {filled && !ok && <p>Not quite — battery should lead. Reset and try again.</p>}
      {ok && <Award k="game:jumble" amount={XP.gameEasy} ready />}
    </GameFrame>
  )
}

function Match() {
  const pairs = [
    { id: 'and', name: 'AND', def: '1 only if every input is 1' },
    { id: 'xor', name: 'XOR', def: '1 if inputs disagree' },
    { id: 'not', name: 'NOT', def: 'Flips a single bit' },
  ]
  const [sel, setSel] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const defs = [...pairs].sort((a, b) => a.def.localeCompare(b.def))
  return (
    <GameFrame title="Component Match" onReset={() => { setSel(null); setMatched([]) }}>
      <p>Select a name, then its behaviour.</p>
      <div className="grid cols-2">
        <div>
          {pairs.map((p) => (
            <button
              key={p.id}
              className={`btn ${sel === p.id ? '' : 'secondary'}`}
              type="button"
              disabled={matched.includes(p.id)}
              onClick={() => setSel(p.id)}
              style={{ display: 'block', marginBottom: 8, width: '100%' }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div>
          {defs.map((p) => (
            <button
              key={p.def}
              className="btn secondary"
              type="button"
              disabled={matched.includes(p.id)}
              style={{ display: 'block', marginBottom: 8, width: '100%' }}
              onClick={() => {
                if (sel === p.id) setMatched((m) => [...m, p.id])
                setSel(null)
              }}
            >
              {p.def}
            </button>
          ))}
        </div>
      </div>
      {matched.length === 3 && <Award k="game:match" amount={XP.gameEasy} ready />}
    </GameFrame>
  )
}

function Boss() {
  const y = evalGate('NOT', evalGate('AND', true, true))
  const [g, setG] = useState('')
  const ok = g === bit(y)
  return (
    <GameFrame title="Boss Puzzle" onReset={() => setG('')}>
      <p>A and B (both 1) enter AND, then NOT. Lock Y.</p>
      <input value={g} onChange={(e) => setG(e.target.value)} />
      <p>{g && (ok ? 'Boss down. NAND in two pieces.' : `Expected ${bit(y)}.`)}</p>
      {ok && <Award k="game:boss" amount={XP.gameHard} ready />}
    </GameFrame>
  )
}

function CreatorPuzzle() {
  const { state } = useDemo()
  const [title, setTitle] = useState('')
  const [gate, setGate] = useState<GateName>('AND')
  const [bits, setBits] = useState('')
  const [msg, setMsg] = useState('')
  if (!state.creatorEnabled) {
    return (
      <p>
        Creator capability is off. Enable the demo toggle in the sidebar — it is not production authorization.
      </p>
    )
  }
  const expected = GATES.includes(gate)
    ? gate === 'NOT'
      ? [evalGate('NOT', false), evalGate('NOT', true)].map(bit).join('')
      : [false, true]
          .flatMap((a) => [false, true].map((b) => bit(evalGate(gate, a, b))))
          .join('')
    : ''
  return (
    <GameFrame title="Student Challenge Creator" onReset={() => { setTitle(''); setBits(''); setMsg('') }}>
      <p className="tag amber">Publishing is simulated. Puzzles must match a real truth table before “publish”.</p>
      <label className="field">
        <span>Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="field">
        <span>Gate</span>
        <select value={gate} onChange={(e) => setGate(e.target.value as GateName)}>
          {GATES.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Expected outputs in table order ({gate === 'NOT' ? '2 bits' : '4 bits'})</span>
        <input value={bits} onChange={(e) => setBits(e.target.value)} />
      </label>
      <button
        className="btn"
        type="button"
        onClick={() => {
          if (title.trim().length < 4) return setMsg('Give it a real title.')
          if (bits.replace(/\s/g, '') !== expected) return setMsg(`Table does not match ${gate}. Engine expects ${expected}.`)
          setMsg(`Validated locally. Demo publish id ${uid('puz')} — not sent to a server.`)
        }}
      >
        Validate & demo publish
      </button>
      <p>{msg}</p>
    </GameFrame>
  )
}

function GameFrame({ title, children, onReset }: { title: string; children: ReactNode; onReset: () => void }) {
  const nav = useNavigate()
  return (
    <div>
      <Link to="/app/games">← Lobby</Link>
      <h1>{title}</h1>
      {children}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn secondary" type="button" onClick={onReset}>
          Reset
        </button>
        <button className="btn ghost" type="button" onClick={() => nav('/app/games')}>
          Exit
        </button>
      </div>
    </div>
  )
}
