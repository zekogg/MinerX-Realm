-- =====================================================================
-- Migration لهذه الجولة فقط: مهمة Watch MonetixAds
-- شغّلها مرة واحدة على D1 الحي (D1 Console أو wrangler).
-- =====================================================================

ALTER TABLE users ADD COLUMN monetix_task_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN monetix_task_date TEXT;
