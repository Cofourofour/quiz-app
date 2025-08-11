/**
 * Calculate the majority result from quiz answers
 * Counts occurrences of each label (A, B, C, D) and returns the most frequent one
 * In case of ties, uses deterministic tie-breaker: A > B > C > D
 */

export type QuizAnswer = {
  selected_label: string
}

export type MajorityResult = {
  result_key: string
  count: number
  total_answers: number
}

export function calculateMajority(answers: QuizAnswer[]): MajorityResult {
  if (answers.length === 0) {
    throw new Error('Cannot calculate majority from empty answers array')
  }

  // Count occurrences of each label
  const counts: Record<string, number> = {}
  
  for (const answer of answers) {
    const label = answer.selected_label.toUpperCase()
    counts[label] = (counts[label] || 0) + 1
  }

  // Find the label with the highest count
  let maxCount = 0
  let resultKey = ''

  // Define priority order for tie-breaking: A > B > C > D
  const priorities = ['A', 'B', 'C', 'D']
  
  for (const label of priorities) {
    const count = counts[label] || 0
    if (count > maxCount) {
      maxCount = count
      resultKey = label
    }
  }

  // If no valid labels found, default to A
  if (!resultKey) {
    resultKey = 'A'
    maxCount = 0
  }

  return {
    result_key: resultKey,
    count: maxCount,
    total_answers: answers.length
  }
}

/**
 * Validate that all required questions have been answered
 */
export function validateAnswers(answers: QuizAnswer[], expectedQuestionCount: number): boolean {
  if (answers.length !== expectedQuestionCount) {
    return false
  }

  // Check that all answers have valid labels
  const validLabels = new Set(['A', 'B', 'C', 'D'])
  return answers.every(answer => 
    validLabels.has(answer.selected_label.toUpperCase())
  )
}

/**
 * Get distribution of answers across all options
 */
export function getAnswerDistribution(answers: QuizAnswer[]): Record<string, number> {
  const distribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 }
  
  for (const answer of answers) {
    const label = answer.selected_label.toUpperCase()
    if (label in distribution) {
      distribution[label]++
    }
  }
  
  return distribution
}
