import Link from 'next/link'

export default function TermsPage() {
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

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--text)' }}>
            Terms of Service
          </h1>
          
          <div 
            className="prose prose-lg p-8 rounded-lg"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            <p className="text-sm mb-6" style={{ color: 'var(--text)' }}>
              Last updated: January 2024
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              1. Acceptance of Terms
            </h2>
            <p className="mb-6">
              By accessing and using this quiz application ("Service"), you accept and agree to be bound by these Terms of Service.
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              2. Use of Service
            </h2>
            <p className="mb-6">
              This Service is provided for entertainment and educational purposes. Quiz results are for informational purposes only and should not be considered professional advice.
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              3. Data Collection
            </h2>
            <p className="mb-6">
              We collect your email address and quiz responses to provide personalized results. See our Privacy Policy for details on how we handle your data.
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              4. Prohibited Uses
            </h2>
            <p className="mb-6">
              You may not use this Service for any unlawful purpose or to spam or abuse our systems. We reserve the right to terminate access for violations.
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              5. Limitation of Liability
            </h2>
            <p className="mb-6">
              This Service is provided "as is" without warranties. We are not liable for any damages resulting from your use of the Service.
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              6. Contact
            </h2>
            <p>
              For questions about these Terms, please contact us at quiz@co404.com.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-lg hover:opacity-75 transition-opacity"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--text-light)' }}
            >
              ← Back to Quiz
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export const metadata = {
  title: 'Terms of Service - Co404 Quiz',
  description: 'Terms of Service for Co404 Quiz application.',
}
