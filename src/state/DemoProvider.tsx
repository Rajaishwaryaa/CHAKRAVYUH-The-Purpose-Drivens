import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { SAMPLE_PROJECTS } from '../data/catalog'
import { uid } from '../lib/id'
import { applyReward } from '../lib/xp'
import type {
  AuditEntry,
  CommunityQuestion,
  DemoState,
  Experience,
  LabDesign,
  ModerationItem,
  ProjectPost,
} from '../types'

const KEY = 'cognivolt-demo-v1'

const SAMPLE_QUESTIONS: CommunityQuestion[] = [
  {
    id: 'q-xor-or',
    title: 'Why is XOR not lighting when both switches are on?',
    subject: 'Digital Logic',
    unit: 'Unit 2',
    body: 'I expected XOR to behave like OR. Both inputs 1, LED off. Is the IC dead?',
    author: 'Neha R.',
    createdAt: '2026-10-12',
    helpful: 8,
    answers: [
      {
        id: 'a1',
        author: 'Ananya Kulkarni',
        body: 'XOR is disagreement, not “any 1”. Both 1 → 0. OR would light. Check the truth table before swapping the chip.',
        helpful: 11,
      },
    ],
    acceptedId: 'a1',
    reports: 0,
    status: 'visible',
  },
  {
    id: 'q-threshold',
    title: 'Streetlight stays on in the corridor. Sensor or code?',
    subject: 'Embedded Systems',
    unit: 'Unit 3',
    body: 'LDR voltage changes, but the lamp never turns off indoors. Threshold is 80 in the sketch.',
    author: 'Omar S.',
    createdAt: '2026-10-20',
    helpful: 5,
    answers: [
      {
        id: 'a2',
        author: 'Sana Qureshi',
        body: 'Try the mission test table. Indoor ~50 with threshold 80 still counts as dark. Drop the number, then re-run all four cases.',
        helpful: 7,
      },
    ],
    reports: 0,
    status: 'visible',
  },
]

const SAMPLE_MOD: ModerationItem[] = [
  {
    id: 'm1',
    type: 'project',
    title: 'Draft: 555 timer siren (photos pending)',
    creator: 'Guest creator',
    submittedAt: '2026-10-28',
    status: 'pending',
  },
  {
    id: 'm2',
    type: 'question',
    title: 'Is my NAND table wrong or is the simulator?',
    creator: 'Neha R.',
    submittedAt: '2026-10-27',
    status: 'pending',
  },
]

function seed(): DemoState {
  return {
    session: false,
    displayName: '',
    email: '',
    institution: '',
    department: '',
    year: '',
    interests: [],
    goals: [],
    experience: '',
    onboardingDone: false,
    rolePreview: 'student',
    creatorEnabled: false,
    xp: 0,
    streak: 1,
    completions: {},
    bookmarks: [],
    voted: {},
    questions: SAMPLE_QUESTIONS,
    projects: SAMPLE_PROJECTS,
    moderation: SAMPLE_MOD,
    audit: [
      {
        id: 'aud-0',
        at: new Date().toISOString(),
        actor: 'system',
        action: 'seed',
        detail: 'Demo data loaded in this browser. Nothing was saved to a COGNIVOLT server.',
      },
    ],
    designs: [],
    streetlightThreshold: 80,
    streetlightDiagnosed: false,
    partnerInterest: '',
    groupRequests: [],
  }
}

function load(): DemoState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    const parsed = JSON.parse(raw) as DemoState
    return { ...seed(), ...parsed, questions: parsed.questions?.length ? parsed.questions : SAMPLE_QUESTIONS }
  } catch {
    return seed()
  }
}

function persist(s: DemoState) {
  const copy = { ...s }
  localStorage.setItem(KEY, JSON.stringify(copy))
}

interface Store {
  state: DemoState
  patch: (p: Partial<DemoState>) => void
  startSession: (p: { displayName: string; email?: string; institution?: string; department?: string; year?: string }) => void
  completeOnboarding: (p: { interests: string[]; goals: string[]; experience: Experience }) => void
  awardOnce: (key: string, amount: number) => { awarded: boolean; amount: number }
  toggleBookmark: (id: string) => void
  resetDemo: () => void
  addAudit: (action: string, detail: string) => void
  moderate: (id: string, status: 'approved' | 'rejected') => void
  saveDesign: (d: LabDesign) => void
  addQuestion: (q: Omit<CommunityQuestion, 'id' | 'createdAt' | 'answers' | 'helpful' | 'reports' | 'status'>) => void
  addAnswer: (qid: string, body: string) => void
  vote: (id: string) => void
  acceptAnswer: (qid: string, aid: string) => void
  reportQuestion: (qid: string) => void
  saveProject: (p: ProjectPost) => void
  signOut: () => void
}

const Ctx = createContext<Store | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => load())

  const patch = useCallback(
    (p: Partial<DemoState>) => {
      setState((prev) => {
        const next = { ...prev, ...p }
        persist(next)
        return next
      })
    },
    [],
  )

  const addAudit = useCallback((action: string, detail: string) => {
    setState((prev) => {
      const entry: AuditEntry = {
        id: uid('aud'),
        at: new Date().toISOString(),
        actor: prev.displayName || 'demo-user',
        action,
        detail,
      }
      const next = { ...prev, audit: [entry, ...prev.audit].slice(0, 40) }
      persist(next)
      return next
    })
  }, [])

  const startSession: Store['startSession'] = useCallback((p) => {
    setState((prev) => {
      const next: DemoState = {
        ...prev,
        session: true,
        displayName: p.displayName.trim() || 'Guest learner',
        email: p.email?.trim() ?? '',
        institution: p.institution?.trim() ?? '',
        department: p.department?.trim() ?? '',
        year: p.year?.trim() ?? '',
      }
      persist(next)
      return next
    })
  }, [])

  const completeOnboarding: Store['completeOnboarding'] = useCallback((p) => {
    setState((prev) => {
      const next = { ...prev, ...p, onboardingDone: true }
      persist(next)
      return next
    })
  }, [])

  const awardOnce: Store['awardOnce'] = useCallback((key, amount) => {
    const prev = load()
    const reward = applyReward(prev.completions, prev.xp, key, amount)
    if (!reward.awarded) return { awarded: false, amount: 0 }
    const next = { ...prev, xp: reward.xp, completions: reward.completions }
    persist(next)
    setState(next)
    return { awarded: true, amount: reward.amount }
  }, [])

  const toggleBookmark = useCallback((id: string) => {
    setState((prev) => {
      const has = prev.bookmarks.includes(id)
      const next = {
        ...prev,
        bookmarks: has ? prev.bookmarks.filter((x) => x !== id) : [...prev.bookmarks, id],
      }
      persist(next)
      return next
    })
  }, [])

  const resetDemo = useCallback(() => {
    localStorage.removeItem(KEY)
    const fresh = seed()
    setState(fresh)
  }, [])

  const moderate: Store['moderate'] = useCallback((id, status) => {
    setState((prev) => {
      const entry: AuditEntry = {
        id: uid('aud'),
        at: new Date().toISOString(),
        actor: prev.displayName || 'demo-admin',
        action: `moderation:${status}`,
        detail: `Item ${id} marked ${status} in demo memory only.`,
      }
      const next = {
        ...prev,
        moderation: prev.moderation.map((m) => (m.id === id ? { ...m, status } : m)),
        audit: [entry, ...prev.audit],
      }
      persist(next)
      return next
    })
  }, [])

  const saveDesign = useCallback((d: LabDesign) => {
    setState((prev) => {
      const rest = prev.designs.filter((x) => x.id !== d.id)
      const next = { ...prev, designs: [d, ...rest].slice(0, 8) }
      persist(next)
      return next
    })
  }, [])

  const addQuestion: Store['addQuestion'] = useCallback((q) => {
    setState((prev) => {
      const item: CommunityQuestion = {
        ...q,
        id: uid('q'),
        createdAt: new Date().toISOString().slice(0, 10),
        answers: [],
        helpful: 0,
        reports: 0,
        status: 'visible',
      }
      const next = { ...prev, questions: [item, ...prev.questions] }
      persist(next)
      return next
    })
  }, [])

  const addAnswer = useCallback((qid: string, body: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === qid
            ? {
                ...q,
                answers: [...q.answers, { id: uid('a'), author: prev.displayName || 'You', body, helpful: 0 }],
              }
            : q,
        ),
      }
      persist(next)
      return next
    })
  }, [])

  const vote = useCallback((id: string) => {
    setState((prev) => {
      if (prev.voted[id]) return prev
      const next = {
        ...prev,
        voted: { ...prev.voted, [id]: true },
        questions: prev.questions.map((q) => {
          if (q.id === id) return { ...q, helpful: q.helpful + 1 }
          return {
            ...q,
            answers: q.answers.map((a) => (a.id === id ? { ...a, helpful: a.helpful + 1 } : a)),
          }
        }),
      }
      persist(next)
      return next
    })
  }, [])

  const acceptAnswer = useCallback((qid: string, aid: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id !== qid) return q
          const ans = q.answers.find((a) => a.id === aid)
          if (!ans) return q
          if (ans.author === (prev.displayName || 'You')) return q
          if (q.author !== (prev.displayName || 'You')) return q
          return { ...q, acceptedId: aid }
        }),
      }
      persist(next)
      return next
    })
  }, [])

  const reportQuestion = useCallback((qid: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        questions: prev.questions.map((q) => (q.id === qid ? { ...q, reports: q.reports + 1, status: 'pending' as const } : q)),
        moderation: [
          {
            id: uid('m'),
            type: 'question' as const,
            title: prev.questions.find((q) => q.id === qid)?.title ?? qid,
            creator: prev.displayName || 'reporter',
            submittedAt: new Date().toISOString().slice(0, 10),
            status: 'pending' as const,
          },
          ...prev.moderation,
        ],
      }
      persist(next)
      return next
    })
  }, [])

  const saveProject = useCallback((p: ProjectPost) => {
    setState((prev) => {
      const rest = prev.projects.filter((x) => x.id !== p.id)
      const next: DemoState = {
        ...prev,
        projects: [p, ...rest],
        moderation: p.status === 'pending'
          ? [
              {
                id: uid('m'),
                type: 'project',
                title: p.title,
                creator: p.author,
                submittedAt: new Date().toISOString().slice(0, 10),
                status: 'pending',
              },
              ...prev.moderation,
            ]
          : prev.moderation,
      }
      persist(next)
      return next
    })
  }, [])

  const signOut = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, session: false }
      persist(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      state,
      patch,
      startSession,
      completeOnboarding,
      awardOnce,
      toggleBookmark,
      resetDemo,
      addAudit,
      moderate,
      saveDesign,
      addQuestion,
      addAnswer,
      vote,
      acceptAnswer,
      reportQuestion,
      saveProject,
      signOut,
    }),
    [
      state,
      patch,
      startSession,
      completeOnboarding,
      awardOnce,
      toggleBookmark,
      resetDemo,
      addAudit,
      moderate,
      saveDesign,
      addQuestion,
      addAnswer,
      vote,
      acceptAnswer,
      reportQuestion,
      saveProject,
      signOut,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useDemo() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
