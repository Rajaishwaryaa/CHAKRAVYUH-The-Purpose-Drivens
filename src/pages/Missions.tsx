import { Link } from 'react-router-dom'
import { CORRECT_THRESHOLD, FAULTY_THRESHOLD, STREETLIGHT_TESTS, lampOn } from '../data/catalog'
import { XP } from '../lib/xp'
import { useDemo } from '../state/DemoProvider'

const FUTURE = [
  'Smart agriculture moisture alert',
  'Water-level overflow alarm',
  'Workshop safety beam',
  'Signal recovery sketch',
  'Home automation scene',
]

export function Missions() {
  return (
    <div>
      <h1>Engineering Missions</h1>
      <p>Scenario labs with acceptance tests. Games are warm-ups; this is the write-up with a submit gate.</p>
      <article className="card">
        <span className="tag ok">Playable</span>
        <h3>Smart Streetlight</h3>
        <p>Diagnose a threshold fault, then pass every lighting case.</p>
        <Link className="btn" to="/app/missions/streetlight">
          Open mission
        </Link>
      </article>
      <h2>Coming soon</h2>
      <div className="grid cols-2">
        {FUTURE.map((f) => (
          <article className="card" key={f}>
            <span className="tag locked">Coming soon</span>
            <h3>{f}</h3>
            <p>Not playable yet — listed so the roadmap stays honest.</p>
            <button className="btn secondary" type="button" disabled>
              Locked
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

export function Streetlight() {
  const { state, patch, awardOnce } = useDemo()
  const t = state.streetlightThreshold
  const rows = STREETLIGHT_TESTS.map((test) => {
    const actual = lampOn(test.light, t)
    return { ...test, actual, pass: actual === test.expectOn }
  })
  const all = rows.every((r) => r.pass)
  const done = Boolean(state.completions['mission:streetlight'])

  return (
    <div>
      <Link to="/app/missions">← Missions</Link>
      <h1>Mission: Smart Streetlight</h1>
      <p>
        A campus path should light when it is dark, and rest when it is reasonably bright. This is a software comparison
        on a 0–100 light reading — not a mains fixture, not a photometric lab.
      </p>
      <div className="grid cols-2">
        <article className="card">
          <h3>Brief</h3>
          <ul>
            <li>Goal: lampOn when ambient light is below a sensible dusk threshold.</li>
            <li>Constraint: one threshold number, four official tests.</li>
            <li>Budget: n/a in simulation.</li>
            <li>Supported tools: this test table + Virtual Lab for digital extras.</li>
          </ul>
          <p>
            Starting config is a known fault: threshold = {FAULTY_THRESHOLD}. Indoor evening (50) will fail until you
            diagnose it.
          </p>
          <label className="field">
            <span>Threshold (lamp on if light &lt; T)</span>
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              aria-describedby="streetlight-threshold-help"
              value={t}
              onChange={(e) => {
                const next = e.target.valueAsNumber
                if (Number.isFinite(next) && next >= 0 && next <= 100) patch({ streetlightThreshold: next })
              }}
            />
          </label>
          <p id="streetlight-threshold-help" className="tiny">Use a whole-number sensor reading from 0 to 100.</p>
          <button
            className="btn secondary"
            type="button"
            onClick={() => patch({ streetlightThreshold: FAULTY_THRESHOLD, streetlightDiagnosed: false })}
          >
            Reset to known fault
          </button>
          <fieldset>
            <legend>What was wrong?</legend>
            <label>
              <input
                type="radio"
                name="diag"
                checked={state.streetlightDiagnosed}
                onChange={() => patch({ streetlightDiagnosed: true })}
              />{' '}
              Threshold too high — corridor still looked “night” to the code.
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="diag"
                checked={!state.streetlightDiagnosed}
                onChange={() => patch({ streetlightDiagnosed: false })}
              />{' '}
              Still investigating
            </label>
          </fieldset>
        </article>
        <article className="card">
          <h3>Live tests</h3>
          <table className="data">
            <thead>
              <tr>
                <th>Case</th>
                <th>Expect</th>
                <th>Actual</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.label}</td>
                  <td>{r.expectOn ? 'ON' : 'OFF'}</td>
                  <td>{r.actual ? 'ON' : 'OFF'}</td>
                  <td>
                    <span className={r.pass ? 'tag ok' : 'tag warn'}>{r.pass ? 'Pass' : 'Fail'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="tiny">Hint: dusk is 25. A working T sits above dusk and below indoor 50. Many teams use {CORRECT_THRESHOLD}.</p>
        </article>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3>Submit</h3>
        <p>
          {all
            ? 'Every required test passes. You can submit.'
            : 'Submit stays closed until the table is all green. Failed rows show expected vs actual.'}
        </p>
        <button
          className="btn"
          type="button"
          disabled={!all || !state.streetlightDiagnosed || done}
          onClick={() => awardOnce('mission:streetlight', XP.mission)}
        >
          {done ? `Submitted · ${XP.mission} XP already counted` : `Submit mission · +${XP.mission} XP once`}
        </button>
        {!state.streetlightDiagnosed && <p className="tiny">Mark the diagnosis first — name the fault, then ship.</p>}
        <h4>Reflection</h4>
        <p>
          If the lamp never sleeps, ask whether “dark” is a feeling or a number. Write the number next to the photo of
          the path.
        </p>
      </div>
    </div>
  )
}
