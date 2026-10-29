import { Link } from 'react-router-dom'
import { WORLDS, TUTORIALS, CHALLENGES } from '../data/catalog'
import { rankFor } from '../lib/xp'
import { useDemo } from '../state/DemoProvider'

export function Dashboard() {
  const { state } = useDemo()
  const rank = rankFor(state.xp)
  const last = Object.keys(state.completions).at(-1)
  const recTutorial = TUTORIALS.find((t) => state.interests.includes(t.subject)) ?? TUTORIALS[0]
  const nextCh = CHALLENGES.find((c) => !state.completions[`ch:${c.id}`]) ?? CHALLENGES[0]
  const hello = 'Welcome back'

  return (
    <div>
      <h1>
        {hello}, {state.displayName.split(' ')[0]}.
      </h1>
      <p>Pick a small win. Logic Rookie and the streetlight mission are the playable slice.</p>
      <div className="grid cols-3">
        <article className="card">
          <div className="kicker">Continue</div>
          <h3>Pick up where you left off</h3>
          <p>{last ? `Last verified item: ${last}` : 'Nothing verified yet — that is a clean bench, not a failing grade.'}</p>
          <Link className="btn" to={last?.startsWith('ch:') ? '/app/challenges' : '/app/hub'}>
            {last ? 'Jump back' : 'Open the Hub'}
          </Link>
        </article>
        <article className="card">
          <div className="kicker">Recommended</div>
          <h3>{recTutorial.title}</h3>
          <p>{recTutorial.minutes} min · {recTutorial.creator}</p>
          <Link className="btn secondary" to={`/app/hub/${recTutorial.id}`}>
            Read tutorial
          </Link>
        </article>
        <article className="card">
          <div className="kicker">XP · demo rules</div>
          <h3>
            {rank.name} · {state.xp} XP
          </h3>
          <div className="progress">
            <span style={{ width: `${Math.min(100, (state.xp / 420) * 100)}%` }} />
          </div>
          <p className="tiny">{rank.next ? `${rank.remain} XP to ${rank.next}` : 'Top demo rank reached'}</p>
        </article>
      </div>
      <h2 style={{ marginTop: 24 }}>Journey</h2>
      <div className="flow">
        <span>Tutorial</span>
        <span>Challenge</span>
        <span>Mission</span>
      </div>
      <h2>Eight learning worlds</h2>
      <div className="grid cols-4">
        {WORLDS.map((w) => (
          <article className="card world" key={w.id}>
            <div>
              <span className={`tag ${w.status === 'playable' ? 'ok' : w.status === 'partial' ? 'amber' : 'locked'}`}>
                {w.status === 'playable' ? 'Playable' : w.status === 'partial' ? 'One mission' : 'Coming soon'}
              </span>
              <h3>{w.name}</h3>
              <p>{w.blurb}</p>
            </div>
            {w.status === 'playable' ? (
              <Link to="/app/challenges">Enter Logic Rookie</Link>
            ) : w.status === 'partial' ? (
              <Link to="/app/missions/streetlight">Open streetlight</Link>
            ) : (
              <span className="tiny">Locked until that lab exists.</span>
            )}
          </article>
        ))}
      </div>
      <h2 style={{ marginTop: 24 }}>Quick actions</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Link className="btn" to="/app/hub">
          Explore tutorials
        </Link>
        <Link className="btn secondary" to="/app/games">
          Play a circuit game
        </Link>
        <Link className="btn secondary" to="/app/lab">
          Open Virtual Lab
        </Link>
        <Link className="btn secondary" to="/app/challenges">
          Solve a challenge
        </Link>
      </div>
      <p className="tiny" style={{ marginTop: 12 }}>
        Next challenge waiting: {nextCh.title}. Rankings on Progress are sample names, not a live leaderboard.
      </p>
    </div>
  )
}
