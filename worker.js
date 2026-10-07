// Config
const WEBAPP_URL = "https://minerxrealm.zekobusiness0.workers.dev/";

// Welcome message config
const WELCOME_PHOTO_URL = "https://raw.githubusercontent.com/zekogg/MinerX-Realm/refs/heads/main/frontend/MinerX%20Welcome%20.webp";
const PAYOUTS_CHANNEL_URL = "https://t.me/MinerXRealmWithdrawals";
const SUPPORT_USERNAME = "MinerXRealm_SupportBot";

// Start Mining config
const MINING_CYCLE_SECONDS = 60 * 60;
const MINING_REWARD_COINS = 70;
const MINING_DAILY_LIMIT = 5;

// Daily Streak config
const STREAK_REWARDS = [50, 100, 150, 200, 250, 300, 500];

// Spin config
const SPIN_SEGMENTS = [
  { type: "coins", amount: 100,    weight: 500  },
  { type: "gram",  amount: 0.0025, weight: 25   },
  { type: "coins", amount: 500,    weight: 100  },
  { type: "gram",  amount: 0.005,  weight: 25   },
  { type: "coins", amount: 150,    weight: 500  },
  { type: "gram",  amount: 0.001,  weight: 25   },
  { type: "coins", amount: 50,     weight: 8800 },
  { type: "gram",  amount: 0.01,   weight: 25   }
];

// Exchange config
const EXCHANGE_RATE_COIN_TO_GRAM = 0.00001;
const EXCHANGE_MIN_COINS = 1000;

// Deposit config
const DEPOSIT_GRAM_TO_COINS_RATE = 1 / EXCHANGE_RATE_COIN_TO_GRAM;
const DEPOSIT_MIN_GRAM = 2;
const DEPOSIT_CHECK_TIMEOUT_MS = 120_000;
const DEPOSIT_CHECK_MAX_ATTEMPTS = 8;
const DEPOSIT_CHECK_FIRST_DELAY_MS = 5_000;
const DEPOSIT_CHECK_RETRY_DELAY_MS = 15_000;

// Withdraw config
const WITHDRAW_MIN_GRAM = 0.1;
// to withdraw: this many ads watched today (every ad, the gates included; the day starts at 00:00 UTC) and this many
// active referrals at any time (once reached, it stays reached)
const WITHDRAW_DAILY_ADS = 15;
const WITHDRAW_ACTIVE_REFERRALS = 1;
// Today's ad count rides on the same write as the lifetime count: it restarts by itself on the first ad of a new
// UTC day (date('now') is the UTC date, like todayUTC()), so nothing has to reset it at midnight
const ADS_TODAY_PLUS_ONE = "ads_today = CASE WHEN ads_today_date = date('now') THEN ads_today + 1 ELSE 1 END, ads_today_date = date('now')";
const WITHDRAW_FEE_RATE = 0.05;
const WITHDRAW_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const ADMIN_TELEGRAM_ID = 1018495986;
const DEVICE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const ADMIN_CHANNEL_ID = -1004325013522;
const PLAY_GAME_URL = "https://t.me/MinerXRealmBot/app";
const NEWS_CHANNEL_URL = "https://t.me/MinerXRealmNews";

// Daily Combo config
const COMBO_CARDS = ["duck", "polar_bear", "penguin"];
const COMBO_CARD_LABELS = { duck: "Duck", polar_bear: "Polar Bear", penguin: "Penguin" };
const COMBO_REWARD_COINS = 200;
const COMBO_MAX_ATTEMPTS = 1;

// Watch Adsgram Ad config
const ADS_TASK_REWARD_COINS = 15;
const ADS_TASK_DAILY_LIMIT = 10;

// Friends / Referrals config
const REFERRAL_SIGNUP_BONUS_COINS = 20;
const REFERRAL_ACTIVE_BONUS_COINS = 180;
const REFERRAL_DEPOSIT_COMMISSION_RATE = 0.05;
const REFERRAL_MIN_CLAIM_COINS = 1000;
const ACTIVE_FRIEND_ADS_THRESHOLD = 10;

// Weekly Leaderboard config
const LEADERBOARD_RANK_LIMIT = 20;
const LEADERBOARD_PRIZES = [5000, 3750, 2500, 1250, 1250, 1250, 1250, 1250, 1250, 1250];

// Active friend threshold config
const GUARDIAN_ADS_THRESHOLD = 4000;
const GUARDIAN_SPEED = 50;
const HAPPY_DOG_FRIENDS_THRESHOLD = 100;
const HAPPY_DOG_SPEED = 25;
// Friends milestone missions: active friends needed and the coin reward. Fixed values, so they live here instead of
// being read from a table on every request; each has its users.milestone_<friends>_claimed column
const FRIEND_MILESTONES = [
  { friends: 10, reward: 5000 },
  { friends: 25, reward: 10000 },
  { friends: 50, reward: 20000 },
  { friends: 100, reward: 50000 }
];

// Check-in config
const CHECKIN_TASK_REWARDS = { 1: 10, 2: 10, 3: 20, 4: 20, 5: 5 };
const CHECKIN_PARTNER_CHANNEL = "@XTreasuryX";

// Bonus AD Every 1H config
const BONUS_AD_REWARD_COINS = 15;
const BONUS_AD_DAILY_LIMIT = 5;
const BONUS_AD_COOLDOWN_MS = 60 * 60 * 1000;

// Watch GigaPub ads config
const GIGAPUB_REWARD_COINS = 15;
const GIGAPUB_DAILY_LIMIT = 8;

// Watch MonetixAds config
const MONETIX_REWARD_COINS = 15;
const MONETIX_DAILY_LIMIT = 10;

// Watch OnClicka Ads config
const ONCLICKA_REWARD_COINS = 15;
const ONCLICKA_DAILY_LIMIT = 10;

// Realm pets & Storage config
const PETS = {
  duck:         { basespeed: 77,    price: 200000 },
  polar_bear:   { basespeed: 191,   price: 500000 },
  scorpion:     { basespeed: 379,   price: 1000000 },
  penguin:      { basespeed: 1894,  price: 5000000 },
  dancing_bear: { basespeed: 3788,  price: 10000000 },
  the_cat:      { basespeed: 18940, price: 50000000 }
};
const PET_MAX_LEVEL = 100;
const PET_SPEED_INCREMENT_RATIO = 0.10;
const PET_UPGRADE_COST_RATIO = 0.10;
const STORAGE_DEFAULT_CAPACITY_HOURS = 6;
function petSpeedForLevel(petId, level) {
  const pet = PETS[petId];
  return pet.basespeed + (level - 1) * (pet.basespeed * PET_SPEED_INCREMENT_RATIO);
}
function petUpgradeCost(petId) {
  return Math.round(PETS[petId].price * PET_UPGRADE_COST_RATIO);
}

// Daily pet speed boost (Dancing Bear / The Cat)
const DAILY_PET_BOOST = {
  dancing_bear: { dailyPct: 0.5, maxDays: 20 },
  the_cat: { dailyPct: 1.0, maxDays: 10 }
};
async function applyDailyPetBoost(env) {
  for (const [petId, cfg] of Object.entries(DAILY_PET_BOOST)) {
    const basespeed = PETS[petId].basespeed;
    const deltaSpeed = basespeed * (cfg.dailyPct / 100);
    const rows = await env.DB.prepare(
      `SELECT p.telegram_id, u.total_speed, u.capacity_hours, u.last_claim_at
       FROM user_pets p
       JOIN users u ON u.telegram_id = p.telegram_id
       WHERE p.pet_id = ? AND p.daily_boost_days < ?`
    ).bind(petId, cfg.maxDays).all();
    const eligible = rows.results || [];
    if (!eligible.length) continue;
    const nowIso = new Date().toISOString();
    const stmts = [];
    for (const row of eligible) {
      const capacitySeconds = (row.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
      let preBoostAccrued = 0;
      if (row.last_claim_at) {
        const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(row.last_claim_at)) / 1000);
        preBoostAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((row.total_speed || 0) / 3600);
      }
      // the credit of the storage, the new speed and the storage reset are one write, guarded on the values the credit
      // was worked out from, so a storage claim at the same moment cannot pay the same storage twice; the pet changes
      // only when it went through (changes() is the row count of the statement just before it), and a boost missed
      // that way is given on the next run
      stmts.push(
        env.DB.prepare(
          `UPDATE users SET coins = coins + ?, total_speed = total_speed + ?, last_claim_at = ?
           WHERE telegram_id = ? AND last_claim_at IS ? AND total_speed IS ? AND capacity_hours IS ?`
        ).bind(preBoostAccrued, deltaSpeed, nowIso, row.telegram_id, row.last_claim_at, row.total_speed, row.capacity_hours),
        env.DB.prepare(
          "UPDATE user_pets SET current_speed = current_speed + ?, daily_boost_days = daily_boost_days + 1 WHERE telegram_id = ? AND pet_id = ? AND changes() = 1"
        ).bind(deltaSpeed, row.telegram_id, petId)
      );
    }
    try {
      await env.DB.batch(stmts);
    } catch (e) {
      console.error("daily pet boost failed for " + petId + ":", e?.message || e);
    }
  }
}

// Storage levels
const STORAGE_LEVELS = [6, 8, 12, 16, 24];
const STORAGE_MAX_LEVEL = STORAGE_LEVELS.length;
const STORAGE_UPGRADE_COST_COINS = 300000;
function storageLevelForCapacityHours(capacityHours) {
  const index = STORAGE_LEVELS.indexOf(capacityHours);
  return index === -1 ? 1 : index + 1;
}
export default {

  // Scheduled cron jobs
  async scheduled(event, env, ctx) {
    if (event.cron === "0 0 * * *") {
      ctx.waitUntil(generateDailyCombo(env));
      ctx.waitUntil(applyDailyPetBoost(env));
    } else if (event.cron === "5 0 * * FRI") {
      ctx.waitUntil(handleLeaderboardPayout(env));
    }
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    return routeRequest(request, env, url);
  }
};
async function routeRequest(request, env, url) {

    // Routes
    if (url.pathname === "/telegram-webhook") {
      return handleTelegram(request, env);
    }
    if (url.pathname === "/api/user" && request.method === "POST") {
      return handleGetUser(request, env);
    }
    if (url.pathname === "/api/realm/status" && request.method === "POST") {
      return handleRealmStatus(request, env);
    }
    if (url.pathname === "/api/mine/start" && request.method === "POST") {
      return withGateAd(request, env, handleMineStart);
    }
    if (url.pathname === "/api/mine/claim" && request.method === "POST") {
      return withGateAd(request, env, handleMineClaim);
    }
    if (url.pathname === "/api/streak/claim" && request.method === "POST") {
      return withGateAd(request, env, handleStreakClaim);
    }
    if (url.pathname === "/api/spin/claim" && request.method === "POST") {
      return withGateAd(request, env, handleSpinClaim);
    }
    if (url.pathname === "/api/chest/claim" && request.method === "POST") {
      return withGateAd(request, env, handleChestClaim);
    }
    if (url.pathname === "/api/giftpick/claim" && request.method === "POST") {
      return withGateAd(request, env, handleGiftPickClaim);
    }
    const petMatch = request.method === "POST" && url.pathname.match(/^\/api\/pet\/([a-z_]+)\/(buy|upgrade)$/);
    if (petMatch) {
      const [, petId, action] = petMatch;
      if (!PETS[petId]) return jsonResponse({ error: "unknown_pet" }, 400);
      return action === "buy" ? handlePetBuy(request, env, petId) : handlePetUpgrade(request, env, petId);
    }
    if (url.pathname === "/api/storage/claim" && request.method === "POST") {
      return handleStorageClaim(request, env);
    }
    if (url.pathname === "/api/storage/upgrade" && request.method === "POST") {
      return handleStorageUpgrade(request, env);
    }
    if (url.pathname === "/api/promo/redeem" && request.method === "POST") {
      return withGateAd(request, env, handlePromoRedeem);
    }
    if (url.pathname === "/api/exchange" && request.method === "POST") {
      return handleExchange(request, env);
    }
    if (url.pathname === "/api/deposit/info" && request.method === "POST") {
      return handleDepositInfo(request, env);
    }
    if (url.pathname === "/api/deposit/check" && request.method === "POST") {
      return handleDepositCheck(request, env);
    }
    if (url.pathname === "/api/deposit/status" && request.method === "POST") {
      return handleDepositStatus(request, env);
    }
    if (url.pathname === "/api/withdraw/request" && request.method === "POST") {
      return handleWithdrawRequest(request, env);
    }
    if (url.pathname === "/api/wallet/history" && request.method === "POST") {
      return handleWalletHistory(request, env);
    }
    if (url.pathname === "/api/combo/check" && request.method === "POST") {
      return handleComboCheck(request, env);
    }
    if (url.pathname === "/api/ads/reward" && request.method === "GET") {
      return handleAdsReward(url, env);
    }
    if (url.pathname === "/api/friends/claim_earnings" && request.method === "POST") {
      return handleFriendsClaimEarnings(request, env);
    }
    if (url.pathname === "/api/friends/claim_milestone" && request.method === "POST") {
      return handleFriendsClaimMilestone(request, env);
    }
    if (url.pathname === "/api/friends/list" && request.method === "POST") {
      return handleFriendsList(request, env);
    }
    if (url.pathname === "/api/friends/milestones" && request.method === "POST") {
      return handleFriendsMilestones(request, env);
    }
    if (url.pathname === "/api/checkin/claim" && request.method === "POST") {
      return handleCheckinClaim(request, env);
    }
    if (url.pathname === "/api/tasks/list" && request.method === "POST") {
      return handleTasksList(request, env);
    }
    if (url.pathname === "/api/tasks/claim" && request.method === "POST") {
      return handleTasksClaim(request, env);
    }
    if (url.pathname === "/api/gigapub/postback" && request.method === "GET") {
      return handleGigapubPostback(url, env);
    }
    if (url.pathname === "/api/ads/client-rewards" && request.method === "POST") {
      return handleClientAdRewards(request, env);
    }
    if (url.pathname === "/api/pets/claim_happy_dog" && request.method === "POST") {
      return handleClaimHappyDog(request, env);
    }
    if (url.pathname === "/api/pets/claim_guardian" && request.method === "POST") {
      return handleClaimGuardian(request, env);
    }
    if (url.pathname === "/api/pets/claim_ambassador" && request.method === "POST") {
      return handleClaimAmbassador(request, env);
    }
    if (url.pathname === "/api/profile" && request.method === "POST") {
      return handleProfile(request, env);
    }
    if (url.pathname === "/api/admin/user/find" && request.method === "POST") {
      return handleAdminUserFind(request, env);
    }
    if (url.pathname === "/api/admin/user/ban" && request.method === "POST") {
      return handleAdminUserBan(request, env);
    }
    if (url.pathname === "/api/admin/user/ban_linked" && request.method === "POST") {
      return handleAdminUserBanLinked(request, env);
    }
    if (url.pathname === "/api/admin/banned/list" && request.method === "POST") {
      return handleAdminBannedList(request, env);
    }
    if (url.pathname === "/api/admin/user/edit_balance" && request.method === "POST") {
      return handleAdminEditBalance(request, env);
    }
    if (url.pathname === "/api/admin/tasks/list" && request.method === "POST") {
      return handleAdminTasksList(request, env);
    }
    if (url.pathname === "/api/admin/tasks/save" && request.method === "POST") {
      return handleAdminTasksSave(request, env);
    }
    if (url.pathname === "/api/admin/tasks/delete" && request.method === "POST") {
      return handleAdminTasksDelete(request, env);
    }
    if (url.pathname === "/api/admin/tasks/pin" && request.method === "POST") {
      return handleAdminTasksPin(request, env);
    }
    if (url.pathname === "/api/admin/promo/create" && request.method === "POST") {
      return handleAdminPromoCreate(request, env);
    }
    if (url.pathname === "/api/admin/promo/delete" && request.method === "POST") {
      return handleAdminPromoDelete(request, env);
    }
    if (url.pathname === "/api/admin/promo/list" && request.method === "POST") {
      return handleAdminPromoList(request, env);
    }
    if (url.pathname === "/api/admin/ambassador/grant" && request.method === "POST") {
      return handleAdminAmbassadorGrant(request, env);
    }
    if (url.pathname === "/api/admin/ambassador/revoke" && request.method === "POST") {
      return handleAdminAmbassadorRevoke(request, env);
    }
    if (url.pathname === "/api/admin/ambassador/list" && request.method === "POST") {
      return handleAdminAmbassadorList(request, env);
    }
    if (url.pathname === "/api/leaderboard" && request.method === "POST") {
      return handleLeaderboard(request, env);
    }
    if (url.pathname === "/api/leaderboard/previous" && request.method === "POST") {
      return handleLeaderboardPrevious(request, env);
    }
    return env.ASSETS.fetch(request);
}

// /api/user
async function handleGetUser(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateRequest(request, env, body);
  if (!auth.ok) return auth.response;
  const { telegramId, username, referredBy, photoUrl } = auth;
  // random id the app keeps in localStorage; accounts opened on the same device share it
  const deviceId = typeof body.device_id === "string" && DEVICE_ID_PATTERN.test(body.device_id) ? body.device_id : null;
  const today = todayUTC();
  const userQuery = `
    SELECT u.telegram_id, u.username, u.coins, u.gram, u.total_speed, u.total_mined,
           u.mining_started_at, u.mining_cycles_today, u.mining_cycle_date,
           u.streak_day, u.streak_last_claim_date,
           u.last_spin_date, u.last_chest_date, u.last_giftpick_date,
           u.last_withdraw_request_at,
           u.adsgram_task_count, u.adsgram_task_date,
           u.invites_count, u.active_referrals_count, u.referral_pending_earnings,
           u.milestone_10_claimed, u.milestone_25_claimed, u.milestone_50_claimed, u.milestone_100_claimed,
           u.checkin1_claimed_date, u.checkin2_claimed_date, u.checkin3_claimed_date, u.checkin4_claimed_date, u.checkin5_claimed_date,
           u.bonus_ad_count_today, u.bonus_ad_date, u.bonus_ad_last_watched_at,
           u.gigapub_task_count, u.gigapub_task_date, u.photo_url,
           u.monetix_task_count, u.monetix_task_date, u.onclicka_task_count, u.onclicka_task_date, u.lifetime_ads_watched,
           u.combo_date, u.combo_attempts_used, u.combo_solved, u.device_id, u.banned_at, u.locked_coins
    FROM users u
    WHERE u.telegram_id = ?
  `;
  let user = await env.DB.prepare(userQuery).bind(telegramId).first();
  if (!user) {
    // the new account and its referral are one batch, so the link and the inviter's bonus are never lost; OR IGNORE
    // lets two first opens at the same moment both go through, and changes() (the row count of the statement just
    // before) makes only the one that created the account record the referral. An inviter with no account (a mistyped
    // or deleted link) is dropped: referred_by is stored only when that user exists, and the referral and the bonus
    // follow it, so the foreign keys never fail the signup
    const signupStmts = [
      env.DB.prepare(
        "INSERT OR IGNORE INTO users (telegram_id, username, referred_by, created_at, photo_url, device_id) VALUES (?, ?, (SELECT telegram_id FROM users WHERE telegram_id = ?), ?, ?, ?)"
      ).bind(telegramId, username, referredBy, Date.now(), photoUrl, deviceId)
    ];
    if (referredBy) {
      signupStmts.push(
        env.DB.prepare(
          "INSERT OR IGNORE INTO referrals (referrer_id, referred_id, invited_at, earned_coins) SELECT ?, ?, ?, ? WHERE changes() = 1 AND EXISTS (SELECT 1 FROM users WHERE telegram_id = ?)"
        ).bind(referredBy, telegramId, Date.now(), REFERRAL_SIGNUP_BONUS_COINS, referredBy),
        env.DB.prepare(
          "UPDATE users SET referral_pending_earnings = referral_pending_earnings + ?, invites_count = invites_count + 1 WHERE telegram_id = ? AND changes() = 1"
        ).bind(REFERRAL_SIGNUP_BONUS_COINS, referredBy)
      );
    }
    const [insertResult] = await env.DB.batch(signupStmts);
    if (insertResult.meta && insertResult.meta.changes === 1) {
      try {
        await sendWelcomeMessage(env, telegramId);
      } catch (e) {   }
    }
    user = await env.DB.prepare(userQuery).bind(telegramId).first();
  } else {
    // the name and photo follow the Telegram account (shown on the leaderboard, friends lists and admin panel); one
    // write, and only when one of them changed
    const nameChanged = username && username !== user.username;
    const photoChanged = photoUrl && photoUrl !== user.photo_url;
    if (nameChanged || photoChanged) {
      await env.DB.prepare("UPDATE users SET username = COALESCE(?, username), photo_url = COALESCE(?, photo_url) WHERE telegram_id = ?")
        .bind(nameChanged ? username : null, photoChanged ? photoUrl : null, telegramId).run();
      if (nameChanged) user.username = username;
      if (photoChanged) user.photo_url = photoUrl;
    }
    // written once and never replaced, so accounts linked before a storage wipe stay linked
    if (deviceId && !user.device_id) {
      await env.DB.prepare("UPDATE users SET device_id = ? WHERE telegram_id = ? AND device_id IS NULL").bind(deviceId, telegramId).run();
    }
  }
  if (user.banned_at) {
    return jsonResponse({ banned: true });
  }
  delete user.device_id;
  delete user.banned_at;
  let view = withMiningView(user);
  view = withStreakView(view);
  view = withDailyPrizeView(view, "last_spin_date", "spin_claimed_today", "spin_next_reset_utc");
  view = withDailyPrizeView(view, "last_chest_date", "chest_claimed_today", "chest_next_reset_utc");
  view = withDailyPrizeView(view, "last_giftpick_date", "giftpick_claimed_today", "giftpick_next_reset_utc");
  view.exchange_rate_coin_to_gram = EXCHANGE_RATE_COIN_TO_GRAM;
  view.exchange_min_coins = EXCHANGE_MIN_COINS;
  view.withdraw_min_gram = WITHDRAW_MIN_GRAM;
  view.withdraw_fee_rate = WITHDRAW_FEE_RATE;
  view.next_withdraw_allowed_at = user.last_withdraw_request_at
    ? user.last_withdraw_request_at + WITHDRAW_COOLDOWN_MS
    : null;
  const comboToday = user.combo_date === today;
  view.combo_solved_today = comboToday && !!user.combo_solved;
  view.combo_attempts_used = comboToday ? (user.combo_attempts_used || 0) : 0;
  view.combo_max_attempts = COMBO_MAX_ATTEMPTS;
  view.ads_watched_today = user.adsgram_task_date === today ? (user.adsgram_task_count || 0) : 0;
  view.ads_daily_limit = ADS_TASK_DAILY_LIMIT;
  view.ads_reward_coins = ADS_TASK_REWARD_COINS;
  view.friends_invites = user.invites_count || 0;
  view.friends_active = user.active_referrals_count || 0;
  view.friends_pending_earnings = user.referral_pending_earnings || 0;
  view.friends_min_claim = REFERRAL_MIN_CLAIM_COINS;
  view.checkin_claimed_today = {
    1: user.checkin1_claimed_date === today,
    2: user.checkin2_claimed_date === today,
    3: user.checkin3_claimed_date === today,
    4: user.checkin4_claimed_date === today,
    5: user.checkin5_claimed_date === today
  };
  view.checkin_rewards = CHECKIN_TASK_REWARDS;
  view.bonus_ad_watched_today = user.bonus_ad_date === today ? (user.bonus_ad_count_today || 0) : 0;
  view.bonus_ad_daily_limit = BONUS_AD_DAILY_LIMIT;
  view.bonus_ad_reward_coins = BONUS_AD_REWARD_COINS;
  view.bonus_ad_next_available_at = user.bonus_ad_last_watched_at
    ? user.bonus_ad_last_watched_at + BONUS_AD_COOLDOWN_MS
    : null;
  view.gigapub_watched_today = user.gigapub_task_date === today ? (user.gigapub_task_count || 0) : 0;
  view.gigapub_daily_limit = GIGAPUB_DAILY_LIMIT;
  view.gigapub_reward_coins = GIGAPUB_REWARD_COINS;
  view.monetix_watched_today = user.monetix_task_date === today ? (user.monetix_task_count || 0) : 0;
  view.monetix_daily_limit = MONETIX_DAILY_LIMIT;
  view.monetix_reward_coins = MONETIX_REWARD_COINS;
  view.onclicka_watched_today = user.onclicka_task_date === today ? (user.onclicka_task_count || 0) : 0;
  view.onclicka_daily_limit = ONCLICKA_DAILY_LIMIT;
  view.onclicka_reward_coins = ONCLICKA_REWARD_COINS;
  view.locked_coins = user.locked_coins || 0;
  return jsonResponse({ user: view });
}

// /api/realm/status
async function handleRealmStatus(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const [row, petsResult, ambassadorGrant] = await Promise.all([
    env.DB.prepare(
      `SELECT u.total_speed, u.lifetime_ads_watched,
              u.capacity_hours AS storage_capacity_hours, u.last_claim_at AS storage_last_claim_at
       FROM users u
       WHERE u.telegram_id = ?`
    ).bind(telegramId).first(),
    env.DB.prepare(
      "SELECT pet_id, level, current_speed, daily_boost_days FROM user_pets WHERE telegram_id = ?"
    ).bind(telegramId).all(),
    env.DB.prepare(
      "SELECT value_usd FROM ambassador_grants WHERE telegram_id = ?"
    ).bind(telegramId).first()
  ]);
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);
  const pets = {};
  for (const r of (petsResult.results || [])) {
    pets[r.pet_id] = { level: r.level, speed: r.current_speed, daily_boost_days: r.daily_boost_days || 0 };
  }
  const storageView = withStorageView({
    pets,
    total_speed: row.total_speed,
    storage_capacity_hours: row.storage_capacity_hours,
    storage_last_claim_at: row.storage_last_claim_at
  });
  return jsonResponse({
    pets,
    happy_dog_claimed: !!pets.happy_dog,
    guardian_claimed: !!pets.guardian,
    ambassador_claimed: !!pets.ambassador,
    ambassador_available: !!ambassadorGrant && !pets.ambassador,
    ambassador_value: pets.ambassador && ambassadorGrant ? ambassadorGrant.value_usd : null,
    happy_dog_friends_threshold: HAPPY_DOG_FRIENDS_THRESHOLD,
    guardian_ads_threshold: GUARDIAN_ADS_THRESHOLD,
    lifetime_ads_watched: row.lifetime_ads_watched || 0,
    total_speed: row.total_speed,
    storage_has_pet: storageView.storage_has_pet,
    storage_accrued: storageView.storage_accrued,
    storage_level: storageView.storage_level,
    storage_max_level: storageView.storage_max_level,
    storage_capacity_hours: storageView.storage_capacity_hours,
    storage_capacity_seconds: storageView.storage_capacity_seconds,
    storage_remaining_seconds: storageView.storage_remaining_seconds,
    storage_is_full: storageView.storage_is_full
  });
}

// /api/mine/start
async function handleMineStart(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const row = await env.DB.prepare(
    "SELECT mining_started_at, mining_cycles_today, mining_cycle_date FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);
  const today = todayUTC();
  if (row.mining_started_at && row.mining_cycle_date === today) {
    return jsonResponse({
      error: "already_mining",
      mining_started_at: row.mining_started_at,
      cycle_duration_seconds: MINING_CYCLE_SECONDS
    }, 409);
  }
  const cyclesToday = row.mining_cycle_date === today ? (row.mining_cycles_today || 0) : 0;
  if (cyclesToday >= MINING_DAILY_LIMIT) {
    return jsonResponse({
      error: "daily_limit_reached",
      cycles_today: cyclesToday,
      cycles_max: MINING_DAILY_LIMIT
    }, 429);
  }
  const nowIso = new Date().toISOString();
  const result = await env.DB.prepare(
    `UPDATE users SET mining_started_at = ?, mining_cycle_date = ?, mining_cycles_today = ?
     WHERE telegram_id = ? AND mining_started_at IS ?`
  ).bind(nowIso, today, cyclesToday, telegramId, row.mining_started_at || null).run();
  if (!result.meta || result.meta.changes === 0) {
    return jsonResponse({ error: "already_mining" }, 409);
  }
  return jsonResponse({
    mining_started_at: nowIso,
    cycle_duration_seconds: MINING_CYCLE_SECONDS,
    cycles_today: cyclesToday,
    cycles_max: MINING_DAILY_LIMIT
  });
}

// /api/mine/claim
async function handleMineClaim(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const row = await env.DB.prepare(
    "SELECT mining_started_at, mining_cycles_today, mining_cycle_date FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);
  if (!row.mining_started_at) {
    return jsonResponse({ error: "not_mining" }, 400);
  }
  const today = todayUTC();
  if (row.mining_cycle_date !== today) {
    return jsonResponse({ error: "cycle_expired", cycles_today: 0, cycles_max: MINING_DAILY_LIMIT }, 409);
  }
  const startedAtMs = Date.parse(row.mining_started_at);
  const elapsedSeconds = (Date.now() - startedAtMs) / 1000;
  if (elapsedSeconds < MINING_CYCLE_SECONDS) {
    return jsonResponse({
      error: "cycle_not_finished",
      remaining_seconds: Math.ceil(MINING_CYCLE_SECONDS - elapsedSeconds)
    }, 400);
  }
  const cyclesToday = row.mining_cycles_today || 0;
  if (cyclesToday >= MINING_DAILY_LIMIT) {
    return jsonResponse({ error: "daily_limit_reached", cycles_today: cyclesToday, cycles_max: MINING_DAILY_LIMIT }, 429);
  }
  const newCyclesToday = cyclesToday + 1;
  const nextStartedAt = newCyclesToday < MINING_DAILY_LIMIT ? new Date().toISOString() : null;
  const updateStmt = env.DB.prepare(
    `UPDATE users SET coins = coins + ?, total_mined = total_mined + ?, mining_started_at = ?, mining_cycles_today = ?, mining_cycle_date = ?
     WHERE telegram_id = ? AND mining_started_at = ?
     RETURNING coins, total_mined`
  ).bind(MINING_REWARD_COINS, MINING_REWARD_COINS, nextStartedAt, newCyclesToday, today, telegramId, row.mining_started_at);
  const updated = await updateStmt.first();
  if (!updated) {
    return jsonResponse({ error: "already_claimed" }, 409);
  }
  return jsonResponse({
    reward: MINING_REWARD_COINS,
    coins: updated.coins,
    total_mined: updated.total_mined || 0,
    mining_started_at: nextStartedAt,
    cycle_duration_seconds: MINING_CYCLE_SECONDS,
    cycles_today: newCyclesToday,
    cycles_max: MINING_DAILY_LIMIT
  });
}

// /api/streak/claim
async function handleStreakClaim(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const row = await env.DB.prepare(
    "SELECT streak_day, streak_last_claim_date FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);
  const state = computeStreakState(row);
  if (state.alreadyClaimedToday) {
    return jsonResponse({
      error: "already_claimed_today",
      claimed_day: state.claimedDay,
      next_reset_utc: nextUtcMidnightIso()
    }, 409);
  }
  const dayToClaim = state.pendingDay;
  const reward = STREAK_REWARDS[dayToClaim - 1];
  const nextStreakDay = dayToClaim === 7 ? 1 : dayToClaim + 1;
  const updateStmt = env.DB.prepare(
    `UPDATE users SET coins = coins + ?, streak_day = ?, streak_last_claim_date = ?
     WHERE telegram_id = ? AND (streak_last_claim_date IS NULL OR streak_last_claim_date <> ?)
     RETURNING coins`
  ).bind(reward, nextStreakDay, state.today, telegramId, state.today);
  const updated = await updateStmt.first();
  if (!updated) {
    return jsonResponse({ error: "already_claimed_today" }, 409);
  }
  return jsonResponse({
    day_claimed: dayToClaim,
    reward,
    next_day: nextStreakDay,
    coins: updated.coins,
    next_reset_utc: nextUtcMidnightIso()
  });
}

// /api/spin/claim
async function handleSpinClaim(request, env) {
  return handleDailyPrizeClaim(request, env, {
    dateColumn: "last_spin_date",
    errorCode: "already_spun_today"
  });
}
async function handleChestClaim(request, env) {
  return handleDailyPrizeClaim(request, env, {
    dateColumn: "last_chest_date",
    errorCode: "already_claimed_today"
  });
}
async function handleGiftPickClaim(request, env) {
  return handleDailyPrizeClaim(request, env, {
    dateColumn: "last_giftpick_date",
    errorCode: "already_claimed_today"
  });
}

// Daily prize logic (Spin / Chest / Gift Pick)
async function handleDailyPrizeClaim(request, env, { dateColumn, errorCode }) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const row = await env.DB.prepare(
    `SELECT ${dateColumn} AS last_date FROM users WHERE telegram_id = ?`
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);
  const today = todayUTC();
  if (row.last_date === today) {
    return jsonResponse({ error: errorCode, next_reset_utc: nextUtcMidnightIso() }, 409);
  }
  const index = pickWeightedSpinIndex();
  const prize = SPIN_SEGMENTS[index];
  const column = prize.type === "coins" ? "coins" : "gram";
  const updateStmt = env.DB.prepare(
    `UPDATE users SET ${column} = ${column} + ?, ${dateColumn} = ?
     WHERE telegram_id = ? AND (${dateColumn} IS NULL OR ${dateColumn} <> ?)
     RETURNING coins, gram`
  ).bind(prize.amount, today, telegramId, today);
  const updated = await updateStmt.first();
  if (!updated) {
    return jsonResponse({ error: errorCode }, 409);
  }
  return jsonResponse({
    segment_index: index,
    prize_type: prize.type,
    prize_amount: prize.amount,
    coins: updated.coins,
    gram: updated.gram,
    next_reset_utc: nextUtcMidnightIso()
  });
}

// Weighted spin pick
function pickWeightedSpinIndex() {
  const totalWeight = SPIN_SEGMENTS.reduce((sum, p) => sum + p.weight, 0);
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = buf[0] % totalWeight;
  let acc = 0;
  for (let i = 0; i < SPIN_SEGMENTS.length; i++) {
    acc += SPIN_SEGMENTS[i].weight;
    if (roll < acc) return i;
  }
  return SPIN_SEGMENTS.length - 1;
}

// Daily prize view
function withDailyPrizeView(user, dateColumn, claimedKey, resetKey) {
  return {
    ...user,
    [claimedKey]: user[dateColumn] === todayUTC(),
    [resetKey]: nextUtcMidnightIso()
  };
}

// /api/pet/<pet_id>/buy
async function handlePetBuy(request, env, petId) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const pet = PETS[petId];
  const existing = await env.DB.prepare(
    "SELECT 1 FROM user_pets WHERE telegram_id = ? AND pet_id = ?"
  ).bind(telegramId, petId).first();
  if (existing) return jsonResponse({ error: "already_owned" }, 409);
  const storageRow = await env.DB.prepare(
    `SELECT u.coins, u.total_speed, u.capacity_hours, u.last_claim_at
     FROM users u
     WHERE u.telegram_id = ?`
  ).bind(telegramId).first();
  if (!storageRow || storageRow.coins < pet.price) {
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }
  let preBuyAccrued = 0;
  if (storageRow.last_claim_at) {
    const capacitySeconds = (storageRow.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(storageRow.last_claim_at)) / 1000);
    preBuyAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((storageRow.total_speed || 0) / 3600);
  }
  const nowIso = new Date().toISOString();
  // the price, the credit of the storage and its reset are one write, guarded on the values the credit was worked out
  // from, so a storage claim or another purchase in between cannot pay the same storage twice
  const storageSet = storageRow.last_claim_at ? "last_claim_at = ?" : "capacity_hours = " + STORAGE_DEFAULT_CAPACITY_HOURS + ", last_claim_at = ?";
  const deductStmt = env.DB.prepare(
    `UPDATE users SET coins = coins - ? + ?, total_speed = total_speed + ?, locked_coins = MAX(0, COALESCE(locked_coins, 0) - ?), ${storageSet}
     WHERE telegram_id = ? AND coins >= ? AND last_claim_at IS ? AND total_speed IS ? AND capacity_hours IS ?
     RETURNING coins, total_speed, locked_coins`
  ).bind(
    pet.price, preBuyAccrued, pet.basespeed, pet.price, nowIso,
    telegramId, pet.price, storageRow.last_claim_at, storageRow.total_speed, storageRow.capacity_hours
  );
  // changes() is the row count of the write just before it in the batch; a pet already owned fails the batch and
  // nothing in it is kept
  const insertPetStmt = env.DB.prepare(
    "INSERT INTO user_pets (telegram_id, pet_id, level, current_speed) SELECT ?, ?, 1, ? WHERE changes() = 1"
  ).bind(telegramId, petId, pet.basespeed);
  let deductResult;
  try {
    [deductResult] = await env.DB.batch([deductStmt, insertPetStmt]);
  } catch (e) {
    return jsonResponse({ error: "already_owned" }, 409);
  }
  const updatedUser = deductResult.results && deductResult.results[0];
  if (!updatedUser) {
    return jsonResponse({ error: "storage_changed" }, 409);
  }
  return jsonResponse({
    locked_coins: updatedUser.locked_coins || 0,
    pet_id: petId,
    level: 1,
    speed: pet.basespeed,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins,
    storage_credited: preBuyAccrued
  });
}

// /api/pet/<pet_id>/upgrade
async function handlePetUpgrade(request, env, petId) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const row = await env.DB.prepare(
    `SELECT p.level, p.current_speed, u.coins, u.total_speed, u.capacity_hours, u.last_claim_at, u.locked_coins
     FROM user_pets p
     JOIN users u ON u.telegram_id = p.telegram_id
     WHERE p.telegram_id = ? AND p.pet_id = ?`
  ).bind(telegramId, petId).first();
  if (!row) return jsonResponse({ error: "not_owned" }, 400);
  if (row.level >= PET_MAX_LEVEL) {
    return jsonResponse({ error: "max_level_reached", level: row.level }, 400);
  }
  const newLevel = row.level + 1;
  const newSpeed = petSpeedForLevel(petId, newLevel);
  const speedDelta = newSpeed - row.current_speed;
  const upgradeCost = petUpgradeCost(petId);
  if (row.coins < upgradeCost) {
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }
  const capacitySeconds = (row.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
  let preUpgradeAccrued = 0;
  if (row.last_claim_at) {
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(row.last_claim_at)) / 1000);
    preUpgradeAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((row.total_speed || 0) / 3600);
  }
  const nowIso = new Date().toISOString();
  // the cost, the credit of the storage and its reset are one write, guarded on the values the credit was worked out
  // from, so a storage claim or another purchase in between cannot pay the same storage twice
  const deductStmt = env.DB.prepare(
    `UPDATE users SET coins = coins - ? + ?, total_speed = total_speed + ?, locked_coins = MAX(0, COALESCE(locked_coins, 0) - ?), last_claim_at = ?
     WHERE telegram_id = ? AND coins >= ? AND last_claim_at IS ? AND total_speed IS ? AND capacity_hours IS ?
     RETURNING coins, total_speed, locked_coins`
  ).bind(
    upgradeCost, preUpgradeAccrued, speedDelta, upgradeCost, nowIso,
    telegramId, upgradeCost, row.last_claim_at, row.total_speed, row.capacity_hours
  );
  // changes() is the row count of the write just before it in the batch, so a refused payment upgrades nothing
  const updatePetStmt = env.DB.prepare(
    `UPDATE user_pets SET level = ?, current_speed = ?
     WHERE telegram_id = ? AND pet_id = ? AND level = ? AND changes() = 1`
  ).bind(newLevel, newSpeed, telegramId, petId, row.level);
  const [deductResult, updatePetResult] = await env.DB.batch([deductStmt, updatePetStmt]);
  const updatedUser = deductResult.results && deductResult.results[0];
  if (!updatedUser) {
    return jsonResponse({ error: "level_changed" }, 409);
  }
  if (!updatePetResult.meta || updatePetResult.meta.changes === 0) {
    // the level moved on in between: give the payment back and put the storage back as it was
    const lockedTaken = lockedTakenFor(upgradeCost, updatedUser.locked_coins, row.locked_coins);
    await env.DB.prepare(
      `UPDATE users SET coins = coins + ? - ?, total_speed = total_speed - ?, locked_coins = COALESCE(locked_coins, 0) + ?,
         last_claim_at = CASE WHEN last_claim_at = ? THEN ? ELSE last_claim_at END
       WHERE telegram_id = ?`
    ).bind(upgradeCost, preUpgradeAccrued, speedDelta, lockedTaken, nowIso, row.last_claim_at, telegramId).run();
    return jsonResponse({ error: "level_changed" }, 409);
  }
  return jsonResponse({
    locked_coins: updatedUser.locked_coins || 0,
    pet_id: petId,
    level: newLevel,
    speed: newSpeed,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins,
    storage_credited: preUpgradeAccrued,
    is_max_level: newLevel >= PET_MAX_LEVEL
  });
}

// /api/storage/claim
async function handleStorageClaim(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const row = await env.DB.prepare(
    `SELECT u.total_speed, u.capacity_hours, u.last_claim_at
     FROM users u
     WHERE u.telegram_id = ?`
  ).bind(telegramId).first();
  if (!row || !row.last_claim_at) {
    return jsonResponse({ error: "no_storage" }, 400);
  }
  const capacitySeconds = (row.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
  const perSecondRate = (row.total_speed || 0) / 3600;
  const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(row.last_claim_at)) / 1000);
  const accrued = Math.min(elapsedSeconds, capacitySeconds) * perSecondRate;
  if (elapsedSeconds < capacitySeconds) {
    return jsonResponse({
      error: "not_full_yet",
      remaining_seconds: capacitySeconds - elapsedSeconds
    }, 400);
  }
  const nowIso = new Date().toISOString();
  // reset and credit in one write, so neither can happen without the other; RETURNING gives the new balance
  const updatedUser = await env.DB.prepare(
    `UPDATE users SET last_claim_at = ?, coins = coins + ?
     WHERE telegram_id = ? AND last_claim_at = ?
     RETURNING coins`
  ).bind(nowIso, accrued, telegramId, row.last_claim_at).first();
  if (!updatedUser) {
    return jsonResponse({ error: "already_claimed" }, 409);
  }
  return jsonResponse({
    claimed_amount: accrued,
    coins: updatedUser.coins,
    capacity_seconds: capacitySeconds
  });
}

// /api/storage/upgrade
async function handleStorageUpgrade(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const row = await env.DB.prepare(
    `SELECT u.coins, u.total_speed, u.capacity_hours, u.last_claim_at
     FROM users u
     WHERE u.telegram_id = ?`
  ).bind(telegramId).first();
  if (!row || !row.last_claim_at) {
    return jsonResponse({ error: "no_storage" }, 400);
  }
  const currentCapacityHours = row.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS;
  const currentLevel = storageLevelForCapacityHours(currentCapacityHours);
  if (currentLevel >= STORAGE_MAX_LEVEL) {
    return jsonResponse({ error: "max_level_reached", level: currentLevel }, 400);
  }
  const newLevel = currentLevel + 1;
  const newCapacityHours = STORAGE_LEVELS[newLevel - 1];
  const newCapacitySeconds = newCapacityHours * 3600;
  const oldCapacitySeconds = currentCapacityHours * 3600;
  if (row.coins < STORAGE_UPGRADE_COST_COINS) {
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }
  const perSecondRate = (row.total_speed || 0) / 3600;
  const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(row.last_claim_at)) / 1000);
  const preUpgradeAccrued = Math.min(elapsedSeconds, oldCapacitySeconds) * perSecondRate;
  const nowIso = new Date().toISOString();
  // the cost, the credit of the storage, the new capacity and the reset are one write, guarded on the values the
  // credit was worked out from, so nothing has to be given back and the same storage cannot be paid twice
  const updatedUser = await env.DB.prepare(
    `UPDATE users SET coins = coins - ? + ?, locked_coins = MAX(0, COALESCE(locked_coins, 0) - ?), capacity_hours = ?, last_claim_at = ?
     WHERE telegram_id = ? AND coins >= ? AND capacity_hours = ? AND last_claim_at = ? AND total_speed IS ?
     RETURNING coins, locked_coins`
  ).bind(
    STORAGE_UPGRADE_COST_COINS, preUpgradeAccrued, STORAGE_UPGRADE_COST_COINS, newCapacityHours, nowIso,
    telegramId, STORAGE_UPGRADE_COST_COINS, currentCapacityHours, row.last_claim_at, row.total_speed
  ).first();
  if (!updatedUser) {
    return jsonResponse({ error: "level_changed" }, 409);
  }
  return jsonResponse({
    locked_coins: updatedUser.locked_coins || 0,
    level: newLevel,
    capacity_hours: newCapacityHours,
    capacity_seconds: newCapacitySeconds,
    coins: updatedUser.coins,
    storage_credited: preUpgradeAccrued,
    is_max_level: newLevel >= STORAGE_MAX_LEVEL
  });
}

// /api/promo/redeem
async function handlePromoRedeem(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateRequest(request, env, body);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  if (!code) return jsonResponse({ error: "missing_code" }, 400);
  const promo = await env.DB.prepare(
    "SELECT code, reward, currency, max_uses, expires_at FROM promo_codes WHERE code = ?"
  ).bind(code).first();
  if (!promo) return jsonResponse({ error: "invalid_code" }, 404);
  if (promo.expires_at && Date.now() > Date.parse(promo.expires_at)) {
    return jsonResponse({ error: "code_expired" }, 400);
  }
  // One transaction, all or nothing: the redemption is recorded only if this user has not used the code and it
  // has uses left; the counter and the reward each follow only if the statement before them changed a row.
  // (user, code) is the table's primary key, so the same user can never be recorded twice.
  const column = promo.currency === "gram" ? "gram" : "coins";
  let results;
  try {
    results = await env.DB.batch([
      env.DB.prepare(
        `INSERT OR IGNORE INTO promo_redemptions (telegram_id, code)
         SELECT ?, ? WHERE EXISTS (
           SELECT 1 FROM promo_codes WHERE code = ? AND (max_uses IS NULL OR uses_count < max_uses)
         ) AND EXISTS (SELECT 1 FROM users WHERE telegram_id = ?)`
      ).bind(telegramId, code, code, telegramId),
      env.DB.prepare(
        "UPDATE promo_codes SET uses_count = uses_count + 1 WHERE code = ? AND changes() = 1"
      ).bind(code),
      env.DB.prepare(
        `UPDATE users SET ${column} = ${column} + ? WHERE telegram_id = ? AND changes() = 1`
      ).bind(promo.reward, telegramId),
      env.DB.prepare("SELECT coins, gram FROM users WHERE telegram_id = ?").bind(telegramId)
    ]);
  } catch (e) {
    console.error("promo redeem batch failed:", e?.message || e);
    return jsonResponse({ error: "server_error" }, 500);
  }
  if (!results[2].meta || results[2].meta.changes !== 1) {
    // nothing was recorded: either this user already used the code, or it has no uses left
    const used = await env.DB.prepare(
      "SELECT 1 FROM promo_redemptions WHERE telegram_id = ? AND code = ?"
    ).bind(telegramId, code).first();
    return used
      ? jsonResponse({ error: "already_redeemed" }, 409)
      : jsonResponse({ error: "code_exhausted" }, 400);
  }
  const updatedUser = (results[3].results || [])[0];
  return jsonResponse({
    reward: promo.reward,
    currency: column,
    coins: updatedUser.coins,
    gram: updatedUser.gram
  });
}

// /api/exchange
async function handleExchange(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateRequest(request, env, body);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const amountCoins = Number(body.amount);
  if (!Number.isFinite(amountCoins) || amountCoins <= 0) {
    return jsonResponse({ error: "invalid_amount" }, 400);
  }
  if (amountCoins < EXCHANGE_MIN_COINS) {
    return jsonResponse({ error: "below_minimum", minimum: EXCHANGE_MIN_COINS }, 400);
  }
  const gramAmount = amountCoins * EXCHANGE_RATE_COIN_TO_GRAM;
  // deposited coins (locked_coins) are for pets and upgrades only; only the rest can become Gram
  const updatedUser = await env.DB.prepare(
    `UPDATE users SET coins = coins - ?, gram = gram + ?
     WHERE telegram_id = ? AND coins - COALESCE(locked_coins, 0) >= ?
     RETURNING coins, gram, locked_coins`
  ).bind(amountCoins, gramAmount, telegramId, amountCoins).first();
  if (!updatedUser) {
    const current = await env.DB.prepare(
      "SELECT coins, locked_coins FROM users WHERE telegram_id = ?"
    ).bind(telegramId).first();
    if (current && current.coins >= amountCoins) {
      return jsonResponse({
        error: "locked_coins",
        exchangeable: Math.max(0, current.coins - (current.locked_coins || 0)),
        locked_coins: current.locked_coins || 0
      }, 400);
    }
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }
  return jsonResponse({
    locked_coins: updatedUser.locked_coins || 0,
    exchanged_coins: amountCoins,
    received_gram: gramAmount,
    coins: updatedUser.coins,
    gram: updatedUser.gram
  });
}

// /api/deposit/info
async function handleDepositInfo(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  return jsonResponse({
    address: env.DEPOSIT_ADDRESS || "",
    memo: String(telegramId),
    min_gram: DEPOSIT_MIN_GRAM,
    rate_gram_to_coins: DEPOSIT_GRAM_TO_COINS_RATE
  });
}

// /api/deposit/check
async function handleDepositCheck(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  if (!env.DEPOSIT_ADDRESS) {
    return jsonResponse({ error: "deposit_not_configured" }, 500);
  }
  const doId = env.DEPOSIT_CHECKER.idFromName(`user_${telegramId}`);
  const doStub = env.DEPOSIT_CHECKER.get(doId);
  const doRes = await doStub.fetch("https://do/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId, memo: String(telegramId) })
  });
  return new Response(doRes.body, {
    status: doRes.status,
    headers: { "Content-Type": "application/json" }
  });
}

// /api/deposit/status
async function handleDepositStatus(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const doId = env.DEPOSIT_CHECKER.idFromName(`user_${telegramId}`);
  const doStub = env.DEPOSIT_CHECKER.get(doId);
  const doRes = await doStub.fetch("https://do/status");
  const doData = await doRes.json();
  if (doData.status === "found" || doData.status === "already_processed") {
    const updatedUser = await env.DB.prepare(
      "SELECT coins, gram, locked_coins FROM users WHERE telegram_id = ?"
    ).bind(telegramId).first();
    return jsonResponse({ ...doData, coins: updatedUser.coins, gram: updatedUser.gram, locked_coins: updatedUser.locked_coins || 0 });
  }
  return jsonResponse(doData);
}

// DepositChecker (Durable Object)
export class DepositChecker {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/start" && request.method === "POST") {
      const currentStatus = await this.state.storage.get("status");
      if (currentStatus === "pending") {
        return jsonResponse({ status: "pending", alreadyRunning: true, next_check_at: await this.state.storage.getAlarm() });
      }
      const { telegramId, memo } = await request.json();
      await this.state.storage.put("telegramId", telegramId);
      await this.state.storage.put("memo", String(memo));
      await this.state.storage.put("status", "pending");
      await this.state.storage.put("startTime", Date.now());
      await this.state.storage.put("attempts", 0);
      await this.state.storage.delete("amountGram");
      await this.state.storage.delete("coinsCredited");
      const nextCheckAt = Date.now() + DEPOSIT_CHECK_FIRST_DELAY_MS;
      await this.state.storage.setAlarm(nextCheckAt);
      return jsonResponse({ status: "pending", next_check_at: nextCheckAt });
    }
    if (url.pathname === "/status" && request.method === "GET") {
      const status = (await this.state.storage.get("status")) ?? "idle";
      const amountGram = (await this.state.storage.get("amountGram")) ?? null;
      const coinsCredited = (await this.state.storage.get("coinsCredited")) ?? null;
      const nextCheckAt = status === "pending" ? await this.state.storage.getAlarm() : null;
      return jsonResponse({ status, amount_gram: amountGram, coins_credited: coinsCredited, next_check_at: nextCheckAt });
    }
    return jsonResponse({ error: "not_found" }, 404);
  }
  async alarm() {
    const telegramId = await this.state.storage.get("telegramId");
    const memo = await this.state.storage.get("memo");
    const startTime = await this.state.storage.get("startTime");
    let attempts = (await this.state.storage.get("attempts")) || 0;
    attempts++;
    await this.state.storage.put("attempts", attempts);
    if (Date.now() - startTime > DEPOSIT_CHECK_TIMEOUT_MS) {
      await this.state.storage.put("status", "timeout");
      return;
    }
    const depositAddress = this.env.DEPOSIT_ADDRESS || "";
    const headers = { "Accept": "application/json" };
    if (this.env.TONCENTER_API_KEY) headers["X-API-Key"] = this.env.TONCENTER_API_KEY;
    try {
      const tonRes = await fetch(
        `https://toncenter.com/api/v2/getTransactions?address=${encodeURIComponent(depositAddress)}&limit=10&archival=false`,
        { headers }
      );
      if (tonRes.ok) {
        const tonData = await tonRes.json();
        if (tonData?.ok && Array.isArray(tonData.result)) {
          for (const tx of tonData.result) {
            const inMsg = tx.in_msg;
            if (!inMsg || !inMsg.value || Number(inMsg.value) === 0) continue;
            let txComment = "";
            if (typeof inMsg.message === "string" && inMsg.message.length > 0) {
              txComment = inMsg.message;
            } else {
              const msgData = inMsg.msg_data;
              if (msgData?.["@type"] === "msg.dataText" && msgData.text) {
                try {
                  txComment = atob(msgData.text).replace(/^\x00+/, "");
                } catch (e) {
                  txComment = "";
                }
              }
            }
            if (txComment.trim() !== String(memo).trim()) continue;
            const txHash = tx.transaction_id?.hash;
            if (!txHash) continue;
            const amountGram = Number(inMsg.value) / 1e9;
            if (amountGram < DEPOSIT_MIN_GRAM) {
              await this.state.storage.put("status", "below_minimum");
              await this.state.storage.put("amountGram", amountGram);
              return;
            }
            const coinsCredited = amountGram * DEPOSIT_GRAM_TO_COINS_RATE;
            const depositor = await this.env.DB.prepare(
              "SELECT referred_by FROM users WHERE telegram_id = ?"
            ).bind(telegramId).first();
            const referrerId = depositor?.referred_by || null;
            const referralCommission = referrerId ? coinsCredited * REFERRAL_DEPOSIT_COMMISSION_RATE : 0;
            const depositBatch = [
              this.env.DB.prepare(
                "INSERT INTO deposits (telegram_id, tx_hash, amount_gram, coins_credited, status, memo, created_at) VALUES (?, ?, ?, ?, 'confirmed', ?, ?)"
              ).bind(telegramId, txHash, amountGram, coinsCredited, memo, Date.now()),
              // deposited coins are also locked: usable for pets and upgrades, never exchangeable to Gram
              this.env.DB.prepare(
                "UPDATE users SET coins = coins + ?, locked_coins = COALESCE(locked_coins, 0) + ? WHERE telegram_id = ?"
              ).bind(coinsCredited, coinsCredited, telegramId)
            ];
            if (referrerId) {
              depositBatch.push(
                this.env.DB.prepare(
                  "UPDATE users SET referral_pending_earnings = referral_pending_earnings + ?, referral_deposit_commission_total = referral_deposit_commission_total + ? WHERE telegram_id = ?"
                ).bind(referralCommission, referralCommission, referrerId),
                this.env.DB.prepare(
                  "UPDATE referrals SET earned_coins = earned_coins + ? WHERE referrer_id = ? AND referred_id = ?"
                ).bind(referralCommission, referrerId, telegramId),
                this.env.DB.prepare(
                  "INSERT INTO referral_commission_log (telegram_id, amount, created_at) VALUES (?, ?, ?)"
                ).bind(referrerId, referralCommission, Date.now())
              );
            }
            try {
              await this.env.DB.batch(depositBatch);
            } catch (e) {
              const errMsg = String(e?.message || e).toLowerCase();
              if (errMsg.includes("unique")) {
                await this.state.storage.put("status", "already_processed");
                await this.state.storage.put("amountGram", amountGram);
                return;
              }
              break;
            }
            await this.state.storage.put("status", "found");
            await this.state.storage.put("amountGram", amountGram);
            await this.state.storage.put("coinsCredited", coinsCredited);
            await this.notifyUser(telegramId, amountGram, coinsCredited);
            return;
          }
        }
      }
    } catch (e) {
    }
    if (attempts < DEPOSIT_CHECK_MAX_ATTEMPTS) {
      await this.state.storage.setAlarm(Date.now() + DEPOSIT_CHECK_RETRY_DELAY_MS);
    } else {
      await this.state.storage.put("status", "timeout");
    }
  }
  async notifyUser(telegramId, amountGram, coinsCredited) {
    if (!this.env.BOT_TOKEN) return;
    try {
      await sendMessage(this.env, telegramId, {
        text:
          `✅ <b>Deposit Confirmed!</b>\n\n` +
          `💎 Amount: <b>${amountGram.toFixed(4)} Gram</b>\n` +
          `🪙 Credited: <b>${Math.round(coinsCredited).toLocaleString("en-US")} Coins</b>`,
        parse_mode: "HTML"
      });
    } catch (e) {}
  }
}

// /api/withdraw/request
async function handleWithdrawRequest(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateRequest(request, env, body);
  if (!auth.ok) return auth.response;
  const { telegramId, rawUsername, firstName } = auth;
  const amountGram = Number(body.amount);
  const address = typeof body.address === "string" ? body.address.trim() : "";
  if (!Number.isFinite(amountGram) || amountGram < WITHDRAW_MIN_GRAM) {
    return jsonResponse({ error: "below_minimum", minimum: WITHDRAW_MIN_GRAM }, 400);
  }
  if (!address) {
    return jsonResponse({ error: "missing_address" }, 400);
  }
  const now = Date.now();
  const cooldownCutoff = now - WITHDRAW_COOLDOWN_MS;
  const feeGram = amountGram * WITHDRAW_FEE_RATE;
  const netGram = Math.max(0, amountGram - feeGram);
  const reserveStmt = env.DB.prepare(
    `UPDATE users SET gram = gram - ?, last_withdraw_request_at = ?
     WHERE telegram_id = ? AND gram >= ? AND banned_at IS NULL
       AND (last_withdraw_request_at IS NULL OR last_withdraw_request_at <= ?)
       AND (CASE WHEN ads_today_date = date('now') THEN ads_today ELSE 0 END) >= ?
       AND active_referrals_count >= ?
     RETURNING gram`
  ).bind(amountGram, now, telegramId, amountGram, cooldownCutoff, WITHDRAW_DAILY_ADS, WITHDRAW_ACTIVE_REFERRALS);
  // changes() is the row count of reserveStmt just before it in the batch, so a refused request records nothing
  const insertStmt = env.DB.prepare(
    `INSERT INTO withdrawals
       (telegram_id, raw_username, first_name, amount_gram, fee_gram, net_gram, address, status, created_at)
     SELECT ?, ?, ?, ?, ?, ?, ?, 'pending', ?
     WHERE changes() = 1`
  ).bind(telegramId, rawUsername, firstName, amountGram, feeGram, netGram, address, now);
  let batchResults;
  try {
    batchResults = await env.DB.batch([reserveStmt, insertStmt]);
  } catch (e) {
    console.error("withdraw request batch failed:", e?.message || e);
    return jsonResponse({ error: "server_error" }, 500);
  }
  const [reserveResult, insertResult] = batchResults;
  const reserved = reserveResult.results && reserveResult.results[0];
  if (!reserved) {
    const user = await env.DB.prepare(
      "SELECT gram, last_withdraw_request_at, banned_at, ads_today, ads_today_date, active_referrals_count FROM users WHERE telegram_id = ?"
    ).bind(telegramId).first();
    if (user && user.banned_at) {
      return jsonResponse({ error: "banned" }, 403);
    }
    if (user && user.last_withdraw_request_at && user.last_withdraw_request_at > cooldownCutoff) {
      return jsonResponse({
        error: "cooldown_active",
        next_allowed_at: user.last_withdraw_request_at + WITHDRAW_COOLDOWN_MS
      }, 400);
    }
    if (!user || !(user.gram >= amountGram)) {
      return jsonResponse({ error: "insufficient_funds" }, 400);
    }
    // enough Gram: the requirements are what is missing (shown in the To Withdraw window)
    const adsToday = user.ads_today_date === todayUTC() ? (user.ads_today || 0) : 0;
    const activeReferrals = user.active_referrals_count || 0;
    if (adsToday < WITHDRAW_DAILY_ADS || activeReferrals < WITHDRAW_ACTIVE_REFERRALS) {
      return jsonResponse({
        error: "requirements_not_met",
        ads_today: adsToday, ads_required: WITHDRAW_DAILY_ADS,
        active_referrals: activeReferrals, referrals_required: WITHDRAW_ACTIVE_REFERRALS
      }, 400);
    }
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }
  if (!insertResult.meta || insertResult.meta.changes === 0) {
    // balance was reserved but no request row was written: give it back and clear the cooldown
    console.error("withdraw request row not written after reserve; refunding");
    await env.DB.prepare(
      "UPDATE users SET gram = gram + ?, last_withdraw_request_at = NULL WHERE telegram_id = ? AND last_withdraw_request_at = ?"
    ).bind(amountGram, telegramId, now).run();
    return jsonResponse({ error: "server_error" }, 500);
  }
  const withdrawalId = insertResult.meta.last_row_id;
  try {
    const channelMsg = await sendMessage(env, ADMIN_CHANNEL_ID, {
      text: buildWithdrawText("pending", { telegramId, rawUsername, firstName, netGram, address }),
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: "✅ Approve", callback_data: `wd_approve_${withdrawalId}` },
          { text: "❌ Reject", callback_data: `wd_reject_${withdrawalId}` }
        ]]
      }
    });
    if (channelMsg && channelMsg.ok && channelMsg.result) {
      await env.DB.prepare(
        "UPDATE withdrawals SET channel_message_id = ? WHERE id = ?"
      ).bind(channelMsg.result.message_id, withdrawalId).run();
    } else {
      console.error("withdraw channel notification failed:", JSON.stringify(channelMsg));
    }
  } catch (e) {
    console.error("withdraw channel notification threw:", e?.message || e);
  }
  try {
    await sendMessage(env, telegramId, {
      text:
        `📨 Withdrawal Request Created\n\n` +
        `Your request for ${netGram} Gram has been received and is being processed.\n\n` +
        `⏱ This usually takes a few minutes, but can sometimes take up to 24 hours.`
    });
  } catch (e) {
    console.error("withdraw confirmation DM failed:", e?.message || e);
  }
  return jsonResponse({
    gram: reserved.gram,
    net_gram: netGram,
    next_allowed_at: now + WITHDRAW_COOLDOWN_MS
  });
}

// /api/wallet/history
async function handleWalletHistory(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const [depositsResult, withdrawalsResult, referralCommissionResult] = await env.DB.batch([
    env.DB.prepare(
      "SELECT coins_credited AS amount, created_at FROM deposits WHERE telegram_id = ? AND status = 'confirmed' ORDER BY created_at DESC LIMIT 5"
    ).bind(telegramId),
    env.DB.prepare(
      "SELECT net_gram AS amount, status, created_at FROM withdrawals WHERE telegram_id = ? ORDER BY created_at DESC LIMIT 5"
    ).bind(telegramId),
    env.DB.prepare(
      "SELECT amount, created_at FROM referral_commission_log WHERE telegram_id = ? ORDER BY created_at DESC LIMIT 5"
    ).bind(telegramId)
  ]);
  const items = [];
  for (const row of (depositsResult.results || [])) {
    items.push({ type: "deposit", amount: row.amount, status: "confirmed", created_at: row.created_at });
  }
  for (const row of (withdrawalsResult.results || [])) {
    items.push({ type: "withdraw", amount: row.amount, status: row.status, created_at: row.created_at });
  }
  for (const row of (referralCommissionResult.results || [])) {
    items.push({ type: "referral_commission", amount: row.amount, created_at: row.created_at });
  }
  items.sort((a, b) => b.created_at - a.created_at);
  return jsonResponse({ items: items.slice(0, 10) });
}

// /api/ads/reward (Adsgram)
async function handleAdsReward(url, env) {
  const secret = url.searchParams.get("secret");
  if (!env.ADSGRAM_REWARD_SECRET || secret !== env.ADSGRAM_REWARD_SECRET) {
    return new Response("forbidden", { status: 403 });
  }
  const telegramId = parseInt(url.searchParams.get("userid"), 10);
  if (!Number.isFinite(telegramId)) {
    return new Response("bad request", { status: 400 });
  }
  if (url.searchParams.get("task") === "bonus_ad") {
    return handleBonusAdReward(telegramId, env);
  }
  const row = await env.DB.prepare(
    "SELECT adsgram_task_count, adsgram_task_date FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) {
    return new Response("user not found", { status: 404 });
  }
  const today = todayUTC();
  const countToday = row.adsgram_task_date === today ? (row.adsgram_task_count || 0) : 0;
  if (countToday >= ADS_TASK_DAILY_LIMIT) {
    return new Response("limit reached", { status: 200 });
  }
  const newCount = countToday + 1;
  // reward and ad counters in one write; RETURNING gives the new lifetime count without a second read
  const updated = await env.DB.prepare(
    `UPDATE users SET coins = coins + ?, adsgram_task_count = ?, adsgram_task_date = ?, lifetime_ads_watched = COALESCE(lifetime_ads_watched, 0) + 1, weekly_ads_watched = weekly_ads_watched + 1, ${ADS_TODAY_PLUS_ONE}
     WHERE telegram_id = ? AND (adsgram_task_date IS NULL OR adsgram_task_date <> ? OR adsgram_task_count = ?)
     RETURNING lifetime_ads_watched, referred_by`
  ).bind(ADS_TASK_REWARD_COINS, newCount, today, telegramId, today, countToday).first();
  if (updated) {
    await activateReferralOnLifetimeAds(env, telegramId, updated.referred_by, updated.lifetime_ads_watched);
  }
  return new Response("OK", { status: 200 });
}

// Lifetime ads counter
async function bumpLifetimeAdsWatched(env, telegramId) {
  // one write; RETURNING gives the new lifetime count without a separate read
  const updated = await env.DB.prepare(
    `UPDATE users SET lifetime_ads_watched = COALESCE(lifetime_ads_watched, 0) + 1, weekly_ads_watched = weekly_ads_watched + 1, ${ADS_TODAY_PLUS_ONE}
     WHERE telegram_id = ?
     RETURNING lifetime_ads_watched, referred_by`
  ).bind(telegramId).first();
  if (!updated) return;
  await activateReferralOnLifetimeAds(env, telegramId, updated.referred_by, updated.lifetime_ads_watched);
}

// Referral becomes active once the invited user reaches ACTIVE_FRIEND_ADS_THRESHOLD lifetime ads
async function activateReferralOnLifetimeAds(env, telegramId, referredBy, lifetimeAds) {
  if (referredBy && lifetimeAds >= ACTIVE_FRIEND_ADS_THRESHOLD) {
    // one batch, so a friend is never marked active without the inviter's bonus and counters; changes() is the row
    // count of the statement just before it, so an already active friend pays nothing
    await env.DB.batch([
      env.DB.prepare(
        `UPDATE referrals SET is_active = 1, earned_coins = earned_coins + ?
         WHERE referrer_id = ? AND referred_id = ? AND is_active = 0`
      ).bind(REFERRAL_ACTIVE_BONUS_COINS, referredBy, telegramId),
      env.DB.prepare(
        `UPDATE users SET referral_pending_earnings = referral_pending_earnings + ?, active_referrals_count = active_referrals_count + 1, weekly_active_referrals = weekly_active_referrals + 1
         WHERE telegram_id = ? AND changes() = 1`
      ).bind(REFERRAL_ACTIVE_BONUS_COINS, referredBy)
    ]);
  }
}

// /api/pets/claim_happy_dog
async function handleClaimHappyDog(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const existing = await env.DB.prepare(
    "SELECT 1 FROM user_pets WHERE telegram_id = ? AND pet_id = 'happy_dog'"
  ).bind(telegramId).first();
  if (existing) return jsonResponse({ error: "already_claimed" }, 409);
  const row = await env.DB.prepare(
    `SELECT u.active_referrals_count, u.total_speed, u.capacity_hours, u.last_claim_at
     FROM users u
     WHERE u.telegram_id = ?`
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);
  if ((row.active_referrals_count || 0) < HAPPY_DOG_FRIENDS_THRESHOLD) {
    return jsonResponse({ error: "not_eligible", active_referrals_count: row.active_referrals_count || 0 }, 403);
  }
  const capacitySeconds = (row.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
  let preClaimAccrued = 0;
  if (row.last_claim_at) {
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(row.last_claim_at)) / 1000);
    preClaimAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((row.total_speed || 0) / 3600);
  }
  const nowIso = new Date().toISOString();
  // the new speed, the credit of the storage and its reset are one write, guarded on the values the credit was worked
  // out from, so a storage claim in between cannot pay the same storage twice; RETURNING gives the new values
  const storageSet = row.last_claim_at ? "last_claim_at = ?" : "capacity_hours = " + STORAGE_DEFAULT_CAPACITY_HOURS + ", last_claim_at = ?";
  const userStmt = env.DB.prepare(
    `UPDATE users SET total_speed = total_speed + ?, coins = coins + ?, ${storageSet}
     WHERE telegram_id = ? AND last_claim_at IS ? AND total_speed IS ? AND capacity_hours IS ?
     RETURNING total_speed, coins`
  ).bind(HAPPY_DOG_SPEED, preClaimAccrued, nowIso, telegramId, row.last_claim_at, row.total_speed, row.capacity_hours);
  // changes() is the row count of the write just before it in the batch; a pet already claimed fails the batch and
  // nothing in it is kept
  const insertPetStmt = env.DB.prepare(
    "INSERT INTO user_pets (telegram_id, pet_id, level, current_speed) SELECT ?, 'happy_dog', 1, ? WHERE changes() = 1"
  ).bind(telegramId, HAPPY_DOG_SPEED);
  let userResult;
  try {
    [userResult] = await env.DB.batch([userStmt, insertPetStmt]);
  } catch (e) {
    return jsonResponse({ error: "already_claimed" }, 409);
  }
  const updatedUser = userResult.results && userResult.results[0];
  if (!updatedUser) {
    return jsonResponse({ error: "storage_changed" }, 409);
  }
  return jsonResponse({
    pet_id: "happy_dog",
    level: 1,
    speed: HAPPY_DOG_SPEED,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins,
    storage_credited: preClaimAccrued
  });
}

// /api/pets/claim_guardian
async function handleClaimGuardian(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const existing = await env.DB.prepare(
    "SELECT 1 FROM user_pets WHERE telegram_id = ? AND pet_id = 'guardian'"
  ).bind(telegramId).first();
  if (existing) return jsonResponse({ error: "already_claimed" }, 409);
  const row = await env.DB.prepare(
    `SELECT u.lifetime_ads_watched, u.total_speed, u.capacity_hours, u.last_claim_at
     FROM users u
     WHERE u.telegram_id = ?`
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);
  if ((row.lifetime_ads_watched || 0) < GUARDIAN_ADS_THRESHOLD) {
    return jsonResponse({ error: "not_eligible", lifetime_ads_watched: row.lifetime_ads_watched || 0 }, 403);
  }
  const capacitySeconds = (row.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
  let preClaimAccrued = 0;
  if (row.last_claim_at) {
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(row.last_claim_at)) / 1000);
    preClaimAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((row.total_speed || 0) / 3600);
  }
  const nowIso = new Date().toISOString();
  // the new speed, the credit of the storage and its reset are one write, guarded on the values the credit was worked
  // out from, so a storage claim in between cannot pay the same storage twice; RETURNING gives the new values
  const storageSet = row.last_claim_at ? "last_claim_at = ?" : "capacity_hours = " + STORAGE_DEFAULT_CAPACITY_HOURS + ", last_claim_at = ?";
  const userStmt = env.DB.prepare(
    `UPDATE users SET total_speed = total_speed + ?, coins = coins + ?, ${storageSet}
     WHERE telegram_id = ? AND last_claim_at IS ? AND total_speed IS ? AND capacity_hours IS ?
     RETURNING total_speed, coins`
  ).bind(GUARDIAN_SPEED, preClaimAccrued, nowIso, telegramId, row.last_claim_at, row.total_speed, row.capacity_hours);
  // changes() is the row count of the write just before it in the batch; a pet already claimed fails the batch and
  // nothing in it is kept
  const insertPetStmt = env.DB.prepare(
    "INSERT INTO user_pets (telegram_id, pet_id, level, current_speed) SELECT ?, 'guardian', 1, ? WHERE changes() = 1"
  ).bind(telegramId, GUARDIAN_SPEED);
  let userResult;
  try {
    [userResult] = await env.DB.batch([userStmt, insertPetStmt]);
  } catch (e) {
    return jsonResponse({ error: "already_claimed" }, 409);
  }
  const updatedUser = userResult.results && userResult.results[0];
  if (!updatedUser) {
    return jsonResponse({ error: "storage_changed" }, 409);
  }
  return jsonResponse({
    pet_id: "guardian",
    level: 1,
    speed: GUARDIAN_SPEED,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins,
    storage_credited: preClaimAccrued
  });
}

// /api/pets/claim_ambassador
async function handleClaimAmbassador(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const existing = await env.DB.prepare(
    "SELECT 1 FROM user_pets WHERE telegram_id = ? AND pet_id = 'ambassador'"
  ).bind(telegramId).first();
  if (existing) return jsonResponse({ error: "already_claimed" }, 409);
  const grantRow = await env.DB.prepare(
    "SELECT speed, value_usd FROM ambassador_grants WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!grantRow) return jsonResponse({ error: "not_eligible" }, 403);
  const ambassadorSpeed = grantRow.speed;
  const storageRow = await env.DB.prepare(
    `SELECT u.total_speed, u.capacity_hours, u.last_claim_at
     FROM users u
     WHERE u.telegram_id = ?`
  ).bind(telegramId).first();
  if (!storageRow) return jsonResponse({ error: "user_not_found" }, 404);
  let preClaimAccrued = 0;
  if (storageRow.last_claim_at) {
    const capacitySeconds = (storageRow.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(storageRow.last_claim_at)) / 1000);
    preClaimAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((storageRow.total_speed || 0) / 3600);
  }
  const nowIso = new Date().toISOString();
  // the new speed, the credit of the storage and its reset are one write, guarded on the values the credit was worked
  // out from, so a storage claim in between cannot pay the same storage twice; RETURNING gives the new values
  const storageSet = storageRow.last_claim_at ? "last_claim_at = ?" : "capacity_hours = " + STORAGE_DEFAULT_CAPACITY_HOURS + ", last_claim_at = ?";
  const userStmt = env.DB.prepare(
    `UPDATE users SET total_speed = total_speed + ?, coins = coins + ?, ${storageSet}
     WHERE telegram_id = ? AND last_claim_at IS ? AND total_speed IS ? AND capacity_hours IS ?
     RETURNING total_speed, coins`
  ).bind(ambassadorSpeed, preClaimAccrued, nowIso, telegramId, storageRow.last_claim_at, storageRow.total_speed, storageRow.capacity_hours);
  // changes() is the row count of the write just before it in the batch; a pet already claimed fails the batch and
  // nothing in it is kept
  const insertPetStmt = env.DB.prepare(
    "INSERT INTO user_pets (telegram_id, pet_id, level, current_speed) SELECT ?, 'ambassador', 1, ? WHERE changes() = 1"
  ).bind(telegramId, ambassadorSpeed);
  let userResult;
  try {
    [userResult] = await env.DB.batch([userStmt, insertPetStmt]);
  } catch (e) {
    return jsonResponse({ error: "already_claimed" }, 409);
  }
  const updatedUser = userResult.results && userResult.results[0];
  if (!updatedUser) {
    return jsonResponse({ error: "storage_changed" }, 409);
  }
  return jsonResponse({
    pet_id: "ambassador",
    level: 1,
    speed: ambassadorSpeed,
    value: grantRow.value_usd,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins,
    storage_credited: preClaimAccrued
  });
}

// Admin panel auth
async function authenticateAdmin(request, env, preParsedBody) {
  const auth = await authenticateRequest(request, env, preParsedBody);
  if (!auth.ok) return auth;
  if (auth.telegramId !== ADMIN_TELEGRAM_ID) {
    return { ok: false, response: jsonResponse({ error: "forbidden" }, 403) };
  }
  return auth;
}

// /api/admin/user/find
async function handleAdminUserFind(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const targetId = parseInt(body.target_id, 10);
  if (!Number.isInteger(targetId)) return jsonResponse({ error: "invalid_target_id" }, 400);
  const [user, depositResult, withdrawResult] = await Promise.all([
    env.DB.prepare(
      "SELECT telegram_id, username, coins, gram, total_speed, invites_count, active_referrals_count, referral_deposit_commission_total, lifetime_ads_watched, created_at, device_id, banned_at, locked_coins FROM users WHERE telegram_id = ?"
    ).bind(targetId).first(),
    env.DB.prepare(
      "SELECT COALESCE(SUM(amount_gram), 0) AS total FROM deposits WHERE telegram_id = ? AND status = 'confirmed'"
    ).bind(targetId).first(),
    env.DB.prepare(
      "SELECT COALESCE(SUM(net_gram), 0) AS total FROM withdrawals WHERE telegram_id = ? AND status = 'approved'"
    ).bind(targetId).first()
  ]);
  if (!user) return jsonResponse({ error: "user_not_found" }, 404);
  let linked = [];
  if (user.device_id) {
    const linkedResult = await env.DB.prepare(
      "SELECT telegram_id, username, lifetime_ads_watched FROM users WHERE device_id = ? AND telegram_id <> ? ORDER BY telegram_id LIMIT 50"
    ).bind(user.device_id, targetId).all();
    linked = (linkedResult.results || []).map((r) => ({
      telegram_id: r.telegram_id,
      username: r.username,
      ads_watched: r.lifetime_ads_watched || 0
    }));
  }
  return jsonResponse({
    telegram_id: user.telegram_id,
    username: user.username,
    coins: user.coins,
    gram: user.gram,
    total_speed: user.total_speed,
    invites: user.invites_count || 0,
    active_invites: user.active_referrals_count || 0,
    referral_commission_total: user.referral_deposit_commission_total || 0,
    registered_date: user.created_at ? formatDateDDMMYYYY(user.created_at) : "—",
    ads_watched: user.lifetime_ads_watched || 0,
    total_deposit_gram: depositResult.total || 0,
    total_withdraw_gram: withdrawResult.total || 0,
    banned_date: user.banned_at ? formatDateDDMMYYYY(user.banned_at) : null,
    locked_coins: user.locked_coins || 0,
    linked_accounts: linked
  });
}

// /api/admin/user/ban — body.banned true bans, false unbans
async function handleAdminUserBan(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const targetId = parseInt(body.target_id, 10);
  if (!Number.isInteger(targetId)) return jsonResponse({ error: "invalid_target_id" }, 400);
  const ban = body.banned === true;
  // banning an already banned user keeps the first ban date
  const result = await env.DB.prepare(
    ban
      ? "UPDATE users SET banned_at = COALESCE(banned_at, ?) WHERE telegram_id = ?"
      : "UPDATE users SET banned_at = NULL WHERE telegram_id = ?"
  ).bind(...(ban ? [Date.now(), targetId] : [targetId])).run();
  if (!result.meta || result.meta.changes === 0) return jsonResponse({ error: "user_not_found" }, 404);
  return jsonResponse({ ok: true, banned: ban });
}

// /api/admin/user/ban_linked — the user and every account sharing its device_id
async function handleAdminUserBanLinked(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const targetId = parseInt(body.target_id, 10);
  if (!Number.isInteger(targetId)) return jsonResponse({ error: "invalid_target_id" }, 400);
  const result = await env.DB.prepare(
    `UPDATE users SET banned_at = ?
     WHERE banned_at IS NULL
       AND (telegram_id = ? OR device_id = (SELECT device_id FROM users WHERE telegram_id = ?))`
  ).bind(Date.now(), targetId, targetId).run();
  return jsonResponse({ ok: true, banned_count: (result.meta && result.meta.changes) || 0 });
}

// /api/admin/banned/list
async function handleAdminBannedList(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const result = await env.DB.prepare(
    "SELECT telegram_id, username, banned_at FROM users WHERE banned_at IS NOT NULL ORDER BY banned_at DESC LIMIT 200"
  ).all();
  return jsonResponse({
    banned: (result.results || []).map((r) => ({
      telegram_id: r.telegram_id,
      username: r.username,
      banned_date: formatDateDDMMYYYY(r.banned_at)
    }))
  });
}

// /api/admin/user/edit_balance
async function handleAdminEditBalance(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const targetId = parseInt(body.target_id, 10);
  if (!Number.isInteger(targetId)) return jsonResponse({ error: "invalid_target_id" }, 400);
  // body.coins is the exchangeable part and body.locked_coins the deposited part; users.coins stores their total,
  // so locked coins can never exceed the balance. Without locked_coins the current locked amount is kept.
  const freeCoins = Number(body.coins);
  const newGram = Number(body.gram);
  const lockedGiven = body.locked_coins !== undefined && body.locked_coins !== null && body.locked_coins !== "";
  const newLocked = lockedGiven ? Number(body.locked_coins) : null;
  if (!Number.isFinite(freeCoins) || freeCoins < 0 || !Number.isFinite(newGram) || newGram < 0 ||
      (lockedGiven && (!Number.isFinite(newLocked) || newLocked < 0))) {
    return jsonResponse({ error: "invalid_amount" }, 400);
  }
  const row = await env.DB.prepare("SELECT locked_coins FROM users WHERE telegram_id = ?").bind(targetId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);
  const locked = lockedGiven ? newLocked : (row.locked_coins || 0);
  await env.DB.prepare("UPDATE users SET coins = ?, locked_coins = ?, gram = ? WHERE telegram_id = ?")
    .bind(freeCoins + locked, locked, newGram, targetId).run();
  return jsonResponse({ ok: true, coins: freeCoins + locked, locked_coins: locked, gram: newGram });
}

// /api/admin/tasks/list
async function handleAdminTasksList(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const section = body.section === "special" ? "special" : "partner";
  const result = await env.DB.prepare(
    `SELECT id, title, description, icon_url, reward_coins, link, channel_id, max_claims, claims_count, display_order, pinned_at
     FROM admin_tasks WHERE section = ? AND is_active = 1
     ORDER BY (pinned_at IS NULL) ASC, pinned_at ASC, display_order ASC, id ASC`
  ).bind(section).all();
  return jsonResponse({ tasks: result.results || [] });
}

// /api/admin/tasks/save
async function handleAdminTasksSave(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const section = body.section === "special" ? "special" : "partner";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const link = typeof body.link === "string" ? body.link.trim() : "";
  const channelId = typeof body.channel_id === "string" && body.channel_id.trim() ? body.channel_id.trim() : null;
  const iconUrl = typeof body.icon_url === "string" && body.icon_url.trim() ? body.icon_url.trim() : null;
  const rewardCoins = parseInt(body.reward_coins, 10);
  const maxClaims = (body.max_claims === null || body.max_claims === "" || body.max_claims === undefined)
    ? null : parseInt(body.max_claims, 10);
  const displayOrder = Number.isInteger(parseInt(body.display_order, 10)) ? parseInt(body.display_order, 10) : 0;
  if (!title || !link || !Number.isInteger(rewardCoins) || rewardCoins <= 0) {
    return jsonResponse({ error: "invalid_task_data" }, 400);
  }
  if (maxClaims !== null && (!Number.isInteger(maxClaims) || maxClaims <= 0)) {
    return jsonResponse({ error: "invalid_max_claims" }, 400);
  }
  const id = parseInt(body.id, 10);
  if (Number.isInteger(id)) {
    const result = await env.DB.prepare(
      `UPDATE admin_tasks SET section = ?, title = ?, description = ?, icon_url = ?, reward_coins = ?, link = ?, channel_id = ?, max_claims = ?, display_order = ?
       WHERE id = ?`
    ).bind(section, title, description, iconUrl, rewardCoins, link, channelId, maxClaims, displayOrder, id).run();
    if (!result.meta || result.meta.changes === 0) return jsonResponse({ error: "task_not_found" }, 404);
    return jsonResponse({ ok: true, id });
  }
  const insertResult = await env.DB.prepare(
    `INSERT INTO admin_tasks (section, title, description, icon_url, reward_coins, link, channel_id, max_claims, claims_count, is_active, display_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?, ?)`
  ).bind(section, title, description, iconUrl, rewardCoins, link, channelId, maxClaims, displayOrder, Date.now()).run();
  return jsonResponse({ ok: true, id: insertResult.meta.last_row_id });
}

// /api/admin/tasks/delete
async function handleAdminTasksDelete(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const id = parseInt(body.id, 10);
  if (!Number.isInteger(id)) return jsonResponse({ error: "invalid_id" }, 400);
  const [deleteResult] = await env.DB.batch([
    env.DB.prepare("DELETE FROM admin_tasks WHERE id = ?").bind(id),
    env.DB.prepare("DELETE FROM admin_task_claims WHERE task_id = ?").bind(id)
  ]);
  if (!deleteResult.meta || deleteResult.meta.changes === 0) return jsonResponse({ error: "task_not_found" }, 404);
  return jsonResponse({ ok: true });
}

// /api/admin/tasks/pin
async function handleAdminTasksPin(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const id = parseInt(body.id, 10);
  if (!Number.isInteger(id)) return jsonResponse({ error: "invalid_id" }, 400);
  const pin = !!body.pin;
  const result = await env.DB.prepare(
    "UPDATE admin_tasks SET pinned_at = ? WHERE id = ?"
  ).bind(pin ? Date.now() : null, id).run();
  if (!result.meta || result.meta.changes === 0) return jsonResponse({ error: "task_not_found" }, 404);
  return jsonResponse({ ok: true, pinned: pin });
}

// /api/admin/promo/create
async function handleAdminPromoCreate(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  const reward = Number(body.reward);
  const currency = body.currency === "gram" ? "gram" : "coins";
  const maxUses = (body.max_uses === null || body.max_uses === "" || body.max_uses === undefined)
    ? null : parseInt(body.max_uses, 10);
  const expiresAt = typeof body.expires_at === "string" && body.expires_at.trim() ? body.expires_at.trim() : null;
  if (!code || !Number.isFinite(reward) || reward <= 0) {
    return jsonResponse({ error: "invalid_promo_data" }, 400);
  }
  if (maxUses !== null && (!Number.isInteger(maxUses) || maxUses <= 0)) {
    return jsonResponse({ error: "invalid_max_uses" }, 400);
  }
  try {
    await env.DB.prepare(
      "INSERT INTO promo_codes (code, reward, currency, max_uses, uses_count, expires_at) VALUES (?, ?, ?, ?, 0, ?)"
    ).bind(code, reward, currency, maxUses, expiresAt).run();
  } catch (e) {
    return jsonResponse({ error: "code_exists" }, 409);
  }
  return jsonResponse({ ok: true, code });
}

// /api/admin/promo/list
async function handleAdminPromoList(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const result = await env.DB.prepare(
    "SELECT code, reward, currency, max_uses, uses_count, expires_at FROM promo_codes ORDER BY code ASC"
  ).all();
  return jsonResponse({ codes: result.results || [] });
}

// /api/admin/promo/delete — removes only the code's own row (one write). Its redemption records stay: they are
// read only for this code, so they cost nothing, and if the same code is created again, users who already used it
// still cannot use it twice. Rewards already given stay with the users
async function handleAdminPromoDelete(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  if (!code) return jsonResponse({ error: "missing_code" }, 400);
  const result = await env.DB.prepare("DELETE FROM promo_codes WHERE code = ?").bind(code).run();
  if (!result.meta || result.meta.changes === 0) return jsonResponse({ error: "not_found" }, 404);
  return jsonResponse({ ok: true });
}

// /api/admin/ambassador/grant
async function handleAdminAmbassadorGrant(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const targetId = parseInt(body.target_id, 10);
  const speed = parseInt(body.speed, 10);
  const valueGiven = body.value !== undefined && body.value !== null && String(body.value).trim() !== "";
  const value = valueGiven ? Number(body.value) : null;
  if (!Number.isInteger(targetId)) return jsonResponse({ error: "invalid_target_id" }, 400);
  if (!Number.isInteger(speed) || speed <= 0) return jsonResponse({ error: "invalid_speed" }, 400);
  if (valueGiven && (!Number.isFinite(value) || value < 0)) return jsonResponse({ error: "invalid_value" }, 400);
  const upsertGrantStmt = env.DB.prepare(
    `INSERT INTO ambassador_grants (telegram_id, speed, granted_at, value_usd) VALUES (?, ?, ?, ?)
     ON CONFLICT(telegram_id) DO UPDATE SET speed = excluded.speed, value_usd = COALESCE(excluded.value_usd, ambassador_grants.value_usd)`
  ).bind(targetId, speed, Date.now(), value);
  const petRow = await env.DB.prepare(
    `SELECT p.current_speed, u.total_speed, u.capacity_hours, u.last_claim_at
     FROM user_pets p
     JOIN users u ON u.telegram_id = p.telegram_id
     WHERE p.telegram_id = ? AND p.pet_id = 'ambassador'`
  ).bind(targetId).first();
  if (!petRow) {
    const userExists = await env.DB.prepare("SELECT 1 FROM users WHERE telegram_id = ?").bind(targetId).first();
    if (!userExists) return jsonResponse({ error: "user_not_found" }, 404);
    await upsertGrantStmt.run();
    return jsonResponse({ ok: true, mode: "pending", speed });
  }
  if (speed === petRow.current_speed) {
    await upsertGrantStmt.run();
    return jsonResponse({ ok: true, mode: "updated", speed });
  }
  const speedDelta = speed - petRow.current_speed;
  const capacitySeconds = (petRow.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
  let preChangeAccrued = 0;
  if (petRow.last_claim_at) {
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(petRow.last_claim_at)) / 1000);
    preChangeAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((petRow.total_speed || 0) / 3600);
  }
  const nowIso = new Date().toISOString();
  // the new speed, the credit of the storage and its reset are one write, guarded on the values the credit was worked
  // out from; the pet and the grant change only when it went through (changes() chains each to the write before it)
  const [userResult] = await env.DB.batch([
    env.DB.prepare(
      `UPDATE users SET total_speed = total_speed + ?, coins = coins + ?, last_claim_at = CASE WHEN last_claim_at IS NULL THEN NULL ELSE ? END
       WHERE telegram_id = ? AND last_claim_at IS ? AND total_speed IS ? AND capacity_hours IS ?`
    ).bind(speedDelta, preChangeAccrued, nowIso, targetId, petRow.last_claim_at, petRow.total_speed, petRow.capacity_hours),
    env.DB.prepare("UPDATE user_pets SET current_speed = ? WHERE telegram_id = ? AND pet_id = 'ambassador' AND changes() = 1").bind(speed, targetId),
    env.DB.prepare(
      `INSERT INTO ambassador_grants (telegram_id, speed, granted_at, value_usd) SELECT ?, ?, ?, ? WHERE changes() = 1
       ON CONFLICT(telegram_id) DO UPDATE SET speed = excluded.speed, value_usd = COALESCE(excluded.value_usd, ambassador_grants.value_usd)`
    ).bind(targetId, speed, Date.now(), value)
  ]);
  if (!userResult.meta || userResult.meta.changes === 0) {
    return jsonResponse({ error: "storage_changed" }, 409);
  }
  return jsonResponse({ ok: true, mode: "updated", speed });
}

// /api/admin/ambassador/revoke
async function handleAdminAmbassadorRevoke(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const targetId = parseInt(body.target_id, 10);
  if (!Number.isInteger(targetId)) return jsonResponse({ error: "invalid_target_id" }, 400);
  const grantRow = await env.DB.prepare("SELECT 1 FROM ambassador_grants WHERE telegram_id = ?").bind(targetId).first();
  const petRow = await env.DB.prepare(
    `SELECT p.current_speed, u.total_speed, u.capacity_hours, u.last_claim_at
     FROM user_pets p
     JOIN users u ON u.telegram_id = p.telegram_id
     WHERE p.telegram_id = ? AND p.pet_id = 'ambassador'`
  ).bind(targetId).first();
  if (!grantRow && !petRow) return jsonResponse({ error: "not_found" }, 404);
  if (!petRow) {
    await env.DB.prepare("DELETE FROM ambassador_grants WHERE telegram_id = ?").bind(targetId).run();
    return jsonResponse({ ok: true, mode: "pending_removed" });
  }
  const capacitySeconds = (petRow.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
  let preRevokeAccrued = 0;
  if (petRow.last_claim_at) {
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(petRow.last_claim_at)) / 1000);
    preRevokeAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((petRow.total_speed || 0) / 3600);
  }
  const nowIso = new Date().toISOString();
  // the speed removal, the credit of the storage and its reset are one write, guarded on the values the credit was
  // worked out from; the pet and the grant are removed only when it went through (changes() chains each to the write
  // before it)
  const stmts = [
    env.DB.prepare(
      `UPDATE users SET total_speed = total_speed - ?, coins = coins + ?, last_claim_at = CASE WHEN last_claim_at IS NULL THEN NULL ELSE ? END
       WHERE telegram_id = ? AND last_claim_at IS ? AND total_speed IS ? AND capacity_hours IS ?`
    ).bind(petRow.current_speed, preRevokeAccrued, nowIso, targetId, petRow.last_claim_at, petRow.total_speed, petRow.capacity_hours),
    env.DB.prepare("DELETE FROM user_pets WHERE telegram_id = ? AND pet_id = 'ambassador' AND changes() = 1").bind(targetId)
  ];
  if (grantRow) {
    stmts.push(env.DB.prepare("DELETE FROM ambassador_grants WHERE telegram_id = ? AND changes() = 1").bind(targetId));
  }
  const [userResult] = await env.DB.batch(stmts);
  if (!userResult.meta || userResult.meta.changes === 0) {
    return jsonResponse({ error: "storage_changed" }, 409);
  }
  return jsonResponse({ ok: true, mode: "removed" });
}

// /api/admin/ambassador/list
async function handleAdminAmbassadorList(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateAdmin(request, env, body);
  if (!auth.ok) return auth.response;
  const result = await env.DB.prepare(
    `SELECT u.telegram_id AS telegram_id, u.username AS username, COALESCE(p.current_speed, g.speed) AS speed, g.value_usd AS value,
            CASE WHEN p.telegram_id IS NULL THEN 'pending' ELSE 'claimed' END AS status
     FROM ambassador_grants g
     JOIN users u ON u.telegram_id = g.telegram_id
     LEFT JOIN user_pets p ON p.telegram_id = g.telegram_id AND p.pet_id = 'ambassador'
     UNION ALL
     SELECT u.telegram_id AS telegram_id, u.username AS username, p.current_speed AS speed, NULL AS value, 'claimed' AS status
     FROM user_pets p JOIN users u ON u.telegram_id = p.telegram_id
     WHERE p.pet_id = 'ambassador' AND NOT EXISTS (SELECT 1 FROM ambassador_grants g WHERE g.telegram_id = p.telegram_id)
     ORDER BY status ASC, telegram_id ASC`
  ).all();
  return jsonResponse({ ambassadors: result.results || [] });
}

// /api/leaderboard
// Ties keep a fixed order (telegram_id) in the board and in the payout alike. The index on each weekly
// counter is stored as (counter DESC, rowid ASC), so this order still reads only the top rows.
const LEADERBOARD_ADS_SQL =
  `SELECT telegram_id, username, photo_url, weekly_ads_watched AS val
   FROM users WHERE weekly_ads_watched > 0
   ORDER BY weekly_ads_watched DESC, telegram_id ASC LIMIT ?`;
const LEADERBOARD_REFS_SQL =
  `SELECT telegram_id, username, photo_url, weekly_active_referrals AS val
   FROM users WHERE weekly_active_referrals > 0
   ORDER BY weekly_active_referrals DESC, telegram_id ASC LIMIT ?`;
function shapeLeaderboardRows(rows) {
  return (rows.results || []).map((r, i) => ({
    rank: i + 1,
    name: r.username || ("Player " + r.telegram_id),
    photo_url: r.photo_url || null,
    value: r.val,
    prize: LEADERBOARD_PRIZES[i] || 0
  }));
}
// When the board and the previous winners stop being current: at the next payout (or midnight for the
// daily board). Until this week's payout has actually run, both stay short-lived so nobody keeps old data.
// A week counts as paid by its week_key, so a payout that ran earlier in the same ISO week also counts.
async function leaderboardTiming(env) {
  const last = await env.DB.prepare(
    "SELECT week_key, paid_at, winners FROM leaderboard_payouts ORDER BY paid_at DESC LIMIT 1"
  ).first();
  const now = Date.now();
  const scheduled = lastScheduledLeaderboardPayoutAt(now);
  const pending = (!last || last.week_key !== isoWeekKeyUTC(scheduled)) && now - scheduled < 24 * 3600 * 1000;
  return { last, pending, nextPayoutAt: pending ? scheduled : scheduled + 7 * 24 * 3600 * 1000 };
}
async function handleLeaderboard(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const cache = caches.default;
  const cacheKey = new Request("https://internal.minerxrealm/leaderboard-cache");
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const [adsResult, refsResult, timing] = await Promise.all([
    env.DB.prepare(LEADERBOARD_ADS_SQL).bind(LEADERBOARD_RANK_LIMIT).all(),
    env.DB.prepare(LEADERBOARD_REFS_SQL).bind(LEADERBOARD_RANK_LIMIT).all(),
    leaderboardTiming(env)
  ]);
  const payload = {
    ads: shapeLeaderboardRows(adsResult),
    referrals: shapeLeaderboardRows(refsResult),
    next_payout_at: timing.nextPayoutAt
  };
  const response = jsonResponse(payload);
  // daily refresh at 00:00 UTC, and never kept past the payout
  const untilPayout = Math.floor((timing.nextPayoutAt - Date.now()) / 1000);
  const maxAge = timing.pending ? 60 : Math.max(60, Math.min(secondsUntilNextMidnightUTC(), untilPayout));
  response.headers.set("Cache-Control", "public, max-age=" + maxAge);
  await cache.put(cacheKey, response.clone());
  return response;
}

// /api/leaderboard/previous — last week's winners as saved by the payout; they change once a week
async function handleLeaderboardPrevious(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const cache = caches.default;
  const cacheKey = new Request("https://internal.minerxrealm/leaderboard-previous-cache");
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const timing = await leaderboardTiming(env);
  let winners = null;
  try {
    winners = timing.last && timing.last.winners ? JSON.parse(timing.last.winners) : null;
  } catch (e) {   }
  const response = jsonResponse({
    paid_at: winners && timing.last ? timing.last.paid_at : null,
    ads: (winners && winners.ads) || [],
    referrals: (winners && winners.referrals) || [],
    next_payout_at: timing.nextPayoutAt
  });
  const untilPayout = Math.floor((timing.nextPayoutAt - Date.now()) / 1000);
  response.headers.set("Cache-Control", "public, max-age=" + (timing.pending ? 60 : Math.max(60, untilPayout)));
  await cache.put(cacheKey, response.clone());
  return response;
}

// Weekly Leaderboard payout (cron)
async function handleLeaderboardPayout(env) {
  const weekKey = isoWeekKeyUTC();
  const [adsResult, refsResult] = await Promise.all([
    env.DB.prepare(LEADERBOARD_ADS_SQL).bind(LEADERBOARD_RANK_LIMIT).all(),
    env.DB.prepare(LEADERBOARD_REFS_SQL).bind(LEADERBOARD_RANK_LIMIT).all()
  ]);
  // the paid ranks are kept with the payout and shown as Previous Winners until the next one
  const prizeWinners = (rows) => shapeLeaderboardRows(rows).filter((w) => w.prize > 0);
  const winners = JSON.stringify({ ads: prizeWinners(adsResult), referrals: prizeWinners(refsResult) });
  const stmts = [
    env.DB.prepare("INSERT INTO leaderboard_payouts (week_key, paid_at, winners) VALUES (?, ?, ?)")
      .bind(weekKey, Date.now(), winners)
  ];
  const creditWinners = (rows) => {
    (rows.results || []).forEach((r, i) => {
      const prize = LEADERBOARD_PRIZES[i] || 0;
      if (prize <= 0) return;
      stmts.push(env.DB.prepare("UPDATE users SET coins = coins + ? WHERE telegram_id = ?").bind(prize, r.telegram_id));
    });
  };
  creditWinners(adsResult);
  creditWinners(refsResult);
  stmts.push(env.DB.prepare(
    "UPDATE users SET weekly_ads_watched = 0, weekly_active_referrals = 0 WHERE weekly_ads_watched != 0 OR weekly_active_referrals != 0"
  ));
  try {
    await env.DB.batch(stmts);
  } catch (e) {
    console.error("leaderboard payout skipped/failed:", e?.message || e);
    return;
  }
  await caches.default.delete(new Request("https://internal.minerxrealm/leaderboard-cache"));
  await caches.default.delete(new Request("https://internal.minerxrealm/leaderboard-previous-cache"));
}

// Bonus AD Every 1H
async function handleBonusAdReward(telegramId, env) {
  const row = await env.DB.prepare(
    "SELECT bonus_ad_count_today, bonus_ad_date, bonus_ad_last_watched_at FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) {
    return new Response("user not found", { status: 404 });
  }
  const today = todayUTC();
  const countToday = row.bonus_ad_date === today ? (row.bonus_ad_count_today || 0) : 0;
  if (countToday >= BONUS_AD_DAILY_LIMIT) {
    return new Response("limit reached", { status: 200 });
  }
  const now = Date.now();
  const oldLastWatchedAt = row.bonus_ad_last_watched_at || null;
  if (oldLastWatchedAt && (now - oldLastWatchedAt) < BONUS_AD_COOLDOWN_MS) {
    return new Response("cooldown active", { status: 200 });
  }
  const newCount = countToday + 1;
  // reward and ad counters in one write; RETURNING gives the new lifetime count without a second read
  const updated = await env.DB.prepare(
    `UPDATE users SET coins = coins + ?, bonus_ad_count_today = ?, bonus_ad_date = ?, bonus_ad_last_watched_at = ?, lifetime_ads_watched = COALESCE(lifetime_ads_watched, 0) + 1, weekly_ads_watched = weekly_ads_watched + 1, ${ADS_TODAY_PLUS_ONE}
     WHERE telegram_id = ?
       AND (bonus_ad_last_watched_at IS NULL OR bonus_ad_last_watched_at = ?)
       AND (bonus_ad_date IS NULL OR bonus_ad_date <> ? OR bonus_ad_count_today = ?)
     RETURNING lifetime_ads_watched, referred_by`
  ).bind(BONUS_AD_REWARD_COINS, newCount, today, now, telegramId, oldLastWatchedAt, today, countToday).first();
  if (updated) {
    await activateReferralOnLifetimeAds(env, telegramId, updated.referred_by, updated.lifetime_ads_watched);
  }
  return new Response("OK", { status: 200 });
}

// /api/gigapub/postback
async function handleGigapubPostback(url, env) {
  const secret = url.searchParams.get("secret");
  if (!env.GIGAPUB_POSTBACK_SECRET || secret !== env.GIGAPUB_POSTBACK_SECRET) {
    return new Response("forbidden", { status: 403 });
  }
  const telegramId = parseInt(url.searchParams.get("uid"), 10);
  if (!Number.isFinite(telegramId)) {
    return new Response("bad request", { status: 200 });
  }
  if (url.searchParams.get("tag") === "gate") {
    await bumpLifetimeAdsWatched(env, telegramId);
    return new Response("OK", { status: 200 });
  }
  const row = await env.DB.prepare(
    "SELECT gigapub_task_count, gigapub_task_date FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) {
    return new Response("user not found", { status: 200 });
  }
  const today = todayUTC();
  const countToday = row.gigapub_task_date === today ? (row.gigapub_task_count || 0) : 0;
  if (countToday >= GIGAPUB_DAILY_LIMIT) {
    return new Response("limit reached", { status: 200 });
  }
  const newCount = countToday + 1;
  // reward and ad counters in one write; RETURNING gives the new lifetime count without a second read
  const updated = await env.DB.prepare(
    `UPDATE users SET coins = coins + ?, gigapub_task_count = ?, gigapub_task_date = ?, lifetime_ads_watched = COALESCE(lifetime_ads_watched, 0) + 1, weekly_ads_watched = weekly_ads_watched + 1, ${ADS_TODAY_PLUS_ONE}
     WHERE telegram_id = ? AND (gigapub_task_date IS NULL OR gigapub_task_date <> ? OR gigapub_task_count = ?)
     RETURNING lifetime_ads_watched, referred_by`
  ).bind(GIGAPUB_REWARD_COINS, newCount, today, telegramId, today, countToday).first();
  if (updated) {
    await activateReferralOnLifetimeAds(env, telegramId, updated.referred_by, updated.lifetime_ads_watched);
  }
  return new Response("OK", { status: 200 });
}

// /api/ads/client-rewards — Monetix and OnClicka have no postback, so the app reports their ads itself:
// it shows the reward at once and sends the counts here in one request a minute after the last ad
const CLIENT_AD_NETWORKS = {
  monetix: { countCol: "monetix_task_count", dateCol: "monetix_task_date", limit: MONETIX_DAILY_LIMIT, reward: MONETIX_REWARD_COINS },
  onclicka: { countCol: "onclicka_task_count", dateCol: "onclicka_task_date", limit: ONCLICKA_DAILY_LIMIT, reward: ONCLICKA_REWARD_COINS }
};
async function handleClientAdRewards(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateRequest(request, env, body);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const networks = Object.keys(CLIENT_AD_NETWORKS);
  const today = todayUTC();
  // a lost compare-and-set (another request changed a count in between) is retried with fresh counts
  for (let attempt = 0; attempt < 3; attempt++) {
    const row = await env.DB.prepare(
      `SELECT coins, ${networks.map((n) => CLIENT_AD_NETWORKS[n].countCol + ", " + CLIENT_AD_NETWORKS[n].dateCol).join(", ")}
       FROM users WHERE telegram_id = ?`
    ).bind(telegramId).first();
    if (!row) return jsonResponse({ error: "user_not_found" }, 404);
    const sets = [];
    const setArgs = [];
    const guards = [];
    const guardArgs = [];
    const result = { credited: {} };
    let coinsAdded = 0;
    let adsAdded = 0;
    for (const n of networks) {
      const cfg = CLIENT_AD_NETWORKS[n];
      const requested = Math.max(0, Math.min(cfg.limit, parseInt(body[n], 10) || 0));
      const countToday = row[cfg.dateCol] === today ? (row[cfg.countCol] || 0) : 0;
      const credit = Math.min(requested, cfg.limit - countToday);
      result.credited[n] = credit;
      result[n] = { watched_today: countToday + credit, daily_limit: cfg.limit, reward_coins: cfg.reward };
      if (credit <= 0) continue;
      sets.push(`${cfg.countCol} = ?`, `${cfg.dateCol} = ?`);
      setArgs.push(countToday + credit, today);
      guards.push(`(${cfg.dateCol} IS NULL OR ${cfg.dateCol} <> ? OR ${cfg.countCol} = ?)`);
      guardArgs.push(today, countToday);
      coinsAdded += credit * cfg.reward;
      adsAdded += credit;
    }
    if (adsAdded === 0) {
      result.coins = row.coins;
      return jsonResponse(result);
    }
    // rewards and every ad counter in one write; RETURNING gives the new totals without a second read
    const updated = await env.DB.prepare(
      `UPDATE users SET coins = coins + ?, ${sets.join(", ")}, lifetime_ads_watched = COALESCE(lifetime_ads_watched, 0) + ?, weekly_ads_watched = weekly_ads_watched + ?,
         ads_today = CASE WHEN ads_today_date = date('now') THEN ads_today + ? ELSE ? END, ads_today_date = date('now')
       WHERE telegram_id = ? AND ${guards.join(" AND ")}
       RETURNING coins, lifetime_ads_watched, referred_by`
    ).bind(coinsAdded, ...setArgs, adsAdded, adsAdded, adsAdded, adsAdded, telegramId, ...guardArgs).first();
    if (!updated) continue;
    await activateReferralOnLifetimeAds(env, telegramId, updated.referred_by, updated.lifetime_ads_watched);
    result.coins = updated.coins;
    return jsonResponse(result);
  }
  return jsonResponse({ error: "busy" }, 409);
}

// A Monetix/OnClicka ad shown before a gated action comes as gate_ad: true on the action's own request and is
// counted only when the action succeeds, so each count is tied to an action that has its own daily limit
async function withGateAd(request, env, handler) {
  let gateAd = false;
  let initData = null;
  try {
    const body = await request.clone().json();
    gateAd = body.gate_ad === true;
    initData = body.initData;
  } catch (e) {   }
  const response = await handler(request, env);
  if (!gateAd || !response.ok) return response;
  let data = null;
  try {
    data = await response.clone().json();
  } catch (e) {   }
  if (!data || data.error) return response;
  // the handler already validated this initData, so the id can be read from it directly
  let telegramId = null;
  try {
    telegramId = JSON.parse(new URLSearchParams(initData).get("user")).id;
  } catch (e) {   }
  if (Number.isInteger(telegramId)) await bumpLifetimeAdsWatched(env, telegramId);
  return response;
}

// /api/profile
async function handleProfile(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId, rawUsername, firstName, lastName } = auth;
  const [user, depositResult, withdrawResult] = await Promise.all([
    env.DB.prepare(
      "SELECT coins, gram, total_speed, invites_count, active_referrals_count, referral_deposit_commission_total, lifetime_ads_watched, created_at FROM users WHERE telegram_id = ?"
    ).bind(telegramId).first(),
    env.DB.prepare(
      "SELECT COALESCE(SUM(amount_gram), 0) AS total FROM deposits WHERE telegram_id = ? AND status = 'confirmed'"
    ).bind(telegramId).first(),
    env.DB.prepare(
      "SELECT COALESCE(SUM(net_gram), 0) AS total FROM withdrawals WHERE telegram_id = ? AND status = 'approved'"
    ).bind(telegramId).first()
  ]);
  if (!user) {
    return jsonResponse({ error: "user_not_found" }, 404);
  }
  return jsonResponse({
    telegram_id: telegramId,
    display_name: [firstName, lastName].filter(Boolean).join(" ") || "Player",
    username: rawUsername,
    registered_date: user.created_at ? formatDateDDMMYYYY(user.created_at) : "—",
    ads_watched: user.lifetime_ads_watched || 0,
    invites: user.invites_count || 0,
    active_invites: user.active_referrals_count || 0,
    referral_commission_total: user.referral_deposit_commission_total || 0,
    coins: user.coins,
    gram: user.gram,
    total_speed: user.total_speed,
    total_deposit_gram: depositResult.total || 0,
    total_withdraw_gram: withdrawResult.total || 0
  });
}

// /api/friends/claim_earnings
async function handleFriendsClaimEarnings(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const row = await env.DB.prepare(
    "SELECT referral_pending_earnings FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);
  const pending = row.referral_pending_earnings || 0;
  if (pending < REFERRAL_MIN_CLAIM_COINS) {
    return jsonResponse({ error: "below_minimum", minimum: REFERRAL_MIN_CLAIM_COINS, pending }, 400);
  }
  const updated = await env.DB.prepare(
    `UPDATE users SET coins = coins + ?, referral_pending_earnings = referral_pending_earnings - ?
     WHERE telegram_id = ? AND referral_pending_earnings = ?
     RETURNING coins`
  ).bind(pending, pending, telegramId, pending).first();
  if (!updated) {
    return jsonResponse({ error: "try_again" }, 409);
  }
  return jsonResponse({ claimed: pending, coins: updated.coins });
}

// /api/friends/claim_milestone
async function handleFriendsClaimMilestone(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateRequest(request, env, body);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const tier = Number(body.tier);
  const milestone = FRIEND_MILESTONES.find((m) => m.friends === tier);
  if (!milestone) {
    return jsonResponse({ error: "invalid_tier" }, 400);
  }
  // the column name comes from the fixed list above, never from the request
  const column = `milestone_${milestone.friends}_claimed`;
  const user = await env.DB.prepare(
    `UPDATE users SET coins = coins + ?, ${column} = 1
     WHERE telegram_id = ? AND active_referrals_count >= ? AND ${column} = 0
     RETURNING coins`
  ).bind(milestone.reward, telegramId, milestone.friends).first();
  if (!user) {
    return jsonResponse({ error: "not_eligible" }, 400);
  }
  return jsonResponse({ reward: milestone.reward, coins: user.coins });
}

// /api/friends/milestones
async function handleFriendsMilestones(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  // one row read: the user's claimed flags; the missions themselves are the fixed list above
  const user = await env.DB.prepare(
    "SELECT milestone_10_claimed, milestone_25_claimed, milestone_50_claimed, milestone_100_claimed FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!user) return jsonResponse({ error: "user_not_found" }, 404);
  const milestones = FRIEND_MILESTONES.map((m) => ({
    count: m.friends,
    reward: m.reward,
    claimed: !!user[`milestone_${m.friends}_claimed`]
  }));
  return jsonResponse({ milestones });
}

// /api/friends/list
async function handleFriendsList(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateRequest(request, env, body);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const page = Math.max(0, parseInt(body.page, 10) || 0);
  const offset = page * 10;
  const result = await env.DB.prepare(
    `SELECT u.telegram_id, u.username, u.lifetime_ads_watched, r.earned_coins, r.is_active
     FROM referrals r
     JOIN users u ON u.telegram_id = r.referred_id
     WHERE r.referrer_id = ?
     ORDER BY r.is_active DESC, r.invited_at DESC
     LIMIT 11 OFFSET ?`
  ).bind(telegramId, offset).all();
  const rows = result.results || [];
  const hasMore = rows.length > 10;
  const friends = rows.slice(0, 10).map((r) => ({
    name: r.username || ("User " + r.telegram_id),
    // lifetime_ads_watched counts every ad network, the Bonus Ad and the ad gates
    ads_watched: r.lifetime_ads_watched || 0,
    earned_coins: r.earned_coins || 0,
    active: !!r.is_active
  }));
  return jsonResponse({ friends, has_more: hasMore });
}

// Check-in verification helpers
function telegramApiUrl(env, method, params) {
  const url = new URL(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}
function verifyNameContainsBotMention(auth) {
  const fullName = `${auth.firstName || ""} ${auth.lastName || ""}`.toLowerCase();
  return fullName.includes("@minerxrealmbot") || fullName.includes("minerxrealmbot");
}
async function verifyBioContainsReferralLink(env, telegramId) {
  try {
    const res = await fetch(telegramApiUrl(env, "getChat", { chat_id: telegramId }));
    const data = await res.json();
    const bio = data?.result?.bio || "";
    return bio.includes(`ref_${telegramId}`);
  } catch (e) {
    console.error("getChat bio check failed:", e?.message || e);
    return false;
  }
}

// /api/checkin/claim
async function handleCheckinClaim(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateRequest(request, env, body);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const task = Number(body.task);
  const reward = CHECKIN_TASK_REWARDS[task];
  if (!reward) {
    return jsonResponse({ error: "invalid_task" }, 400);
  }
  const column = `checkin${task}_claimed_date`;
  if (task === 3 && !verifyNameContainsBotMention(auth)) {
    return jsonResponse({ error: "not_verified" }, 400);
  }
  if (task === 4 && !(await verifyBioContainsReferralLink(env, telegramId))) {
    return jsonResponse({ error: "not_verified" }, 400);
  }
  if (task === 5 && !(await checkChannelMembership(env, CHECKIN_PARTNER_CHANNEL, telegramId))) {
    return jsonResponse({ error: "not_verified" }, 400);
  }
  const today = todayUTC();
  const user = await env.DB.prepare(
    `UPDATE users SET coins = coins + ?, ${column} = ?
     WHERE telegram_id = ? AND (${column} IS NULL OR ${column} <> ?)
     RETURNING coins`
  ).bind(reward, today, telegramId, today).first();
  if (!user) {
    return jsonResponse({ error: "already_claimed_today" }, 409);
  }
  return jsonResponse({ reward, coins: user.coins });
}

// /api/tasks/list
async function handleTasksList(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateRequest(request, env, body);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const section = body.section === "special" ? "special" : "partner";
  const result = await env.DB.prepare(
    `SELECT t.id, t.title, t.description, t.icon_url, t.reward_coins, t.link, t.channel_id
     FROM admin_tasks t
     LEFT JOIN admin_task_claims c ON c.task_id = t.id AND c.telegram_id = ?
     WHERE t.section = ? AND t.is_active = 1 AND (t.max_claims IS NULL OR t.claims_count < t.max_claims)
       AND c.telegram_id IS NULL
     ORDER BY (t.pinned_at IS NULL) ASC, t.pinned_at ASC, t.display_order ASC, t.id ASC`
  ).bind(telegramId, section).all();
  const tasks = (result.results || []).map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description || "",
    icon_url: t.icon_url,
    reward: t.reward_coins,
    link: t.link,
    requires_membership: !!t.channel_id
  }));
  return jsonResponse({ tasks });
}

// /api/tasks/claim
async function handleTasksClaim(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateRequest(request, env, body);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const taskId = Number(body.task_id);
  const task = await env.DB.prepare(
    "SELECT id, reward_coins, channel_id, max_claims, claims_count FROM admin_tasks WHERE id = ? AND is_active = 1"
  ).bind(taskId).first();
  if (!task) {
    return jsonResponse({ error: "invalid_task" }, 400);
  }
  if (task.channel_id) {
    const isMember = await checkChannelMembership(env, task.channel_id, telegramId);
    if (!isMember) {
      return jsonResponse({ error: "not_member" }, 400);
    }
  }
  // one batch: the claim row only while the task has room, then the counter and the reward, each only when the
  // write before it went through (changes() is the row count of the statement just before it)
  const [, , rewardResult] = await env.DB.batch([
    env.DB.prepare(
      `INSERT OR IGNORE INTO admin_task_claims (telegram_id, task_id, claimed_at)
       SELECT ?, ?, ? WHERE EXISTS (SELECT 1 FROM admin_tasks WHERE id = ? AND (max_claims IS NULL OR claims_count < max_claims))`
    ).bind(telegramId, taskId, Date.now(), taskId),
    env.DB.prepare("UPDATE admin_tasks SET claims_count = claims_count + 1 WHERE id = ? AND changes() = 1").bind(taskId),
    env.DB.prepare("UPDATE users SET coins = coins + ? WHERE telegram_id = ? AND changes() = 1 RETURNING coins").bind(task.reward_coins, telegramId)
  ]);
  const user = rewardResult.results && rewardResult.results[0];
  if (!user) {
    const claimed = await env.DB.prepare(
      "SELECT 1 FROM admin_task_claims WHERE telegram_id = ? AND task_id = ?"
    ).bind(telegramId, taskId).first();
    return claimed ? jsonResponse({ error: "already_claimed" }, 409) : jsonResponse({ error: "task_full" }, 400);
  }
  return jsonResponse({ reward: task.reward_coins, coins: user.coins });
}
async function checkChannelMembership(env, channelId, telegramId) {
  try {
    const res = await fetch(telegramApiUrl(env, "getChatMember", { chat_id: channelId, user_id: telegramId }));
    const data = await res.json();
    const status = data?.result?.status;
    return status === "member" || status === "administrator" || status === "creator";
  } catch (e) {
    console.error("getChatMember check failed:", e?.message || e);
    return false;
  }
}

// Daily Combo generation (cron)
async function generateDailyCombo(env) {
  const today = todayUTC();
  const order = shuffleArray(COMBO_CARDS.slice());
  await env.DB.prepare(
    "INSERT OR REPLACE INTO daily_combo (date, card_order) VALUES (?, ?)"
  ).bind(today, order.join(",")).run();
  const now = new Date();
  const dateLabel = `${now.getUTCDate()}/${now.getUTCMonth() + 1}`;
  const labels = order.map((c) => COMBO_CARD_LABELS[c]).join(" , ");
  try {
    await sendMessage(env, ADMIN_TELEGRAM_ID, {
      text: `(${dateLabel}) Today Combo :\n${labels}`
    });
  } catch (e) {
    console.error("daily combo admin notify failed:", e?.message || e);
  }
}
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// /api/combo/check
async function handleComboCheck(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const auth = await authenticateRequest(request, env, body);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const guess = Array.isArray(body.order) ? body.order.map(String) : [];
  const isValidGuess =
    guess.length === COMBO_CARDS.length &&
    COMBO_CARDS.every((c) => guess.includes(c)) &&
    new Set(guess).size === COMBO_CARDS.length;
  if (!isValidGuess) {
    return jsonResponse({ error: "invalid_order" }, 400);
  }
  const today = todayUTC();
  // both reads at once
  const [combo, comboRow] = await Promise.all([
    env.DB.prepare("SELECT card_order FROM daily_combo WHERE date = ?").bind(today).first(),
    env.DB.prepare(
      "SELECT combo_date, combo_attempts_used, combo_solved FROM users WHERE telegram_id = ?"
    ).bind(telegramId).first()
  ]);
  if (!combo) {
    return jsonResponse({ error: "combo_not_ready" }, 409);
  }
  if (!comboRow) return jsonResponse({ error: "user_not_found" }, 404);
  const isToday = comboRow.combo_date === today;
  const attemptsUsed = isToday ? (comboRow.combo_attempts_used || 0) : 0;
  if (isToday && comboRow.combo_solved) {
    return jsonResponse({ error: "already_solved" }, 409);
  }
  if (attemptsUsed >= COMBO_MAX_ATTEMPTS) {
    return jsonResponse({ error: "no_attempts_left" }, 409);
  }
  const isCorrect = guess.join(",") === combo.card_order;
  const user = await env.DB.prepare(
    `UPDATE users SET combo_date = ?, combo_attempts_used = ?, combo_solved = ?, coins = coins + ?
     WHERE telegram_id = ? AND combo_date IS ? AND combo_attempts_used IS ? AND combo_solved IS ?
     RETURNING coins`
  ).bind(
    today, attemptsUsed + 1, isCorrect ? 1 : 0, isCorrect ? COMBO_REWARD_COINS : 0,
    telegramId, comboRow.combo_date, comboRow.combo_attempts_used, comboRow.combo_solved
  ).first();
  if (!user) {
    return jsonResponse({ error: "no_attempts_left" }, 409);
  }
  const newAttemptsUsed = attemptsUsed + 1;
  if (!isCorrect) {
    return jsonResponse({
      correct: false,
      attempts_used: newAttemptsUsed,
      attempts_left: COMBO_MAX_ATTEMPTS - newAttemptsUsed
    });
  }
  return jsonResponse({
    correct: true,
    reward: COMBO_REWARD_COINS,
    coins: user.coins,
    attempts_used: newAttemptsUsed
  });
}

// Storage view
function withStorageView(user) {
  const hasPet = !!(user.pets && Object.keys(user.pets).length > 0);
  const capacityHours = user.storage_capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS;
  const capacitySeconds = capacityHours * 3600;
  const perSecondRate = (user.total_speed || 0) / 3600;
  let accrued = 0;
  let remainingSeconds = capacitySeconds;
  let isFull = false;
  if (hasPet && user.storage_last_claim_at) {
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(user.storage_last_claim_at)) / 1000);
    const cappedElapsed = Math.min(elapsedSeconds, capacitySeconds);
    accrued = cappedElapsed * perSecondRate;
    remainingSeconds = Math.max(0, capacitySeconds - elapsedSeconds);
    isFull = elapsedSeconds >= capacitySeconds;
  }
  return {
    ...user,
    storage_has_pet: hasPet,
    storage_accrued: accrued,
    storage_capacity_hours: capacityHours,
    storage_level: storageLevelForCapacityHours(capacityHours),
    storage_max_level: STORAGE_MAX_LEVEL,
    storage_capacity_seconds: capacitySeconds,
    storage_remaining_seconds: remainingSeconds,
    storage_is_full: isFull
  };
}

// Streak view
function computeStreakState(user) {
  const today = todayUTC();
  const yesterday = shiftUTCDate(today, -1);
  const lastClaim = user.streak_last_claim_date;
  const storedDay = user.streak_day || 1;
  if (lastClaim === today) {
    const claimedDay = storedDay === 1 ? 7 : storedDay - 1;
    return { today, alreadyClaimedToday: true, claimedDay, pendingDay: storedDay };
  }
  let pendingDay;
  if (!lastClaim) {
    pendingDay = 1;
  } else if (lastClaim === yesterday) {
    pendingDay = storedDay;
  } else {
    pendingDay = 1;
  }
  return { today, alreadyClaimedToday: false, pendingDay };
}
function withStreakView(user) {
  const state = computeStreakState(user);
  return {
    ...user,
    streak_display_day: state.alreadyClaimedToday ? state.claimedDay : state.pendingDay,
    streak_claimed_today: state.alreadyClaimedToday,
    streak_next_reset_utc: nextUtcMidnightIso()
  };
}

// Date helpers
function nextUtcMidnightIso() {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  return next.toISOString();
}
function shiftUTCDate(dateStr, deltaDays) {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}
function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}
// Weekly payout: Friday 00:05 UTC (cron "5 0 * * FRI"), five minutes after the daily board refresh
function lastScheduledLeaderboardPayoutAt(now) {
  const d = new Date(now);
  const result = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 5, 0, 0));
  result.setUTCDate(result.getUTCDate() - ((result.getUTCDay() - 5 + 7) % 7));
  if (result.getTime() > now) result.setUTCDate(result.getUTCDate() - 7);
  return result.getTime();
}
function secondsUntilNextMidnightUTC() {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
  return Math.max(60, Math.floor((next.getTime() - now.getTime()) / 1000));
}
function isoWeekKeyUTC(at = Date.now()) {
  const now = new Date(at);
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return d.getUTCFullYear() + "-W" + String(weekNo).padStart(2, "0");
}
function formatDateDDMMYYYY(ms) {
  const d = new Date(ms);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// User view
// Spending takes locked (deposited) coins first. Locked coins left after the spend mean the whole cost came
// from them; otherwise the share is what was locked just before, never more than the cost. A refund puts
// exactly this share back as locked, so a failed purchase can never turn deposited coins into free ones.
function lockedTakenFor(cost, lockedAfter, lockedBefore) {
  if (lockedAfter > 0) return cost;
  return Math.min(cost, Math.max(0, lockedBefore || 0));
}
function withMiningView(user) {
  const today = todayUTC();
  const isToday = user.mining_cycle_date === today;
  const cyclesToday = isToday ? (user.mining_cycles_today || 0) : 0;
  return {
    ...user,
    mining_started_at: isToday ? user.mining_started_at : null,
    mining_cycles_today: cyclesToday,
    mining_cycles_max: MINING_DAILY_LIMIT,
    mining_cycle_duration_seconds: MINING_CYCLE_SECONDS
  };
}

// Request authentication
async function authenticateRequest(request, env, preParsedBody) {
  let body = preParsedBody;
  if (!body) {
    try {
      body = await request.json();
    } catch (e) {
      return { ok: false, response: jsonResponse({ error: "invalid_body" }, 400) };
    }
  }
  const initData = body.initData;
  if (!initData) {
    return { ok: false, response: jsonResponse({ error: "missing_init_data" }, 400) };
  }
  const isValid = await validateInitData(initData, env.BOT_TOKEN);
  if (!isValid) {
    return { ok: false, response: jsonResponse({ error: "invalid_init_data" }, 401) };
  }
  const params = new URLSearchParams(initData);
  const userJson = params.get("user");
  if (!userJson) {
    return { ok: false, response: jsonResponse({ error: "no_user_in_init_data" }, 400) };
  }
  const tgUser = JSON.parse(userJson);
  const telegramId = tgUser.id;
  const username = tgUser.username || tgUser.first_name || null;
  const startParam = params.get("start_param");
  let referredBy = null;
  if (startParam && startParam.startsWith("ref_")) {
    const parsed = parseInt(startParam.replace("ref_", ""), 10);
    if (!isNaN(parsed) && parsed !== telegramId) referredBy = parsed;
  }
  return {
    ok: true,
    telegramId,
    username,
    rawUsername: tgUser.username || null,
    firstName: tgUser.first_name || null,
    lastName: tgUser.last_name || null,
    photoUrl: tgUser.photo_url || null,
    referredBy
  };
}

// Telegram initData validation
async function validateInitData(initData, botToken) {
  if (!botToken) return false;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return false;
  params.delete("hash");
  const pairs = [];
  for (const [key, value] of params.entries()) {
    pairs.push(`${key}=${value}`);
  }
  pairs.sort();
  const dataCheckString = pairs.join("\n");
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw", encoder.encode("WebAppData"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const secretKeyBytes = await crypto.subtle.sign("HMAC", baseKey, encoder.encode(botToken));
  const signingKey = await crypto.subtle.importKey(
    "raw", secretKeyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", signingKey, encoder.encode(dataCheckString));
  const computedHash = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computedHash === hash;
}
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "X-Server-Time": String(Date.now()) }
  });
}
async function handleTelegram(request, env) {
  if (request.method !== "POST") {
    return new Response("OK");
  }
  // Telegram sends the secret set with setWebhook (secret_token) in this header on every update; anything without it
  // did not come from Telegram
  if (env.TELEGRAM_WEBHOOK_SECRET && request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response("forbidden", { status: 403 });
  }
  let update;
  try {
    update = await request.json();
  } catch (e) {
    return new Response("OK");
  }
  const message = update && update.message;
  if (message && message.text === "/start") {
    try {
      await sendWelcomeMessage(env, message.chat.id);
    } catch (e) {   }
  }
  if (update && update.callback_query) {
    await handleWithdrawCallback(update.callback_query, env);
  }
  return new Response("OK");
}
async function sendMessage(env, chatId, payload) {
  const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, ...payload })
  });
  return res.json().catch(() => null);
}
async function sendPhoto(env, chatId, payload) {
  const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, ...payload })
  });
  return res.json().catch(() => null);
}

// Welcome message
async function sendWelcomeMessage(env, chatId) {
  await sendPhoto(env, chatId, {
    photo: WELCOME_PHOTO_URL,
    caption: "Welcome to MinerXRealm!\nStart mining now and earn coins for free.",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🎮 Open App", web_app: { url: WEBAPP_URL } }
        ],
        [
          { text: "💰 Payouts", url: PAYOUTS_CHANNEL_URL },
          { text: "🎧 Support", url: `https://t.me/${SUPPORT_USERNAME}` }
        ],
        [
          { text: "📺 Channel", url: NEWS_CHANNEL_URL }
        ]
      ]
    }
  });
}
async function editMessage(env, chatId, messageId, payload) {
  const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, ...payload })
  });
  return res.json().catch(() => null);
}
async function answerCallbackQuery(env, callbackQueryId, text) {
  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text })
  }).catch(() => {});
}

// Withdraw message builder
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function buildWithdrawText(status, w) {
  const title = status === "approved"
    ? "✅ Withdrawal Successful!"
    : status === "rejected"
    ? "❌ Withdrawal Rejected"
    : "⏰ Pending Withdrawal";
  const nameLine = w.rawUsername
    ? `@${escapeHtml(w.rawUsername)}`
    : (w.firstName ? escapeHtml(w.firstName) : `ID: ${w.telegramId}`);
  return (
    `${title}\n\n` +
    `👤 ${nameLine}\n` +
    `🆔 <code>${w.telegramId}</code>\n\n` +
    `💵 Amount: ${w.netGram} Gram\n\n` +
    `📍 Address:\n<code>${escapeHtml(w.address)}</code>`
  );
}

// Withdraw approve / reject
async function handleWithdrawCallback(cbq, env) {
  const data = cbq.data || "";
  const match = data.match(/^wd_(approve|reject)_(\d+)$/);
  if (!match) return;
  if (cbq.from.id !== ADMIN_TELEGRAM_ID) {
    await answerCallbackQuery(env, cbq.id, "⛔ Not authorized");
    return;
  }
  const action = match[1];
  const withdrawalId = Number(match[2]);
  const newStatus = action === "approve" ? "approved" : "rejected";
  try {
    const stmts = [
      env.DB.prepare(
        "UPDATE withdrawals SET status = ?, resolved_at = ? WHERE id = ? AND status = 'pending' RETURNING *"
      ).bind(newStatus, Date.now(), withdrawalId)
    ];
    if (newStatus === "rejected") {
      // the refund is in the same batch, so a rejected request is never left without it; changes() is the row
      // count of the status change just before it, so a request already processed is not refunded again
      stmts.push(env.DB.prepare(
        `UPDATE users SET gram = gram + (SELECT amount_gram FROM withdrawals WHERE id = ?)
         WHERE telegram_id = (SELECT telegram_id FROM withdrawals WHERE id = ?) AND changes() = 1`
      ).bind(withdrawalId, withdrawalId));
    }
    const [statusResult] = await env.DB.batch(stmts);
    const w = statusResult.results && statusResult.results[0];
    if (!w) {
      await answerCallbackQuery(env, cbq.id, "⚠️ Already processed");
      return;
    }
    const textArgs = {
      telegramId: w.telegram_id,
      rawUsername: w.raw_username,
      firstName: w.first_name,
      netGram: w.net_gram,
      address: w.address
    };
    const editPayload = { text: buildWithdrawText(newStatus, textArgs), parse_mode: "HTML" };
    if (newStatus === "approved") {
      editPayload.reply_markup = {
        inline_keyboard: [
          [{ text: "🎮 PLAY GAME 🕹️", url: PLAY_GAME_URL }],
          [{ text: "📢 News Channel 📢", url: NEWS_CHANNEL_URL }]
        ]
      };
    }
    try {
      const editResult = await editMessage(env, ADMIN_CHANNEL_ID, w.channel_message_id, editPayload);
      if (!editResult || !editResult.ok) {
        console.error("withdraw callback editMessage failed:", JSON.stringify(editResult));
      }
    } catch (e) {
      console.error("withdraw callback editMessage threw:", e?.message || e);
    }
    const dmText = newStatus === "approved"
      ? `✅ Withdrawal Successful\n\nYour withdrawal of ${w.net_gram} Gram has been sent to your wallet.`
      : `❌ Withdrawal Rejected\n\nYour withdrawal request could not be processed. Please try again later.\n\nYour balance has been refunded.`;
    try {
      await sendMessage(env, w.telegram_id, { text: dmText });
    } catch (e) {
      console.error("withdraw callback user DM threw:", e?.message || e);
    }
    await answerCallbackQuery(env, cbq.id, newStatus === "approved" ? "✅ Approved" : "❌ Rejected");
  } catch (e) {
    console.error("withdraw callback failed:", e?.message || e);
    await answerCallbackQuery(env, cbq.id, "⚠️ Something went wrong");
  }
}
