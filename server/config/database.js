import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

let db = null;

// Initialize database
export const initializeDatabase = async () => {
  try {
    // Open SQLite database
    db = await open({
      filename: './hensform.db',
      driver: sqlite3.Database
    });

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS sheds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shed_number TEXT UNIQUE NOT NULL,
        capacity INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS shed_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shed_id INTEGER NOT NULL,
        present_hens INTEGER NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (shed_id) REFERENCES sheds(id) ON DELETE CASCADE,
        UNIQUE(shed_id, date)
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS mortality (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shed_id INTEGER NOT NULL,
        count INTEGER NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (shed_id) REFERENCES sheds(id) ON DELETE CASCADE,
        UNIQUE(shed_id, date)
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS production (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shed_id INTEGER NOT NULL,
        egg_trays INTEGER NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (shed_id) REFERENCES sheds(id) ON DELETE CASCADE,
        UNIQUE(shed_id, date)
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shed_id INTEGER NOT NULL,
        trays_sold INTEGER NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (shed_id) REFERENCES sheds(id) ON DELETE CASCADE,
        UNIQUE(shed_id, date)
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS feed (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shed_id INTEGER NOT NULL,
        quantity_kg REAL NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (shed_id) REFERENCES sheds(id) ON DELETE CASCADE,
        UNIQUE(shed_id, date)
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shed_id INTEGER NOT NULL,
        note TEXT,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (shed_id) REFERENCES sheds(id) ON DELETE CASCADE,
        UNIQUE(shed_id, date)
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS gudam (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        feed_type TEXT NOT NULL,
        quantity_kg REAL NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(feed_type, date)
      )
    `);

    console.log('SQLite database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

// Initialize database on startup
initializeDatabase();
