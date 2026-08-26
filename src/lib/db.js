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

  CREATE TABLE IF NOT EXISTS computers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    room TEXT DEFAULT 'Phòng máy 01',
    specs TEXT DEFAULT '',
    status TEXT DEFAULT 'available', -- available, pending, in_use, maintenance
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS computer_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    computer_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    purpose TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, returned
    admin_note TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (computer_id) REFERENCES computers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Migrations
try {
  const tableInfo = db.prepare("PRAGMA table_info(users)").all();
  const hasDob = tableInfo.some((col) => col.name === 'dob');
  if (!hasDob) {
    db.exec("ALTER TABLE users ADD COLUMN dob TEXT DEFAULT '17/10/1994'");
  }
  const hasRole = tableInfo.some((col) => col.name === 'role');
  if (!hasRole) {
    db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
  }
  // Ensure ONLY 725000001@student.edu.vn is admin, set all other users to 'user' role
  db.exec("UPDATE users SET role = 'user' WHERE LOWER(email) != '725000001@student.edu.vn'");
  db.exec("UPDATE users SET role = 'admin' WHERE LOWER(email) = '725000001@student.edu.vn'");

  // Migration: Update existing computer names to simple sequence M01, M02...
  db.exec(`
    UPDATE computers SET code = 'M01', name = 'Máy M01', specs = '' WHERE code = 'PC-01';
    UPDATE computers SET code = 'M02', name = 'Máy M02', specs = '' WHERE code = 'PC-02';
    UPDATE computers SET code = 'M03', name = 'Máy M03', specs = '' WHERE code = 'PC-03';
    UPDATE computers SET code = 'M04', name = 'Máy M04', specs = '' WHERE code = 'PC-04';
    UPDATE computers SET code = 'M05', name = 'Máy M05', specs = '' WHERE code = 'PC-05';
    UPDATE computers SET code = 'M06', name = 'Máy M06', specs = '' WHERE code = 'PC-06';
  `);
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
    INSERT INTO users (email, phone, password, full_name, mssv, class_name, dob, avatar, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertStmt.run(
    '725000001@student.edu.vn',
    '0912345678',
    hashPasswordSeed('12345678'),
    'Huỳnh Thị Huyền Trâm',
    '725000001',
    '25CT712',
    '17/10/1994',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'admin'
  );
}

// Seed demo computers if no computers exist
const computerCount = db.prepare('SELECT COUNT(*) as count FROM computers').get().count;
if (computerCount === 0) {
  const insertComp = db.prepare(`
    INSERT INTO computers (code, name, room, specs, status)
    VALUES (?, ?, ?, ?, ?)
  `);

  const initialComputers = [
    ['M01', 'Máy M01', 'Phòng máy 01', '', 'available'],
    ['M02', 'Máy M02', 'Phòng máy 01', '', 'available'],
    ['M03', 'Máy M03', 'Phòng máy 01', '', 'in_use'],
    ['M04', 'Máy M04', 'Phòng máy 01', '', 'pending'],
    ['M05', 'Máy M05', 'Phòng máy 02', '', 'available'],
    ['M06', 'Máy M06', 'Phòng máy 02', '', 'maintenance']
  ];

  initialComputers.forEach(([code, name, room, specs, status]) => {
    insertComp.run(code, name, room, specs, status);
  });
}

export default db;
