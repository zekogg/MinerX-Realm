-- =====================================================================
-- Migration لهذه الجولة فقط: Watch gigapub ads
-- شغّلها مرة واحدة على D1 الحي (D1 Console أو wrangler).
-- =====================================================================

ALTER TABLE users ADD COLUMN gigapub_task_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN gigapub_task_date TEXT;
ALTER TABLE users ADD COLUMN gigapub_pending_token TEXT;
ALTER TABLE users ADD COLUMN gigapub_pending_expires INTEGER;
