import { notFound } from 'next/navigation'
import Link from 'next/link'
import { QuizDB } from '@/lib/database'
import QuizWrapper from '@/components/QuizWrapper'
import { Suspense } from 'react'

interface QuizPageProps {
  params: Promise<{
    slug: string
  }>
}

interface Quiz {
  id: string
  slug: string
  title: string
  description?: string
  active: number
}

interface Question {
  id: string
  quiz_id: string
  position: number
  title: string
  options: Array<{
    id: string
    label: string
    text: string
    result_key: string
  }>
}

interface Result {
  id: string
  quiz_id: string
  key: string
  name: string
  headline: string
  description: string
  email_template?: string
}

async function getQuizData(slug: string) {
  try {
    // Get quiz
    const quiz = QuizDB.getQuizBySlug(slug) as Quiz | undefined
    
    if (!quiz) {
      return null
    }

    // Get questions with options
    const questionsData = QuizDB.getQuestions(quiz.id) as any[]
    
    // Parse options from JSON
    const questions: Question[] = questionsData.map((q: any) => ({
      ...q,
      options: JSON.parse(q.options)
    }))

    // Get results for this quiz
    const results = QuizDB.getResults(quiz.id) as Result[]

    return {
      quiz,
      questions,
      results
    }
  } catch (error) {
    // If database fails, return null for 404
    console.error('Database connection failed:', error)
    return null
  }
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { slug } = await params
  const data = await getQuizData(slug)

  if (!data) {
    notFound()
  }

  // Always use the wrapper component which handles popup detection client-side
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <Link href="/" className="text-2xl font-bold hover:opacity-75" style={{ color: 'var(--primary)' }}>
            Co404 Quiz
          </Link>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="container mx-auto px-4 py-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            {data.quiz.title}
          </h1>
          <p className="text-lg" style={{ color: 'var(--text)' }}>
            Answer these {data.questions.length} questions to discover your digital nomad personality type.
          </p>
        </div>

        <QuizWrapper data={data} />
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t" style={{ borderColor: 'var(--card)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--text)' }}>
            © 2025 Co404. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getQuizData(slug)
  
  if (!data) {
    return {
      title: 'Quiz Not Found'
    }
  }

  return {
    title: data.quiz.title,
    description: `Take our ${data.quiz.title} quiz to discover your personality type. Quick ${data.questions.length}-question assessment with instant results.`,
  }
}
