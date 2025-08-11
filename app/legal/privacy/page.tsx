import Link from 'next/link'

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          
          <div 
            className="prose prose-lg p-8 rounded-lg"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            <p className="text-sm mb-6" style={{ color: 'var(--text)' }}>
              Last updated: January 2024
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              1. Information We Collect
            </h2>
            <p className="mb-6">
              We collect your email address and quiz responses when you take our quiz. We also collect technical information like IP addresses (hashed for privacy) and browser details for security purposes.
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              2. How We Use Your Information
            </h2>
            <p className="mb-6">
              We use your email to send you quiz results and may occasionally send related content. We use quiz responses to calculate and provide personalized results. Technical data helps us prevent abuse and improve our service.
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              3. Data Sharing
            </h2>
            <p className="mb-6">
              We do not sell or share your personal information with third parties except as required by law or to provide our service (e.g., email delivery through Resend).
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              4. Data Security
            </h2>
            <p className="mb-6">
              We implement appropriate security measures to protect your information. IP addresses are hashed before storage, and we use secure, encrypted connections for all data transmission.
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              5. Your Rights
            </h2>
            <p className="mb-6">
              You can request access to, correction of, or deletion of your personal data by contacting us. We retain data only as long as necessary to provide our service.
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              6. Cookies and Tracking
            </h2>
            <p className="mb-6">
              We do not use tracking cookies. Our website only uses essential functionality cookies required for the quiz to work properly.
            </p>

            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              7. Contact
            </h2>
            <p>
              For privacy questions or to exercise your rights, contact us at privacy@co404.com.
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
  title: 'Privacy Policy - Co404 Quiz',
  description: 'Privacy Policy for Co404 Quiz application.',
}
