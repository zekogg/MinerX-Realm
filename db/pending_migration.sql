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

-- -- Daily Streak (دورة أسبوعية متكررة 1-7، تُعاد لليوم 1 عند أي انقطاع) --
-- streak_day             : اليوم القادم المستحق (1-7). يلتف لـ1 بعد اكتمال اليوم 7.
-- streak_last_claim_date : تاريخ آخر Claim ناجح بتوقيت UTC — يُقارَن به لتحديد
--                          هل استمر التسلسل، انقطع (يرجع لليوم 1)، أو استُلم اليوم بالفعل.
ALTER TABLE users ADD COLUMN streak_day INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN streak_last_claim_date TEXT;

-- ملاحظة تصميم مهمة: جدول daily_streak_claims المُنشأ مسبقاً بمفتاح أساسي
-- (telegram_id, day_number) لا يصلح لهذه الدورة الأسبوعية المتكررة — نفس
-- (telegram_id, day_number) سيتكرر كل أسبوع ويسبب تعارض INSERT. لذلك لم
-- نستخدم هذا الجدول إطلاقاً؛ سجل كل Claim يُحفظ بدلاً منه في جدول
-- transactions (type = 'daily_streak') كأرشيف تاريخي بدون قيد تكرار.
-- إذا رغبت مستقبلاً بجدول تاريخي مخصص، الأفضل مفتاح (telegram_id, claimed_at)
-- بدل (telegram_id, day_number).

-- -- Spin (عجلة الحظ اليومية المجانية) ------------------------------------
-- last_spin_date : تاريخ آخر دورة مجانية ناجحة بتوقيت UTC — يُقارَن بتاريخ
--                  اليوم الحالي لتحديد هل تبقّت دورة مجانية اليوم (بدون أي
--                  مهمة مجدولة، نفس أسلوب Start Mining وDaily Streak).
ALTER TABLE users ADD COLUMN last_spin_date TEXT;

-- -- Chest وGift Pick (نفس جدول جوائز واحتمالات Spin بالضبط، محاولة يومية
--    مستقلة لكل ميزة) --------------------------------------------------
-- last_chest_date    : تاريخ آخر فتح صندوق ناجح بتوقيت UTC
-- last_giftpick_date : تاريخ آخر فتح هدية ناجح بتوقيت UTC
ALTER TABLE users ADD COLUMN last_chest_date TEXT;
ALTER TABLE users ADD COLUMN last_giftpick_date TEXT;

-- -- Promo Code ------------------------------------------------------------
-- uses_count : عدّاد مخزَّن لعدد مرات استخدام الكود، يُحدَّث ذرّياً عند كل
--              استبدال ناجح. بديل عن COUNT(*) على promo_redemptions في كل
--              محاولة (كان سيقرأ كل الصفوف المتراكمة لنفس الكود في كل مرة —
--              مكلف على D1 كلما زاد عدد المستخدمين له). قراءة/كتابة صف واحد
--              ثابتة التكلفة بدلاً من ذلك.
ALTER TABLE promo_codes ADD COLUMN uses_count INTEGER DEFAULT 0;

-- -- Deposit (إيداع Gram حقيقي على شبكة TON — يُحوَّل تلقائياً إلى Coins) --
-- جدول جديد بالكامل: كل صف = معاملة TON واحدة تم تأكيدها فعلياً على
-- البلوكتشين (تحققها DepositChecker Durable Object). قيد UNIQUE على
-- tx_hash هو خط الدفاع الأخير ضد أي تحصيل مضاعف لنفس المعاملة، حتى لو
-- أعاد الـ alarm نفس الفحص أكثر من مرة أو أعاد Worker تشغيل نفسه.
CREATE TABLE IF NOT EXISTS deposits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  tx_hash TEXT NOT NULL UNIQUE,
  amount_gram REAL NOT NULL,
  coins_credited REAL NOT NULL,
  status TEXT NOT NULL,
  memo TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_deposits_telegram_id ON deposits(telegram_id);

-- -- Withdraw (سحب يدوي بالكامل — لا فحص بلوكتشين، فقط Approve/Reject) --
-- last_withdraw_request_at : وقت آخر طلب سحب بالمللي ثانية (UTC) — يُقارَن
--                             به لتطبيق فترة الانتظار 24 ساعة، تبدأ فور
--                             الطلب بغض النظر عن نجاح السحب أو رفضه.
ALTER TABLE users ADD COLUMN last_withdraw_request_at INTEGER;

-- withdrawals: كل صف = طلب سحب واحد. amount_gram هو المبلغ الكامل المخصوم
-- من رصيد المستخدم فور الطلب (يُعاد بالكامل لو رُفض)، وnet_gram هو المبلغ
-- الصافي بعد خصم الرسوم (fee_gram) — وهو الرقم الذي يظهر بالرسائل ويجب
-- على الأدمن إرساله فعلياً للمستخدم عند الموافقة.
CREATE TABLE IF NOT EXISTS withdrawals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  raw_username TEXT,
  first_name TEXT,
  amount_gram REAL NOT NULL,
  fee_gram REAL NOT NULL,
  net_gram REAL NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  channel_message_id INTEGER,
  created_at INTEGER NOT NULL,
  resolved_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_withdrawals_telegram_id ON withdrawals(telegram_id);
