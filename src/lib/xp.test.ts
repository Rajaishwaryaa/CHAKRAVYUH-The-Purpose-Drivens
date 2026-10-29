import { describe, expect, it } from 'vitest'
import { applyReward, rankFor } from './xp'

describe('applyReward', () => {
  it('awards once then refuses duplicates', () => {
    const first = applyReward({}, 0, 'ch:c-and-output', 20, 't1')
    expect(first.awarded).toBe(true)
    expect(first.xp).toBe(20)
    const second = applyReward(first.completions, first.xp, 'ch:c-and-output', 20, 't2')
    expect(second.awarded).toBe(false)
    expect(second.xp).toBe(20)
  })
})

describe('rankFor', () => {
  it('uses the published ladder names', () => {
    expect(rankFor(0).name).toBe('Beginner')
    expect(rankFor(40).name).toBe('Circuit Explorer')
    expect(rankFor(100).name).toBe('Debugger')
  })
})
