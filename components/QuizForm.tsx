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

interface QuizProps {
  data: QuizData
}

export default function QuizForm({ data }: QuizProps) {
  const [step, setStep] = useState<'quiz' | 'email' | 'result'>('quiz')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    questions?: string[]
    consent?: string
  }>({})

  const handleAnswerChange = (questionId: string, selectedLabel: string) => {
    // Find the result_key for this option
    const question = data.questions.find(q => q.id === questionId)
    const option = question?.options.find(opt => opt.label === selectedLabel)
    
    if (option) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: option.result_key // Store result_key instead of label
      }))
    }
    
    // Clear validation error for this question
    setValidationErrors(prev => ({
      ...prev,
      questions: prev.questions?.filter(qId => qId !== questionId)
    }))
  }

  const validateQuiz = () => {
    const unansweredQuestions = data.questions.filter(q => !answers[q.id])
    if (unansweredQuestions.length > 0) {
      setValidationErrors({
        questions: unansweredQuestions.map(q => q.id)
      })
      return false
    }
    return true
  }

  const handleQuizComplete = () => {
    if (validateQuiz()) {
      setStep('email')
      setValidationErrors({})
    }
  }

  const validateForm = () => {
    const errors: typeof validationErrors = {}
    
    // Validate email
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address'
    }
    
    // Validate consent
    if (!consent) {
      errors.consent = 'You must accept the terms and privacy policy'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate email form
    if (!validateForm()) {
      setError('')
      return
    }

    setIsSubmitting(true)
    setError('')
    setValidationErrors({})

    try {
      // Submit to server with correct format
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz_slug: data.quiz.slug,
          email: email.trim(),
          answers: answers // This now contains questionId -> result_key
        })
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit quiz')
      }

      // Set the result from server response
      if (responseData.result) {
        setResult(responseData.result)
        setStep('result')
      } else {
        throw new Error('No result received from server')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add click outside handler for share modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-share-modal]') && !target.closest('[data-share-button]')) {
        setShowShareModal(false)
      }
    }

    if (step === 'result' && showShareModal) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
    
    // Always return a cleanup function, even if empty
    return () => {}
  }, [step, showShareModal])

  // Show result page
  if (step === 'result' && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div 
          className="p-8 rounded-lg text-center"
          style={{ backgroundColor: 'var(--background)' }}
        >
          <div 
            className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--text-light)' }}>
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            🎉 Great job completing the quiz!
          </h3>
          <p className="text-lg mb-4" style={{ color: 'var(--text)' }}>
            Your personalized results have been sent to:
          </p>
          <p className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
            {email}
          </p>
          <div className="text-sm space-y-2" style={{ color: 'var(--text)' }}>
            <p>📧 <strong>Sent from:</strong> co404coliving@gmail.com</p>
            <p>⏱️ <strong>Delivery time:</strong> Usually within 1-2 minutes</p>
            <p>📂 <strong>Can't find it?</strong> Check your spam/junk folder</p>
            <p>🔄 <strong>Still missing?</strong> Check your promotions tab (Gmail users)</p>
          </div>
          
          <div 
            className="mt-6 p-4 rounded-lg border-l-4"
            style={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--primary)'
            }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              � <strong>Pro tip:</strong> Add co404coliving@gmail.com to your contacts to ensure future emails reach your inbox!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => {
              setStep('quiz')
              setEmail('')
              setConsent(false)
              setAnswers({})
              setResult(null)
              setError('')
              setValidationErrors({})
            }}
            className="flex-1 py-3 px-6 text-lg font-semibold rounded-lg transition-all duration-200 border-2"
            style={{ 
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
              backgroundColor: 'transparent'
            }}
          >
            🔄 Take Quiz Again
          </button>
          
          <div className="flex-1 relative">
            <button
              data-share-button
              onClick={(e) => {
                e.stopPropagation()
                setShowShareModal(!showShareModal)
              }}
              className="w-full py-3 px-6 text-lg font-semibold rounded-lg transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--accent)',
                color: 'var(--text-light)'
              }}
            >
              📱 Share Quiz
            </button>
            
            {/* Share Modal */}
            {showShareModal && (
              <div 
                data-share-modal
                className="absolute top-full left-0 right-0 mt-2 p-4 rounded-lg shadow-lg z-50"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: '2px solid var(--primary)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                }}
              >
                <h4 className="font-semibold mb-3 text-center" style={{ color: 'var(--text)' }}>
                  Share this quiz with friends!
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      window.open(`https://api.whatsapp.com/send?text=I%20just%20discovered%20I%27m%20a%20${encodeURIComponent(result.name)}%21%20%F0%9F%8C%8D%20What%27s%20your%20digital%20nomad%20type%3F%20Take%20the%20quiz%3A%20${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)}`, '_blank')
                      setShowShareModal(false)
                    }}
                    className="p-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: '#8B7355', color: 'var(--text-light)' }}
                  >
                    💬 WhatsApp
                  </button>
                  
                  {/* Facebook */}
                  <button
                    onClick={() => {
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)}`, '_blank')
                      setShowShareModal(false)
                    }}
                    className="p-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: '#A0826D', color: 'var(--text-light)' }}
                  >
                    📘 Facebook
                  </button>
                  
                  {/* Twitter */}
                  <button
                    onClick={() => {
                      window.open(`https://twitter.com/intent/tweet?text=I%20just%20discovered%20I%27m%20a%20${encodeURIComponent(result.name)}%21%20%F0%9F%8C%8D%20What%27s%20your%20digital%20nomad%20type%3F%20Take%20the%20quiz%3A%20${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)}`, '_blank')
                      setShowShareModal(false)
                    }}
                    className="p-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: '#B5956A', color: 'var(--text-light)' }}
                  >
                    🐦 Twitter
                  </button>
                  
                  {/* Email */}
                  <button
                    onClick={() => {
                      window.open(`mailto:?subject=Check%20out%20this%20Digital%20Nomad%20Quiz!&body=I%20just%20discovered%20I%27m%20a%20${encodeURIComponent(result.name)}%21%20%F0%9F%8C%8D%20Find%20out%20your%20digital%20nomad%20type%3A%20${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)}`, '_blank')
                      setShowShareModal(false)
                    }}
                    className="p-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--text-light)' }}
                  >
                    📧 Email
                  </button>
                  
                  {/* Copy Link */}
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)
                        alert('Quiz link copied to clipboard!')
                      } catch (err) {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea')
                        textArea.value = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
                        document.body.appendChild(textArea)
                        textArea.select()
                        document.execCommand('copy')
                        document.body.removeChild(textArea)
                        alert('Quiz link copied to clipboard!')
                      }
                      setShowShareModal(false)
                    }}
                    className="p-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--text-light)' }}
                  >
                    📋 Copy Link
                  </button>
                  
                  {/* Contact for Custom Quiz */}
                  <button
                    onClick={() => {
                      window.open('mailto:Laurens.co404@gmail.com?subject=Custom Quiz Request&body=Hi Laurens, I would like to create my own customized quiz similar to the Digital Nomad Type Quiz. Please let me know how we can proceed!', '_blank')
                      setShowShareModal(false)
                    }}
                    className="p-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--text-light)' }}
                  >
                    � Custom Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Embed Code */}
        <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
          <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>
            Want to embed this quiz on your site?
          </h4>
          <div className="p-3 rounded text-sm font-mono" style={{ backgroundColor: 'var(--background)' }}>
            <code style={{ color: 'var(--text)' }}>
              {`<iframe src="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/embed/${data.quiz.slug}" width="100%" height="720" style="border:0;"></iframe>`}
            </code>
          </div>
        </div>
      </div>
    )
  }

  // Show email collection step
  if (step === 'email') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            🎉 Quiz Complete!
          </h2>
          <p className="text-lg" style={{ color: 'var(--accent)' }}>
            Get your personalized results delivered to your inbox
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Email Address <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                // Clear email validation error when user types
                if (validationErrors.email) {
                  setValidationErrors(prev => ({ ...prev, email: undefined }))
                }
              }}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
              style={{ 
                borderColor: validationErrors.email ? '#dc2626' : 'var(--card)',
                backgroundColor: 'var(--text-light)',
                color: 'var(--text)'
              }}
              onFocus={(e) => e.target.style.borderColor = validationErrors.email ? '#dc2626' : 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = validationErrors.email ? '#dc2626' : 'var(--card)'}
              placeholder="your.email@example.com"
              required
              autoFocus
            />
            {validationErrors.email && (
              <p className="mt-2 text-sm" style={{ color: '#dc2626' }}>
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Consent */}
          <div className="mb-8">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked)
                  // Clear consent validation error when user checks
                  if (validationErrors.consent) {
                    setValidationErrors(prev => ({ ...prev, consent: undefined }))
                  }
                }}
                className="mt-1 mr-3"
                required
              />
              <span style={{ color: validationErrors.consent ? '#dc2626' : 'var(--text)' }}>
                By continuing, you accept our{' '}
                <a href="/legal/terms" className="underline hover:opacity-75" style={{ color: 'var(--primary)' }}>
                  Terms
                </a>{' '}
                &{' '}
                <a href="/legal/privacy" className="underline hover:opacity-75" style={{ color: 'var(--primary)' }}>
                  Privacy Policy
                </a>
                . <span style={{ color: 'var(--primary)' }}>*</span>
              </span>
            </label>
            {validationErrors.consent && (
              <p className="mt-2 text-sm ml-6" style={{ color: '#dc2626' }}>
                {validationErrors.consent}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg border-l-4" 
                 style={{ backgroundColor: '#fef2f2', borderColor: '#dc2626', color: '#dc2626' }}>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Error:</span>
              </div>
              <p className="mt-1">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep('quiz')}
              className="px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-200 border-2"
              style={{ 
                borderColor: 'var(--primary)',
                color: 'var(--primary)',
                backgroundColor: 'transparent'
              }}
            >
              ← Back to Quiz
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 text-lg font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-opacity-50"
              style={{ 
                backgroundColor: 'var(--primary)',
                color: 'var(--text-light)',
                boxShadow: '0 4px 14px 0 rgba(180, 119, 117, 0.25)'
              }}
            >
              {isSubmitting ? 'Sending Results...' : 'Get My Results 📧'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Show quiz form
  return (
    <div className="max-w-2xl mx-auto">
      {/* Questions */}
      {data.questions
        .sort((a, b) => a.position - b.position)
        .map((question, index) => (
          <div key={question.id} className="mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ 
              color: validationErrors.questions?.includes(question.id) ? '#dc2626' : 'var(--text)' 
            }}>
              {index + 1}. {question.title}
              {validationErrors.questions?.includes(question.id) && (
                <span className="ml-2 text-sm font-normal" style={{ color: '#dc2626' }}>
                  - Please select an answer
                </span>
              )}
            </h3>
            <div className="space-y-3">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-start p-4 rounded-lg cursor-pointer transition-colors hover:opacity-80"
                  style={{ 
                    backgroundColor: answers[question.id] === option.result_key ? 'var(--primary)' : 'var(--card)',
                    color: answers[question.id] === option.result_key ? 'var(--text-light)' : 'var(--text)',
                    borderWidth: validationErrors.questions?.includes(question.id) ? '2px' : '0px',
                    borderColor: validationErrors.questions?.includes(question.id) ? '#dc2626' : 'transparent'
                  }}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.label}
                    checked={answers[question.id] === option.result_key}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="mt-1 mr-3 opacity-0 absolute"
                  />
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center mt-0.5"
                    style={{ 
                      borderColor: answers[question.id] === option.result_key ? 'var(--text-light)' : 'var(--text)',
                      backgroundColor: answers[question.id] === option.result_key ? 'var(--text-light)' : 'transparent'
                    }}
                  >
                    {answers[question.id] === option.result_key && (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold mr-2">{option.label}.</span>
                    {option.text}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}

      {/* Continue Button */}
      <button
        type="button"
        onClick={handleQuizComplete}
        disabled={!data.questions.every(q => answers[q.id])}
        className="w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-opacity-50"
        style={{ 
          backgroundColor: 'var(--primary)',
          color: 'var(--text-light)',
          boxShadow: '0 4px 14px 0 rgba(180, 119, 117, 0.25)'
        }}
      >
        {data.questions.every(q => answers[q.id]) ? 'Continue to Results 🎉' : `Answer ${data.questions.length - Object.keys(answers).length} more question${data.questions.length - Object.keys(answers).length !== 1 ? 's' : ''}`}
      </button>
    </div>
  )
}
