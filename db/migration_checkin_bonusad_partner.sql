-- =====================================================================
-- Migration لهذه الجولة فقط: Check-in + Bonus AD Every 1H + Partner/Special
-- شغّلها مرة واحدة على D1 الحي (انظر الأمر في الرسالة المرفقة).
-- =====================================================================

-- -- Check-in (4 مهام يومية، Reset 00:00 UTC) --
ALTER TABLE users ADD COLUMN checkin1_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin2_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin3_claimed_date TEXT;
ALTER TABLE users ADD COLUMN checkin4_claimed_date TEXT;

-- -- Bonus AD Every 1H --
ALTER TABLE users ADD COLUMN bonus_ad_count_today INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN bonus_ad_date TEXT;
ALTER TABLE users ADD COLUMN bonus_ad_last_watched_at INTEGER;

-- -- Partner / Special --
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

-- مثال لإضافة مهمة جديدة يدوياً في قسم Partner (استبدل القيم):
-- INSERT INTO admin_tasks (section, title, icon_url, reward_coins, link, channel_id, display_order, created_at)
-- VALUES ('partner', 'Join This Channel', 'https://.../icon.svg', 10, 'https://t.me/YourChannel', '@YourChannel', 0, strftime('%s','now') * 1000);
