import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

let db: Database.Database;

export const initializeDB = () => {
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/issuance.db');
  
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  
  db = new Database(dbPath);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT UNIQUE,
      credential TEXT,
      issuedAt TEXT,
      worker TEXT
    )
  `);
  
  console.log(`Database initialized at: ${dbPath}`);
  
  return db;
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDB() first.');
  }
  return db;
};

export { db };