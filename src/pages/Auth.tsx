import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Emblem } from '../components/Emblem'
import { useDemo } from '../state/DemoProvider'

export function SignIn() {
  const nav = useNavigate()
  const { startSession } = useDemo()
  const [name, setName] = useState('Guest learner')
  return (
    <AuthFrame title="Demo sign-in">
      <p>
        No authentication provider is connected. This form does not check a password and cannot unlock a real account.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          startSession({ displayName: name })
          nav('/onboarding')
        }}
      >
        <label className="field">
          <span>Display name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="nickname" />
        </label>
        <label className="field">
          <span>Email (optional, stays in this browser)</span>
          <input type="email" autoComplete="email" placeholder="you@college.edu" />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" disabled placeholder="Disabled — no password collection" />
        </label>
        <button className="btn" type="submit">
          Continue demo session
        </button>
      </form>
      <p className="tiny">
        <Link to="/demo/register">Registration UI</Link> ·{' '}
        <Link to="/demo/forgot">Forgot password (unavailable)</Link>
      </p>
    </AuthFrame>
  )
}

export function Register() {
  const nav = useNavigate()
  const { startSession } = useDemo()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [inst, setInst] = useState('')
  const [dept, setDept] = useState('ENTC')
  const [year, setYear] = useState('')
  const [consent, setConsent] = useState(false)
  const [show, setShow] = useState(false)
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [errs, setErrs] = useState<string[]>([])

  return (
    <AuthFrame title="Create a demo profile">
      <p>
        This does not create a server account, send email, or store a password. After you continue, only a display
        profile is kept in local demo state.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const next: string[] = []
          if (name.trim().length < 2) next.push('Please use a full name (at least 2 characters).')
          if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.push('Email looks off — or leave it blank.')
          if (!consent) next.push('Please confirm you understand this is a simulated registration.')
          if (pw || pw2) next.push('Leave password fields empty. We will not collect credentials in the demo.')
          setErrs(next)
          if (next.length) return
          startSession({ displayName: name, email, institution: inst, department: dept, year })
          nav('/onboarding')
        }}
      >
        <label className="field">
          <span>Full name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label className="field">
          <span>Password (do not enter a real one)</span>
          <input
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
            placeholder="Leave blank"
          />
        </label>
        <label className="field">
          <span>Confirm password</span>
          <input type={show ? 'text' : 'password'} value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Leave blank" />
        </label>
        <label className="tiny" style={{ display: 'flex', gap: 8 }}>
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
          Show those fields (still unused)
        </label>
        <p className="tiny">If you did type something, we ignore it and never write it to storage.</p>
        <label className="field">
          <span>Institution (optional)</span>
          <input value={inst} onChange={(e) => setInst(e.target.value)} />
        </label>
        <label className="field">
          <span>Department</span>
          <input value={dept} onChange={(e) => setDept(e.target.value)} />
        </label>
        <label className="field">
          <span>Year of study (optional)</span>
          <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2nd year" />
        </label>
        <label className="tiny" style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />I understand no real
          account is created and I should not type a live password.
        </label>
        {errs.map((er) => (
          <p key={er} className="err">
            {er}
          </p>
        ))}
        <button className="btn" type="submit">
          Start demo onboarding
        </button>
      </form>
    </AuthFrame>
  )
}

export function Forgot() {
  return (
    <AuthFrame title="Password reset">
      <p>
        Reset, MFA, and email delivery are not available. There is no identity provider on this preview, so we cannot
        send a message or confirm whether an address exists.
      </p>
      <Link className="btn" to="/demo/sign-in">
        Back to demo sign-in
      </Link>
    </AuthFrame>
  )
}

function AuthFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="page" style={{ maxWidth: 520 }}>
      <Link to="/" className="brand-row" style={{ color: 'inherit', padding: 0, marginBottom: 16 }}>
        <Emblem />
        <strong>COGNIVOLT</strong>
      </Link>
      <div className="card">
        <span className="tag amber">Simulated auth</span>
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  )
}
