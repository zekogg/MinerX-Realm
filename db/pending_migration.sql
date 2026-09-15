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

-- ملاحظة: العمود التالي أُضيف يدوياً على D1 الحي بالفعل (وليس عبر هذا الملف).
-- مُدرَج هنا فقط للتوثيق حتى لا يُعاد إضافته بالخطأ عند بناء migration نهائي
-- شامل لاحقاً (وإلا سيفشل ALTER TABLE بخطأ "duplicate column").
-- ALTER TABLE users ADD COLUMN total_mined REAL DEFAULT 0;  -- تم تطبيقه يدوياً بالفعل
