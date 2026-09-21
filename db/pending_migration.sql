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

-- -- Daily Combo (تركيبة يومية بثلاث بطاقات ثابتة: Duck, Polar Bear, Penguin) --
-- daily_combo: صف واحد لكل يوم UTC — card_order هو الترتيب الصحيح السرّي
-- الذي اختاره السيرفر عشوائياً (يُخزَّن كنص مفصول بفواصل، مثلاً
-- "duck,penguin,polar_bear")، ولا يُرسَل أبداً لأي نقطة API يراها المستخدم.
CREATE TABLE IF NOT EXISTS daily_combo (
  date TEXT PRIMARY KEY,
  card_order TEXT NOT NULL
);

-- combo_attempts: محاولات كل مستخدم لكل يوم — attempts_used يبدأ من 0
-- ويصل لحد أقصى COMBO_MAX_ATTEMPTS (محاولتان)، وsolved=1 فقط عند تخمين
-- نفس الترتيب بالضبط (الترتيب مهم، وليس فقط اختيار البطاقات الصحيحة).
CREATE TABLE IF NOT EXISTS combo_attempts (
  telegram_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  attempts_used INTEGER NOT NULL DEFAULT 0,
  solved INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (telegram_id, date)
);

-- -- Watch Adsgram Ad (أول بطاقة حقيقية في Daily Ads، حد أقصى 10/يوم) --
-- ads_task_count : عدد الإعلانات المُشاهَدة والمُكافأة فعلياً "لليوم
--                   المسجَّل في ads_task_date" — يُصفَّر ضمنياً (بدون أي
--                   كتابة) عند أي طلب في يوم UTC مختلف، نفس أسلوب باقي
--                   الميزات اليومية (Start Mining, Spin, ...).
-- ads_task_date  : تاريخ اليوم (UTC) المرتبط بالعداد أعلاه.
ALTER TABLE users ADD COLUMN ads_task_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN ads_task_date TEXT;

-- -- Friends / Referrals (مكافآت الإحالة + Milestone Missions) --
-- ads_task_total          : إجمالي الإعلانات المُشاهَدة مدى الحياة (لا يُصفَّر
--                            أبداً، بخلاف ads_task_count اليومي) — يُستخدم فقط
--                            لتحديد "نشط" (10 فأكثر تراكمياً).
-- referral_pending_earnings: رصيد أرباح الإحالة المعلّق (تسجيل +20 + نشاط
--                            +130 + عمولة إيداع 5%) — لا يُضاف لـcoins إلا
--                            بطلب Claim صريح (بحد أدنى 5000).
-- invites_count            : عدّاد مُخزَّن لعدد الأصدقاء المدعوين (بدل COUNT(*)).
-- active_referrals_count   : عدّاد مُخزَّن لعدد الأصدقاء "النشطين" فقط — أساس
--                            تقدّم واستحقاق Milestone Missions.
-- milestone_*_claimed      : علم واحد لكل عتبة، يُمنح مرة واحدة ويُضاف مباشرة
--                            لـcoins (لا يمر عبر الرصيد المعلّق) — أعمدة مسطّحة
--                            على users عمداً (أرخص من جدول منفصل لأنها لا
--                            تتطلب أي JOIN إضافي على /api/user).
-- ملاحظة: عتبات/مكافآت Milestone Missions نفسها تُقرأ من جدول
-- milestone_missions الموجود مسبقاً بالقاعدة (وليست أرقاماً بالكود) — لو
-- أضفت عتبة جديدة هناك (مثلاً 200)، يلزم أيضاً عمود milestone_200_claimed هنا.
ALTER TABLE users ADD COLUMN ads_task_total INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN referral_pending_earnings REAL DEFAULT 0;
ALTER TABLE users ADD COLUMN invites_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN active_referrals_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_10_claimed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_25_claimed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_50_claimed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_100_claimed INTEGER DEFAULT 0;

-- جدول referrals كان موجوداً مسبقاً بالقاعدة بعمودي is_active وinvited_at
-- جاهزَين لنفس الغرض بالضبط — استخدمناهما مباشرة بدل إنشاء جدول موازٍ،
-- وأضفنا فقط عمود earned_coins (إجمالي ما جلبه هذا الصديق تحديداً للمُحيل،
-- لعرضه في Friends List). لا حاجة لعمود "signup_bonus_paid" لأن مكافأة
-- التسجيل تُمنح ضمن نفس السطر الذي يُنشئ صف المستخدم الجديد لأول مرة
-- (لا يتكرر تنفيذه إطلاقاً)، فلا داعي لعلم منفصل.
ALTER TABLE referrals ADD COLUMN earned_coins REAL DEFAULT 0;

-- -- Check-in (4 مهام يومية، Reset 00:00 UTC) --
-- checkin1..4_claimed_date: تاريخ آخر استلام ناجح لكل مهمة على حدة (نفس
-- أسلوب last_spin_date). المهمتان 1 و2 بلا تحقق سيرفري حقيقي (فتح رابط +
-- انتظار 5 ثوانٍ من الواجهة فقط). المهمة 3 يتحقق السيرفر أن الاسم الظاهر
-- يحتوي "@MinerXRealmBot"، والمهمة 4 يتحقق عبر Telegram getChat أن الـbio
-- يحتوي رابط إحالة هذا المستخدم تحديداً.
ALTER TABLE users ADD COLUMN checkin1_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin2_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin3_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin4_claimed_date TEXT;

-- -- Bonus AD Every 1H (إعلان Adsgram إضافي، منفصل عن Watch Adsgram Ad اليومية) --
-- bonus_ad_count_today   : عدد المرات المُكافأة اليوم (حد أقصى 5).
-- bonus_ad_date          : تاريخ اليوم (UTC) المرتبط بالعداد أعلاه.
-- bonus_ad_last_watched_at: وقت آخر مشاهدة ناجحة (مللي ثانية) — أساس
--                           تبريد الساعة الواحدة بين كل إعلان والتالي.
ALTER TABLE users ADD COLUMN bonus_ad_count_today INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN bonus_ad_date TEXT;
ALTER TABLE users ADD COLUMN bonus_ad_last_watched_at INTEGER;

-- -- Partner / Special (مهام يديرها الأدمن من D1 حالياً، ولاحقاً من لوحة أدمن) --
-- admin_tasks: صف واحد لكل مهمة. section = 'partner' أو 'special'.
-- channel_id (اختياري): معرّف/اسم قناة تيليجرام — إن وُجد، يُتحقَّق فعلياً
-- من عضوية المستخدم فيها عبر getChatMember قبل منح المكافأة؛ إن كان
-- فارغاً (مهمة بلا تحقق آلي، مثل "شارك المنشور")، تُمنح المكافأة مباشرة
-- عند الضغط. is_active يسمح بإخفاء مهمة دون حذفها. display_order يتحكم
-- بترتيب الظهور.
CREATE TABLE IF NOT EXISTS admin_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  icon_url TEXT,
  reward_coins INTEGER NOT NULL,
  link TEXT NOT NULL,
  channel_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_section ON admin_tasks(section, is_active, display_order);

-- admin_task_claims: استلام واحد فقط مدى الحياة لكل مستخدم × كل مهمة
-- (وليست يومية، بخلاف Check-in) — قيد PRIMARY KEY هو الـCAS الذي يمنع أي
-- استلام مضاعف.
CREATE TABLE IF NOT EXISTS admin_task_claims (
  telegram_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  claimed_at INTEGER NOT NULL,
  PRIMARY KEY (telegram_id, task_id)
);

-- مثال لإضافة مهمة جديدة يدوياً في قسم Partner (استبدل القيم):
-- INSERT INTO admin_tasks (section, title, icon_url, reward_coins, link, channel_id, display_order, created_at)
-- VALUES ('partner', 'Join This Channel', 'https://.../icon.svg', 10, 'https://t.me/YourChannel', '@YourChannel', 0, strftime('%s','now') * 1000);

-- -- Watch gigapub ads --
-- gigapub_task_count/date : عدّاد يومي (نفس أسلوب ads_task_count) —
-- يُمنح فقط عبر Postback حقيقي من GigaPub (/api/gigapub/postback).
-- ملاحظة: gigapub_pending_token/expires كانا لآلية توكن مؤقتة أُستخدمت
-- قبل توفّر Postback حقيقي، وأصبحا غير مُستخدَمين في الكود الحالي (تُركا
-- في القاعدة بلا ضرر بدل حذفهما).
ALTER TABLE users ADD COLUMN gigapub_task_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN gigapub_task_date TEXT;
ALTER TABLE users ADD COLUMN gigapub_pending_token TEXT;
ALTER TABLE users ADD COLUMN gigapub_pending_expires INTEGER;

-- -- نافذة Profile (تاريخ التسجيل + صورة تيليجرام الحقيقية) --
-- created_at : وقت إنشاء صف المستخدم لأول مرة (مللي ثانية) — يُعرض بصيغة
-- DD-MM-YYYY في نافذة Profile. المستخدمون الموجودون قبل هذا التحديث
-- حُدِّث لهم created_at لتاريخ تطبيق التحديث نفسه (انظر migration_profile.sql).
-- photo_url : آخر رابط صورة بروفايل تيليجرام معروف لهذا المستخدم، يُخزَّن
-- من initData الموثَّق فقط (وليس من أي مصدر آخر) — يفيد لاحقاً بعرض صور
-- الأصدقاء بأماكن كقائمة Friends التي لا تملك initData الخاص بغير المستخدم
-- الحالي نفسه.
ALTER TABLE users ADD COLUMN created_at INTEGER;
ALTER TABLE users ADD COLUMN photo_url TEXT;
