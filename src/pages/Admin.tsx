import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDemo } from '../state/DemoProvider'
import { Modal } from '../components/Ui'

export function Admin() {
  const { state, moderate } = useDemo()
  const [pending, setPending] = useState<{ id: string; status: 'approved' | 'rejected' } | null>(null)
  if (state.rolePreview !== 'admin') {
    return (
      <div className="card">
        <h2>Access denied</h2>
        <p>Admin console needs the Administrator preview toggle (demo) or a real backend role (production).</p>
        <Link className="btn" to="/app">
          Return
        </Link>
      </div>
    )
  }
  return (
    <div>
      <h1>Admin moderation console</h1>
      <p className="tag amber">Sample queue. Approve/reject updates this browser only and writes a demo audit line.</p>
      <table className="data">
        <thead>
          <tr>
            <th>Type</th>
            <th>Title</th>
            <th>Creator</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.moderation.map((m) => (
            <tr key={m.id}>
              <td>{m.type}</td>
              <td>{m.title}</td>
              <td>{m.creator}</td>
              <td>{m.submittedAt}</td>
              <td>{m.status}</td>
              <td>
                <button className="btn secondary" type="button" disabled={m.status !== 'pending'} onClick={() => setPending({ id: m.id, status: 'approved' })}>
                  Approve
                </button>
                <button className="btn danger" type="button" disabled={m.status !== 'pending'} onClick={() => setPending({ id: m.id, status: 'rejected' })}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Audit log (demo)</h2>
      <ul>
        {state.audit.map((a) => (
          <li key={a.id} className="tiny">
            {a.at} · {a.actor} · {a.action} — {a.detail}
          </li>
        ))}
      </ul>
      <p className="tiny">Passwords, tokens, and API keys are never shown. Destructive actions stay confirm-gated.</p>
      {pending && (
        <Modal title={`Confirm ${pending.status}?`} onClose={() => setPending(null)}>
          <p>This does not notify a server. It only updates local demo state and the audit list.</p>
          <button
            className="btn"
            type="button"
            onClick={() => {
              moderate(pending.id, pending.status)
              setPending(null)
            }}
          >
            Confirm
          </button>
        </Modal>
      )}
    </div>
  )
}

export function Legal({ kind }: { kind: 'privacy' | 'terms' | 'help' }) {
  const title = kind === 'privacy' ? 'Privacy' : kind === 'terms' ? 'Terms' : 'Help'
  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <Link to="/">← Home</Link>
      <h1>{title}</h1>
      {kind === 'privacy' && (
        <p>
          This preview stores a display profile, XP, and demo content in your browser’s localStorage. It does not collect
          passwords. There is no analytics backend in this repository.
        </p>
      )}
      {kind === 'terms' && (
        <p>
          COGNIVOLT is a student learning preview. Do not treat simulated circuits as electrical safety advice. Do not
          upload secrets.
        </p>
      )}
      {kind === 'help' && (
        <ul>
          <li>Start a demo session from the landing page.</li>
          <li>Play Logic Rookie challenges and the streetlight mission.</li>
          <li>If a control is disabled, the nearby copy explains why.</li>
        </ul>
      )}
    </div>
  )
}
