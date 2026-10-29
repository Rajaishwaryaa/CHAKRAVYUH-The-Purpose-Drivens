import { describe, expect, it } from 'vitest'
import { CHALLENGES, CORRECT_THRESHOLD, FAULTY_THRESHOLD, STREETLIGHT_TESTS, expectedChallenge, lampOn } from './catalog'
import { evalGate } from '../lib/logic'

describe('streetlight mission', () => {
  it('fails indoor evening at the planted threshold and passes at 30', () => {
    const indoor = STREETLIGHT_TESTS.find((t) => t.id === 'indoor')!
    expect(lampOn(indoor.light, FAULTY_THRESHOLD)).toBe(true)
    expect(lampOn(indoor.light, FAULTY_THRESHOLD) === indoor.expectOn).toBe(false)
    expect(STREETLIGHT_TESTS.every((t) => lampOn(t.light, CORRECT_THRESHOLD) === t.expectOn)).toBe(true)
  })

  it('does not complete if any required test fails', () => {
    const allPass = STREETLIGHT_TESTS.every((t) => lampOn(t.light, FAULTY_THRESHOLD) === t.expectOn)
    expect(allPass).toBe(false)
  })
})

describe('challenge expected answers', () => {
  it('AND 1,0 is 0', () => {
    expect(expectedChallenge('c-and-output')).toBe('0')
    expect(evalGate('AND', true, false)).toBe(false)
  })
  it('XOR table is disagreement bits', () => {
    expect(expectedChallenge('c-xor-table')).toBe('0110')
  })
  it('keeps a unique id for every published challenge', () => {
    const ids = CHALLENGES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(5)
  })
})
