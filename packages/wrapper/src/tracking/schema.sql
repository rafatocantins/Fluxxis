-- Fluxxis Tracking Schema
-- Compatível com PostgreSQL 14+ e SQLite 3.38+

-- ──────────────────────────────────────
-- 1. User Sessions
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS fluxxis_sessions (
  id TEXT PRIMARY KEY,                    -- UUID
  client_id TEXT NOT NULL,                -- identificador do site/aplicacao
  session_token TEXT NOT NULL,            -- cookie/localStorage anonimo
  user_id TEXT,                           -- NULL ate login
  device_type TEXT,                       -- mobile, desktop, tablet
  browser TEXT,
  os TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_campaign TEXT,
  country TEXT,
  language TEXT,
  consent_given INTEGER DEFAULT 0,       -- 0=false, 1=true
  consent_timestamp TEXT,                 -- ISO 8601
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT                         -- 30 dias se anonimo
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON fluxxis_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON fluxxis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_client ON fluxxis_sessions(client_id);

-- ──────────────────────────────────────
-- 2. Behavior Signals (append-only, high volume)
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS fluxxis_signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL REFERENCES fluxxis_sessions(id),
  signal_type TEXT NOT NULL,              -- page_view, scroll, click, dwell, hover, exit_intent
  payload TEXT NOT NULL,                  -- JSON: {url, scroll_depth, dwell_ms, element_id, ...}
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_signals_session ON fluxxis_signals(session_id);
CREATE INDEX IF NOT EXISTS idx_signals_type ON fluxxis_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_signals_time ON fluxxis_signals(created_at);

-- ──────────────────────────────────────
-- 3. User Profile (textual, inspectable)
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS fluxxis_user_profile (
  user_id TEXT PRIMARY KEY,
  profile_text TEXT NOT NULL DEFAULT '',  -- perfil em linguagem natural
  inferred_intents TEXT NOT NULL DEFAULT '{}', -- JSON: {browse: 0.1, buy: 0.7, learn: 0.2}
  total_sessions INTEGER DEFAULT 0,
  total_signals INTEGER DEFAULT 0,
  first_seen TEXT,
  last_seen TEXT,
  last_updated TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ──────────────────────────────────────
-- 4. Intent Cache (pre-computed, low latency)
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS fluxxis_intent_cache (
  session_id TEXT NOT NULL REFERENCES fluxxis_sessions(id),
  intent_type TEXT NOT NULL,              -- browse, buy, learn, compare
  confidence REAL NOT NULL DEFAULT 1.0,  -- 0.0-1.0
  resolved_tokens TEXT NOT NULL DEFAULT '{}', -- JSON: output do DS Adapter
  expires_at TEXT NOT NULL,
  PRIMARY KEY (session_id, intent_type)
);

CREATE INDEX IF NOT EXISTS idx_cache_expiry ON fluxxis_intent_cache(expires_at);

-- ──────────────────────────────────────
-- PostgreSQL-specific adaptations
-- ──────────────────────────────────────
-- Para PostgreSQL, substituir:
--   INTEGER PRIMARY KEY AUTOINCREMENT → SERIAL PRIMARY KEY
--   TEXT → VARCHAR
--   datetime('now') → NOW()
--   REFERENCES → adicionar ON DELETE CASCADE
