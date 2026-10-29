import { useMemo, useState } from 'react'
import { GROUP_TOPICS } from '../data/catalog'
import { uid } from '../lib/id'
import { useDemo } from '../state/DemoProvider'
import type { ProjectPost } from '../types'

export function Community() {
  const { state, addQuestion, addAnswer, vote, acceptAnswer, reportQuestion, saveProject, patch } = useDemo()
  const [tab, setTab] = useState<'doubts' | 'projects' | 'groups'>('doubts')
  const [filter, setFilter] = useState('newest')
  const [q, setQ] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [subject, setSubject] = useState('Digital Logic')

  const questions = useMemo(() => {
    let rows = state.questions.filter((item) => {
      if (item.status === 'rejected') return false
      const hay = `${item.title} ${item.body}`.toLowerCase()
      return !q || hay.includes(q.toLowerCase())
    })
    if (filter === 'unanswered') rows = rows.filter((item) => item.answers.length === 0)
    if (filter === 'helpful') rows = [...rows].sort((a, b) => b.helpful - a.helpful)
    else rows = [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return rows
  }, [state.questions, q, filter])

  const projects = state.projects.filter((p) => !p.draft || p.author === state.displayName)

  return (
    <div>
      <h1>Student community</h1>
      <div className="flow">
        <button className={`btn ${tab === 'doubts' ? '' : 'secondary'}`} type="button" onClick={() => setTab('doubts')}>
          Doubt Exchange
        </button>
        <button className={`btn ${tab === 'projects' ? '' : 'secondary'}`} type="button" onClick={() => setTab('projects')}>
          Project library
        </button>
        <button className={`btn ${tab === 'groups' ? '' : 'secondary'}`} type="button" onClick={() => setTab('groups')}>
          Groups & partners
        </button>
      </div>

      {tab === 'doubts' && (
        <>
          <div className="grid cols-2">
            <label className="field">
              <span>Search</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <label className="field">
              <span>Filter</span>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="unanswered">Unanswered</option>
                <option value="helpful">Most helpful</option>
              </select>
            </label>
          </div>
          <form
            className="card"
            onSubmit={(e) => {
              e.preventDefault()
              if (title.trim().length < 8) return
              addQuestion({
                title,
                subject,
                unit: 'Unit 1',
                body,
                author: state.displayName || 'You',
              })
              setTitle('')
              setBody('')
            }}
          >
            <h3>Ask the floor</h3>
            <p className="tiny">Attachments are disabled — no upload service.</p>
            <label className="field">
              <span>Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label className="field">
              <span>Subject</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </label>
            <label className="field">
              <span>Description</span>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
            </label>
            <button className="btn" type="submit">
              Post question (demo)
            </button>
          </form>
          {questions.map((item) => (
            <article className="card" key={item.id} style={{ marginTop: 12 }}>
              {item.status === 'pending' && <span className="tag amber">Pending review</span>}
              <h3>{item.title}</h3>
              <p>
                {item.author} · {item.subject} · {item.createdAt}
              </p>
              <p>{item.body}</p>
              <button className="btn ghost" type="button" disabled={Boolean(state.voted[item.id])} onClick={() => vote(item.id)}>
                Helpful ({item.helpful})
              </button>
              <button className="btn ghost" type="button" onClick={() => reportQuestion(item.id)}>
                Report
              </button>
              {item.answers.map((a) => (
                <div key={a.id} style={{ paddingLeft: 12, borderLeft: '3px solid #dfe3ec', margin: '8px 0' }}>
                  <strong>{a.author}</strong>
                  {item.acceptedId === a.id && <span className="tag ok">Accepted</span>}
                  <p>{a.body}</p>
                  <button className="btn ghost" type="button" disabled={Boolean(state.voted[a.id])} onClick={() => vote(a.id)}>
                    Helpful ({a.helpful})
                  </button>
                  {item.author === state.displayName && (
                    <button className="btn ghost" type="button" onClick={() => acceptAnswer(item.id, a.id)}>
                      Accept
                    </button>
                  )}
                </div>
              ))}
              <AnswerBox onSend={(text) => addAnswer(item.id, text)} />
            </article>
          ))}
        </>
      )}

      {tab === 'projects' && (
        <Projects
          projects={projects}
          me={state.displayName}
          creator={state.creatorEnabled}
          onSave={saveProject}
        />
      )}

      {tab === 'groups' && (
        <div className="grid cols-2">
          {GROUP_TOPICS.map((g) => (
            <article className="card" key={g.id}>
              <h3>{g.name}</h3>
              <p>{g.goal}</p>
              <p className="tiny">{g.members} members (sample count)</p>
              <button
                className="btn secondary"
                type="button"
                onClick={() => patch({ groupRequests: [...new Set([...state.groupRequests, g.id])] })}
              >
                {state.groupRequests.includes(g.id) ? 'Request sent (demo)' : 'Request to join'}
              </button>
            </article>
          ))}
          <article className="card">
            <h3>Learning partner</h3>
            <p>Share a topic of interest. We never show phone numbers or private email here.</p>
            <input
              value={state.partnerInterest}
              onChange={(e) => patch({ partnerInterest: e.target.value })}
              placeholder="e.g. Sunday XOR drills"
            />
            {state.partnerInterest && <p className="tiny">Interest noted locally: {state.partnerInterest}</p>}
          </article>
        </div>
      )}
    </div>
  )
}

function AnswerBox({ onSend }: { onSend: (t: string) => void }) {
  const [t, setT] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!t.trim()) return
        onSend(t)
        setT('')
      }}
    >
      <label className="sr-only" htmlFor="ans">
        Answer
      </label>
      <input id="ans" value={t} onChange={(e) => setT(e.target.value)} placeholder="Peer answer" />
      <button className="btn secondary" type="submit">
        Reply
      </button>
    </form>
  )
}

function Projects({
  projects,
  me,
  creator,
  onSave,
}: {
  projects: ProjectPost[]
  me: string
  creator: boolean
  onSave: (p: ProjectPost) => void
}) {
  const [form, setForm] = useState({
    title: '',
    topic: 'Digital Logic',
    description: '',
    approach: '',
    mistakes: '',
    improvements: '',
  })
  return (
    <div>
      {!creator && <p className="tiny">Creating projects needs the demo Creator toggle.</p>}
      {creator && (
        <form
          className="card"
          onSubmit={(e) => {
            e.preventDefault()
            onSave({
              id: uid('proj'),
              title: form.title,
              author: me,
              topic: form.topic,
              difficulty: 'easy',
              description: form.description,
              components: ['Demo only'],
              skills: ['Documentation'],
              approach: form.approach,
              mistakes: form.mistakes,
              improvements: form.improvements,
              demoLabel: 'No live hardware link',
              draft: false,
              status: 'pending',
            })
            setForm({ title: '', topic: 'Digital Logic', description: '', approach: '', mistakes: '', improvements: '' })
          }}
        >
          <h3>Share a project</h3>
          <p className="tiny">Goes to pending review in demo memory.</p>
          {(['title', 'topic', 'description', 'approach', 'mistakes', 'improvements'] as const).map((k) => (
            <label className="field" key={k}>
              <span>{k}</span>
              <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required />
            </label>
          ))}
          <button className="btn" type="submit">
            Submit for review
          </button>
        </form>
      )}
      <div className="grid cols-2" style={{ marginTop: 12 }}>
        {projects.map((p) => (
          <article className="card" key={p.id}>
            <span className="tag">{p.status}</span>
            <h3>{p.title}</h3>
            <p>
              {p.author} · {p.topic} · {p.difficulty}
            </p>
            <p>{p.description}</p>
            <p className="tiny">Skills: {p.skills.join(', ')}</p>
            <p className="tiny">{p.demoLabel}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
