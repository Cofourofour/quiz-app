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
          
          <p className="text-lg md:text-xl mb-6 leading-relaxed" style={{ color: 'var(--text)' }}>
            Take our <strong>interactive quiz</strong> to discover your digital nomad personality and get personalized Latin America destination recommendations straight to your inbox.
          </p>

          {/* Social Proof */}
          <div className="mb-8 p-4 rounded-lg border-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--primary)' }}>
            <div className="flex items-center justify-center space-x-4 text-sm" style={{ color: 'var(--text)' }}>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                1,200+ completions
              </span>
              <span className="hidden md:block">•</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 8l-3 3 3 3m0 0l3-3m-3 3H3m13-4V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1"/>
                </svg>
                2-3 minutes
              </span>
              <span className="hidden md:block">•</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Privacy protected
              </span>
            </div>
          </div>

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
            
            <div className="text-center">
              <Link
                href="/embed-demo"
                className="text-sm underline hover:opacity-75"
                style={{ color: 'var(--primary)' }}
              >
                View Popup Integration Demo
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            <div 
              className="p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-200"
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
                Smooth Animations
              </h3>
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                Premium transitions and hover effects for engaging experience
              </p>
            </div>

            <div 
              className="p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-200"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--text-light)' }}>
                  <path d="M3 4a1 1 0 000 2v9a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v1zM5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Embed Ready
              </h3>
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                Ultra-compact popup design perfect for website integration
              </p>
            </div>

            <div 
              className="p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-200"
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
                Branded Emails
              </h3>
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                Beautiful result emails with social sharing and destination tips
              </p>
            </div>

            <div 
              className="p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-200"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--text-light)' }}>
                  <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Latin America Focus
              </h3>
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                Curated destination recommendations for Central & South America
              </p>
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
