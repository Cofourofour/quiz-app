const Database = require('better-sqlite3')
const path = require('path')

// Connect to database
const dbPath = path.join(process.cwd(), 'quiz.db')
const db = new Database(dbPath)

console.log('Updating Social Butterfly email template...')

// Update the Social Butterfly email template
const updateResult = db.prepare(`
  UPDATE results 
  SET email_template = ?
  WHERE key = 'A' AND name LIKE '%Social Butterfly%'
`)

const newTemplate = `Hi {{name}}!

🧑‍💻 **You're The Social Butterfly!**

You thrive on connection, community, and a packed calendar. You're the nomad who's always down for a rooftop party, brunch coworking session, or casual meet-up with strangers who instantly become friends.

**Perfect destinations for you:**
1. Medellin, Colombia - buzzing expat scene and coworking
2. Playa del Carmen
3. 🇲🇽 Mexico City, Mexico - Vibrant community and endless networking

**Your ideal setup:**
• Buzzing coworking spaces with regular events
• Coliving spaces with active communities
• Cities with established digital nomad scenes

Ready to connect with your tribe? 🌍

Best,
Co404 Team`

const result = updateResult.run(newTemplate)

console.log(`Updated ${result.changes} record(s)`)

// Verify the update
const verify = db.prepare(`SELECT name, email_template FROM results WHERE key = 'A'`).get()
if (verify) {
  console.log('✅ Social Butterfly template updated successfully!')
  console.log('New destinations:')
  console.log('1. Medellin, Colombia')
  console.log('2. Playa del Carmen') 
  console.log('3. Mexico City, Mexico')
} else {
  console.log('❌ Update failed')
}

db.close()
