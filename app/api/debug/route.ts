import { NextResponse } from 'next/server'
import { QuizDB } from '@/lib/database'

export async function GET() {
  try {
    const quiz = QuizDB.getQuizBySlug('digital-nomad-type') as any
    const questions = quiz ? QuizDB.getQuestions(quiz.id) : null
    const results = quiz ? QuizDB.getResults(quiz.id) : null
    
    return NextResponse.json({
      quiz: quiz ? { id: quiz.id, slug: quiz.slug, title: quiz.title } : null,
      questionsCount: questions ? questions.length : 0,
      resultsCount: results ? results.length : 0,
      results: results ? results.map((r: any) => ({ key: r.key, name: r.name })) : []
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}
