-- Ekzekutoje në Neon SQL Editor pas schema-java08.sql.
-- Dy udhëtime fiktive me nga dy vende për provat e Java 10.
-- ID 10: rastet 1–2 (kërkesë dhe pranim).
-- ID 11: rasti 3 (ndërprerje dhe rilidhje).
INSERT INTO udhetimet (id, nisja, destinacioni, ora, vendtakimi, vende)
VALUES
  ('10', 'Ferizaj (provë Java 10)', 'AAB', '08:15', 'Stacioni (provë)', 2),
  ('11', 'Fushë Kosovë (provë Java 10)', 'AAB', '08:30', 'Qendra (provë)', 2)
ON CONFLICT (id) DO NOTHING;

SELECT id, nisja, destinacioni, ora, vende
FROM udhetimet WHERE id IN ('10', '11') ORDER BY id;
