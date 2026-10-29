import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TUTORIALS } from '../data/catalog'
import { XP } from '../lib/xp'
import { useDemo } from '../state/DemoProvider'

export function Hub() {
  const { state, toggleBookmark } = useDemo()
  const [q, setQ] = useState('')
  const [subject, setSubject] = useState('all')
  const [diff, setDiff] = useState('all')
  const [type, setType] = useState('all')
  const [sort, setSort] = useState('title')
  const [unit, setUnit] = useState('all')
  const [mode, setMode] = useState<'browse' | 'exam'>('browse')

  const subjects = [...new Set(TUTORIALS.map((t) => t.subject))]
  const units = [...new Set(TUTORIALS.map((t) => t.unit))]
  const filtersActive = Boolean(q || subject !== 'all' || diff !== 'all' || type !== 'all' || unit !== 'all')
  const list = useMemo(() => {
    let rows = TUTORIALS.filter((t) => {
      const hay = [t.title, t.topic, t.creator, t.subject, t.unit, t.type, t.difficulty, ...t.objectives, ...t.prerequisites, t.body]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (q && !hay.includes(q.toLowerCase())) return false
      if (subject !== 'all' && t.subject !== subject) return false
      if (unit !== 'all' && t.unit !== unit) return false
      if (diff !== 'all' && t.difficulty !== diff) return false
      if (type !== 'all' && t.type !== type) return false
      return true
    })
    rows = [...rows].sort((a, b) => (sort === 'time' ? a.minutes - b.minutes : a.title.localeCompare(b.title)))
    return rows
  }, [q, subject, unit, diff, type, sort])

  return (
    <div>
      <h1>Student Learning Hub</h1>
      <p>Sample peer-style learning resources. Video playback, file upload, and publishing are not connected.</p>
      <div className="flow" role="tablist" aria-label="Hub mode">
        <button className={`btn ${mode === 'browse' ? '' : 'secondary'}`} type="button" onClick={() => setMode('browse')}>
          Browse library
        </button>
        <button className={`btn ${mode === 'exam' ? '' : 'secondary'}`} type="button" onClick={() => setMode('exam')}>
          Exam Survival
        </button>
      </div>
      {mode === 'exam' && <ExamSurvival />}
      <div className="grid cols-4">
        <label className="field">
          <span>Search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="gates, threshold, XOR…" />
        </label>
        <label className="field">
          <span>Subject</span>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="all">All</option>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Unit</span>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="all">All</option>
            {units.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Difficulty</span>
          <select value={diff} onChange={(e) => setDiff(e.target.value)}>
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label className="field">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="title">Title</option>
            <option value="time">Shortest</option>
          </select>
        </label>
      </div>
      <label className="field" style={{ maxWidth: 220 }}>
        <span>Type</span>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All</option>
          <option value="notes">Notes</option>
          <option value="diagram">Diagram</option>
          <option value="code">Code</option>
          <option value="demo">Demo</option>
        </select>
      </label>
      <p aria-live="polite" className="tiny">
        {list.length} {list.length === 1 ? 'resource' : 'resources'} · demo library
        {filtersActive && (
          <button
            className="btn ghost"
            type="button"
            style={{ marginLeft: 8 }}
            onClick={() => {
              setQ('')
              setSubject('all')
              setDiff('all')
              setType('all')
              setUnit('all')
            }}
          >
            Clear filters
          </button>
        )}
      </p>
      {list.length === 0 ? (
        <div className="card">
          <h2>No matching resources</h2>
          <p>Try a broader topic or clear the filters to see the full library.</p>
        </div>
      ) : (
        <div className="grid cols-2">
          {list.map((t) => (
            <article className="card" key={t.id}>
              <span className="tag">{t.difficulty}</span> <span className="tag">{t.type}</span>
              {state.completions[`tut:${t.id}`] && <span className="tag ok">Completed</span>}
              <h3>
                <Link to={`/app/hub/${t.id}`}>{t.title}</Link>
              </h3>
              <p>
                {t.creator} · {t.subject} · {t.minutes} min
              </p>
              <button className="btn ghost" type="button" onClick={() => toggleBookmark(t.id)}>
                {state.bookmarks.includes(t.id) ? 'Bookmarked' : 'Bookmark'}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export function TutorialDetail() {
  const { id } = useParams()
  const t = TUTORIALS.find((x) => x.id === id)
  const { state, awardOnce, toggleBookmark } = useDemo()
  const [q, setQ] = useState('')
  const [reply, setReply] = useState('')
  const [quiz, setQuiz] = useState('')
  const [quizMsg, setQuizMsg] = useState('')
  const [quizPassed, setQuizPassed] = useState(false)
  const [helpful, setHelpful] = useState<'yes' | 'no' | ''>('')
  const nav = useNavigate()
  if (!t) return <p>That tutorial is not in the demo library.</p>
  const done = Boolean(state.completions[`tut:${t.id}`])

  return (
    <article>
      <Link to="/app/hub">← Hub</Link>
      <p><span className="tag amber">Demo resource</span> {done && <span className="tag ok">Completed</span>}</p>
      <p className="kicker">{t.unit}</p>
      <h1>{t.title}</h1>
      <p>{t.creator} · {t.subject} · {t.difficulty} · {t.minutes} min</p>
      <ul>
        {t.objectives.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <p className="tiny">Prerequisites: {t.prerequisites.join(', ') || 'None'}</p>
      {t.body.split('\n\n').map((p) => (
        <p key={p.slice(0, 24)}>{p}</p>
      ))}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          className="btn"
          type="button"
          disabled={done || !quizPassed}
          onClick={() => {
            awardOnce(`tut:${t.id}`, XP.tutorial)
          }}
        >
          {done
            ? 'Completed · XP already counted'
            : quizPassed
              ? `Mark complete · +${XP.tutorial} demo XP once`
              : 'Pass the mini-check below to complete'}
        </button>
        <button className="btn secondary" type="button" onClick={() => toggleBookmark(t.id)}>
          {state.bookmarks.includes(t.id) ? 'Bookmarked' : 'Bookmark'}
        </button>
        {t.relatedChallengeId && (
          <Link className="btn secondary" to={`/app/challenges/${t.relatedChallengeId}`}>
            Related challenge
          </Link>
        )}
      </div>
      <section className="card" style={{ marginTop: 18 }}>
        <h2>Ask this tutorial (scripted demo)</h2>
        <p className="tiny">Not a live model. Answers are templates from keywords in your question.</p>
        <label className="field">
          <span>Your question</span>
          <textarea value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <button
          className="btn secondary"
          type="button"
          onClick={() => setReply(tutorialAi(q, t.title))}
        >
          Ask
        </button>
        {reply && <p className="bubble ai">{reply}</p>}
      </section>
      <section className="card" style={{ marginTop: 12 }}>
        <h2>Tutorial Remix Lab</h2>
        <p>1) You read the note. 2) Mini-check: AND of 1 and 0 is?</p>
        <input
          value={quiz}
          onChange={(e) => {
            setQuiz(e.target.value)
            setQuizPassed(false)
          }}
          placeholder="0 or 1"
        />
        <button
          className="btn"
          type="button"
          style={{ marginLeft: 8 }}
          onClick={() => {
            if (quiz.trim() === '0') {
              setQuizPassed(true)
              setQuizMsg('Nice work — AND needs both 1s.')
              awardOnce(`remix:${t.id}`, XP.remix)
            } else {
              setQuizPassed(false)
              setQuizMsg('Not quite yet. AND is picky — one 0 keeps Y at 0.')
            }
          }}
        >
          Check
        </button>
        <p>{quizMsg}</p>
        <p>Ask the creator is not wired to email. Leave a Hub question in Community instead.</p>
        <p>Was this tutorial helpful?</p>
        <button className="btn secondary" type="button" onClick={() => setHelpful('yes')}>
          Yes
        </button>
        <button className="btn secondary" type="button" onClick={() => setHelpful('no')}>
          Needs work
        </button>
        {helpful && <p className="tiny">Feedback stored only in this session UI ({helpful}).</p>}
        <p>
          <button className="btn ghost" type="button" onClick={() => nav('/app/games/predict')}>
            Practise Predict & Play
          </button>
        </p>
      </section>
    </article>
  )
}

function ExamSurvival() {
  const { state } = useDemo()
  const [card, setCard] = useState(0)
  const [show, setShow] = useState(false)
  const cards = TUTORIALS.flatMap((t) => t.objectives.map((o) => ({ id: `${t.id}:${o}`, front: t.title, back: o, unit: t.unit })))
  const current = cards[card]
  const doneCount = TUTORIALS.filter((t) => state.completions[`tut:${t.id}`]).length
  return (
    <section className="card" style={{ marginBottom: 16 }}>
      <h2>Exam Survival Mode</h2>
      <p>
        Checklist of demo notes for internals. Flashcards are objectives pulled from the library — not a live quiz bank.
      </p>
      <ul>
        {TUTORIALS.map((t) => (
          <li key={t.id}>
            {state.completions[`tut:${t.id}`] ? 'Done' : 'Open'} · <Link to={`/app/hub/${t.id}`}>{t.title}</Link> · {t.unit}
          </li>
        ))}
      </ul>
      <p className="tiny">
        {doneCount}/{TUTORIALS.length} tutorials marked complete in this browser.
      </p>
      {current && (
        <div className="card">
          <p className="kicker">{current.unit}</p>
          <h3>{show ? current.back : current.front}</h3>
          <button className="btn secondary" type="button" onClick={() => setShow((s) => !s)}>
            {show ? 'Hide objective' : 'Show objective'}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setShow(false)
              setCard((c) => (c + 1) % cards.length)
            }}
          >
            Next card
          </button>
        </div>
      )}
    </section>
  )
}

function tutorialAi(q: string, title: string) {
  const s = q.toLowerCase()
  if (!s.trim()) return 'Ask something specific — for example, “when is AND 1?”'
  if (s.includes('and')) return `Demo AI: In “${title}”, AND is 1 only if every input is 1. Verify with a 4-row table.`
  if (s.includes('xor')) return 'Demo AI: XOR lights when inputs disagree. Both 1 is 0. Double-check OR vs XOR.'
  if (s.includes('threshold') || s.includes('light'))
    return 'Demo AI: A streetlight is compare-to-threshold, not a personality. Wrong number → wrong lamp. Run all tests.'
  return `Demo AI: I only have a tiny keyword script. Re-read “${title}”, then try a challenge. Verify anything safety-critical yourself.`
}
