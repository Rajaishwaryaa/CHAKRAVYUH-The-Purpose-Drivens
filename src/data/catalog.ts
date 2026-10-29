import { bit, evalGate } from '../lib/logic'
import type { Challenge, MissionTest, ProjectPost, Tutorial } from '../types'

export const INTERESTS = [
  'Digital Logic',
  'Electronics and Circuits',
  'Embedded Systems',
  'IoT',
  'Communication Systems',
  'AI and Data Science',
]

export const GOALS = [
  'Exam preparation',
  'Engineering problem practice',
  'Practical projects',
  'Circuit design',
  'Helping peers',
]

export const WORLDS = [
  {
    id: 'logic-rookie',
    name: 'Logic Rookie',
    blurb: 'Binary, gates, truth tables, Boolean thinking.',
    status: 'playable' as const,
    topics: ['Binary', 'AND/OR/NOT', 'NAND/NOR', 'XOR'],
  },
  {
    id: 'circuit-builder',
    name: 'Circuit Builder',
    blurb: 'Voltage, current, diodes, transistors.',
    status: 'locked' as const,
    topics: ['Ohm’s law', 'Diodes', 'BJT as switch'],
  },
  {
    id: 'signal-master',
    name: 'Signal Master',
    blurb: 'Sampling, filtering, noise.',
    status: 'locked' as const,
    topics: ['Analog vs digital', 'Filters'],
  },
  {
    id: 'embedded-explorer',
    name: 'Embedded Explorer',
    blurb: 'Microcontrollers, sensors, control logic.',
    status: 'partial' as const,
    topics: ['GPIO', 'Thresholds', 'Streetlight mission'],
  },
  {
    id: 'iot-architect',
    name: 'IoT Architect',
    blurb: 'Sensors, messaging, alerts.',
    status: 'locked' as const,
    topics: ['Telemetry', 'Alerts'],
  },
  {
    id: 'comm-commander',
    name: 'Communication Commander',
    blurb: 'Modulation, bandwidth, reliability.',
    status: 'locked' as const,
    topics: ['SNR', 'Modulation'],
  },
  {
    id: 'ai-engineer',
    name: 'AI Engineer',
    blurb: 'Datasets, classification, evaluation.',
    status: 'locked' as const,
    topics: ['Features', 'Confusion matrix'],
  },
  {
    id: 'innovation-legend',
    name: 'Innovation Legend',
    blurb: 'Integration, trade-offs, reliability.',
    status: 'locked' as const,
    topics: ['Optimization', 'Constraints'],
  },
]

export const TUTORIALS: Tutorial[] = [
  {
    id: 't-and-or-not',
    title: 'Gates that actually decide: AND, OR, NOT',
    creator: 'Ananya Kulkarni',
    subject: 'Digital Logic',
    unit: 'Unit 1 — Combinational basics',
    topic: 'Logic gates',
    difficulty: 'easy',
    type: 'notes',
    minutes: 18,
    objectives: [
      'Read a 2-input truth table without guessing',
      'Explain AND/OR/NOT in one sentence each',
      'Predict a single-gate output from two switches',
    ],
    prerequisites: ['Binary 0/1 as off/on'],
    relatedChallengeId: 'c-and-output',
    relatedGame: 'predict',
    xp: 12,
    body: `Think of a gate as a tiny rule, not a mysterious chip.

AND is picky: the lamp lights only if every input is 1. OR is generous: one 1 is enough. NOT simply flips whatever it sees.

Try this aloud: “If the lab door is closed AND the bench power is on, the instrument is safe to use.” That is AND in a sentence you already live.

When you get an output wrong, check the second input before rewriting the whole rule. Most first mistakes are “I treated AND like OR.”`,
  },
  {
    id: 't-nand-nor',
    title: 'NAND and NOR: the universal pair',
    creator: 'Rahul Deshmukh',
    subject: 'Digital Logic',
    unit: 'Unit 1 — Combinational basics',
    topic: 'Universal gates',
    difficulty: 'medium',
    type: 'diagram',
    minutes: 22,
    objectives: ['Relate NAND to AND+NOT', 'Build NOT from NAND in your head', 'Spot why NAND is everywhere in ICs'],
    prerequisites: ['AND, OR, NOT'],
    relatedChallengeId: 'c-nand-vs-and',
    relatedGame: 'dungeon',
    xp: 12,
    body: `NAND is AND followed by a NOT. If AND would have said 1, NAND says 0.

That extra bubble is not decoration. It is why a single NAND part can become NOT (tie inputs together), AND (NAND then NOT), or OR (with De Morgan).

NOR is the other universal cousin: OR then NOT.

If a truth table looks “upside down” from AND, you are probably looking at NAND. Write both tables side by side once — it sticks.`,
  },
  {
    id: 't-xor',
    title: 'XOR: the disagreement detector',
    creator: 'Meera Shah',
    subject: 'Digital Logic',
    unit: 'Unit 2 — Arithmetic helpers',
    topic: 'XOR / XNOR',
    difficulty: 'medium',
    type: 'notes',
    minutes: 16,
    objectives: ['State XOR in plain language', 'Fill a 2-input XOR table from memory', 'Connect XOR to parity'],
    prerequisites: ['AND, OR, NOT'],
    relatedChallengeId: 'c-xor-table',
    relatedGame: 'predict',
    xp: 12,
    body: `XOR is 1 when the inputs disagree. Same inputs → 0. That is it.

XNOR is the agreement detector: 1 when inputs match.

Adders, parity bits, and “toggle if different” tricks all sit on this idea. If you ever mix XOR with OR, remember OR is also 1 when both inputs are 1. XOR is not.`,
  },
  {
    id: 't-boolean-simplify',
    title: 'Boolean expressions without the panic',
    creator: 'Ishan Patel',
    subject: 'Digital Logic',
    unit: 'Unit 2 — Algebra',
    topic: 'Boolean algebra',
    difficulty: 'medium',
    type: 'notes',
    minutes: 24,
    objectives: ['Use identity, null, and complement laws', 'See why A + A·B = A', 'Check a simplification with a tiny table'],
    prerequisites: ['Gate truth tables'],
    relatedChallengeId: 'c-and-then-not',
    xp: 12,
    body: `Algebra is just rewriting a rule so the hardware (or your brain) does less work.

A + 0 = A. A · 1 = A. A + A' = 1. A · A' = 0.

Absorption: A + A·B = A. The extra AND cannot add a new case where the output becomes 1 if A was already 0.

Always verify with two or three input combinations. If the tables match, the rewrite is honest.`,
  },
  {
    id: 't-gpio-light',
    title: 'From darkness to a pin: streetlight thinking',
    creator: 'Sana Qureshi',
    subject: 'Embedded Systems',
    unit: 'Unit 3 — Sensing',
    topic: 'Thresholds',
    difficulty: 'easy',
    type: 'demo',
    minutes: 20,
    objectives: [
      'Describe ambient light as a number',
      'Explain a compare-with-threshold decision',
      'Name one way a wrong threshold fails in daylight',
    ],
    prerequisites: ['Digital 0/1 outputs'],
    relatedChallengeId: 'c-fault-or-and',
    xp: 12,
    body: `A smart streetlight is a comparison, not magic. A sensor reports “how bright” (0–100 in our demo). Firmware says: if the reading is darker than a threshold, turn the lamp on.

If someone leaves the threshold at 80, indoor evening still looks “dark” to the code and the lamp never rests. If the threshold is 5, dusk never wins.

The fault is often in the number, not the bulb. The Streetlight mission lets you prove that with a live test table — simulation only, not a real fixture.`,
  },
  {
    id: 't-de-morgan',
    title: 'De Morgan without memorizing fear',
    creator: 'Arjun Nair',
    subject: 'Digital Logic',
    unit: 'Unit 2 — Algebra',
    topic: 'De Morgan',
    difficulty: 'hard',
    type: 'notes',
    minutes: 20,
    objectives: ['Translate bubbles on a diagram into algebra', 'Convert AND-NOT to OR of NOTs', 'Check with a 4-row table'],
    prerequisites: ['NAND, NOR'],
    relatedChallengeId: 'c-nand-vs-and',
    xp: 12,
    body: `(A·B)' = A' + B'. Breaking an AND and flipping the whole result is the same as flipping each input and OR-ing.

(A + B)' = A' · B'.

Draw the bubbles. If you move a bubble through a gate, the gate type flips. Then confirm with 00, 01, 10, 11. Four rows beat a night of doubt.`,
  },
  {
    id: 't-timing-hygiene',
    title: 'Reading a datasheet like a teammate',
    creator: 'Priya Menon',
    subject: 'Electronics and Circuits',
    unit: 'Unit 0 — Lab habits',
    topic: 'Lab practice',
    difficulty: 'easy',
    type: 'notes',
    minutes: 12,
    objectives: ['Find Vcc and GND first', 'Never assume a pin is 5 V logic', 'Write the assumption you are simulating'],
    prerequisites: [],
    xp: 12,
    body: `This platform currently evaluates digital logic in software. It does not run SPICE, heat a transistor, or certify a live mains circuit.

When you leave the lab kit, still write assumptions: voltage family, pull-ups, what “dark” means. Future-you (and your viva panel) will thank present-you.`,
  },
  {
    id: 't-sampling-intro',
    title: 'Why sampling is not “taking a photo of voltage”',
    creator: 'Dev Joshi',
    subject: 'Communication Systems',
    unit: 'Unit 1 — Signals',
    topic: 'Sampling',
    difficulty: 'medium',
    type: 'notes',
    minutes: 18,
    objectives: ['State Nyquist as a caution, not a slogan', 'Separate quantization from sampling'],
    prerequisites: ['Analog vs digital intuition'],
    xp: 12,
    body: `Sampling captures a value at instants. Miss too many instants and a fast wiggle impersonates a slow one (aliasing).

This tutorial is conceptual. There is no live ADC in the demo. When you meet a real codec later, you will already know what question to ask: “How often, how many bits, and what anti-alias filter?”`,
  },
]

export const CHALLENGES: Challenge[] = [
  {
    id: 'c-and-output',
    title: 'AND under pressure',
    difficulty: 'easy',
    type: 'logic-output',
    world: 'Logic Rookie',
    statement: 'Inputs A=1, B=0 feed a 2-input AND. What is Y?',
    inputsNote: 'A and B are ideal digital levels. AND is the standard Boolean AND.',
    constraints: ['Answer with a single bit 0 or 1.', 'No extra gates.'],
    examples: ['If A=1, B=1 then Y=1', 'If A=0, B=0 then Y=0'],
    hints: [
      'AND is 1 only when every input is 1.',
      'B is 0, so the product cannot be 1.',
      'Y = 0.',
    ],
    xp: 20,
  },
  {
    id: 'c-xor-table',
    title: 'Fill the XOR table',
    difficulty: 'easy',
    type: 'truth-table',
    world: 'Logic Rookie',
    statement: 'Enter the four XOR outputs for inputs 00, 01, 10, 11 as four bits (example: 0110).',
    inputsNote: 'Row order is binary counting: 00, 01, 10, 11.',
    constraints: ['Exactly four characters, each 0 or 1.', 'No spaces.'],
    examples: ['AND would be 0001 in this order.'],
    hints: [
      'XOR is 1 when the two bits differ.',
      '00 and 11 agree, so those rows are 0.',
      'The string is 0110.',
    ],
    xp: 20,
  },
  {
    id: 'c-nand-vs-and',
    title: 'NAND is not a rude AND',
    difficulty: 'medium',
    type: 'logic-output',
    world: 'Logic Rookie',
    statement: 'A=1, B=1 into NAND. What is Y?',
    inputsNote: 'NAND = NOT(AND(A,B)).',
    constraints: ['Single bit 0 or 1.'],
    examples: ['AND of 1,1 is 1. NAND flips that.'],
    hints: [
      'First compute AND.',
      'Then invert.',
      'Y = 0.',
    ],
    xp: 32,
  },
  {
    id: 'c-and-then-not',
    title: 'Two-gate prediction',
    difficulty: 'medium',
    type: 'prediction',
    world: 'Logic Rookie',
    statement: 'A and B go into AND. That result goes into NOT. If A=1 and B=1, what is the final output?',
    inputsNote: 'No other connections. Ideal gates.',
    constraints: ['Single bit.'],
    examples: ['If either input is 0, AND is 0, NOT becomes 1.'],
    hints: [
      'Evaluate AND first.',
      'AND(1,1)=1.',
      'NOT of 1 is 0.',
    ],
    xp: 32,
  },
  {
    id: 'c-fault-or-and',
    title: 'Fault Hunter: wrong gate on the bench',
    difficulty: 'hard',
    type: 'fault',
    world: 'Logic Rookie',
    statement:
      'A designer wanted a lamp that lights only if both Enable and Ready are 1. On the board, the lamp lights if either is 1. Which gate was fitted by mistake?',
    inputsNote: 'Observed: 10 → lamp 1; 01 → lamp 1; 11 → lamp 1; 00 → lamp 0.',
    constraints: ['Answer AND, OR, XOR, or NAND (the mistaken part).'],
    examples: ['Desired behaviour matches AND.'],
    hints: [
      'The observed table matches a generous gate.',
      'OR is 1 unless both inputs are 0.',
      'The mistaken gate is OR.',
    ],
    xp: 48,
  },
]

export function expectedChallenge(id: string): string {
  switch (id) {
    case 'c-and-output':
      return bit(evalGate('AND', true, false))
    case 'c-xor-table':
      return [false, true]
        .flatMap((a) => [false, true].map((b) => bit(evalGate('XOR', a, b))))
        .join('')
    case 'c-nand-vs-and':
      return bit(evalGate('NAND', true, true))
    case 'c-and-then-not':
      return bit(evalGate('NOT', evalGate('AND', true, true)))
    case 'c-fault-or-and':
      return 'OR'
    default:
      return ''
  }
}

export function normalizeAnswer(id: string, raw: string): string {
  const t = raw.trim().toUpperCase().replace(/\s+/g, '')
  if (id === 'c-fault-or-and') return t
  return t
}

export const STREETLIGHT_TESTS: MissionTest[] = [
  { id: 'night', label: 'Night (light = 5)', light: 5, expectOn: true },
  { id: 'dusk', label: 'Dusk (light = 25)', light: 25, expectOn: true },
  { id: 'indoor', label: 'Indoor evening (light = 50)', light: 50, expectOn: false },
  { id: 'noon', label: 'Noon (light = 90)', light: 90, expectOn: false },
]

export const CORRECT_THRESHOLD = 30
export const FAULTY_THRESHOLD = 80

export function lampOn(light: number, threshold: number): boolean {
  return light < threshold
}

export const SAMPLE_PROJECTS: ProjectPost[] = [
  {
    id: 'p-logic-kit',
    title: 'Pocket truth-table trainer',
    author: 'Kavya Iyer',
    topic: 'Digital Logic',
    difficulty: 'easy',
    description: 'A study card set plus a tiny AND/XOR quiz we used before internals.',
    components: ['Paper cards', 'Optional LEDs on a trainer board'],
    skills: ['Truth tables', 'Peer quizzing'],
    approach: 'Each card shows inputs; the back shows the gate and Y. We swapped decks between benches.',
    mistakes: 'We first printed XOR as OR. Two people failed a mock because of that card.',
    improvements: 'Added a “common mix-ups” card. Would love a Virtual Lab export next.',
    demoLabel: 'No live link — photos were on a class drive (not connected here).',
    draft: false,
    status: 'approved',
  },
  {
    id: 'p-street-sim',
    title: 'Threshold notes for a campus path light',
    author: 'Omar Siddiqui',
    topic: 'Embedded Systems',
    difficulty: 'medium',
    description: 'We logged “does this feel dark?” vs a cheap LDR divider, then argued about the number.',
    components: ['LDR', 'Microcontroller (lab kit)', 'LED as lamp stand-in'],
    skills: ['Thresholding', 'Writing acceptance tests'],
    approach: 'Four lighting conditions, same as the COGNIVOLT streetlight mission.',
    mistakes: 'Used 80 as threshold after one night test. Indoor corridor kept the LED on.',
    improvements: 'Document the number next to the photo of the path.',
    demoLabel: 'Hardware not connected — results described only.',
    draft: false,
    status: 'approved',
  },
]

export const GROUP_TOPICS = [
  { id: 'g-gates', name: 'Sunday gate drill', goal: 'Finish Logic Rookie tables before internals', members: 6 },
  { id: 'g-embed', name: 'Embedded office hours', goal: 'Walk through streetlight tests together', members: 4 },
  { id: 'g-comm', name: 'Signals reading circle', goal: 'One paper-style problem a week', members: 3 },
]
