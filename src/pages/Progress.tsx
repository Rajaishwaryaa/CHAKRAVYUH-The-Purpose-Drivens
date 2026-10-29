import { Link } from 'react-router-dom'
import { CHALLENGES, TUTORIALS } from '../data/catalog'
import { rankFor } from '../lib/xp'
import { useDemo } from '../state/DemoProvider'

const SAMPLE_BOARD = [
  { name: 'Sample · A. Kulkarni', xp: 210, note: 'Demo row' },
  { name: 'Sample · R. Deshmukh', xp: 160, note: 'Demo row' },
  { name: 'You (this browser)', xp: 0, note: 'Uses your demo XP' },
]

export function Progress() {
  const { state, completeOnboarding } = useDemo()
  const rank = rankFor(state.xp)
  const keys = Object.keys(state.completions)
  const board = SAMPLE_BOARD.map((r) => (r.name.startsWith('You') ? { ...r, xp: state.xp } : r)).sort((a, b) => b.xp - a.xp)

  return (
    <div>
      <h1>Progress, rewards, portfolio</h1>
      <p>
        XP is awarded once per verified key in this browser. Repeating a passed challenge does not farm points.
        Ranks: Beginner → Circuit Explorer → Debugger → Systems Engineer → AI Innovator → Engineering Legend.
      </p>
      <div className="grid cols-3">
        <article className="card">
          <h3>
            {rank.name} · {state.xp} XP
          </h3>
          <p>Streak shown as {state.streak} day (cosmetic demo, not a server clock).</p>
        </article>
        <article className="card">
          <h3>Verified completions</h3>
          {keys.length === 0 ? (
            <p>Empty on purpose. Pass a challenge or the streetlight to see keys appear.</p>
          ) : (
            <ul>
              {keys.map((k) => (
                <li key={k} className="mono tiny">
                  {k}
                </li>
              ))}
            </ul>
          )}
        </article>
        <article className="card">
          <h3>Preferences</h3>
          <p>Interests: {state.interests.join(', ') || 'not set'}</p>
          <button
            className="btn secondary"
            type="button"
            onClick={() => completeOnboarding({ interests: ['Digital Logic'], goals: state.goals, experience: 'beginner' })}
          >
            Reset interests to Digital Logic
          </button>
        </article>
      </div>
      <h2>Portfolio</h2>
      <div className="grid cols-2">
        {state.projects.filter((p) => p.author === state.displayName).map((p) => (
          <article className="card" key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p className="tiny">{p.skills.join(' · ')}</p>
          </article>
        ))}
        {state.designs.map((d) => (
          <article className="card" key={d.id}>
            <h3>{d.name}</h3>
            <p>{d.components.length} parts · saved locally</p>
            <Link to="/app/lab">Open lab</Link>
          </article>
        ))}
        {state.projects.filter((p) => p.author === state.displayName).length === 0 && state.designs.length === 0 && (
          <p>No personal artefacts yet. Complete the streetlight or save a lab net.</p>
        )}
      </div>
      <h2>Leaderboard</h2>
      <p className="tiny">Transparent rule: sum of one-time XP from verified demo tasks. Names besides you are labelled sample.</p>
      <table className="data">
        <thead>
          <tr>
            <th>Name</th>
            <th>XP</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {board.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td>{r.xp}</td>
              <td>
                <span className="tag amber">{r.note}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Recommendations</h2>
      <ul>
        {TUTORIALS.filter((t) => !state.completions[`tut:${t.id}`]).slice(0, 2).map((t) => (
          <li key={t.id}>
            <Link to={`/app/hub/${t.id}`}>{t.title}</Link>
          </li>
        ))}
        {CHALLENGES.filter((c) => !state.completions[`ch:${c.id}`]).slice(0, 2).map((c) => (
          <li key={c.id}>
            <Link to={`/app/challenges/${c.id}`}>{c.title}</Link>
          </li>
        ))}
      </ul>
      <p className="tiny">Teach-to-earn in this demo is the helpful vote count, not a payout.</p>
    </div>
  )
}

export function CreatorStudio() {
  const { state } = useDemo()
  if (!state.creatorEnabled) {
    return (
      <div className="card">
        <h2>Creator studio is off</h2>
        <p>Enable the simulated Creator capability in the sidebar to draft puzzles and projects.</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Creator studio</h1>
      <p className="tag amber">Simulated publishing. You cannot globally moderate or approve your own flagged items.</p>
      <ul>
        <li>
          <Link to="/app/games/creator">Validate a gate puzzle</Link>
        </li>
        <li>
          <Link to="/app/community">Submit a project draft</Link>
        </li>
      </ul>
    </div>
  )
}

export function MentorConsole() {
  const { state } = useDemo()
  if (state.rolePreview !== 'mentor') {
    return (
      <div className="card">
        <h2>Access denied</h2>
        <p>Switch Role preview to Faculty / Mentor. That switch is not production authorization.</p>
        <Link to="/app">Return home</Link>
      </div>
    )
  }
  return (
    <div>
      <h1>Mentor preview</h1>
      <p>No groups are assigned in this demo. A real mentor account would only see students they are authorized to support.</p>
      <div className="card">
        <h3>Assigned groups</h3>
        <p>Empty — nothing to review. That is the honest state, not a hidden class list.</p>
      </div>
    </div>
  )
}
