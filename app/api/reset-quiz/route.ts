import { NextRequest, NextResponse } from 'next/server'
import { resetQuizData } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Resetting quiz data with new randomized answers...')
    
    resetQuizData()
    
    return NextResponse.json({
      success: true,
      message: 'Quiz data reset successfully!',
      changes: [
        'Removed A/B/C/D labels from answer options',
        'Randomized answer order for each question', 
        'Fixed result calculation (removed debug code forcing result A)'
      ]
    })
  } catch (error) {
    console.error('❌ Error resetting quiz data:', error)
    return NextResponse.json(
      { error: 'Failed to reset quiz data', details: error },
      { status: 500 }
    )
  }
}
