export type Experience = 'beginner' | 'intermediate' | 'advanced'
export type RolePreview = 'student' | 'mentor' | 'admin'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type WorldStatus = 'playable' | 'partial' | 'locked'
export type GateName = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR'

export type CompKind = GateName | 'IN' | 'OUT'

export interface LabComponent {
  id: string
  kind: CompKind
  x: number
  y: number
  on?: boolean
}

export interface LabWire {
  id: string
  fromId: string
  toId: string
  toPin: 0 | 1
}

export interface LabDesign {
  id: string
  name: string
  components: LabComponent[]
  wires: LabWire[]
}

export interface Tutorial {
  id: string
  title: string
  creator: string
  subject: string
  unit: string
  topic: string
  difficulty: Difficulty
  type: 'notes' | 'diagram' | 'code' | 'demo'
  minutes: number
  objectives: string[]
  prerequisites: string[]
  body: string
  relatedChallengeId?: string
  relatedGame?: string
  xp: number
}

export interface Challenge {
  id: string
  title: string
  difficulty: Difficulty
  type: 'logic-output' | 'truth-table' | 'prediction' | 'fault' | 'construction'
  statement: string
  inputsNote: string
  constraints: string[]
  examples: string[]
  hints: string[]
  xp: number
  world: string
}

export interface MissionTest {
  id: string
  label: string
  light: number
  expectOn: boolean
}

export interface CommunityQuestion {
  id: string
  title: string
  subject: string
  unit: string
  body: string
  author: string
  createdAt: string
  answers: CommunityAnswer[]
  helpful: number
  acceptedId?: string
  reports: number
  status: 'visible' | 'pending' | 'rejected'
}

export interface CommunityAnswer {
  id: string
  author: string
  body: string
  helpful: number
}

export interface ProjectPost {
  id: string
  title: string
  author: string
  topic: string
  difficulty: Difficulty
  description: string
  components: string[]
  skills: string[]
  approach: string
  mistakes: string
  improvements: string
  demoLabel: string
  draft: boolean
  status: 'approved' | 'pending' | 'rejected'
}

export interface ModerationItem {
  id: string
  type: 'tutorial' | 'project' | 'question' | 'challenge'
  title: string
  creator: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface AuditEntry {
  id: string
  at: string
  actor: string
  action: string
  detail: string
}

export interface DemoState {
  session: boolean
  displayName: string
  email: string
  institution: string
  department: string
  year: string
  interests: string[]
  goals: string[]
  experience: Experience | ''
  onboardingDone: boolean
  rolePreview: RolePreview
  creatorEnabled: boolean
  xp: number
  streak: number
  completions: Record<string, string>
  bookmarks: string[]
  voted: Record<string, boolean>
  questions: CommunityQuestion[]
  projects: ProjectPost[]
  moderation: ModerationItem[]
  audit: AuditEntry[]
  designs: LabDesign[]
  streetlightThreshold: number
  streetlightDiagnosed: boolean
  partnerInterest: string
  groupRequests: string[]
}
