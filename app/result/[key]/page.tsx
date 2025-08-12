import { notFound } from 'next/navigation'
import Link from 'next/link'
import { QuizDB } from '@/lib/database'

interface ResultPageProps {
  params: Promise<{
    key: string
  }>
}

async function getResultData(key: string) {
  try {
    // Get all quizzes to find results
    const quiz = QuizDB.getQuizBySlug('digital-nomad-type') as any
    
    if (!quiz) {
      return null
    }

    // Get results for this quiz
    const results = QuizDB.getResults(quiz.id) as any[]
    const result = results.find((r: any) => r.key === key.toUpperCase())
    
    if (!result) {
      return null
    }

    return {
      ...result,
      quiz: {
        slug: quiz.slug,
        title: quiz.title,
        active: quiz.active
      }
    }
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { key } = await params
  const result = await getResultData(key)

  if (!result) {
    notFound()
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:opacity-75" style={{ color: 'var(--primary)' }}>
            Co404 Quiz
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/legal/terms" className="hover:opacity-75" style={{ color: 'var(--text)' }}>
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:opacity-75" style={{ color: 'var(--text)' }}>
              Privacy
            </Link>
          </nav>
        </div>
      </header>

      {/* Result Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--text-light)' }}
            >
              {result.key}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              {result.name}
            </h1>
            {result.headline && (
              <p className="text-xl md:text-2xl mb-6" style={{ color: 'var(--accent)' }}>
                {result.headline}
              </p>
            )}
            {result.description && (
              <div 
                className="p-8 rounded-lg text-lg leading-relaxed"
                style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
              >
                {result.description}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Want to discover your type?
            </h2>
            <p className="mb-6" style={{ color: 'var(--text)' }}>
              Take our quick quiz to find out which digital nomad personality matches you best.
            </p>
            <Link
              href={`/quiz/${result.quiz.slug}`}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'var(--text-light)',
                boxShadow: '0 4px 14px 0 rgba(180, 119, 117, 0.25)'
              }}
            >
              Take the Quiz
              <svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </Link>
          </div>

          {/* Other Results */}
          <div className="mt-16">
            <h3 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--text)' }}>
              Explore Other Nomad Types
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].filter(k => k !== result.key).map(key => (
                <Link
                  key={key}
                  href={`/result/${key}`}
                  className="p-4 rounded-lg hover:opacity-75 transition-opacity"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3"
                      style={{ backgroundColor: 'var(--accent)', color: 'var(--text-light)' }}
                    >
                      {key}
                    </div>
                    <span style={{ color: 'var(--text)' }}>
                      View Type {key} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
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

export async function generateMetadata({ params }: ResultPageProps) {
  const { key } = await params
  const result = await getResultData(key)
  
  if (!result) {
    return {
      title: 'Result Not Found'
    }
  }

  return {
    title: `${result.name} - ${result.quiz.title}`,
    description: result.headline || result.description || `Learn about the ${result.name} digital nomad personality type.`,
  }
}

export async function generateStaticParams() {
  try {
    const quiz = QuizDB.getQuizBySlug('digital-nomad-type') as any
    if (!quiz) return []
    
    const results = QuizDB.getResults(quiz.id) as any[]
    
    return results?.map((result: any) => ({
      key: result.key.toLowerCase(),
    })) || []
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
