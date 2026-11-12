-- Ekzekutoje në Neon SQL Editor pas schema-java08.sql.
-- Një preferim i vetëm për çdo përdorues dhe udhëtim.
CREATE TABLE IF NOT EXISTS udhetimet_preferuara (
  github_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  udhetim_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  krijuar_me TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (github_id, udhetim_id)
);

CREATE INDEX IF NOT EXISTS udhetimet_preferuara_udhetim_idx
  ON udhetimet_preferuara (udhetim_id);
