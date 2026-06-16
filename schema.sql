-- Schema para la tabla calls
CREATE TABLE IF NOT EXISTS calls (
  id SERIAL PRIMARY KEY,
  call_id TEXT UNIQUE NOT NULL,
  agent_id TEXT,
  status TEXT,
  duration_seconds INTEGER,
  transcript TEXT,
  event_type TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la tabla ya existe, aplicar estos ALTER:
-- ALTER TABLE calls ADD COLUMN IF NOT EXISTS event_type TEXT;
-- ALTER TABLE calls ADD COLUMN IF NOT EXISTS raw_payload JSONB;
-- ALTER TABLE calls ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
-- ALTER TABLE calls ADD CONSTRAINT calls_call_id_unique UNIQUE (call_id);
