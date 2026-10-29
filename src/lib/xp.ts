export const RANK_LADDER = [
  { min: 0, name: 'Beginner' },
  { min: 40, name: 'Circuit Explorer' },
  { min: 100, name: 'Debugger' },
  { min: 180, name: 'Systems Engineer' },
  { min: 280, name: 'AI Innovator' },
  { min: 420, name: 'Engineering Legend' },
] as const

export function rankFor(xp: number): { name: string; next?: string; remain?: number } {
  let current: (typeof RANK_LADDER)[number] = RANK_LADDER[0]
  let next: (typeof RANK_LADDER)[number] | undefined
  for (let i = 0; i < RANK_LADDER.length; i++) {
    if (xp >= RANK_LADDER[i].min) current = RANK_LADDER[i]
    if (RANK_LADDER[i].min > xp) {
      next = RANK_LADDER[i]
      break
    }
  }
  return {
    name: current.name,
    next: next?.name,
    remain: next ? next.min - xp : undefined,
  }
}

export const XP = {
  tutorial: 12,
  gameEasy: 10,
  gameMedium: 16,
  gameHard: 22,
  challengeEasy: 20,
  challengeMedium: 32,
  challengeHard: 48,
  mission: 80,
  remix: 8,
} as const

export function applyReward(
  completions: Record<string, string>,
  xp: number,
  key: string,
  amount: number,
  at = new Date().toISOString(),
): { completions: Record<string, string>; xp: number; awarded: boolean; amount: number } {
  if (completions[key]) return { completions, xp, awarded: false, amount: 0 }
  return {
    completions: { ...completions, [key]: at },
    xp: xp + amount,
    awarded: true,
    amount,
  }
}
