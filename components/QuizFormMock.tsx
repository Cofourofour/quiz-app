'use client'

import { useState } from 'react'

interface Option {
  id: string
  label: string
  text: string
  result_key: string
}

interface Question {
  id: string
  position: number
  title: string
  options: Option[]
}

interface Result {
  key: string
  name: string
  headline: string
  description: string
}

interface MockData {
  quiz: {
    id: string
    slug: string
    title: string
  }
  questions: Question[]
  results: Result[]
}

interface QuizFormMockProps {
  data: MockData
}

export default function QuizFormMock({ data }: QuizFormMockProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)

  const currentQuestion = data.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === data.questions.length - 1
  const hasAnsweredCurrent = answers[currentQuestion.id]

  const handleAnswerSelect = (questionId: string, resultKey: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: resultKey
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate result using simple majority logic
      const answerValues = Object.values(answers)
      const counts: Record<string, number> = {}
      
      // Count occurrences of each result key
      answerValues.forEach(key => {
        counts[key] = (counts[key] || 0) + 1
      })
      
      // Find the key with the highest count
      let maxCount = 0
      let resultKey = 'A' // fallback
      
      Object.entries(counts).forEach(([key, count]) => {
        if (count > maxCount) {
          maxCount = count
          resultKey = key
        }
      })
      
      const calculatedResult = data.results.find(r => r.key === resultKey)
      
      if (calculatedResult) {
        setResult(calculatedResult)
        setShowEmailForm(true)
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setShowEmailForm(false)
  }

  if (result && !showEmailForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-8 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Your Result: {result.name}
            </h2>
            <p className="text-xl mb-6" style={{ color: 'var(--text)' }}>
              {result.headline}
            </p>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
              {result.description}
            </p>
          </div>

          <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Embed This Quiz
            </h3>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
              <code>
                {`<iframe src="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/quiz/${data.quiz.slug}" width="100%" height="600" frameborder="0"></iframe>`}
              </code>
            </div>
            <p className="text-sm mt-2" style={{ color: 'var(--text)' }}>
              Copy this code to embed the quiz on your website.
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--text-light)' }}
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showEmailForm && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-8 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Your Result: {result.name}
            </h2>
            <p className="text-xl mb-6" style={{ color: 'var(--text)' }}>
              {result.headline}
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                Get your detailed results via email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--accent)',
                  color: 'var(--text)'
                }}
                placeholder="your@email.com"
              />
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                <strong>Demo Mode:</strong> In the real version, you'd receive a personalized email with your results and recommendations. 
                For now, click submit to see your result without sending an actual email.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="flex-1 px-6 py-3 rounded-lg font-medium border-2 hover:opacity-90 transition-opacity"
                style={{ 
                  borderColor: 'var(--accent)', 
                  color: 'var(--accent)',
                  backgroundColor: 'transparent'
                }}
              >
                Skip Email
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="flex-1 px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--text-light)' }}
              >
                {isSubmitting ? 'Submitting...' : 'Get My Results'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            Question {currentQuestionIndex + 1} of {data.questions.length}
          </span>
          <span className="text-sm" style={{ color: 'var(--text)' }}>
            {Math.round(((currentQuestionIndex + 1) / data.questions.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--card)' }}>
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: 'var(--primary)',
              width: `${((currentQuestionIndex + 1) / data.questions.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-8 rounded-lg shadow-lg mb-6" style={{ backgroundColor: 'var(--card)' }}>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text)' }}>
          {currentQuestion.title}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(currentQuestion.id, option.result_key)}
              className={`w-full p-4 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${
                answers[currentQuestion.id] === option.result_key
                  ? 'ring-2 ring-opacity-50'
                  : 'hover:shadow-md'
              }`}
              style={{
                backgroundColor: answers[currentQuestion.id] === option.result_key 
                  ? 'var(--accent)' 
                  : 'var(--background)',
                color: answers[currentQuestion.id] === option.result_key 
                  ? 'var(--text-light)' 
                  : 'var(--text)'
              }}
            >
              <div className="flex items-center">
                <span className="text-lg font-semibold mr-3">
                  {option.label}.
                </span>
                <span className="text-base">
                  {option.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        {currentQuestionIndex > 0 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-lg font-medium border-2 hover:opacity-90 transition-opacity"
            style={{ 
              borderColor: 'var(--accent)', 
              color: 'var(--accent)',
              backgroundColor: 'transparent'
            }}
          >
            Back
          </button>
        )}
        
        <button
          onClick={handleNext}
          disabled={!hasAnsweredCurrent}
          className="flex-1 px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--text-light)' }}
        >
          {isLastQuestion ? 'See My Results' : 'Next Question'}
        </button>
      </div>
    </div>
  )
}
