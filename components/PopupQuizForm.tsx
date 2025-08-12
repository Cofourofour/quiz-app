'use client'

import { useState, useEffect } from 'react'

interface QuizOption {
  id: string
  label: string
  text: string
  result_key: string
}

interface QuizQuestion {
  id: string
  position: number
  title: string
  options: QuizOption[]
}

interface QuizResult {
  key: string
  name: string
  headline: string | null
  description: string | null
}

interface QuizData {
  quiz: {
    id: string
    slug: string
    title: string
  }
  questions: QuizQuestion[]
  results: QuizResult[]
}

interface PopupQuizProps {
  data: QuizData
  device?: string
}

export default function PopupQuizForm({ data, device = 'desktop' }: PopupQuizProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'question' | 'email' | 'result'>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Debug log to confirm popup component is loading
  useEffect(() => {
    console.log('PopupQuizForm loaded - device:', device)
  }, [device])

  // Add effect to hide header/footer when in popup mode
  useEffect(() => {
    const isInPopup = window.location.search.includes('popup=true')
    if (isInPopup) {
      // Hide the main page header and footer
      const header = document.querySelector('header')
      const footer = document.querySelector('footer')
      const main = document.querySelector('main')
      
      if (header) header.style.display = 'none'
      if (footer) footer.style.display = 'none'
      if (main) {
        main.style.padding = '0'
        main.style.margin = '0'
        main.style.maxWidth = 'none'
      }
      
      // Set body styles for popup
      document.body.style.margin = '0'
      document.body.style.padding = '0'
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      // Cleanup on unmount
      if (isInPopup) {
        const header = document.querySelector('header')
        const footer = document.querySelector('footer')
        const main = document.querySelector('main')
        
        if (header) header.style.display = ''
        if (footer) footer.style.display = ''
        if (main) {
          main.style.padding = ''
          main.style.margin = ''
          main.style.maxWidth = ''
        }
        
        document.body.style.margin = ''
        document.body.style.padding = ''
        document.body.style.overflow = ''
      }
    }
  }, [])

  const sortedQuestions = data.questions.sort((a, b) => a.position - b.position)
  const currentQuestion = sortedQuestions[currentQuestionIndex]
  const totalQuestions = sortedQuestions.length
  
  // Responsive heights based on device
  const containerHeight = device === 'mobile' ? 'h-[500px]' : 'h-[600px]'
  const contentPadding = device === 'mobile' ? 'p-2' : 'p-3'
  const headerPadding = device === 'mobile' ? 'p-1' : 'p-1'

  const handleStartQuiz = () => {
    setCurrentStep('question')
  }

  const handleAnswerSelect = async (option: QuizOption) => {
    // Set the answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option.result_key
    }))

    // Show transition effect
    setIsTransitioning(true)
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Move to next question or email step
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setCurrentStep('email')
    }
    
    setIsTransitioning(false)
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    } else {
      setCurrentStep('intro')
    }
  }

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return 'Email is required'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Please enter a valid email address'
    }
    return null
  }

  const handleEmailSubmit = async () => {
    const emailValidationError = validateEmail(email)
    if (emailValidationError) {
      setEmailError(emailValidationError)
      return
    }

    if (!consent) {
      setEmailError('Please agree to receive emails')
      return
    }

    setEmailError('')
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: data.quiz.id,
          email: email.trim(),
          answers,
          consent,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit quiz')
      }

      const { result: quizResult } = await response.json()
      const resultData = data.results.find(r => r.key === quizResult)
      
      if (resultData) {
        setResult(resultData)
        setCurrentStep('result')
      } else {
        throw new Error('Result not found')
      }
    } catch (err) {
      console.error('Submission error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const shareQuiz = () => {
    const url = window.location.origin + '/quiz/' + data.quiz.slug
    const text = `I just took this ${data.quiz.title} quiz! Take it here:`
    
    if (navigator.share) {
      navigator.share({ title: data.quiz.title, text, url })
    } else {
      navigator.clipboard.writeText(`${text} ${url}`)
      // Could show a toast notification here
    }
  }

  // Intro Step
  if (currentStep === 'intro') {
    return (
      <div className={`${containerHeight} flex flex-col`} style={{ backgroundColor: 'var(--background)' }}>
        {/* Header */}
        <div className={`flex justify-center ${headerPadding} border-b`} style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--card)' }}>
          <h1 className="text-base font-bold" style={{ color: 'var(--primary)' }}>
            Co404 Quiz
          </h1>
        </div>

        {/* Content */}
        <div className={`flex-1 flex items-center justify-center ${contentPadding}`}>
          <div className="text-center max-w-md">
            <h2 className={`${device === 'mobile' ? 'text-lg' : 'text-xl'} font-bold mb-2`} style={{ color: 'var(--text)' }}>
              What Type of{" "}
              <span style={{ color: 'var(--primary)' }}>
                Digital Nomad
              </span>{" "}
              Are You?
            </h2>
            
            <p className={`${device === 'mobile' ? 'text-xs' : 'text-sm'} mb-3`} style={{ color: 'var(--text)' }}>
              Take our quick quiz to discover your digital nomad personality and get personalized tips!
            </p>

            <button
              onClick={handleStartQuiz}
              className={`w-full px-6 ${device === 'mobile' ? 'py-2 text-base' : 'py-3 text-lg'} font-semibold rounded-lg transition-all duration-200 hover:transform hover:scale-105`}
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'var(--text-light)',
                boxShadow: '0 4px 14px 0 rgba(180, 119, 117, 0.25)'
              }}
            >
              Take the Quiz →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Question Step
  if (currentStep === 'question') {
    return (
      <div className={`${containerHeight} flex flex-col`} style={{ backgroundColor: 'var(--background)' }}>
        {/* Header with Progress */}
        <div className={`${headerPadding} border-b`} style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--card)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${device === 'mobile' ? 'text-xs' : 'text-sm'} font-medium`} style={{ color: 'var(--text)' }}>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--primary)',
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className={`flex-1 flex flex-col justify-center ${contentPadding} transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          <h3 className={`${device === 'mobile' ? 'text-lg' : 'text-xl'} font-bold mb-6 text-center`} style={{ color: 'var(--text)' }}>
            {currentQuestion.title}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option)}
                disabled={isTransitioning}
                className={`w-full ${device === 'mobile' ? 'p-3' : 'p-4'} text-left rounded-lg border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50`}
                style={{ 
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--primary)',
                  color: 'var(--text)'
                }}
              >
                <div className={`font-medium ${device === 'mobile' ? 'text-sm' : ''}`}>{option.label}</div>
                <div className={`${device === 'mobile' ? 'text-xs' : 'text-sm'} opacity-75 mt-1`}>{option.text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className={`${headerPadding} border-t`} style={{ borderColor: 'var(--primary)' }}>
          <button
            onClick={handlePreviousQuestion}
            className={`${device === 'mobile' ? 'text-xs' : 'text-sm'} px-4 py-2 rounded`}
            style={{ color: 'var(--primary)' }}
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  // Email Step
  if (currentStep === 'email') {
    return (
      <div className={`${containerHeight} flex flex-col`} style={{ backgroundColor: 'var(--background)' }}>
        {/* Header */}
        <div className={`flex justify-center ${headerPadding} border-b`} style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--card)' }}>
          <span className={`${device === 'mobile' ? 'text-xs' : 'text-sm'} font-medium`} style={{ color: 'var(--text)' }}>
            Almost done!
          </span>
        </div>

        {/* Email Form */}
        <div className={`flex-1 flex items-center justify-center ${contentPadding}`}>
          <div className="w-full max-w-sm">
            <h3 className={`${device === 'mobile' ? 'text-lg' : 'text-xl'} font-bold mb-4 text-center`} style={{ color: 'var(--text)' }}>
              Get Your Results!
            </h3>
            
            <p className={`${device === 'mobile' ? 'text-xs' : 'text-sm'} mb-6 text-center`} style={{ color: 'var(--text)' }}>
              Enter your email to receive your personalized digital nomad profile and exclusive tips.
            </p>

            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={`w-full px-4 ${device === 'mobile' ? 'py-2 text-sm' : 'py-3'} rounded-lg border-2 focus:outline-none focus:border-opacity-75`}
                  style={{ 
                    borderColor: emailError ? '#ef4444' : 'var(--primary)',
                    backgroundColor: 'var(--card)'
                  }}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <label className={`flex items-start space-x-2 ${device === 'mobile' ? 'text-xs' : 'text-xs'}`}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5"
                />
                <span style={{ color: 'var(--text)' }}>
                  I agree to receive emails with my quiz results and digital nomad tips. You can unsubscribe anytime.
                </span>
              </label>

              <button
                onClick={handleEmailSubmit}
                disabled={isSubmitting}
                className={`w-full px-6 ${device === 'mobile' ? 'py-2 text-sm' : 'py-3'} font-semibold rounded-lg transition-all duration-200 hover:transform hover:scale-105 disabled:opacity-50`}
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'var(--text-light)'
                }}
              >
                {isSubmitting ? 'Getting Results...' : 'Get My Results →'}
              </button>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className={`${headerPadding} border-t`} style={{ borderColor: 'var(--primary)' }}>
          <button
            onClick={() => {
              setCurrentQuestionIndex(totalQuestions - 1)
              setCurrentStep('question')
            }}
            className={`${device === 'mobile' ? 'text-xs' : 'text-sm'} px-4 py-2 rounded`}
            style={{ color: 'var(--primary)' }}
          >
            ← Back to Questions
          </button>
        </div>
      </div>
    )
  }

  // Result Step
  if (currentStep === 'result' && result) {
    return (
      <div className={`${containerHeight} flex flex-col`} style={{ backgroundColor: 'var(--background)' }}>
        {/* Header */}
        <div className={`flex justify-center ${headerPadding} border-b`} style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--card)' }}>
          <span className={`${device === 'mobile' ? 'text-xs' : 'text-sm'} font-medium`} style={{ color: 'var(--text)' }}>
            Your Result
          </span>
        </div>

        {/* Result Content */}
        <div className={`flex-1 flex items-center justify-center ${contentPadding}`}>
          <div className="text-center max-w-md">
            <div className="mb-4 text-4xl">🎉</div>
            
            <h3 className={`${device === 'mobile' ? 'text-xl' : 'text-2xl'} font-bold mb-3`} style={{ color: 'var(--primary)' }}>
              {result.name}
            </h3>
            
            {result.headline && (
              <p className={`${device === 'mobile' ? 'text-base' : 'text-lg'} font-medium mb-4`} style={{ color: 'var(--text)' }}>
                {result.headline}
              </p>
            )}
            
            <p className={`${device === 'mobile' ? 'text-xs' : 'text-sm'} mb-6`} style={{ color: 'var(--text)' }}>
              Check your email for your complete personality profile and personalized recommendations!
            </p>

            <div className="space-y-3">
              <button
                onClick={shareQuiz}
                className={`w-full px-6 ${device === 'mobile' ? 'py-2 text-sm' : 'py-2'} font-medium rounded-lg border-2 transition-all duration-200 hover:transform hover:scale-105`}
                style={{ 
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)',
                  backgroundColor: 'transparent'
                }}
              >
                Share Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
