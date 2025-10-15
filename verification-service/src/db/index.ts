import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

let db: Database.Database;

export const initializeDB = () => {
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/verification.db');
  
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  
  db = new Database(dbPath);
  
  // Credentials table (synced from issuance service)
  db.exec(`
    CREATE TABLE IF NOT EXISTS credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT UNIQUE NOT NULL,
      credential TEXT NOT NULL,
      issuedAt TEXT NOT NULL,
      worker TEXT NOT NULL,
      syncedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Verification logs table (audit trail)
  db.exec(`
    CREATE TABLE IF NOT EXISTS verification_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL,
      verifiedAt TEXT NOT NULL,
      verifiedBy TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('verified', 'not_found')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log(`✓ Verification database initialized at: ${dbPath}`);
  
  return db;
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDB() first.');
  }
  return db;
};

export { db };