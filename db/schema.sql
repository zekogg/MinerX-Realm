-- =====================================================================
-- الشكل الحالي الكامل لقاعدة D1 (الجداول والفهارس)، منسوخ من D1 الحي.
-- توثيق فقط: لا يُشغَّل تلقائياً. أي تعديل جديد على D1 يُضاف هنا أيضاً.
-- السجل التاريخي للتعديلات القديمة محفوظ في git (db/pending_migration.sql).
-- =====================================================================

-- Tables

CREATE TABLE users (
  telegram_id INTEGER PRIMARY KEY,
  username TEXT,
  coins REAL DEFAULT 0,
  gram REAL DEFAULT 0,
  total_speed REAL DEFAULT 0,
  referred_by INTEGER,
  mining_started_at TEXT,
  total_mined REAL DEFAULT 0,
  mining_cycles_today INTEGER DEFAULT 0,
  mining_cycle_date TEXT,
  streak_day INTEGER DEFAULT 1,
  streak_last_claim_date TEXT,
  last_spin_date TEXT,
  last_chest_date TEXT,
  last_giftpick_date TEXT,
  last_withdraw_request_at INTEGER,
  adsgram_task_count INTEGER DEFAULT 0,
  adsgram_task_date TEXT,
  referral_pending_earnings REAL DEFAULT 0,
  invites_count INTEGER DEFAULT 0,
  active_referrals_count INTEGER DEFAULT 0,
  milestone_10_claimed INTEGER DEFAULT 0,
  milestone_25_claimed INTEGER DEFAULT 0,
  milestone_50_claimed INTEGER DEFAULT 0,
  milestone_100_claimed INTEGER DEFAULT 0,
  checkin1_claimed_date TEXT,
  checkin2_claimed_date TEXT,
  checkin3_claimed_date TEXT,
  checkin4_claimed_date TEXT,
  bonus_ad_count_today INTEGER DEFAULT 0,
  bonus_ad_date TEXT,
  bonus_ad_last_watched_at INTEGER,
  gigapub_task_count INTEGER DEFAULT 0,
  gigapub_task_date TEXT,
  created_at INTEGER,
  photo_url TEXT,
  monetix_task_count INTEGER DEFAULT 0,
  monetix_task_date TEXT,
  lifetime_ads_watched INTEGER DEFAULT 0,
  weekly_ads_watched INTEGER DEFAULT 0,
  weekly_active_referrals INTEGER DEFAULT 0,
  referral_deposit_commission_total REAL DEFAULT 0,
  capacity_hours INTEGER,
  last_claim_at TEXT,
  combo_date TEXT,
  combo_attempts_used INTEGER NOT NULL DEFAULT 0,
  combo_solved INTEGER NOT NULL DEFAULT 0,
  onclicka_task_count INTEGER DEFAULT 0,
  onclicka_task_date TEXT,
  device_id TEXT,
  banned_at INTEGER,
  locked_coins REAL DEFAULT 0,
  ads_today INTEGER NOT NULL DEFAULT 0,
  ads_today_date TEXT,
  checkin5_claimed_date TEXT,
  FOREIGN KEY (referred_by) REFERENCES users(telegram_id)
);

CREATE TABLE referrals (
  referrer_id INTEGER NOT NULL,
  referred_id INTEGER NOT NULL,
  is_active INTEGER DEFAULT 0,
  invited_at TEXT DEFAULT (datetime('now')),
  earned_coins REAL DEFAULT 0,
  PRIMARY KEY (referrer_id, referred_id),
  FOREIGN KEY (referrer_id) REFERENCES users(telegram_id),
  FOREIGN KEY (referred_id) REFERENCES users(telegram_id)
);

CREATE TABLE user_pets (
  telegram_id INTEGER NOT NULL,
  pet_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  current_speed REAL NOT NULL,
  daily_boost_days INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (telegram_id, pet_id),
  FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
);

CREATE TABLE "promo_codes" (
  code TEXT PRIMARY KEY,
  reward REAL NOT NULL,
  currency TEXT DEFAULT 'coins',
  uses_count INTEGER DEFAULT 0,
  max_uses INTEGER,
  expires_at TEXT
);

CREATE TABLE promo_redemptions (
  telegram_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  redeemed_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (telegram_id, code),
  FOREIGN KEY (telegram_id) REFERENCES users(telegram_id),
  FOREIGN KEY (code) REFERENCES promo_codes(code)
);

CREATE TABLE admin_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  icon_url TEXT,
  reward_coins INTEGER NOT NULL,
  link TEXT NOT NULL,
  channel_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  description TEXT,
  max_claims INTEGER,
  claims_count INTEGER NOT NULL DEFAULT 0,
  pinned_at INTEGER
);

CREATE TABLE admin_task_claims (
  telegram_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  claimed_at INTEGER NOT NULL,
  PRIMARY KEY (telegram_id, task_id)
);

CREATE TABLE daily_combo (
  date TEXT PRIMARY KEY,
  card_order TEXT NOT NULL
);

CREATE TABLE deposits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  tx_hash TEXT NOT NULL UNIQUE,
  amount_gram REAL NOT NULL,
  coins_credited REAL NOT NULL,
  status TEXT NOT NULL,
  memo TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE withdrawals (
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

CREATE TABLE referral_commission_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE ambassador_grants (
  telegram_id INTEGER PRIMARY KEY,
  speed INTEGER NOT NULL,
  granted_at INTEGER NOT NULL,
  value_usd REAL
);

CREATE TABLE leaderboard_payouts (
  week_key TEXT PRIMARY KEY,
  paid_at INTEGER NOT NULL,
  winners TEXT
);

-- Indexes

CREATE INDEX idx_admin_tasks_section ON admin_tasks(section, is_active, display_order);
CREATE INDEX idx_deposits_telegram_id ON deposits(telegram_id);
CREATE INDEX idx_referral_commission_log_telegram_id ON referral_commission_log(telegram_id, created_at DESC);
CREATE INDEX idx_referrals_referrer_active ON referrals(referrer_id, is_active DESC, invited_at DESC);
CREATE INDEX idx_user_pets_boost ON user_pets(pet_id, daily_boost_days);
CREATE INDEX idx_users_banned ON users(banned_at) WHERE banned_at IS NOT NULL;
CREATE INDEX idx_users_device_id ON users(device_id) WHERE device_id IS NOT NULL;
CREATE INDEX idx_weekly_active_referrals ON users(weekly_active_referrals DESC);
CREATE INDEX idx_weekly_ads_watched ON users(weekly_ads_watched DESC);
CREATE INDEX idx_withdrawals_telegram_id ON withdrawals(telegram_id);
