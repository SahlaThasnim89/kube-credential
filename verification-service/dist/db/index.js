"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.getDB = exports.initializeDB = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let db;
const initializeDB = () => {
    const dbPath = process.env.DB_PATH || path_1.default.join(__dirname, '../../data/verification.db');
    fs_1.default.mkdirSync(path_1.default.dirname(dbPath), { recursive: true });
    exports.db = db = new better_sqlite3_1.default(dbPath);
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
exports.initializeDB = initializeDB;
const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDB() first.');
    }
    return db;
};
exports.getDB = getDB;
