import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { QuizDB } from '@/lib/database'
import { sendEmail, generateResultEmail } from '@/lib/gmail'
import { googleSheets } from '@/lib/google-sheets'
import { hashIP } from '@/lib/utils'

// Zod schema for request validation
const SubmissionSchema = z.object({
  quiz_slug: z.string().min(1),
  email: z.string().email(),
  answers: z.record(z.string(), z.string()), // questionId -> resultKey
  consent: z.boolean(),
  device: z.string().optional().default('desktop')
})

// Simple majority calculation for SQLite version
function calculateResult(answers: string[]): string {
  const counts: Record<string, number> = {}
  
  answers.forEach(key => {
    counts[key] = (counts[key] || 0) + 1
  })
  
  let maxCount = 0
  let resultKey = 'A' // fallback
  
  Object.entries(counts).forEach(([key, count]) => {
    if (count > maxCount) {
      maxCount = count
      resultKey = key
    }
  })
  
  return resultKey
}

export async function POST(request: NextRequest) {
  try {
    // Update email templates on first run (can be removed after deployment)
    try {
      QuizDB.updateEmailTemplates()
    } catch (error) {
      console.log('Email template update skipped:', error)
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = SubmissionSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { quiz_slug, email, answers, consent, device } = validation.data

    // Check consent
    if (!consent) {
      return NextResponse.json(
        { error: 'Consent is required to receive emails' },
        { status: 400 }
      )
    }

    // Get quiz data
    const quiz = QuizDB.getQuizBySlug(quiz_slug) as any
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found or inactive' },
        { status: 404 }
      )
    }

    // Get questions for this quiz to validate answers
    const questionsData = QuizDB.getQuestions(quiz.id) as any[]
    
    if (!questionsData || questionsData.length === 0) {
      return NextResponse.json(
        { error: 'Failed to load quiz questions' },
        { status: 500 }
      )
    }

    // Validate that all questions are answered
    const questionIds = new Set(questionsData.map((q: any) => q.id))
    const answeredQuestionIds = new Set(Object.keys(answers))
    
    for (const questionId of questionIds) {
      if (!answeredQuestionIds.has(questionId)) {
        return NextResponse.json(
          { error: `Missing answer for question: ${questionId}` },
          { status: 400 }
        )
      }
    }

    // Calculate result using majority logic
    const answerValues = Object.values(answers)
    const resultKey = calculateResult(answerValues)

    console.log('Debug - answers object:', JSON.stringify(answers))
    console.log('Debug - answerValues array:', JSON.stringify(answerValues))
    console.log('Debug - calculated resultKey:', resultKey)

    // Get result data
    const results = QuizDB.getResults(quiz.id) as any[]
    console.log('Debug - results from DB:', JSON.stringify(results.map(r => ({ key: r.key, name: r.name }))))
    console.log('Debug - looking for result with key:', resultKey)
    
    const result = results.find((r: any) => r.key === resultKey)
    console.log('Debug - found result:', result ? { key: result.key, name: result.name } : 'null')
    
    if (!result) {
      console.log('Debug - Result lookup failed')
      console.log('Debug - Available keys:', results.map(r => r.key))
      console.log('Debug - Search key:', resultKey)
      console.log('Debug - Key type:', typeof resultKey)
      console.log('Debug - Key length:', resultKey.length)
      console.log('Debug - First available key type:', typeof results[0]?.key)
      return NextResponse.json(
        { 
          error: 'Result calculation failed', 
          debug: { 
            resultKey, 
            availableKeys: results.map(r => r.key),
            answerValues,
            resultKeyType: typeof resultKey,
            availableKeyTypes: results.map(r => typeof r.key)
          } 
        },
        { status: 500 }
      )
    }

    // Get client metadata
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwarded?.split(',')[0] || realIp || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Save submission to database
    try {
      const submissionId = QuizDB.saveSubmission({
        quiz_id: quiz.id,
        email,
        result_key: resultKey,
        answers,
        ip_hash: hashIP(clientIp),
        user_agent: userAgent
      })

      console.log(`Submission saved: ${submissionId}`)
    } catch (error) {
      console.error('Failed to save submission:', error)
      // Continue even if saving fails
    }

    // Send result email
    try {
      if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        const emailContent = generateResultEmail(email, result)
        await sendEmail({
          to: email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        })
        console.log(`Result email sent to: ${email}`)
      } else {
        console.log('Gmail not configured, skipping email')
      }
    } catch (error) {
      console.error('Failed to send email:', error)
      // Continue even if email fails
    }

    // Save to Google Sheets
    try {
      await googleSheets.appendToSheet({
        email,
        quiz_slug,
        result_key: resultKey,
        result_name: result.name,
        device,
        timestamp: new Date()
      })
      console.log(`Submission saved to Google Sheets: ${email}`)
    } catch (error) {
      console.error('Failed to save to Google Sheets:', error)
      // Continue even if Google Sheets fails
    }

    // Return success response with result key
    return NextResponse.json({
      success: true,
      result: resultKey, // Just return the key string
      submission_id: Date.now().toString() // Simple ID for frontend
    })

  } catch (error) {
    console.error('Quiz submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
