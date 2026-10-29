import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CHALLENGES, expectedChallenge, normalizeAnswer } from '../data/catalog'
import { useDemo } from '../state/DemoProvider'

export function ChallengeList() {
  const { state } = useDemo()
  const [q, setQ] = useState('')
  const [d, setD] = useState('all')
  const rows = useMemo(
    () =>
      CHALLENGES.filter((c) => {
        if (d !== 'all' && c.difficulty !== d) return false
        const hay = `${c.title} ${c.statement}`.toLowerCase()
        return !q || hay.includes(q.toLowerCase())
      }),
    [q, d],
  )
  return (
    <div>
      <h1>Engineering Challenge Arena</h1>
      <p>Structured problems with deterministic tests. Separate from timed games.</p>
      <div className="grid cols-2">
        <label className="field">
          <span>Search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="field">
          <span>Difficulty</span>
          <select value={d} onChange={(e) => setD(e.target.value)}>
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>
      <div className="grid">
        {rows.map((c) => (
          <article className="card" key={c.id}>
            <span className="tag">{c.difficulty}</span> <span className="tag">{c.type}</span>
            {state.completions[`ch:${c.id}`] && <span className="tag ok">Passed</span>}
            <h3>
              <Link to={`/app/challenges/${c.id}`}>{c.title}</Link>
            </h3>
            <p>{c.statement}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export function ChallengeDetail() {
  const { id } = useParams()
  const c = CHALLENGES.find((x) => x.id === id)
  const { awardOnce, state } = useDemo()
  const [ans, setAns] = useState('')
  const [hint, setHint] = useState(0)
  const [attempts, setAttempts] = useState<{ at: string; value: string; ok: boolean }[]>([])
  if (!c) return <p>Challenge not in this demo bank.</p>
  const expect = expectedChallenge(c.id)
  const passed = Boolean(state.completions[`ch:${c.id}`])

  const submit = () => {
    const value = normalizeAnswer(c.id, ans)
    const ok = value === expect
    setAttempts((a) => [...a, { at: new Date().toLocaleTimeString(), value, ok }])
    if (ok) awardOnce(`ch:${c.id}`, c.xp)
  }

  return (
    <div>
      <Link to="/app/challenges">← Bank</Link>
      <h1>{c.title}</h1>
      <p>
        {c.world} · {c.difficulty} · {c.xp} XP if all checks pass (once)
      </p>
      <div className="grid cols-2">
        <article className="card">
          <h3>Problem</h3>
          <p>{c.statement}</p>
          <p className="tiny">{c.inputsNote}</p>
          <h4>Constraints</h4>
          <ul>
            {c.constraints.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h4>Examples</h4>
          <ul>
            {c.examples.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Submit</h3>
          <label className="field">
            <span>Your answer</span>
            <input value={ans} onChange={(e) => setAns(e.target.value)} />
          </label>
          <button className="btn" type="button" onClick={submit} disabled={passed}>
            {passed ? 'Already passed' : 'Run tests'}
          </button>
          {attempts[0] && (
            <p>
              Last: expected <span className="mono">{expect}</span> · actual{' '}
              <span className="mono">{attempts.at(-1)?.value}</span> ·{' '}
              {attempts.at(-1)?.ok ? 'Pass — your output matches all test cases.' : 'Fail — compare expected vs actual.'}
            </p>
          )}
          <button className="btn secondary" type="button" onClick={() => setHint((h) => Math.min(c.hints.length, h + 1))}>
            Next hint
          </button>
          <ol>
            {c.hints.slice(0, hint).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ol>
          <h4>Attempt history</h4>
          <ul>
            {attempts.map((a, i) => (
              <li key={i}>
                {a.at} · {a.value} · {a.ok ? 'pass' : 'fail'}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  )
}
