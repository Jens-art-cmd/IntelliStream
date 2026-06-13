-- Branchen ohne Scout-Agent deaktivieren (Phase 6 noch nicht umgesetzt)
-- Betroffen: Agrar (12), E-Commerce (16), Smart City (17), Bildung (18), Maritime (19), Gaming (20)
UPDATE industries
SET is_active = false
WHERE id IN (12, 16, 17, 18, 19, 20);
