-- =====================================================================
-- Migration لهذه الجولة فقط: Weekly Leaderboard
-- شغّلها مرة واحدة على D1 الحي (D1 Console أو wrangler).
-- =====================================================================

-- عدادان أسبوعيان منفصلان تماماً عن lifetime_ads_watched/active_referrals_count
-- (اللذان لا يُصفَّران أبداً) — هذان فقط لترتيب هذا الأسبوع، يُصفَّران كل
-- جمعة 00:30 UTC عبر scheduled() بعد منح الجوائز.
ALTER TABLE users ADD COLUMN weekly_ads_watched INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN weekly_active_referrals INTEGER DEFAULT 0;

-- Index على كل عمود بترتيب تنازلي — يجعل "أعلى 20" عملية ثابتة التكلفة
-- (~20 صف) بصرف النظر عن عدد المستخدمين الإجمالي في الجدول.
CREATE INDEX IF NOT EXISTS idx_weekly_ads_watched ON users(weekly_ads_watched DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_active_referrals ON users(weekly_active_referrals DESC);

-- حماية عدم التكرار (Idempotency) لتوزيع الجوائز الأسبوعي — صف واحد فقط
-- لكل أسبوع (week_key بصيغة "YYYY-Www")؛ INSERT يفشل إن كان هذا الأسبوع
-- مدفوعاً مسبقاً (نفس أسلوب admin_task_claims/combo_attempts بالقاعدة).
CREATE TABLE IF NOT EXISTS leaderboard_payouts (
  week_key TEXT PRIMARY KEY,
  paid_at INTEGER NOT NULL
);
