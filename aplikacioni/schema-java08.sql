-- Ekzekutoje në Neon SQL Editor pas schema-java05.sql.
-- Vendndodhja ndahet vetëm për udhëtime me kërkesë të pranuar nga shoferi.
CREATE TABLE IF NOT EXISTS kerkesat_udhetimit (
  id BIGSERIAL PRIMARY KEY,
  udhetim_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  udhetar_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ne_pritje'
    CHECK (status IN ('ne_pritje', 'pranuar', 'refuzuar')),
  krijuar_me TIMESTAMPTZ NOT NULL DEFAULT now(),
  ndryshuar_me TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (udhetim_id, udhetar_id)
);

CREATE INDEX IF NOT EXISTS kerkesat_udhetimit_pritje_idx
  ON kerkesat_udhetimit (udhetim_id, status);

CREATE TABLE IF NOT EXISTS vendndodhjet_live (
  udhetim_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  saktesia DOUBLE PRECISION NOT NULL CHECK (saktesia >= 0),
  aktive BOOLEAN NOT NULL DEFAULT true,
  perditesuar_me TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (udhetim_id, profile_id)
);

CREATE INDEX IF NOT EXISTS vendndodhjet_live_perditesuar_idx
  ON vendndodhjet_live (udhetim_id, perditesuar_me DESC);
