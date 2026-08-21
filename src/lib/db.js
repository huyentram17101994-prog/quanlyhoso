import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.db');
const db = new Database(dbPath);

// Use standard DELETE journal_mode so only a single database.db file is created
db.pragma('journal_mode = DELETE');

// Create tables if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT DEFAULT '',
    mssv TEXT DEFAULT '',
    class_name TEXT DEFAULT '',
    dob TEXT DEFAULT '17/10/1994',
    avatar TEXT DEFAULT '/default-avatar.png',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Migration: Add dob column to existing users table if it doesn't exist yet
try {
  const tableInfo = db.prepare("PRAGMA table_info(users)").all();
  const hasDob = tableInfo.some((col) => col.name === 'dob');
  if (!hasDob) {
    db.exec("ALTER TABLE users ADD COLUMN dob TEXT DEFAULT '17/10/1994'");
  }
} catch (e) {
  console.error("Error migrating table info:", e);
}

// Password hashing helper for seed data
function hashPasswordSeed(password) {
  const salt = 'my_profile_static_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Seed demo user if no users exist
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (userCount === 0) {
  const insertStmt = db.prepare(`
    INSERT INTO users (email, phone, password, full_name, mssv, class_name, dob, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertStmt.run(
    '725000001@student.edu.vn',
    '0912345678',
    hashPasswordSeed('12345678'),
    'Huỳnh Thị Huyền Trâm',
    '725000001',
    '25CT712',
    '17/10/1994',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
}

export default db;
