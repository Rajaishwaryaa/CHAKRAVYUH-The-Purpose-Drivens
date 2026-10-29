import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Admin, Legal } from './pages/Admin'
import { Forgot, Register, SignIn } from './pages/Auth'
import { ChallengeDetail, ChallengeList } from './pages/Challenges'
import { Community } from './pages/Community'
import { Dashboard } from './pages/Dashboard'
import { GamePage, GamesLobby } from './pages/Games'
import { Hub, TutorialDetail } from './pages/Hub'
import { Lab } from './pages/Lab'
import { HowItWorks, Landing } from './pages/Landing'
import { Mentor } from './pages/Mentor'
import { Missions, Streetlight } from './pages/Missions'
import { Onboarding } from './pages/Onboarding'
import { CreatorStudio, MentorConsole, Progress } from './pages/Progress'
import { useDemo } from './state/DemoProvider'

export default function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/privacy" element={<Legal kind="privacy" />} />
        <Route path="/terms" element={<Legal kind="terms" />} />
        <Route path="/help" element={<Legal kind="help" />} />
        <Route path="/demo/sign-in" element={<SignIn />} />
        <Route path="/demo/register" element={<Register />} />
        <Route path="/demo/forgot" element={<Forgot />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<RequireSession />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/hub" element={<Hub />} />
          <Route path="/app/hub/:id" element={<TutorialDetail />} />
          <Route path="/app/mentor" element={<Mentor />} />
          <Route path="/app/games" element={<GamesLobby />} />
          <Route path="/app/games/:slug" element={<GamePage />} />
          <Route path="/app/lab" element={<Lab />} />
          <Route path="/app/missions" element={<Missions />} />
          <Route path="/app/missions/streetlight" element={<Streetlight />} />
          <Route path="/app/challenges" element={<ChallengeList />} />
          <Route path="/app/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/app/community" element={<Community />} />
          <Route path="/app/progress" element={<Progress />} />
          <Route path="/app/create" element={<CreatorStudio />} />
          <Route path="/app/mentor-console" element={<MentorConsole />} />
          <Route path="/app/admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

function RequireSession() {
  const { state } = useDemo()
  if (!state.session) return <Navigate to="/demo/sign-in" replace />
  return <AppShell />
}

function NotFound() {
  return (
    <div className="page">
      <h1>That page is not on the map</h1>
      <p>Try the landing page or your desk if you already started a demo session.</p>
      <a className="btn" href="/">
        Home
      </a>
    </div>
  )
}
