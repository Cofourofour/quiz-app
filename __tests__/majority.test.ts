import { describe, it, expect } from 'vitest'
import { calculateMajority, validateAnswers, getAnswerDistribution, type QuizAnswer } from '../lib/majority'

describe('calculateMajority', () => {
  it('should return the most frequent label', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'A' },
      { selected_label: 'A' },
      { selected_label: 'B' },
      { selected_label: 'C' },
      { selected_label: 'A' },
      { selected_label: 'D' }
    ]

    const result = calculateMajority(answers)
    
    expect(result.result_key).toBe('A')
    expect(result.count).toBe(3)
    expect(result.total_answers).toBe(6)
  })

  it('should handle tie-breaking with A > B > C > D priority', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'C' },
      { selected_label: 'A' },
      { selected_label: 'C' },
      { selected_label: 'A' }
    ]

    const result = calculateMajority(answers)
    
    // A and C both have 2 occurrences, but A has higher priority
    expect(result.result_key).toBe('A')
    expect(result.count).toBe(2)
  })

  it('should handle case insensitive labels', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'a' },
      { selected_label: 'A' },
      { selected_label: 'b' },
      { selected_label: 'B' }
    ]

    const result = calculateMajority(answers)
    
    // A and B both have 2 occurrences, but A has higher priority
    expect(result.result_key).toBe('A')
    expect(result.count).toBe(2)
  })

  it('should return B when B has more occurrences than A', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'A' },
      { selected_label: 'B' },
      { selected_label: 'B' },
      { selected_label: 'B' },
      { selected_label: 'C' }
    ]

    const result = calculateMajority(answers)
    
    expect(result.result_key).toBe('B')
    expect(result.count).toBe(3)
  })

  it('should handle all same labels', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'D' },
      { selected_label: 'D' },
      { selected_label: 'D' }
    ]

    const result = calculateMajority(answers)
    
    expect(result.result_key).toBe('D')
    expect(result.count).toBe(3)
    expect(result.total_answers).toBe(3)
  })

  it('should handle single answer', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'C' }
    ]

    const result = calculateMajority(answers)
    
    expect(result.result_key).toBe('C')
    expect(result.count).toBe(1)
    expect(result.total_answers).toBe(1)
  })

  it('should throw error for empty answers array', () => {
    expect(() => calculateMajority([])).toThrow('Cannot calculate majority from empty answers array')
  })

  it('should handle complex tie-breaking scenario', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'D' },
      { selected_label: 'B' },
      { selected_label: 'D' },
      { selected_label: 'B' },
      { selected_label: 'C' },
      { selected_label: 'C' }
    ]

    const result = calculateMajority(answers)
    
    // B, C, and D all have 2 occurrences, but B has highest priority among them
    expect(result.result_key).toBe('B')
    expect(result.count).toBe(2)
  })
})

describe('validateAnswers', () => {
  it('should return true for valid answers matching expected count', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'A' },
      { selected_label: 'B' },
      { selected_label: 'C' },
      { selected_label: 'D' },
      { selected_label: 'A' },
      { selected_label: 'B' }
    ]

    expect(validateAnswers(answers, 6)).toBe(true)
  })

  it('should return false for incorrect answer count', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'A' },
      { selected_label: 'B' }
    ]

    expect(validateAnswers(answers, 6)).toBe(false)
  })

  it('should return false for invalid labels', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'A' },
      { selected_label: 'X' }, // Invalid label
      { selected_label: 'B' }
    ]

    expect(validateAnswers(answers, 3)).toBe(false)
  })

  it('should handle case insensitive validation', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'a' },
      { selected_label: 'B' },
      { selected_label: 'c' }
    ]

    expect(validateAnswers(answers, 3)).toBe(true)
  })

  it('should return true for empty answers when expecting zero', () => {
    expect(validateAnswers([], 0)).toBe(true)
  })
})

describe('getAnswerDistribution', () => {
  it('should return correct distribution of answers', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'A' },
      { selected_label: 'A' },
      { selected_label: 'B' },
      { selected_label: 'C' },
      { selected_label: 'A' }
    ]

    const distribution = getAnswerDistribution(answers)
    
    expect(distribution).toEqual({
      A: 3,
      B: 1,
      C: 1,
      D: 0
    })
  })

  it('should handle case insensitive labels', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'a' },
      { selected_label: 'A' },
      { selected_label: 'b' }
    ]

    const distribution = getAnswerDistribution(answers)
    
    expect(distribution).toEqual({
      A: 2,
      B: 1,
      C: 0,
      D: 0
    })
  })

  it('should return zero distribution for empty answers', () => {
    const distribution = getAnswerDistribution([])
    
    expect(distribution).toEqual({
      A: 0,
      B: 0,
      C: 0,
      D: 0
    })
  })

  it('should ignore invalid labels', () => {
    const answers: QuizAnswer[] = [
      { selected_label: 'A' },
      { selected_label: 'X' }, // Invalid label
      { selected_label: 'B' }
    ]

    const distribution = getAnswerDistribution(answers)
    
    expect(distribution).toEqual({
      A: 1,
      B: 1,
      C: 0,
      D: 0
    })
  })
})
