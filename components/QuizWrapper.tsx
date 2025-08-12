'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import QuizForm from './QuizForm'
import PopupQuizForm from './PopupQuizForm'

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

interface QuizWrapperProps {
  data: QuizData
}

function QuizContent({ data }: QuizWrapperProps) {
  const searchParams = useSearchParams()
  const isPopup = searchParams.get('popup') === 'true'

  if (isPopup) {
    return <PopupQuizForm data={data} />
  }

  return <QuizForm data={data} />
}

export default function QuizWrapper({ data }: QuizWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContent data={data} />
    </Suspense>
  )
}
