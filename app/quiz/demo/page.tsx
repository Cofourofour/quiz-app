import Link from 'next/link'
import QuizFormMock from '@/components/QuizFormMock'

export default function QuizPageMock() {
  // Mock data matching your quiz content
  const mockData = {
    quiz: {
      id: 'mock-id',
      slug: 'digital-nomad-type',
      title: 'What Type of Digital Nomad Are You?'
    },
    questions: [
      {
        id: 'q1',
        position: 1,
        title: "What's your ideal work environment?",
        options: [
          { id: 'q1a', label: 'A', text: 'A buzzing coworking space with events every night', result_key: 'A' },
          { id: 'q1b', label: 'B', text: 'A quiet corner of a cute café', result_key: 'B' },
          { id: 'q1c', label: 'C', text: 'A hammock and decent Wi-Fi near the beach', result_key: 'C' },
          { id: 'q1d', label: 'D', text: 'Somewhere I can focus on deep work and wellness', result_key: 'D' }
        ]
      },
      {
        id: 'q2',
        position: 2,
        title: "What's the first thing you do when you arrive in a new city?",
        options: [
          { id: 'q2a', label: 'A', text: 'Find the nearest coworking space and reserve a desk', result_key: 'A' },
          { id: 'q2b', label: 'B', text: 'Walk around and scope out the cafés', result_key: 'B' },
          { id: 'q2c', label: 'C', text: 'Head straight to the beach or a viewpoint', result_key: 'C' },
          { id: 'q2d', label: 'D', text: 'Unpack in my accommodation and do a quick breathwork session', result_key: 'D' }
        ]
      },
      {
        id: 'q3',
        position: 3,
        title: 'Pick your dream Sunday plan abroad:',
        options: [
          { id: 'q3a', label: 'A', text: 'Networking brunch and rooftop drinks', result_key: 'A' },
          { id: 'q3b', label: 'B', text: 'Lazy start, browsing a local market, journaling in a café', result_key: 'B' },
          { id: 'q3c', label: 'C', text: 'Surf at sunrise, tacos at lunch, dance at sunset', result_key: 'C' },
          { id: 'q3d', label: 'D', text: 'Morning hike, green smoothie, sauna and relax', result_key: 'D' }
        ]
      },
      {
        id: 'q4',
        position: 4,
        title: 'Your biggest priority when choosing a destination:',
        options: [
          { id: 'q4a', label: 'A', text: 'Fast Wi-Fi and an active digital nomad scene', result_key: 'A' },
          { id: 'q4b', label: 'B', text: 'Charm, culture, and cool coffee shops', result_key: 'B' },
          { id: 'q4c', label: 'C', text: 'Sun, nature, and cheap cocktails', result_key: 'C' },
          { id: 'q4d', label: 'D', text: 'Peace, personal growth, and natural beauty', result_key: 'D' }
        ]
      },
      {
        id: 'q5',
        position: 5,
        title: 'What kind of accommodation do you prefer?',
        options: [
          { id: 'q5a', label: 'A', text: 'A buzzing coliving with events and group chat', result_key: 'A' },
          { id: 'q5b', label: 'B', text: 'A stylish local guesthouse', result_key: 'B' },
          { id: 'q5c', label: 'C', text: 'A surf hostel near the water', result_key: 'C' },
          { id: 'q5d', label: 'D', text: 'An eco-retreat or wellness-themed coliving', result_key: 'D' }
        ]
      },
      {
        id: 'q6',
        position: 6,
        title: 'Which quote speaks to you most?',
        options: [
          { id: 'q6a', label: 'A', text: '"Your network is your net worth."', result_key: 'A' },
          { id: 'q6b', label: 'B', text: '"Not all who wander are lost."', result_key: 'B' },
          { id: 'q6c', label: 'C', text: '"Work hard, play harder."', result_key: 'C' },
          { id: 'q6d', label: 'D', text: '"Disconnect to reconnect."', result_key: 'D' }
        ]
      }
    ],
    results: [
      {
        key: 'A',
        name: '🧑‍💻 The Social Butterfly',
        headline: 'You thrive on connection, community, and a packed calendar.',
        description: 'You\'re the nomad who\'s always down for a rooftop party, brunch coworking session, or casual meet-up with strangers who instantly become friends. You love energy, people, and making every city feel like your new home.'
      },
      {
        key: 'B',
        name: '☕ The Creative Explorer',
        headline: 'You\'re a soul-led wanderer drawn to charm, culture, and good coffee.',
        description: 'You seek out places with character - where cobblestone streets and café culture fuel your creativity. You\'re less about hustle, more about inspiration, and you value beauty, depth, and a sense of local rhythm.'
      },
      {
        key: 'C',
        name: '🏄 The Free-Spirited Adventurer',
        headline: 'You\'re here for the thrill, the freedom, and the views.',
        description: 'Deadlines matter, but so does catching the sunrise above the clouds or dancing barefoot on the beach. You like destinations that mix wild beauty with a touch of chaos - somewhere you can feel fully alive.'
      },
      {
        key: 'D',
        name: '🌿 The Mindful Minimalist',
        headline: 'You crave calm, clarity, and space to breathe.',
        description: 'Your version of success includes balance, boundaries, and feeling grounded. You seek quiet corners of the world where you can focus on your well-being, work intentionally, and reconnect with yourself.'
      }
    ]
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

      {/* Quiz Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            {mockData.quiz.title}
          </h1>
          <p className="text-lg" style={{ color: 'var(--text)' }}>
            Answer these {mockData.questions.length} questions to discover your digital nomad personality type.
          </p>
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
            <p className="text-sm" style={{ color: 'var(--text)' }}>
              <strong>Demo Mode:</strong> This is working with mock data. The quiz will calculate your result but won't send emails.
            </p>
          </div>
        </div>

        <QuizFormMock data={mockData} />
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t" style={{ borderColor: 'var(--card)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--text)' }}>
            © 2024 Co404. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
