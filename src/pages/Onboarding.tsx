import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CHALLENGES, GOALS, INTERESTS, TUTORIALS } from '../data/catalog'
import { useDemo } from '../state/DemoProvider'
import type { Experience } from '../types'

export function Onboarding() {
  const { state, completeOnboarding } = useDemo()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [interests, setInterests] = useState<string[]>(state.interests)
  const [goals, setGoals] = useState<string[]>(state.goals)
  const [experience, setExperience] = useState<Experience | ''>(state.experience)
  const [err, setErr] = useState('')

  if (!state.session) return <Navigate to="/demo/sign-in" replace />
  if (state.onboardingDone) return <Navigate to="/app" replace />

  const toggle = (list: string[], set: (v: string[]) => void, item: string) => {
    set(list.includes(item) ? list.filter((x) => x !== item) : [...list, item])
  }

  const recTutorials = TUTORIALS.filter((t) => !interests.length || interests.includes(t.subject) || t.subject === 'Digital Logic').slice(0, 3)
  const recCh = CHALLENGES.slice(0, 2)

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <p className="tag amber">Onboarding is simulated and resettable</p>
      <div className="progress" style={{ margin: '12px 0 18px' }}>
        <span style={{ width: `${((step + 1) / 6) * 100}%` }} />
      </div>
      {step === 0 && (
        <>
          <h1>Welcome, {state.displayName}.</h1>
          <p>We’ll set a light profile so recommendations are not random. You can edit this later from Progress.</p>
        </>
      )}
      {step === 1 && (
        <>
          <h1>What are you curious about?</h1>
          <Picker items={INTERESTS} selected={interests} onToggle={(i) => toggle(interests, setInterests, i)} />
        </>
      )}
      {step === 2 && (
        <>
          <h1>What should this season of study do for you?</h1>
          <Picker items={GOALS} selected={goals} onToggle={(i) => toggle(goals, setGoals, i)} />
        </>
      )}
      {step === 3 && (
        <>
          <h1>How do you currently feel in digital logic?</h1>
          {(['beginner', 'intermediate', 'advanced'] as const).map((ex) => (
            <button
              key={ex}
              type="button"
              className={`btn ${experience === ex ? '' : 'secondary'}`}
              style={{ margin: 6 }}
              onClick={() => setExperience(ex)}
            >
              {ex}
            </button>
          ))}
        </>
      )}
      {step === 4 && (
        <>
          <h1>A starting map — not a contract</h1>
          <p>Based on your ticks, these are ready in the demo:</p>
          <ul>
            {recTutorials.map((t) => (
              <li key={t.id}>{t.title}</li>
            ))}
            {recCh.map((c) => (
              <li key={c.id}>{c.title} (challenge)</li>
            ))}
            <li>Smart Streetlight mission</li>
          </ul>
        </>
      )}
      {step === 5 && (
        <>
          <h1>Desk is set.</h1>
          <p>Start with Logic Rookie, or skip around — locked worlds stay honest about “coming soon”.</p>
        </>
      )}
      {err && <p className="err">{err}</p>}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {step > 0 && (
          <button className="btn secondary" type="button" onClick={() => { setErr(''); setStep((s) => s - 1) }}>
            Back
          </button>
        )}
        {step < 5 ? (
          <button
            className="btn"
            type="button"
            onClick={() => {
              if (step === 1 && !interests.length) return setErr('Pick at least one interest — it only steers suggestions.')
              if (step === 2 && !goals.length) return setErr('Pick a goal so the home desk knows what to offer first.')
              if (step === 3 && !experience) return setErr('Choose a starting level. You can change it later.')
              setErr('')
              setStep((s) => s + 1)
            }}
          >
            Next
          </button>
        ) : (
          <button
            className="btn"
            type="button"
            onClick={() => {
              completeOnboarding({ interests, goals, experience: experience || 'beginner' })
              nav('/app')
            }}
          >
            Start learning
          </button>
        )}
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            completeOnboarding({
              interests: interests.length ? interests : ['Digital Logic'],
              goals: goals.length ? goals : ['Engineering problem practice'],
              experience: experience || 'beginner',
            })
            nav('/app')
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}

function Picker({ items, selected, onToggle }: { items: string[]; selected: string[]; onToggle: (i: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {items.map((i) => (
        <button key={i} type="button" className={`btn ${selected.includes(i) ? '' : 'secondary'}`} onClick={() => onToggle(i)}>
          {i}
        </button>
      ))}
    </div>
  )
}
