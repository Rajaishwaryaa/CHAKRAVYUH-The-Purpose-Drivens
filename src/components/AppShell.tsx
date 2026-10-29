import {
  BookOpen,
  Bot,
  CircuitBoard,
  Flag,
  Gamepad2,
  LayoutDashboard,
  Menu,
  Shield,
  Trophy,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { rankFor } from '../lib/xp'
import { useDemo } from '../state/DemoProvider'
import { Emblem } from './Emblem'
import { Modal } from './Ui'

const studentNav = [
  { to: '/app', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/app/hub', label: 'Learning Hub', icon: BookOpen },
  { to: '/app/mentor', label: 'AI Mentor', icon: Bot },
  { to: '/app/games', label: 'Circuit Games', icon: Gamepad2 },
  { to: '/app/lab', label: 'Virtual Lab', icon: CircuitBoard },
  { to: '/app/missions', label: 'Missions', icon: Flag },
  { to: '/app/challenges', label: 'Challenge Arena', icon: Trophy },
  { to: '/app/community', label: 'Community', icon: Users },
  { to: '/app/progress', label: 'Progress', icon: Wrench },
]

export function AppShell() {
  const { state, patch, resetDemo, signOut } = useDemo()
  const [open, setOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()
  const rank = rankFor(state.xp)

  const title = pageTitle(loc.pathname)

  return (
    <div>
      <div className="demo-banner">
        Demo mode — progress lives in this browser only. Roles, creator access, AI replies, and admin actions are
        simulated. No passwords are stored.
      </div>
      <div className="shell">
        <aside className={`sidebar ${open ? 'open' : ''}`} id="app-sidebar">
          <Link to="/app" className="brand-row" onClick={() => setOpen(false)}>
            <Emblem size={32} />
            <div>
              <strong>COGNIVOLT</strong>
              <div className="tiny">Learn Together.</div>
            </div>
          </Link>
          {studentNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <item.icon size={18} aria-hidden />
              {item.label}
            </NavLink>
          ))}
          {state.creatorEnabled && (
            <NavLink to="/app/create" onClick={() => setOpen(false)}>
              <Wrench size={18} aria-hidden />
              Creator studio
            </NavLink>
          )}
          {state.rolePreview === 'mentor' && (
            <NavLink to="/app/mentor-console" onClick={() => setOpen(false)}>
              <Users size={18} aria-hidden />
              Mentor preview
            </NavLink>
          )}
          {state.rolePreview === 'admin' && (
            <NavLink to="/app/admin" onClick={() => setOpen(false)}>
              <Shield size={18} aria-hidden />
              Admin console
            </NavLink>
          )}
          <div style={{ marginTop: 'auto' }} className="tiny">
            <p style={{ color: '#9bb' }}>
              {state.displayName} · {rank.name} · {state.xp} XP
            </p>
            <label className="tiny" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', margin: '8px 0' }}>
              <input
                type="checkbox"
                checked={state.creatorEnabled}
                onChange={(e) => patch({ creatorEnabled: e.target.checked })}
              />
              Demo: Creator capability (simulated). Production needs server policy.
            </label>
            <label className="tiny" style={{ display: 'block', marginBottom: 8 }}>
              Role preview
              <select
                value={state.rolePreview}
                onChange={(e) => patch({ rolePreview: e.target.value as typeof state.rolePreview })}
                style={{ width: '100%', marginTop: 4, borderRadius: 8, padding: 6 }}
              >
                <option value="student">Student</option>
                <option value="mentor">Faculty / Mentor (preview)</option>
                <option value="admin">Administrator (preview)</option>
              </select>
            </label>
            <button className="linkish" type="button" onClick={() => setResetOpen(true)}>
              Reset demo data
            </button>
          </div>
        </aside>
        <div className="content">
          <header className="topbar">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="btn ghost drawer-btn" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
                {open ? <X size={18} /> : <Menu size={18} />}
                <span className="sr-only">Menu</span>
              </button>
              <div>
                <div className="kicker">Student workspace</div>
                <strong>{title}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="tag">XP {state.xp}</span>
              <span className="tag amber">Demo session</span>
              <Link className="btn ghost" to="/app/progress">
                Profile
              </Link>
              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  signOut()
                  nav('/')
                }}
              >
                End session
              </button>
            </div>
          </header>
          <main id="main" className="page">
            <Outlet />
          </main>
        </div>
      </div>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="modal-back"
          style={{ background: 'rgba(16,23,42,.35)' }}
          onClick={() => setOpen(false)}
        />
      )}
      {resetOpen && (
        <Modal title="Reset this demo?" onClose={() => setResetOpen(false)}>
          <p>This clears XP, completions, drafts, and toggles stored in this browser. Sample library content will reload.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn danger" type="button" onClick={() => { resetDemo(); setResetOpen(false); nav('/') }}>
              Reset everything
            </button>
            <button className="btn secondary" type="button" onClick={() => setResetOpen(false)}>
              Keep going
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function pageTitle(path: string) {
  if (path.startsWith('/app/hub')) return 'Learning Hub'
  if (path.startsWith('/app/mentor-console')) return 'Mentor preview'
  if (path.startsWith('/app/mentor')) return 'AI Mentor'
  if (path.startsWith('/app/games')) return 'Circuit Games'
  if (path.startsWith('/app/lab')) return 'Virtual Lab'
  if (path.startsWith('/app/missions')) return 'Engineering Missions'
  if (path.startsWith('/app/challenges')) return 'Challenge Arena'
  if (path.startsWith('/app/community')) return 'Community'
  if (path.startsWith('/app/progress')) return 'Progress & portfolio'
  if (path.startsWith('/app/create')) return 'Creator studio'
  if (path.startsWith('/app/admin')) return 'Admin console'
  return 'Your desk'
}

