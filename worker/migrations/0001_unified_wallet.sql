CREATE TABLE IF NOT EXISTS unified_wallet_state (
  user_id TEXT PRIMARY KEY,
  infinity_balance INTEGER NOT NULL DEFAULT 0 CHECK (infinity_balance >= 0),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS unified_token_records (
  token_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_type TEXT NOT NULL CHECK (token_type IN ('MUSIC_QUANT','LISTENING_QUANT','QUANT_DATA')),
  source TEXT NOT NULL,
  data_json TEXT NOT NULL,
  provenance_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS unified_tokens_by_user ON unified_token_records(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS unified_wallet_events (
  event_id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  asset_code TEXT NOT NULL CHECK (asset_code IN ('INFINITY','MUSIC_QUANT','QUANT')),
  event_type TEXT NOT NULL CHECK (event_type IN ('IMPORT','MINT','SPEND','REVERSAL')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
  reference_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS unified_events_by_user ON unified_wallet_events(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS unified_imports (
  user_id TEXT NOT NULL,
  import_key TEXT NOT NULL,
  imported_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, import_key)
);
