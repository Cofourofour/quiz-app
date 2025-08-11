import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
            Co404 Quiz
          </h1>
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--text)' }}>
            What Type of{" "}
            <span style={{ color: 'var(--primary)' }}>
              Digital Nomad
            </span>{" "}
            Are You?
          </h2>
          
          <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: 'var(--text)' }}>
            The term "digital nomad" gets thrown around a lot - but let's be real, there's no one-size-fits-all lifestyle. From "slowmadders" to surf-chasing freelancers, there are endless ways to live this freedom-fueled life (which is exactly why we love it, right?!)
          </p>
          
          <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: 'var(--text)' }}>
            But with so many options, it can be hard to know what suits you best. Take our free quiz to find out your digital nomad personality - and get exclusive tips, destination guides, and coliving offers straight to your inbox.
          </p>

          <div className="mb-12 space-y-4">
            <Link
              href="/quiz/digital-nomad-type"
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

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div 
              className="p-6 rounded-lg text-center"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--text-light)' }}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                6 Quick Questions
              </h3>
              <p style={{ color: 'var(--text)' }}>
                Takes less than 3 minutes to complete
              </p>
            </div>

            <div 
              className="p-6 rounded-lg text-center"
              style={{ backgroundColor: 'var(--card)' }}
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
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Personalized Results
              </h3>
              <p style={{ color: 'var(--text)' }}>
                Get your result instantly and via email
              </p>
            </div>

            <div 
              className="p-6 rounded-lg text-center"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--text-light)' }}>
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                4 Unique Types
              </h3>
              <p style={{ color: 'var(--text)' }}>
                Discover your nomad personality match
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t" style={{ borderColor: 'var(--card)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--text)' }}>
            © 2024 Co404. All rights reserved.
          </p>
          <div className="mt-4 space-x-6">
            <Link href="/legal/terms" className="hover:opacity-75" style={{ color: 'var(--text)' }}>
              Terms of Service
            </Link>
            <Link href="/legal/privacy" className="hover:opacity-75" style={{ color: 'var(--text)' }}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
