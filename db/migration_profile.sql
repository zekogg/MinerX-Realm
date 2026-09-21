-- =====================================================================
-- Migration لهذه الجولة فقط: نافذة Profile (تاريخ التسجيل + صورة تيليجرام)
-- شغّلها مرة واحدة على D1 الحي (D1 Console أو wrangler).
-- =====================================================================

ALTER TABLE users ADD COLUMN created_at INTEGER;
ALTER TABLE users ADD COLUMN photo_url TEXT;

-- المستخدمون الموجودون حالياً من قبل هذا التحديث ليس لديهم created_at
-- حقيقي — نضع تاريخ اليوم كبداية لهم (طلب صريح من مالك المشروع، بما أنه
-- المستخدم الحقيقي الوحيد حالياً).
UPDATE users SET created_at = strftime('%s','now') * 1000 WHERE created_at IS NULL;
