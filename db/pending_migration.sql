-- =====================================================================
-- تعديلات مؤجلة على قاعدة D1 — لا تُطبَّق تلقائياً.
-- كل ميزة جديدة تضيف تعديلاتها هنا، وتُطبَّق دفعة واحدة عند اكتمال البوت
-- (شغّلها بالترتيب المكتوب عبر: wrangler d1 execute minerxrealm --file=db/pending_migration.sql)
-- =====================================================================

-- -- Start Mining (شخصية Doge الأساسية) --------------------------------
-- mining_started_at   : وقت بدء الدورة الحالية بتوقيت UTC (NULL = غير نشط)
-- mining_cycles_today : عدد الدورات المكتملة "لليوم المسجّل في mining_cycle_date"
-- mining_cycle_date   : تاريخ اليوم (UTC) المرتبط بالعداد أعلاه — يُقارَن به
--                       عند كل طلب لتصفير العداد ضمنياً بعد 00:00 UTC بدون
--                       الحاجة لأي مهمة مجدولة (cron) منفصلة.
ALTER TABLE users ADD COLUMN mining_started_at TEXT;
ALTER TABLE users ADD COLUMN mining_cycles_today INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN mining_cycle_date TEXT;
