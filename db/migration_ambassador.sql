-- =====================================================================
-- Migration لهذه الجولة فقط: The Ambassador (منح/سحب يدوي بالكامل من الأدمن)
-- شغّلها مرة واحدة على D1 الحي (D1 Console أو wrangler).
-- =====================================================================

-- صف واحد لكل مستخدم = "منح معلّق" لم يُستلم بعد. وجود الصف يجعل زر
-- Claim يتوهج في الواجهة ويصبح قابلاً للضغط؛ عند الضغط يُنشأ صف حقيقي في
-- user_pets بنفس قيمة speed هنا، ثم يُحذف هذا الصف تلقائياً (استُهلك).
CREATE TABLE IF NOT EXISTS ambassador_grants (
  telegram_id INTEGER PRIMARY KEY,
  speed INTEGER NOT NULL,
  granted_at INTEGER NOT NULL
);
