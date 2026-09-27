-- =====================================================================
-- سجل كامل بكل تعديلات قاعدة D1 منذ بداية المشروع، مرتّبة زمنياً.
-- كل ما هنا مُطبَّق بالفعل يدوياً على D1 الحي (عبر D1 Console) — هذا
-- الملف توثيق/أرشيف فقط، وليس آلية تلقائية (لا شيء ينفّذه أثناء النشر).
-- فائدته: (1) معرفة سبب/توقيت كل عمود أو جدول لاحقاً، (2) إعادة بناء
-- نفس الهيكل من الصفر على قاعدة D1 جديدة لو احتجت ذلك يوماً (نفّذها
-- بالترتيب المكتوب هنا).
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

-- total_mined: أُضيف يدوياً على D1 الحي قبل توثيقه هنا.
-- ALTER TABLE users ADD COLUMN total_mined REAL DEFAULT 0;

-- -- Daily Streak (دورة أسبوعية متكررة 1-7، تُعاد لليوم 1 عند أي انقطاع) --
-- streak_day             : اليوم القادم المستحق (1-7). يلتف لـ1 بعد اكتمال اليوم 7.
-- streak_last_claim_date : تاريخ آخر Claim ناجح بتوقيت UTC — يُقارَن به لتحديد
--                          هل استمر التسلسل، انقطع (يرجع لليوم 1)، أو استُلم اليوم بالفعل.
ALTER TABLE users ADD COLUMN streak_day INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN streak_last_claim_date TEXT;

-- ملاحظة تصميم مهمة: جدول daily_streak_claims المُنشأ مسبقاً بمفتاح أساسي
-- (telegram_id, day_number) لا يصلح لهذه الدورة الأسبوعية المتكررة — لذلك
-- لم نستخدمه إطلاقاً؛ سجل كل Claim يُحفظ بدلاً منه في transactions
-- (type = 'daily_streak'). الجدول نفسه حُذف لاحقاً (انظر قسم التنظيف أسفله).

-- -- Spin (عجلة الحظ اليومية المجانية) ------------------------------------
ALTER TABLE users ADD COLUMN last_spin_date TEXT;

-- -- Chest وGift Pick (نفس جدول جوائز واحتمالات Spin بالضبط) --------------
ALTER TABLE users ADD COLUMN last_chest_date TEXT;
ALTER TABLE users ADD COLUMN last_giftpick_date TEXT;

-- -- Promo Code ------------------------------------------------------------
-- uses_count : عدّاد مخزَّن لعدد مرات استخدام الكود، يُحدَّث ذرّياً عند كل
--              استبدال ناجح — بديل عن COUNT(*) على promo_redemptions.
ALTER TABLE promo_codes ADD COLUMN uses_count INTEGER DEFAULT 0;

-- -- Deposit (إيداع Gram حقيقي على شبكة TON — يُحوَّل تلقائياً إلى Coins) --
-- قيد UNIQUE على tx_hash هو خط الدفاع الأخير ضد أي تحصيل مضاعف لنفس المعاملة.
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
--                             به لتطبيق فترة الانتظار 24 ساعة.
ALTER TABLE users ADD COLUMN last_withdraw_request_at INTEGER;

-- withdrawals: net_gram هو الصافي بعد خصم fee_gram — الرقم الذي يجب على
-- الأدمن إرساله فعلياً للمستخدم عند الموافقة.
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

-- -- Daily Combo (تركيبة يومية بثلاث بطاقات ثابتة) -------------------------
-- daily_combo: صف واحد لكل يوم UTC — card_order هو الترتيب السرّي الصحيح.
CREATE TABLE IF NOT EXISTS daily_combo (
  date TEXT PRIMARY KEY,
  card_order TEXT NOT NULL
);

-- combo_attempts: محاولات كل مستخدم لكل يوم (حد أقصى محاولتان).
CREATE TABLE IF NOT EXISTS combo_attempts (
  telegram_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  attempts_used INTEGER NOT NULL DEFAULT 0,
  solved INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (telegram_id, date)
);

-- -- Watch Adsgram Ad (أول بطاقة حقيقية في Daily Ads، حد أقصى 10/يوم) --
ALTER TABLE users ADD COLUMN ads_task_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN ads_task_date TEXT;

-- -- Friends / Referrals (مكافآت الإحالة + Milestone Missions) --
-- ads_task_total          : إجمالي الإعلانات المُشاهَدة مدى الحياة (لا يُصفَّر أبداً).
-- referral_pending_earnings: رصيد أرباح الإحالة المعلّق (لا يُضاف لـcoins إلا بـClaim صريح).
-- invites_count / active_referrals_count: عدادان مُخزَّنان بدل COUNT(*).
-- milestone_*_claimed: علم واحد لكل عتبة، يُمنح مرة واحدة مباشرة لـcoins.
ALTER TABLE users ADD COLUMN ads_task_total INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN referral_pending_earnings REAL DEFAULT 0;
ALTER TABLE users ADD COLUMN invites_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN active_referrals_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_10_claimed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_25_claimed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_50_claimed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_100_claimed INTEGER DEFAULT 0;

-- جدول referrals كان موجوداً مسبقاً بعمودي is_active وinvited_at — أضفنا
-- فقط earned_coins (إجمالي ما جلبه هذا الصديق تحديداً للمُحيل).
ALTER TABLE referrals ADD COLUMN earned_coins REAL DEFAULT 0;

-- -- Check-in (4 مهام يومية، Reset 00:00 UTC) --
-- المهمتان 1 و2 بلا تحقق سيرفري حقيقي. المهمة 3 تتحقق من اسم البوت الظاهر،
-- والمهمة 4 تتحقق عبر Telegram getChat من رابط الإحالة داخل الـbio.
ALTER TABLE users ADD COLUMN checkin1_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin2_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin3_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin4_claimed_date TEXT;

-- -- Bonus AD Every 1H (إعلان Adsgram إضافي، منفصل عن Watch Adsgram Ad اليومية) --
ALTER TABLE users ADD COLUMN bonus_ad_count_today INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN bonus_ad_date TEXT;
ALTER TABLE users ADD COLUMN bonus_ad_last_watched_at INTEGER;

-- -- Partner / Special (مهام يديرها الأدمن) --
-- channel_id (اختياري): إن وُجد، يُتحقَّق من العضوية عبر getChatMember قبل المنح.
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

-- admin_task_claims: استلام واحد فقط مدى الحياة لكل مستخدم × كل مهمة —
-- قيد PRIMARY KEY هو الـCAS الذي يمنع أي استلام مضاعف.
CREATE TABLE IF NOT EXISTS admin_task_claims (
  telegram_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  claimed_at INTEGER NOT NULL,
  PRIMARY KEY (telegram_id, task_id)
);

-- مثال لإضافة مهمة جديدة يدوياً في قسم Partner (استبدل القيم):
-- INSERT INTO admin_tasks (section, title, icon_url, reward_coins, link, channel_id, display_order, created_at)
-- VALUES ('partner', 'Join This Channel', 'https://.../icon.svg', 10, 'https://t.me/YourChannel', '@YourChannel', 0, strftime('%s','now') * 1000);

-- -- لوحة الأدمن (Admin Panel داخل التطبيق) --
-- description  : نص صغير يظهر تحت اسم المهمة (اختياري).
-- max_claims   : الحد الأقصى لعدد مرات الاستلام إجمالياً (NULL = بلا حد).
-- claims_count : عدّاد مخزَّن يُزاد بشرط "claims_count < max_claims" عند كل استلام.
ALTER TABLE admin_tasks ADD COLUMN description TEXT;
ALTER TABLE admin_tasks ADD COLUMN max_claims INTEGER;
ALTER TABLE admin_tasks ADD COLUMN claims_count INTEGER NOT NULL DEFAULT 0;

-- تثبيت مهام Special/Partner من لوحة الأدمن.
-- pinned_at: وقت التثبيت بالمللي ثانية (NULL = غير مُثبَّتة). الأقدم تثبيتاً يبقى أولاً.
ALTER TABLE admin_tasks ADD COLUMN pinned_at INTEGER;

-- -- Watch gigapub ads --
-- gigapub_task_count/date: عدّاد يومي، يُمنح فقط عبر Postback حقيقي من GigaPub.
-- gigapub_pending_token/expires: كانا لآلية توكن مؤقتة قديمة، استُبدلا لاحقاً
-- بـPostback حقيقي وأصبحا غير مستخدمين — ثم حُذفا نهائياً (انظر قسم التنظيف).
ALTER TABLE users ADD COLUMN gigapub_task_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN gigapub_task_date TEXT;
ALTER TABLE users ADD COLUMN gigapub_pending_token TEXT;
ALTER TABLE users ADD COLUMN gigapub_pending_expires INTEGER;

-- -- نافذة Profile (تاريخ التسجيل + صورة تيليجرام الحقيقية) --
-- created_at : وقت إنشاء صف المستخدم لأول مرة (مللي ثانية)، يُعرض DD-MM-YYYY.
-- photo_url  : آخر رابط صورة بروفايل تيليجرام معروف، من initData الموثَّق فقط.
ALTER TABLE users ADD COLUMN created_at INTEGER;
ALTER TABLE users ADD COLUMN photo_url TEXT;

-- المستخدمون الموجودون قبل هذا التحديث ليس لديهم created_at حقيقي —
-- وُضع تاريخ تطبيق هذا التحديث كبداية لهم.
UPDATE users SET created_at = strftime('%s','now') * 1000 WHERE created_at IS NULL;

-- -- Watch MonetixAds --
-- لا يوفّر Postback من سيرفره؛ المنح عبر /api/monetix/reward المحمي بـinitData فقط.
ALTER TABLE users ADD COLUMN monetix_task_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN monetix_task_date TEXT;

-- -- عدّاد "إجمالي الإعلانات المشاهدة مدى الحياة" --
-- lifetime_ads_watched: موحّد بين GigaPub/MonetixAds وبوابات الأزرار الست،
-- يُستخدم لتفعيل "صديق نشط" وفتح شخصية The Guardian عند 4000 إعلان.
ALTER TABLE users ADD COLUMN lifetime_ads_watched INTEGER DEFAULT 0;

-- -- The Ambassador (منح/سحب يدوي بالكامل من الأدمن عبر D1، لا عداد تلقائي) --
-- صف واحد لكل مستخدم = "منح معلّق" لم يُستلم بعد. عند الاستلام يُنشأ صف
-- حقيقي في user_pets ويُحذف هذا الصف تلقائياً.
CREATE TABLE IF NOT EXISTS ambassador_grants (
  telegram_id INTEGER PRIMARY KEY,
  speed INTEGER NOT NULL,
  granted_at INTEGER NOT NULL
);

-- -- Weekly Leaderboard (By Ads / By Referrals، جوائز حقيقية كل جمعة 00:30 UTC) --
-- weekly_ads_watched/weekly_active_referrals: عدادان أسبوعيان منفصلان تماماً
-- عن lifetime_ads_watched/active_referrals_count، يُصفَّران أسبوعياً بعد منح الجوائز.
ALTER TABLE users ADD COLUMN weekly_ads_watched INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN weekly_active_referrals INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_weekly_ads_watched ON users(weekly_ads_watched DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_active_referrals ON users(weekly_active_referrals DESC);

-- حماية عدم التكرار (Idempotency) لتوزيع الجوائز — قيد PRIMARY KEY على week_key.
CREATE TABLE IF NOT EXISTS leaderboard_payouts (
  week_key TEXT PRIMARY KEY,
  paid_at INTEGER NOT NULL
);

-- -- الزيادة اليومية التلقائية لسرعة Dancing Bear/The Cat --
-- daily_boost_days: عدد مرات تطبيق الزيادة اليومية حتى الآن (0 = لم تبدأ).
-- غير مستخدَم لأي شخصية غير dancing_bear/the_cat. السقف: 20 يوماً لـ
-- dancing_bear (0.5%×20=10%)، 10 أيام لـthe_cat (1%×10=10%).
ALTER TABLE user_pets ADD COLUMN daily_boost_days INTEGER NOT NULL DEFAULT 0;

-- -- عمولة إيداعات الأصدقاء (Transaction History + Profile + لوحة الأدمن) --
-- referral_deposit_commission_total: إجمالي عمولة إيداعات الأصدقاء (5% من كل
-- إيداع) منذ الأزل، منفصل عن referrals.earned_coins وreferral_pending_earnings.
ALTER TABLE users ADD COLUMN referral_deposit_commission_total REAL DEFAULT 0;

-- referral_commission_log: سطر واحد لكل عملية عمولة إيداع صديق — أرشيف/عرض
-- فقط، لا يُستخدَم لحساب الرصيد الفعلي أو شروط الـClaim.
CREATE TABLE IF NOT EXISTS referral_commission_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_referral_commission_log_telegram_id ON referral_commission_log(telegram_id, created_at DESC);

-- =====================================================================
-- تنظيف: حذف جداول/أعمدة تبيّن أنها غير مُستخدَمة إطلاقاً في الكود (تأكيد
-- عبر بحث كامل في worker.js/frontend/index.html)، ودمج user_storage داخل
-- users لتقليل عدد الصفوف الممسوحة في كل استعلام متعلق بـStorage.
-- =====================================================================

-- جداول ميتة بالكامل (تعريفات الشخصيات/المهام أصبحت مكتوبة مباشرة بالكود
-- بدل قراءتها من هذه الجداول، والباقي استُبدل بأعمدة على users):
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS task_completions;
DROP TABLE IF EXISTS daily_streak_claims;
DROP TABLE IF EXISTS free_pet_progress;
DROP TABLE IF EXISTS settings;

-- أعمدة ميتة على users (لا تُقرأ ولا تُكتب إطلاقاً، أو قيمتها لا تُستخدم أبداً):
ALTER TABLE users DROP COLUMN registered_at;
ALTER TABLE users DROP COLUMN total_deposit;
ALTER TABLE users DROP COLUMN total_withdraw;
ALTER TABLE users DROP COLUMN is_admin;
ALTER TABLE users DROP COLUMN gigapub_pending_token;
ALTER TABLE users DROP COLUMN gigapub_pending_expires;

-- عمود ميت على user_pets:
ALTER TABLE user_pets DROP COLUMN purchased_at;

-- دمج user_storage داخل users: نفس البيانات (capacity_hours/last_claim_at)
-- أصبحت أعمدة مباشرة على users بدل جدول منفصل يُربَط بـLEFT JOIN في كل
-- استعلام متعلق بـStorage — يوفّر صفاً واحداً إضافياً في كل من تلك الاستعلامات.
ALTER TABLE users ADD COLUMN capacity_hours INTEGER;
ALTER TABLE users ADD COLUMN last_claim_at TEXT;
UPDATE users SET
  capacity_hours = (SELECT capacity_hours FROM user_storage WHERE user_storage.telegram_id = users.telegram_id),
  last_claim_at = (SELECT last_claim_at FROM user_storage WHERE user_storage.telegram_id = users.telegram_id)
WHERE telegram_id IN (SELECT telegram_id FROM user_storage);
DROP TABLE user_storage;

-- ملاحظة: pets.pet_id/tasks.task_id كانا مرتبطين بقيود Foreign Key مع
-- user_pets.pet_id/task_completions.task_id — لذلك حُذف task_completions
-- (ميت أصلاً) قبل tasks، بينما حذف pets تطلّب إعادة إنشاء user_pets بالكامل
-- بدون ذلك القيد (فُقدت بيانات الحيوانات المملوكة وقتها، مقبول لأن المستخدم
-- الوحيد وقتها وافق صراحة على ذلك — لو تُطبَّق هذه الخطوة على قاعدة تحتوي
-- مستخدمين حقيقيين، يجب أولاً تصدير user_pets ثم استيرادها بعد إعادة الإنشاء):
-- DROP TABLE user_pets;
-- CREATE TABLE user_pets (
--   telegram_id INTEGER NOT NULL,
--   pet_id TEXT NOT NULL,
--   level INTEGER NOT NULL DEFAULT 1,
--   current_speed REAL NOT NULL,
--   daily_boost_days INTEGER NOT NULL DEFAULT 0,
--   PRIMARY KEY (telegram_id, pet_id),
--   FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
-- );
-- DROP TABLE pets;
