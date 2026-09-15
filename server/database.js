const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/connect to database
const dbPath = path.join(__dirname, 'tf2.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create items table
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      tf2_buy_keys REAL,
      tf2_buy_ref REAL,
      website_sell_price REAL,
      website_buyback_price REAL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create conversion rates table
  db.run(`
    CREATE TABLE IF NOT EXISTS conversion_rates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key_to_ref REAL NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create arbitrage history table (for tracking completed trades)
  db.run(`
    CREATE TABLE IF NOT EXISTS arbitrage_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_name TEXT NOT NULL,
      profit_keys REAL NOT NULL,
      profit_ref REAL NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized');
}

module.exports = db;
