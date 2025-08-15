#!/usr/bin/env node

import { resetQuizData } from '../lib/database.js'

console.log('🔄 Resetting quiz data with new randomized answers...')

try {
  resetQuizData()
  console.log('✅ Quiz data reset successfully!')
  console.log('📝 Changes made:')
  console.log('   • Removed A/B/C/D labels from answer options')
  console.log('   • Randomized answer order for each question')
  console.log('   • Fixed result calculation (removed debug code forcing result A)')
  process.exit(0)
} catch (error) {
  console.error('❌ Error resetting quiz data:', error)
  process.exit(1)
}
