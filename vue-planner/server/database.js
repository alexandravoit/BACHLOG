const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create the courses table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      semester INTEGER,
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      credits INTEGER,
      season TEXT,
      comments TEXT,
      grade INTEGER,
      type TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating courses table:', err.message);
    } else {
      console.log('Courses table is ready.');
    }
  });
});

module.exports = db;