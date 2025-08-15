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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [completionCount, setCompletionCount] = useState(1247)
  const [isLoading, setIsLoading] = useState(false)

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

  // Slowly increment completion counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCompletionCount(prev => prev + 1)
    }, 45000) // Increment every 45 seconds
    
    return () => clearInterval(interval)
  }, [])

  const sortedQuestions = data.questions.sort((a, b) => a.position - b.position)
  const currentQuestion = sortedQuestions[currentQuestionIndex]
  const totalQuestions = sortedQuestions.length
  
  // ACTUAL iframe dimensions: Desktop 804x305px, Mobile 290x521px  
  const containerHeight = device === 'mobile' ? 'h-[510px]' : 'h-[300px]'
  const contentPadding = device === 'mobile' ? 'p-2' : 'p-0'
  const headerPadding = device === 'mobile' ? 'p-1' : 'p-0'

  const handleStartQuiz = () => {
    setCurrentStep('question')
  }

  const handleAnswerSelect = async (option: QuizOption) => {
    // Show selected state
    setSelectedAnswer(option.id)
    
    // Set the answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option.result_key
    }))

    // Show transition effect
    setIsTransitioning(true)
    setIsLoading(true)
    
    // Wait for selection animation + transition
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Move to next question or email step
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setCurrentStep('email')
    }
    
    setIsTransitioning(false)
    setIsLoading(false)
    setSelectedAnswer(null)
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
      const submitData = {
        quiz_slug: data.quiz.slug,
        email: email.trim(),
        answers,
        consent,
      }
      
      console.log('Submitting quiz with data:', JSON.stringify(submitData, null, 2))
      console.log('About to make API call to /api/submit')
      
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      console.log('Received response:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.log('Full API error response:', errorData)
        throw new Error(errorData.error || 'Failed to submit quiz')
      }

      const { result: quizResult } = await response.json()
      console.log('API returned result key:', quizResult)
      console.log('Available frontend results:', data.results.map(r => r.key))
      
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
        {/* Content starting at the very top */}
        <div className="p-0">
          <div className="text-center max-w-md mx-auto">
            <h2 className={`${device === 'mobile' ? 'text-2xl' : 'text-3xl'} font-bold mb-3`} style={{ color: 'var(--text)' }}>
              What Type of{" "}
              <span style={{ color: 'var(--primary)' }}>
                Digital Nomad
              </span>{" "}
              Are You?
            </h2>
            
            <p className={`${device === 'mobile' ? 'text-base' : 'text-xl'} mb-2`} style={{ color: 'var(--text)' }}>
              Answer these 6 questions to discover your digital nomad personality type.
            </p>

            {/* Time indicator and social proof */}
            <div className={`${device === 'mobile' ? 'text-sm' : 'text-base'} mb-4 space-y-1`} style={{ color: 'var(--text)' }}>
              <p className="opacity-75">⏱️ Takes just 1 minute</p>
              <p className="opacity-75">👥 Join {completionCount.toLocaleString()} digital nomads who discovered their type</p>
            </div>

            <button
              onClick={handleStartQuiz}
              className={`w-full px-6 ${device === 'mobile' ? 'py-3 text-lg' : 'py-3 text-xl'} font-semibold rounded transition-all duration-200 hover:transform hover:scale-105`}
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'var(--text-light)'
              }}
            >
              Take the Quiz →
            </button>

            {/* Privacy badge */}
            <div className={`${device === 'mobile' ? 'text-xs' : 'text-sm'} mt-2 opacity-60 flex items-center justify-center gap-1`} style={{ color: 'var(--text)' }}>
              <span>🔒</span>
              <span>Your data is secure</span>
            </div>
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
          <div className="flex items-center justify-between">
            <span className={`${device === 'mobile' ? 'text-xs' : 'text-xs'} font-medium`} style={{ color: 'var(--text)', fontSize: device === 'mobile' ? '' : '9px' }}>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-0.5">
            <div 
              className="h-0.5 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--primary)',
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className={`${contentPadding} transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`} style={{ height: 'calc(100% - 40px)' }}>
          <h3 className={`${device === 'mobile' ? 'text-base' : 'text-lg'} font-bold mb-2 text-center`} style={{ color: 'var(--text)' }}>
            {currentQuestion.title}
          </h3>

          <div className="space-y-0 overflow-y-auto px-4" style={{ height: 'calc(100% - 20px)' }}>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isTransitioning || isLoading}
                  className={`w-full ${device === 'mobile' ? 'p-3' : 'p-2'} text-left rounded-lg border-2 transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 transform border-opacity-60 hover:border-opacity-100 ${
                    isSelected ? 'scale-105 ring-2 ring-opacity-50' : ''
                  }`}
                  style={{ 
                    backgroundColor: isSelected ? 'var(--primary)' : 'var(--card)',
                    borderColor: 'var(--primary)',
                    color: isSelected ? 'var(--text-light)' : 'var(--text)',
                    marginBottom: '4px',
                    boxShadow: isSelected ? '0 8px 25px rgba(180, 119, 117, 0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    maxWidth: 'calc(100% - 25px)',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    minHeight: device === 'mobile' ? '44px' : '36px' // Better touch targets
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'var(--primary)'
                      e.currentTarget.style.color = 'var(--text-light)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(180, 119, 117, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'var(--card)'
                      e.currentTarget.style.color = 'var(--text)'
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <div className={`${device === 'mobile' ? 'text-sm' : 'text-sm'} font-medium transition-all duration-300 flex items-center`}>
                    {isSelected && <span className="mr-2">✓</span>}
                    {option.text}
                    {isLoading && isSelected && <span className="ml-auto">⟳</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className={`${headerPadding} border-t`} style={{ borderColor: 'var(--primary)' }}>
          <button
            onClick={handlePreviousQuestion}
            className={`${device === 'mobile' ? 'text-xs' : 'text-xs'} px-2 py-0 rounded`}
            style={{ color: 'var(--primary)', fontSize: device === 'mobile' ? '' : '9px' }}
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
            <h3 className={`${device === 'mobile' ? 'text-lg' : 'text-base'} font-bold mb-2 text-center`} style={{ color: 'var(--text)' }}>
              🎁 Get Your Personalized Nomad Guide
            </h3>
            
            <p className={`${device === 'mobile' ? 'text-sm' : 'text-sm'} mb-3 text-center`} style={{ color: 'var(--text)' }}>
              Unlock your custom travel recommendations and exclusive digital nomad insights!
            </p>

            <div className="space-y-0">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={`w-full px-4 ${device === 'mobile' ? 'py-4 text-base' : 'py-2 text-sm'} rounded border focus:outline-none focus:border-opacity-75`}
                  style={{ 
                    borderColor: emailError ? '#ef4444' : 'var(--primary)',
                    backgroundColor: 'var(--card)',
                    minHeight: device === 'mobile' ? '48px' : '40px'
                  }}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <label className={`flex items-start space-x-2 ${device === 'mobile' ? 'text-sm' : 'text-xs'} my-3`}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1"
                />
                <span style={{ color: 'var(--text)' }}>
                  I agree to receive emails with my quiz results and digital nomad tips. You can unsubscribe anytime.
                </span>
              </label>

              <button
                onClick={handleEmailSubmit}
                disabled={isSubmitting}
                className={`w-full px-4 ${device === 'mobile' ? 'py-4 text-lg' : 'py-3 text-base'} font-semibold rounded transition-all duration-200 hover:transform hover:scale-105 disabled:opacity-50`}
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'var(--text-light)',
                  minHeight: device === 'mobile' ? '56px' : '48px'
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
            <div className="mb-0 text-base">🎉</div>
            
            <h3 className={`${device === 'mobile' ? 'text-xl' : 'text-xs'} font-bold mb-0`} style={{ color: 'var(--primary)', fontSize: device === 'mobile' ? '' : '12px' }}>
              {result.name}
            </h3>
            
            {result.headline && (
              <p className={`${device === 'mobile' ? 'text-base' : 'text-xs'} font-medium mb-0`} style={{ color: 'var(--text)', fontSize: device === 'mobile' ? '' : '10px' }}>
                {result.headline}
              </p>
            )}
            
            <p className={`${device === 'mobile' ? 'text-xs' : 'text-xs'} mb-3`} style={{ color: 'var(--text)', fontSize: device === 'mobile' ? '' : '8px' }}>
              Check your email for your complete personality profile and personalized recommendations!
            </p>

            <div className="space-y-2">
              <button
                onClick={shareQuiz}
                className={`w-full px-3 ${device === 'mobile' ? 'py-2 text-sm' : 'py-1 text-xs'} font-medium rounded border transition-all duration-200 hover:transform hover:scale-105`}
                style={{ 
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)',
                  backgroundColor: 'transparent',
                  fontSize: device === 'mobile' ? '' : '9px'
                }}
              >
                Share Quiz
              </button>

              <button
                onClick={() => {
                  setCurrentStep('intro')
                  setCurrentQuestionIndex(0)
                  setAnswers({})
                  setEmail('')
                  setResult(null)
                  setError('')
                  setEmailError('')
                }}
                className={`w-full px-3 ${device === 'mobile' ? 'py-1 text-xs' : 'py-1 text-xs'} font-medium rounded transition-all duration-200 hover:opacity-80`}
                style={{ 
                  color: 'var(--text)',
                  backgroundColor: 'transparent',
                  fontSize: device === 'mobile' ? '11px' : '8px',
                  opacity: 0.7
                }}
              >
                Not quite right? Retake the quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
