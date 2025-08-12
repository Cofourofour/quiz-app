const Database = require('better-sqlite3');
const path = require('path');

// Open the database
const db = new Database(path.join(__dirname, 'quiz.db'));

// Updated personality descriptions
const personalities = [
  {
    key: 'A',
    name: '🧑‍💻 The Social Butterfly',
    headline: 'You thrive on connection, community, and a packed calendar.',
    description: 'You\'re the nomad who\'s always down for a rooftop party, brunch coworking session, or casual meet-up with strangers who instantly become friends. You love energy, people, and making every city feel like your new home.\n\nBest Destinations for You:\nMedellín (buzzing expat scene and coworking), Playa del Carmen, Mexico City\n\nYour Perfect Coliving:\nA lively social hub with group dinners, whatsapp group chats, and weekend adventures'
  },
  {
    key: 'B', 
    name: '☕ The Creative Explorer',
    headline: 'You\'re a soul-led wanderer drawn to charm, culture, and good coffee.',
    description: 'You seek out places with character - where cobblestone streets and café culture fuel your creativity. You\'re less about hustle, more about inspiration, and you value beauty, depth, and a sense of local rhythm.\n\nBest Destinations for You:\nOaxaca (art, food, and rich tradition), Antigua Guatemala, Buenos Aires\n\nYour Perfect Coliving:\nA cozy, quiet space with quirky design, creative vibes, and thoughtful people who get your need for alone time and spontaneous connection.'
  },
  {
    key: 'C',
    name: '🏄 The Free-Spirited Adventurer', 
    headline: 'You\'re here for the thrill, the freedom, and the views.',
    description: 'Deadlines matter, but so does catching the sunrise above the clouds or dancing barefoot on the beach. You like destinations that mix wild beauty with a touch of chaos - somewhere you can feel fully alive.\n\nBest Destinations for You:\nMedellín (mountains, music, movement), Puerto Escondido, Santa Teresa\n\nYour Perfect Coliving:\nFlexible and fun, with plenty of spontaneous outings, vibrant communal life, and space to both party and power through a work sprint.'
  },
  {
    key: 'D',
    name: '🌿 The Mindful Minimalist',
    headline: 'You crave calm, clarity, and space to breathe.',
    description: 'Your version of success includes balance, boundaries, and feeling grounded. You seek quiet corners of the world where you can focus on your well-being, work intentionally, and reconnect with yourself.\n\nBest Destinations for You:\nSan Cristóbal de las Casas (peaceful, spiritual, and soulful), Lake Atitlán, the Andes near Medellín\n\nYour Perfect Coliving:\nMinimalist, community-driven, and close to nature - a place where self-care is a priority and slow living is the norm.'
  }
];

// Update each personality
personalities.forEach(personality => {
  const stmt = db.prepare(`
    UPDATE results 
    SET name = ?, headline = ?, description = ?
    WHERE key = ?
  `);
  
  stmt.run(personality.name, personality.headline, personality.description, personality.key);
  console.log(`Updated personality ${personality.key}: ${personality.name}`);
});

console.log('All personalities updated successfully!');
db.close();
