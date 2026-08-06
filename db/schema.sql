-- CJ Klinik — D1 database schema
-- Run once against your D1 database:
-- wrangler d1 execute cj-klinik-db --remote --file=./db/schema.sql
-- (use --local instead of --remote for local development)

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  slot TEXT NOT NULL,
  time TEXT,
  service TEXT,
  doctor TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS doctor_slots (
  doctor_id TEXT NOT NULL,
  date TEXT NOT NULL,
  morning INTEGER NOT NULL DEFAULT 0,
  afternoon INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (doctor_id, date)
);

CREATE TABLE IF NOT EXISTS notice (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  type TEXT,
  message TEXT,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS sheet_links (
  key TEXT PRIMARY KEY,
  url TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS duty_roster (
  day_key TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  staff TEXT NOT NULL DEFAULT ''
);

-- Seed data (safe to re-run; INSERT OR IGNORE skips rows that already exist)
INSERT OR IGNORE INTO notice (id, type, message, updated_at) VALUES (1, NULL, NULL, NULL);

INSERT OR IGNORE INTO sheet_links (key, url) VALUES
  ('tpa', ''), ('labtest', ''), ('preorder', ''), ('weightloss', ''), ('tpaprice', '');

INSERT OR IGNORE INTO settings (key, value) VALUES ('guideline_doc_url', '');

INSERT OR IGNORE INTO duty_roster (day_key, sort_order, staff) VALUES
  ('mon', 1, 'Siti, Wei Jian'),
  ('tue', 2, 'Hui Min, Ah Kow'),
  ('wed', 3, 'Siti, Hui Min'),
  ('thu', 4, 'Wei Jian, Ah Kow'),
  ('fri', 5, 'Siti, Wei Jian, Hui Min'),
  ('sat', 6, 'Ah Kow'),
  ('sun', 7, 'Closed');
