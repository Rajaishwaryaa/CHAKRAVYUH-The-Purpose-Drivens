import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Emblem, HeroCircuit } from '../components/Emblem'

export function Landing() {
  return (
    <div>
      <div className="demo-banner">
        Public preview of a student learning community. Accounts, email, and live AI are not connected.
      </div>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="page" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="brand-row" style={{ color: 'inherit', padding: 0 }}>
          <Emblem />
          <div>
            <strong>COGNIVOLT</strong>
            <div className="tiny muted">By Students, For Students.</div>
          </div>
        </Link>
        <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/help">Help</Link>
          <Link className="btn secondary" to="/demo/sign-in">
            Demo sign-in
          </Link>
        </nav>
      </header>
      <main id="main" className="page">
        <section className="hero">
          <div>
            <p className="kicker">Learn Together. Build Anything.</p>
            <h1>Your next breakthrough starts here.</h1>
            <p style={{ fontSize: '1.15rem' }}>
              Learn the concepts, solve the puzzles, build the circuit, and share what you discover.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '16px 0' }}>
              <Link className="btn" to="/demo/register">
                Start learning <ArrowRight size={16} />
              </Link>
              <Link className="btn secondary" to="/how-it-works">
                Explore how it works
              </Link>
            </div>
            <div className="flow" aria-label="Learning journey">
              <span>Learn</span>
              <span>Practise</span>
              <span>Build</span>
              <span>Share</span>
            </div>
            <p className="tiny">
              Made for ENTC students who want a bench, not a brochure. Mistakes are feedback. AI is a study partner you
              still verify.
            </p>
          </div>
          <HeroCircuit />
        </section>
        <section className="grid cols-3" style={{ marginTop: 12 }}>
          {[
            ['Tutorials', 'Peer-written notes on gates, sensors, and lab habits — searchable, not fluffy.'],
            ['Circuit games', 'Predict outputs, hunt faults, race a timer. Scoring follows real truth tables.'],
            ['Virtual lab', 'Place AND/OR/NOT family gates, flip switches, watch computed lamps.'],
            ['Engineering missions', 'Streetlight: find a bad threshold, pass every test, then submit once.'],
            ['Student projects', 'Show the approach, the mess-up, and what you would change.'],
            ['Honest demo', 'If a button cannot talk to a server, we say so. No fake user counts.'],
          ].map(([t, b]) => (
            <article className="card" key={t}>
              <h3>{t}</h3>
              <p>{b}</p>
            </article>
          ))}
        </section>
        <section className="card" style={{ marginTop: 18 }}>
          <h2>Who this helps</h2>
          <p>
            Undergraduates in Electronics and Telecommunication who learn faster with a puzzle, a second opinion from a
            classmate, and a test table that does not argue back. Faculty preview exists for later mentoring — it is not
            self-granted in production.
          </p>
        </section>
      </main>
      <footer className="page tiny muted">
        <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link> · COGNIVOLT student preview
      </footer>
    </div>
  )
}

export function HowItWorks() {
  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <Link to="/">← Home</Link>
      <h1>How COGNIVOLT works</h1>
      <ol>
        <li>Pick a tutorial in the Hub and actually finish the idea, not the scroll.</li>
        <li>Practise in games — short, scored, truth-table honest.</li>
        <li>Build in the Virtual Lab or a mission with a live test table.</li>
        <li>Share a project or a doubt. Helpfulness beats volume.</li>
        <li>Improve: XP is awarded once per verified task in this demo session.</li>
      </ol>
      <p>Digital logic is implemented. Analog, SPICE, and hardware control are not. AI replies are scripted templates.</p>
      <Link className="btn" to="/demo/register">
        Start a demo session
      </Link>
    </div>
  )
}
