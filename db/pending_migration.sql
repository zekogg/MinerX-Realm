-- =====================================================================
-- سجل كامل بكل تعديلات قاعدة D1 منذ بداية المشروع، مرتّبة زمنياً — توثيق/
-- أرشيف فقط (كل شيء هنا مُطبَّق يدوياً بالفعل على D1 الحي، لا شيء تلقائي).
-- =====================================================================

-- Start Mining: وقت/عدّاد/تاريخ دورة تعدين Doge اليومية (تُصفَّر ضمنياً بلا cron).
ALTER TABLE users ADD COLUMN mining_started_at TEXT;
ALTER TABLE users ADD COLUMN mining_cycles_today INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN mining_cycle_date TEXT;
-- ALTER TABLE users ADD COLUMN total_mined REAL DEFAULT 0; -- أُضيف يدوياً سابقاً

-- Daily Streak: اليوم الحالي (1-7) وتاريخ آخر استلام لدورة أسبوعية متكررة.
ALTER TABLE users ADD COLUMN streak_day INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN streak_last_claim_date TEXT;

-- Spin: تاريخ آخر دورة حظ مجانية اليوم.
ALTER TABLE users ADD COLUMN last_spin_date TEXT;

-- Chest وGift Pick: تاريخ آخر فتح ناجح لكل منهما اليوم.
ALTER TABLE users ADD COLUMN last_chest_date TEXT;
ALTER TABLE users ADD COLUMN last_giftpick_date TEXT;

-- Promo Code: عدّاد استخدام مخزَّن بدل COUNT(*) على promo_redemptions.
ALTER TABLE promo_codes ADD COLUMN uses_count INTEGER DEFAULT 0;

-- Deposit: إيداع TON حقيقي، صف لكل معاملة، tx_hash فريد يمنع أي تحصيل مضاعف.
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

-- Withdraw: طلب سحب يدوي (Approve/Reject)، net_gram هو الصافي بعد الرسوم.
ALTER TABLE users ADD COLUMN last_withdraw_request_at INTEGER;
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

-- Daily Combo: تركيبة يومية سرّية (daily_combo) ومحاولات كل مستخدم (combo_attempts).
CREATE TABLE IF NOT EXISTS daily_combo (
  date TEXT PRIMARY KEY,
  card_order TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS combo_attempts (
  telegram_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  attempts_used INTEGER NOT NULL DEFAULT 0,
  solved INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (telegram_id, date)
);

-- Watch Adsgram Ad: عدّاد/تاريخ مهمة الإعلانات اليومية (حد 10/يوم).
ALTER TABLE users ADD COLUMN adsgram_task_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN adsgram_task_date TEXT;

-- Friends / Referrals: عدّادات الإحالة والأرباح المعلّقة وأعلام Milestone Missions.
ALTER TABLE users ADD COLUMN referral_pending_earnings REAL DEFAULT 0;
ALTER TABLE users ADD COLUMN invites_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN active_referrals_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_10_claimed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_25_claimed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_50_claimed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN milestone_100_claimed INTEGER DEFAULT 0;
ALTER TABLE referrals ADD COLUMN earned_coins REAL DEFAULT 0; -- إجمالي ما جلبه هذا الصديق للمُحيل

-- Check-in: 4 مهام يومية (تاريخ آخر استلام لكل واحدة).
ALTER TABLE users ADD COLUMN checkin1_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin2_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin3_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin4_claimed_date TEXT;

-- Bonus AD Every 1H: عدّاد/تاريخ/وقت آخر مشاهدة (تبريد ساعة بين كل إعلان).
ALTER TABLE users ADD COLUMN bonus_ad_count_today INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN bonus_ad_date TEXT;
ALTER TABLE users ADD COLUMN bonus_ad_last_watched_at INTEGER;

-- Partner / Special: مهام يديرها الأدمن (admin_tasks) واستلام مرة واحدة لكل مستخدم×مهمة.
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
CREATE TABLE IF NOT EXISTS admin_task_claims (
  telegram_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  claimed_at INTEGER NOT NULL,
  PRIMARY KEY (telegram_id, task_id)
);
-- مثال إضافة مهمة يدوياً:
-- INSERT INTO admin_tasks (section, title, icon_url, reward_coins, link, channel_id, display_order, created_at)
-- VALUES ('partner', 'Join This Channel', 'https://.../icon.svg', 10, 'https://t.me/YourChannel', '@YourChannel', 0, strftime('%s','now') * 1000);

-- لوحة الأدمن: وصف/حد أقصى/عدّاد استلام لكل مهمة، وتثبيت المهام بالأعلى.
ALTER TABLE admin_tasks ADD COLUMN description TEXT;
ALTER TABLE admin_tasks ADD COLUMN max_claims INTEGER;
ALTER TABLE admin_tasks ADD COLUMN claims_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE admin_tasks ADD COLUMN pinned_at INTEGER;

-- Watch gigapub ads: عدّاد يومي عبر Postback حقيقي (gigapub_pending_* أُضيفت ثم حُذفت لاحقاً، انظر التنظيف).
ALTER TABLE users ADD COLUMN gigapub_task_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN gigapub_task_date TEXT;
ALTER TABLE users ADD COLUMN gigapub_pending_token TEXT;
ALTER TABLE users ADD COLUMN gigapub_pending_expires INTEGER;

-- نافذة Profile: تاريخ التسجيل وصورة تيليجرام الحقيقية، مع تعبئة تاريخية للمستخدمين القدامى.
ALTER TABLE users ADD COLUMN created_at INTEGER;
ALTER TABLE users ADD COLUMN photo_url TEXT;
UPDATE users SET created_at = strftime('%s','now') * 1000 WHERE created_at IS NULL;

-- Watch MonetixAds: عدّاد يومي، المنح عبر endpoint محمي بـinitData (لا Postback).
ALTER TABLE users ADD COLUMN monetix_task_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN monetix_task_date TEXT;

-- عدّاد إجمالي الإعلانات مدى الحياة: يفعّل "صديق نشط" ويفتح The Guardian عند 4000.
ALTER TABLE users ADD COLUMN lifetime_ads_watched INTEGER DEFAULT 0;

-- The Ambassador: منح/سحب يدوي من الأدمن، صف معلّق يُحذف عند الاستلام.
CREATE TABLE IF NOT EXISTS ambassador_grants (
  telegram_id INTEGER PRIMARY KEY,
  speed INTEGER NOT NULL,
  granted_at INTEGER NOT NULL
);

-- Weekly Leaderboard: عدادان أسبوعيان (يُصفَّران كل جمعة) وحماية دفع مضاعف.
ALTER TABLE users ADD COLUMN weekly_ads_watched INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN weekly_active_referrals INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_weekly_ads_watched ON users(weekly_ads_watched DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_active_referrals ON users(weekly_active_referrals DESC);
CREATE TABLE IF NOT EXISTS leaderboard_payouts (
  week_key TEXT PRIMARY KEY,
  paid_at INTEGER NOT NULL
);

-- الزيادة اليومية التلقائية لسرعة Dancing Bear (+0.5%/يوم) وThe Cat (+1%/يوم)، سقف 10%.
ALTER TABLE user_pets ADD COLUMN daily_boost_days INTEGER NOT NULL DEFAULT 0;

-- عمولة إيداعات الأصدقاء: إجمالي للعرض فقط + سجل أرشيفي لكل عملية على حدة.
ALTER TABLE users ADD COLUMN referral_deposit_commission_total REAL DEFAULT 0;
CREATE TABLE IF NOT EXISTS referral_commission_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_referral_commission_log_telegram_id ON referral_commission_log(telegram_id, created_at DESC);

-- =====================================================================
-- تنظيف لاحق: حذف كل ما تبيّن أنه غير مُستخدَم إطلاقاً في الكود، ودمج
-- user_storage داخل users لتقليل الصفوف الممسوحة بكل استعلام Storage.
-- =====================================================================
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS task_completions;
DROP TABLE IF EXISTS daily_streak_claims;
DROP TABLE IF EXISTS free_pet_progress;
DROP TABLE IF EXISTS settings;

ALTER TABLE users DROP COLUMN registered_at;
ALTER TABLE users DROP COLUMN total_deposit;
ALTER TABLE users DROP COLUMN total_withdraw;
ALTER TABLE users DROP COLUMN is_admin;
ALTER TABLE users DROP COLUMN gigapub_pending_token;
ALTER TABLE users DROP COLUMN gigapub_pending_expires;
ALTER TABLE user_pets DROP COLUMN purchased_at;

ALTER TABLE users ADD COLUMN capacity_hours INTEGER;
ALTER TABLE users ADD COLUMN last_claim_at TEXT;
UPDATE users SET
  capacity_hours = (SELECT capacity_hours FROM user_storage WHERE user_storage.telegram_id = users.telegram_id),
  last_claim_at = (SELECT last_claim_at FROM user_storage WHERE user_storage.telegram_id = users.telegram_id)
WHERE telegram_id IN (SELECT telegram_id FROM user_storage);
DROP TABLE user_storage;

-- ملاحظة: حذف pets تطلّب إعادة إنشاء user_pets بدون قيده الأجنبي معها (فُقدت بيانات الحيوانات المملوكة وقتها، بموافقة صريحة لأن المستخدم كان الوحيد) — على قاعدة فيها مستخدمون حقيقيون، صدّر user_pets أولاً ثم استوردها بعد إعادة الإنشاء:
-- DROP TABLE user_pets;
-- CREATE TABLE user_pets (telegram_id INTEGER NOT NULL, pet_id TEXT NOT NULL, level INTEGER NOT NULL DEFAULT 1, current_speed REAL NOT NULL, daily_boost_days INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (telegram_id, pet_id), FOREIGN KEY (telegram_id) REFERENCES users(telegram_id));
-- DROP TABLE pets;

-- =====================================================================
-- دمج combo_attempts داخل users (صف واحد لكل مستخدم بدل صف يومي جديد)، وحذف transactions (سجل لا يقرؤه البوت).
-- =====================================================================
ALTER TABLE users ADD COLUMN combo_date TEXT;
ALTER TABLE users ADD COLUMN combo_attempts_used INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN combo_solved INTEGER NOT NULL DEFAULT 0;
UPDATE users SET
  combo_date = (SELECT ca.date FROM combo_attempts ca WHERE ca.telegram_id = users.telegram_id ORDER BY ca.date DESC LIMIT 1),
  combo_attempts_used = (SELECT ca.attempts_used FROM combo_attempts ca WHERE ca.telegram_id = users.telegram_id ORDER BY ca.date DESC LIMIT 1),
  combo_solved = (SELECT ca.solved FROM combo_attempts ca WHERE ca.telegram_id = users.telegram_id ORDER BY ca.date DESC LIMIT 1)
WHERE telegram_id IN (SELECT telegram_id FROM combo_attempts);
DROP TABLE combo_attempts;
DROP TABLE transactions;

-- =====================================================================
-- قيمة شارة The Ambassador (Value ??$). يبقى صف ambassador_grants بعد الاستلام ليحفظ القيمة.
-- =====================================================================
ALTER TABLE ambassador_grants ADD COLUMN value_usd REAL;

-- Watch OnClicka Ads: عدّاد يومي، المنح عبر endpoint محمي بـinitData (لا Postback) — نفس طريقة Monetix.
ALTER TABLE users ADD COLUMN onclicka_task_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN onclicka_task_date TEXT;

-- كشف الحسابات المتعددة والحظر: معرّف الجهاز من localStorage (يُكتب مرة واحدة)، ووقت الحظر (فارغ = غير محظور).
ALTER TABLE users ADD COLUMN device_id TEXT;
ALTER TABLE users ADD COLUMN banned_at INTEGER;
CREATE INDEX IF NOT EXISTS idx_users_device_id ON users(device_id) WHERE device_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_banned ON users(banned_at) WHERE banned_at IS NOT NULL;

-- العملات المودعة مقفلة: تُستخدم لشراء وترقية الـ Pets والـ Storage فقط ولا تُحوَّل إلى Gram.
-- coins يبقى الرصيد الكلي، وlocked_coins الجزء المودع منه.
ALTER TABLE users ADD COLUMN locked_coins REAL DEFAULT 0;

-- Previous Winners: الفائزون المدفوع لهم في كل توزيع أسبوعي (JSON)، يُعرضون حتى التوزيع التالي.
ALTER TABLE leaderboard_payouts ADD COLUMN winners TEXT;

-- Withdraw requirements: ads watched today (every ad, the gates included), restarted by the first ad of a new UTC day
ALTER TABLE users ADD COLUMN ads_today INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN ads_today_date TEXT;

-- قائمة الأصدقاء: فهرس بنفس ترتيب العرض (النشطون أولاً ثم الأحدث)، فتقرأ كل صفحة أصدقاءها فقط بدل كل أصدقاء الداعي.
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_active ON referrals(referrer_id, is_active DESC, invited_at DESC);
