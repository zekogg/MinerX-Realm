-- =====================================================================
-- Migration لهذه الجولة فقط: لوحة الأدمن (Admin Panel داخل التطبيق).
-- شغّلها مرة واحدة على D1 الحي (D1 Console أو wrangler).
-- =====================================================================

-- admin_tasks: ثلاثة أعمدة جديدة على الجدول الموجود مسبقاً.
-- description  : نص صغير يظهر تحت اسم المهمة للمستخدمين (اختياري).
-- max_claims   : الحد الأقصى لعدد مرات استلام هذه المهمة إجمالياً عبر كل
--                المستخدمين (NULL = بلا حد). عند الوصول له تختفي المهمة
--                من /api/tasks/list تلقائياً (لا تُحذف، فقط لا تُطابق الشرط).
-- claims_count : عدّاد مخزَّن (بدل COUNT(*) على admin_task_claims في كل
--                طلب) يُزاد ذرّياً بشرط "claims_count < max_claims" عند كل
--                استلام ناجح — نفس أسلوب uses_count بالضبط على promo_codes.
ALTER TABLE admin_tasks ADD COLUMN description TEXT;
ALTER TABLE admin_tasks ADD COLUMN max_claims INTEGER;
ALTER TABLE admin_tasks ADD COLUMN claims_count INTEGER NOT NULL DEFAULT 0;
