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
    const dbPath = process.env.DB_PATH || path_1.default.join(__dirname, '../../data/issuance.db');
    fs_1.default.mkdirSync(path_1.default.dirname(dbPath), { recursive: true });
    exports.db = db = new better_sqlite3_1.default(dbPath);
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
exports.initializeDB = initializeDB;
const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDB() first.');
    }
    return db;
};
exports.getDB = getDB;
