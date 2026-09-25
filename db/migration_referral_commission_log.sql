-- =====================================================================
-- Migration لهذه الجولة فقط: عرض عمولة إيداعات الأصدقاء في Transaction
-- History (Wallet) + خانة "Referrals Commission" في Profile ولوحة الأدمن.
-- شغّلها مرة واحدة على D1 الحي (D1 Console أو wrangler).
-- =====================================================================

-- referral_deposit_commission_total: إجمالي عمولة إيداعات الأصدقاء فقط
-- (5% من كل إيداع) منذ الأزل، منفصل تماماً عن referrals.earned_coins الذي
-- يخلط هذه العمولة مع مكافأة "نشاط الصديق" (+180) معاً. لا علاقة له بـ
-- referral_pending_earnings (الرصيد المعلَّق الذي يحدد فعلياً متى وبأي مبلغ
-- يُسمح بالـClaim) — هذا العمود للعرض فقط (Profile + لوحة الأدمن).
ALTER TABLE users ADD COLUMN referral_deposit_commission_total REAL DEFAULT 0;

-- referral_commission_log: سطر واحد لكل عملية عمولة إيداع صديق على حدة —
-- سجل أرشيف/عرض فقط لـ Transaction History في Wallet (يوثّق أن الحدث حصل
-- ومتى وبأي مبلغ)، ولا يُستخدَم إطلاقاً لحساب الرصيد الفعلي أو شروط الـClaim.
CREATE TABLE IF NOT EXISTS referral_commission_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_referral_commission_log_telegram_id ON referral_commission_log(telegram_id, created_at DESC);
