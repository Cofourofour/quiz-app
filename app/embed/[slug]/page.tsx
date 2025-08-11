import { notFound } from 'next/navigation'
import { QuizDB } from '@/lib/database'
import QuizForm from '@/components/QuizForm'

interface EmbedPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getQuizData(slug: string) {
  try {
    // Get quiz
    const quiz = QuizDB.getQuizBySlug(slug) as any
    
    if (!quiz) {
      return null
    }

    // Get questions with options
    const questionsData = QuizDB.getQuestions(quiz.id) as any[]
    
    // Parse options from JSON
    const questions = questionsData.map((q: any) => ({
      ...q,
      options: JSON.parse(q.options)
    }))

    // Get results for this quiz
    const results = QuizDB.getResults(quiz.id) as any[]

    return {
      quiz,
      questions,
      results
    }
  } catch (error) {
    console.error('Database connection failed:', error)
    return null
  }
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { slug } = await params
  const data = await getQuizData(slug)

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--background)' }}>
      {/* Minimal Header for Embed */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          {data.quiz.title}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text)' }}>
          {data.questions.length} quick questions
        </p>
      </div>

      {/* Quiz Form */}
      <QuizForm data={data} />

      {/* Minimal Footer */}
      <div className="text-center mt-8 pt-4 border-t" style={{ borderColor: 'var(--card)' }}>
        <p className="text-sm" style={{ color: 'var(--text)' }}>
          Powered by{' '}
          <a 
            href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold hover:opacity-75"
            style={{ color: 'var(--primary)' }}
          >
            Co404 Quiz
          </a>
        </p>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: EmbedPageProps) {
  const { slug } = await params
  const data = await getQuizData(slug)
  
  if (!data) {
    return {
      title: 'Quiz Embed'
    }
  }

  return {
    title: data.quiz.title,
    description: `Embedded quiz: ${data.quiz.title}`,
    robots: 'noindex', // Don't index embed pages
  }
}
