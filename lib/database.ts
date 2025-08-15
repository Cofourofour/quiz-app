import Database from 'better-sqlite3'
import path from 'path'

// Create database in project root
const dbPath = path.join(process.cwd(), 'quiz.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Create tables
export function initDatabase() {
  // Create tables
  db.exec(`
    -- Quizzes table
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Questions table
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    );

    -- Options table
    CREATE TABLE IF NOT EXISTS options (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      label TEXT NOT NULL,
      text TEXT NOT NULL,
      result_key TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );

    -- Results table
    CREATE TABLE IF NOT EXISTS results (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      key TEXT NOT NULL,
      name TEXT NOT NULL,
      headline TEXT NOT NULL,
      description TEXT NOT NULL,
      email_template TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
      UNIQUE(quiz_id, key)
    );

    -- Submissions table
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      email TEXT NOT NULL,
      result_key TEXT NOT NULL,
      answers TEXT NOT NULL, -- JSON string
      ip_hash TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    );

    -- Answers table
    CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      submission_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      result_key TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (submission_id) REFERENCES submissions(id),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `)
}

// Seed data
export function seedDatabase() {
  // Check if data already exists
  const existingQuiz = db.prepare('SELECT id FROM quizzes WHERE slug = ?').get('digital-nomad-type')
  if (existingQuiz) {
    console.log('Database already seeded')
    return
  }

  const quizId = 'quiz-1'
  
  // Insert quiz
  db.prepare(`
    INSERT INTO quizzes (id, slug, title, description, active)
    VALUES (?, ?, ?, ?, ?)
  `).run(quizId, 'digital-nomad-type', 'What Type of Digital Nomad Are You?', 'Discover your digital nomad personality type', 1)

  // Insert questions
  const questions = [
    { id: 'q1', position: 1, title: "What's your ideal work environment?" },
    { id: 'q2', position: 2, title: "What's the first thing you do when you arrive in a new city?" },
    { id: 'q3', position: 3, title: 'Pick your dream Sunday plan abroad:' },
    { id: 'q4', position: 4, title: 'Your biggest priority when choosing a destination:' },
    { id: 'q5', position: 5, title: 'What kind of accommodation do you prefer?' },
    { id: 'q6', position: 6, title: 'Which quote speaks to you most?' }
  ]

  const insertQuestion = db.prepare(`
    INSERT INTO questions (id, quiz_id, position, title)
    VALUES (?, ?, ?, ?)
  `)

  questions.forEach(q => {
    insertQuestion.run(q.id, quizId, q.position, q.title)
  })

  // Insert options
  const options = [
    // Question 1
    { id: 'q1a', question_id: 'q1', label: 'A', text: 'A buzzing coworking space with events every night', result_key: 'A' },
    { id: 'q1b', question_id: 'q1', label: 'B', text: 'A quiet corner of a cute café', result_key: 'B' },
    { id: 'q1c', question_id: 'q1', label: 'C', text: 'A hammock and decent Wi-Fi near the beach', result_key: 'C' },
    { id: 'q1d', question_id: 'q1', label: 'D', text: 'Somewhere I can focus on deep work and wellness', result_key: 'D' },
    
    // Question 2
    { id: 'q2a', question_id: 'q2', label: 'A', text: 'Find the nearest coworking space and reserve a desk', result_key: 'A' },
    { id: 'q2b', question_id: 'q2', label: 'B', text: 'Walk around and scope out the cafés', result_key: 'B' },
    { id: 'q2c', question_id: 'q2', label: 'C', text: 'Head straight to the beach or a viewpoint', result_key: 'C' },
    { id: 'q2d', question_id: 'q2', label: 'D', text: 'Unpack in my accommodation and do a quick breathwork session', result_key: 'D' },
    
    // Question 3
    { id: 'q3a', question_id: 'q3', label: 'A', text: 'Networking brunch and rooftop drinks', result_key: 'A' },
    { id: 'q3b', question_id: 'q3', label: 'B', text: 'Lazy start, browsing a local market, journaling in a café', result_key: 'B' },
    { id: 'q3c', question_id: 'q3', label: 'C', text: 'Surf at sunrise, tacos at lunch, dance at sunset', result_key: 'C' },
    { id: 'q3d', question_id: 'q3', label: 'D', text: 'Morning hike, green smoothie, sauna and relax', result_key: 'D' },
    
    // Question 4
    { id: 'q4a', question_id: 'q4', label: 'A', text: 'Fast Wi-Fi and an active digital nomad scene', result_key: 'A' },
    { id: 'q4b', question_id: 'q4', label: 'B', text: 'Charm, culture, and cool coffee shops', result_key: 'B' },
    { id: 'q4c', question_id: 'q4', label: 'C', text: 'Sun, nature, and cheap cocktails', result_key: 'C' },
    { id: 'q4d', question_id: 'q4', label: 'D', text: 'Peace, personal growth, and natural beauty', result_key: 'D' },
    
    // Question 5
    { id: 'q5a', question_id: 'q5', label: 'A', text: 'A buzzing coliving with events and group chat', result_key: 'A' },
    { id: 'q5b', question_id: 'q5', label: 'B', text: 'A stylish local guesthouse', result_key: 'B' },
    { id: 'q5c', question_id: 'q5', label: 'C', text: 'A surf hostel near the water', result_key: 'C' },
    { id: 'q5d', question_id: 'q5', label: 'D', text: 'An eco-retreat or wellness-themed coliving', result_key: 'D' },
    
    // Question 6
    { id: 'q6a', question_id: 'q6', label: 'A', text: '"Your network is your net worth."', result_key: 'A' },
    { id: 'q6b', question_id: 'q6', label: 'B', text: '"Not all who wander are lost."', result_key: 'B' },
    { id: 'q6c', question_id: 'q6', label: 'C', text: '"Work hard, play harder."', result_key: 'C' },
    { id: 'q6d', question_id: 'q6', label: 'D', text: '"Disconnect to reconnect."', result_key: 'D' }
  ]

  const insertOption = db.prepare(`
    INSERT INTO options (id, question_id, label, text, result_key)
    VALUES (?, ?, ?, ?, ?)
  `)

  options.forEach(o => {
    insertOption.run(o.id, o.question_id, o.label, o.text, o.result_key)
  })

  // Insert results
  const results = [
    {
      id: 'result-a',
      key: 'A',
      name: '🧑‍💻 The Social Butterfly',
      headline: 'You thrive on connection, community, and a packed calendar.',
      description: 'You\'re the nomad who\'s always down for a rooftop party, brunch coworking session, or casual meet-up with strangers who instantly become friends. You love energy, people, and making every city feel like your new home.',
      email_template: `Hi {{name}}!

🧑‍💻 **You're The Social Butterfly!**

You thrive on connection, community, and a packed calendar. You're the nomad who's always down for a rooftop party, brunch coworking session, or casual meet-up with strangers who instantly become friends.

**Perfect destinations for you:**
• 🇨🇴 Medellin, Colombia - buzzing expat scene and coworking
• 🇲🇽 Playa del Carmen, Mexico - beachside community and networking
• 🇲🇽 Mexico City, Mexico - Vibrant community and endless networking

**Your ideal setup:**
• Buzzing coworking spaces with regular events
• Coliving spaces with active communities
• Cities with established digital nomad scenes

Ready to connect with your tribe? 🌍

Best,
Co404 Team`
    },
    {
      id: 'result-b',
      key: 'B',
      name: '☕ The Creative Explorer',
      headline: 'You\'re a soul-led wanderer drawn to charm, culture, and good coffee.',
      description: 'You seek out places with character - where cobblestone streets and café culture fuel your creativity. You\'re less about hustle, more about inspiration, and you value beauty, depth, and a sense of local rhythm.',
      email_template: `Hi {{name}}!

☕ **You're The Creative Explorer!**

You're a soul-led wanderer drawn to charm, culture, and good coffee. You seek out places with character where cobblestone streets and café culture fuel your creativity.

**Perfect destinations for you:**
• 🇲🇽 Oaxaca, Mexico - art, food, and rich tradition
• 🇬🇹 Antigua, Guatemala - colonial charm and creative inspiration
• 🇦🇷 Buenos Aires, Argentina - cultural capital with artistic flair

**Your ideal setup:**
• Charming neighborhoods with local character
• Independent coffee shops with personality
• Cities rich in history and artistic heritage

Let your creativity flow! 🎨

Best,
Co404 Team`
    },
    {
      id: 'result-c',
      key: 'C',
      name: '🏄 The Free-Spirited Adventurer',
      headline: 'You\'re here for the thrill, the freedom, and the views.',
      description: 'Deadlines matter, but so does catching the sunrise above the clouds or dancing barefoot on the beach. You like destinations that mix wild beauty with a touch of chaos - somewhere you can feel fully alive.',
      email_template: `Hi {{name}}!

🏄 **You're The Free-Spirited Adventurer!**

You're here for the thrill, the freedom, and the views. Deadlines matter, but so does catching the sunrise above the clouds or dancing barefoot on the beach.

**Perfect destinations for you:**
• 🇨🇴 Medellín, Colombia - mountains, music, movement
• 🇲🇽 Puerto Escondido, Mexico - epic surf breaks and beach vibes
• 🇨🇷 Santa Teresa, Costa Rica - wild beauty and adventure spirit

**Your ideal setup:**
• Beach towns with surf breaks nearby
• Mountains with hiking trails and epic views
• Places where adventure is always around the corner

Keep chasing those sunrises! 🌅

Best,
Co404 Team`
    },
    {
      id: 'result-d',
      key: 'D',
      name: '🌿 The Mindful Minimalist',
      headline: 'You crave calm, clarity, and space to breathe.',
      description: 'Your version of success includes balance, boundaries, and feeling grounded. You seek quiet corners of the world where you can focus on your well-being, work intentionally, and reconnect with yourself.',
      email_template: `Hi {{name}}!

🌿 **You're The Mindful Minimalist!**

You crave calm, clarity, and space to breathe. Your version of success includes balance, boundaries, and feeling grounded.

**Perfect destinations for you:**
• 🇲🇽 San Cristóbal de las Casas, Mexico - peaceful, spiritual, and soulful
• 🇬🇹 Lake Atitlán, Guatemala - tranquil waters and mindful living
• 🇨🇴 The Andes near Medellín, Colombia - mountain serenity and wellness

**Your ideal setup:**
• Quiet spaces for deep work and meditation
• Nature-connected accommodations
• Communities focused on wellness and growth

Find your center! 🧘‍♀️

Best,
Co404 Team`
    }
  ]

  const insertResult = db.prepare(`
    INSERT INTO results (id, quiz_id, key, name, headline, description, email_template)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  results.forEach(r => {
    insertResult.run(r.id, quizId, r.key, r.name, r.headline, r.description, r.email_template)
  })

  console.log('Database seeded successfully!')
}

// Database functions
export const QuizDB = {
  getQuizBySlug: (slug: string) => {
    return db.prepare('SELECT * FROM quizzes WHERE slug = ? AND active = 1').get(slug)
  },

  getQuestions: (quizId: string) => {
    return db.prepare(`
      SELECT q.*, json_group_array(
        json_object(
          'id', o.id,
          'label', o.label,
          'text', o.text,
          'result_key', o.result_key
        )
      ) as options
      FROM questions q
      LEFT JOIN options o ON q.id = o.question_id
      WHERE q.quiz_id = ?
      GROUP BY q.id
      ORDER BY q.position
    `).all(quizId)
  },

  getResults: (quizId: string) => {
    return db.prepare('SELECT * FROM results WHERE quiz_id = ?').all(quizId)
  },

  saveSubmission: (submission: any) => {
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    db.prepare(`
      INSERT INTO submissions (id, quiz_id, email, result_key, answers, ip_hash, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      submissionId,
      submission.quiz_id,
      submission.email,
      submission.result_key,
      JSON.stringify(submission.answers),
      submission.ip_hash,
      submission.user_agent
    )

    // Save individual answers
    const insertAnswer = db.prepare(`
      INSERT INTO answers (id, submission_id, question_id, result_key)
      VALUES (?, ?, ?, ?)
    `)

    Object.entries(submission.answers).forEach(([questionId, resultKey]) => {
      const answerId = `ans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      insertAnswer.run(answerId, submissionId, questionId, resultKey as string)
    })

    return submissionId
  }
}

// Initialize database on import
initDatabase()
seedDatabase()

export default db
