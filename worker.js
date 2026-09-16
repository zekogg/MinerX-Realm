// URL of the deployed Mini App (same Worker serving the static assets)
const WEBAPP_URL = "https://minerxrealm.zekobusiness0.workers.dev/";

// =====================================================================
// إعدادات دورة "Start Mining" الأساسية (شخصية Doge — منفصلة تماماً عن
// حيوانات Realm والتخزين). كل القيم ثابتة هنا ولا تُقرأ أبداً من المتصفح.
// =====================================================================
const MINING_CYCLE_SECONDS = 60 * 60; // 60 دقيقة لكل دورة
const MINING_REWARD_COINS = 75;       // مكافأة كل دورة كاملة
const MINING_DAILY_LIMIT = 7;         // أقصى عدد دورات باليوم (يُصفَّر 00:00 UTC)

// =====================================================================
// إعدادات Daily Streak: دورة أسبوعية متكررة (بعد اليوم 7 يرجع لليوم 1)،
// وأي انقطاع يوم كامل بدون Claim يُعيد التسلسل لليوم 1 (عقوبة انقطاع).
// المكافآت ثابتة هنا فقط وتطابق ما هو معروض بالواجهة.
// =====================================================================
const STREAK_REWARDS = [50, 100, 150, 200, 250, 300, 500]; // index 0 = اليوم 1

// =====================================================================
// إعدادات عجلة الحظ (Spin): دورة واحدة مجانية باليوم، تُصفَّر 00:00 UTC.
// الترتيب هنا يطابق تماماً ترتيب الشرائح الثمانية بالواجهة (كل شريحة 45
// درجة، بدءاً من الأعلى وباتجاه عقارب الساعة). الاختيار عشوائي مرجّح
// (weighted random) من السيرفر فقط — لا شيء يُستقبل من المتصفح سوى initData.
// وزن كل جائزة من 10000 (يساوي نسبتها المئوية × 100):
//   50 عملة = 78% ، 100 = 10% ، 250 = 10% ، 1000 = 1%  (المجموع 99%)
//   كل جوائز Gram الأربع تتقاسم الـ1% المتبقي بالتساوي (0.25% لكل واحدة)
// =====================================================================
const SPIN_SEGMENTS = [
  { type: "coins", amount: 100,    weight: 1000 }, // 0°   (10%)
  { type: "gram",  amount: 0.0025, weight: 25   }, // 45°  (0.25%)
  { type: "coins", amount: 1000,   weight: 100  }, // 90°  (1%)
  { type: "gram",  amount: 0.005,  weight: 25   }, // 135° (0.25%)
  { type: "coins", amount: 250,    weight: 1000 }, // 180° (10%)
  { type: "gram",  amount: 0.001,  weight: 25   }, // 225° (0.25%)
  { type: "coins", amount: 50,     weight: 7800 }, // 270° (78%)
  { type: "gram",  amount: 0.01,   weight: 25   }  // 315° (0.25%)
];

// سعر صرف Coins <-> Gram الموحّد (يُستخدم في الواجهة لعرض "≈ Gram" وفي
// نافذة Exchange) — مصدر واحد بدل تكرار الرقم في أكثر من مكان.
const EXCHANGE_RATE_COIN_TO_GRAM = 0.00001;

// =====================================================================
// إعدادات شخصية The Duck + Storage.
// - السرعة عند الشراء (Lv.1) = DUCK_BASE_SPEED، وكل مستوى يضيف 10% من
//   هذه القيمة الأساسية بشكل ثابت (وليس من السرعة المحدَّثة)، حتى Lv.30.
// - تكلفة الترقية ثابتة لكل مستوى (30,000 = 10% من سعر الشراء 300,000).
// - Storage: يبدأ بالتراكم فور شراء أول شخصية، يمتلئ خلال 6 ساعات حسب
//   Total Speed، وله حد أدنى للاستلام (10 عملات) حتى لا يُستنزف بمبالغ
//   ضئيلة جداً.
// =====================================================================
const DUCK_PET_ID = "duck";
const DUCK_BASE_SPEED = 114;              // Coins/hr عند Lv.1
const DUCK_PRICE_COINS = 300000;
const DUCK_MAX_LEVEL = 30;
const DUCK_UPGRADE_COST_COINS = 30000;    // ثابت لكل مستوى
const DUCK_SPEED_INCREMENT = DUCK_BASE_SPEED * 0.10; // 11.4 Coins/hr لكل مستوى
const STORAGE_DEFAULT_CAPACITY_HOURS = 6;
const STORAGE_MIN_CLAIM_COINS = 10;

function duckSpeedForLevel(level) {
  return DUCK_BASE_SPEED + (level - 1) * DUCK_SPEED_INCREMENT;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Telegram sends updates here
    if (url.pathname === "/telegram-webhook") {
      return handleTelegram(request, env);
    }

    // Mini App calls this on load: validates the user and returns their balance
    if (url.pathname === "/api/user" && request.method === "POST") {
      return handleGetUser(request, env);
    }

    if (url.pathname === "/api/mine/start" && request.method === "POST") {
      return handleMineStart(request, env);
    }

    if (url.pathname === "/api/mine/claim" && request.method === "POST") {
      return handleMineClaim(request, env);
    }

    if (url.pathname === "/api/streak/claim" && request.method === "POST") {
      return handleStreakClaim(request, env);
    }

    if (url.pathname === "/api/spin/claim" && request.method === "POST") {
      return handleSpinClaim(request, env);
    }

    if (url.pathname === "/api/chest/claim" && request.method === "POST") {
      return handleChestClaim(request, env);
    }

    if (url.pathname === "/api/giftpick/claim" && request.method === "POST") {
      return handleGiftPickClaim(request, env);
    }

    if (url.pathname === "/api/duck/buy" && request.method === "POST") {
      return handleDuckBuy(request, env);
    }

    if (url.pathname === "/api/duck/upgrade" && request.method === "POST") {
      return handleDuckUpgrade(request, env);
    }

    if (url.pathname === "/api/storage/claim" && request.method === "POST") {
      return handleStorageClaim(request, env);
    }

    // Everything else -> serve the Mini App static files
    return env.ASSETS.fetch(request);
  }
};

// =====================================================================
// نقطة /api/user — تُستدعى من الواجهة عند فتح التطبيق.
// تتحقق من initData (توقيع تيليجرام)، تنشئ صف المستخدم لو ما كان موجود،
// وترجع بياناته (الرصيد، السرعة، حالة التعدين، إلخ) عشان الواجهة تعرضها
// بدل الأرقام الثابتة.
// =====================================================================
async function handleGetUser(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId, username, referredBy } = auth;

  const userQuery = `
    SELECT u.telegram_id, u.username, u.coins, u.gram, u.total_speed, u.total_mined, u.is_admin,
           u.mining_started_at, u.mining_cycles_today, u.mining_cycle_date,
           u.streak_day, u.streak_last_claim_date,
           u.last_spin_date, u.last_chest_date, u.last_giftpick_date,
           s.capacity_hours AS storage_capacity_hours, s.last_claim_at AS storage_last_claim_at,
           p.level AS duck_level, p.current_speed AS duck_speed
    FROM users u
    LEFT JOIN user_storage s ON s.telegram_id = u.telegram_id
    LEFT JOIN user_pets p ON p.telegram_id = u.telegram_id AND p.pet_id = ?
    WHERE u.telegram_id = ?
  `;

  // موجود أصلاً؟ رجّع بياناته الحالية
  let user = await env.DB.prepare(userQuery).bind(DUCK_PET_ID, telegramId).first();

  if (!user) {
    // أول مرة يفتح التطبيق — أنشئ له صف جديد
    await env.DB.prepare(
      "INSERT INTO users (telegram_id, username, referred_by) VALUES (?, ?, ?)"
    ).bind(telegramId, username, referredBy).run();

    // لو جاء بدعوة، سجّل العلاقة بجدول referrals
    if (referredBy) {
      await env.DB.prepare(
        "INSERT OR IGNORE INTO referrals (referrer_id, referred_id) VALUES (?, ?)"
      ).bind(referredBy, telegramId).run();
    }

    user = await env.DB.prepare(userQuery).bind(DUCK_PET_ID, telegramId).first();
  }

  let view = withMiningView(user);
  view = withStreakView(view);
  view = withDailyPrizeView(view, "last_spin_date", "spin_claimed_today", "spin_next_reset_utc");
  view = withDailyPrizeView(view, "last_chest_date", "chest_claimed_today", "chest_next_reset_utc");
  view = withDailyPrizeView(view, "last_giftpick_date", "giftpick_claimed_today", "giftpick_next_reset_utc");
  view = withStorageView(view);
  view.exchange_rate_coin_to_gram = EXCHANGE_RATE_COIN_TO_GRAM;

  return jsonResponse({ user: view });
}

// =====================================================================
// نقطة /api/mine/start — بدء دورة تعدين جديدة (شخصية Doge الأساسية).
// السيرفر هو من يسجّل وقت البدء؛ لا شيء يُستقبل من المتصفح سوى initData.
// =====================================================================
async function handleMineStart(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const row = await env.DB.prepare(
    "SELECT mining_started_at, mining_cycles_today, mining_cycle_date FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);

  if (row.mining_started_at) {
    return jsonResponse({
      error: "already_mining",
      mining_started_at: row.mining_started_at,
      cycle_duration_seconds: MINING_CYCLE_SECONDS
    }, 409);
  }

  const today = todayUTC();
  const cyclesToday = row.mining_cycle_date === today ? (row.mining_cycles_today || 0) : 0;
  if (cyclesToday >= MINING_DAILY_LIMIT) {
    return jsonResponse({
      error: "daily_limit_reached",
      cycles_today: cyclesToday,
      cycles_max: MINING_DAILY_LIMIT
    }, 429);
  }

  const nowIso = new Date().toISOString();

  // شرط "mining_started_at IS NULL" يمنع بدء دورتين بنفس اللحظة (سباق طلبات)
  const result = await env.DB.prepare(
    `UPDATE users SET mining_started_at = ?, mining_cycle_date = ?, mining_cycles_today = ?
     WHERE telegram_id = ? AND mining_started_at IS NULL`
  ).bind(nowIso, today, cyclesToday, telegramId).run();

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

// =====================================================================
// نقطة /api/mine/claim — استلام مكافأة دورة تعدين مكتملة.
// المدة المنقضية تُحسب من وقت السيرفر المخزّن، والتحديث يتم بشرط
// (Compare-And-Swap) على mining_started_at لمنع استلام المكافأة مرتين
// حتى لو وصل نفس الطلب للسيرفر أكثر من مرة في نفس اللحظة.
// =====================================================================
async function handleMineClaim(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const row = await env.DB.prepare(
    "SELECT coins, total_mined, mining_started_at, mining_cycles_today, mining_cycle_date FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);

  if (!row.mining_started_at) {
    return jsonResponse({ error: "not_mining" }, 400);
  }

  const startedAtMs = Date.parse(row.mining_started_at);
  const elapsedSeconds = (Date.now() - startedAtMs) / 1000;
  if (elapsedSeconds < MINING_CYCLE_SECONDS) {
    return jsonResponse({
      error: "cycle_not_finished",
      remaining_seconds: Math.ceil(MINING_CYCLE_SECONDS - elapsedSeconds)
    }, 400);
  }

  const today = todayUTC();
  const cyclesToday = row.mining_cycle_date === today ? (row.mining_cycles_today || 0) : 0;
  if (cyclesToday >= MINING_DAILY_LIMIT) {
    return jsonResponse({ error: "daily_limit_reached", cycles_today: cyclesToday, cycles_max: MINING_DAILY_LIMIT }, 429);
  }

  const newCyclesToday = cyclesToday + 1;

  const updateStmt = env.DB.prepare(
    `UPDATE users SET coins = coins + ?, total_mined = total_mined + ?, mining_started_at = NULL, mining_cycles_today = ?, mining_cycle_date = ?
     WHERE telegram_id = ? AND mining_started_at = ?`
  ).bind(MINING_REWARD_COINS, MINING_REWARD_COINS, newCyclesToday, today, telegramId, row.mining_started_at);

  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'mining_claim', ?, 'coins')"
  ).bind(telegramId, MINING_REWARD_COINS);

  const [updateResult] = await env.DB.batch([updateStmt, txnStmt]);

  if (!updateResult.meta || updateResult.meta.changes === 0) {
    // طلب آخر (نفس الدورة) سبقه واستلم المكافأة بالفعل
    return jsonResponse({ error: "already_claimed" }, 409);
  }

  return jsonResponse({
    reward: MINING_REWARD_COINS,
    coins: row.coins + MINING_REWARD_COINS,
    total_mined: (row.total_mined || 0) + MINING_REWARD_COINS,
    cycles_today: newCyclesToday,
    cycles_max: MINING_DAILY_LIMIT
  });
}

// =====================================================================
// نقطة /api/streak/claim — استلام مكافأة اليوم من Daily Streak.
// كل الحساب من السيرفر: أي يوم في التسلسل الحالي، هل انقطع التسلسل،
// وهل تم الاستلام اليوم بالفعل. لا شيء يُستقبل من المتصفح سوى initData.
// =====================================================================
async function handleStreakClaim(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const row = await env.DB.prepare(
    "SELECT coins, streak_day, streak_last_claim_date FROM users WHERE telegram_id = ?"
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

  // شرط CAS يمنع استلام مكافأتين لنفس اليوم حتى لو تكرر نفس الطلب بسرعة
  const updateStmt = env.DB.prepare(
    `UPDATE users SET coins = coins + ?, streak_day = ?, streak_last_claim_date = ?
     WHERE telegram_id = ? AND (streak_last_claim_date IS NULL OR streak_last_claim_date <> ?)`
  ).bind(reward, nextStreakDay, state.today, telegramId, state.today);

  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'daily_streak', ?, 'coins')"
  ).bind(telegramId, reward);

  const [updateResult] = await env.DB.batch([updateStmt, txnStmt]);
  if (!updateResult.meta || updateResult.meta.changes === 0) {
    return jsonResponse({ error: "already_claimed_today" }, 409);
  }

  return jsonResponse({
    day_claimed: dayToClaim,
    reward,
    next_day: nextStreakDay,
    coins: row.coins + reward,
    next_reset_utc: nextUtcMidnightIso()
  });
}

// =====================================================================
// نقطة /api/spin/claim — تنفيذ دورة الحظ المجانية اليومية.
// نقطة /api/chest/claim — فتح الصندوق المجاني اليومي.
// نقطة /api/giftpick/claim — فتح إحدى الهدايا الثلاث المجانية يومياً.
// الثلاثة تستخدم بالضبط نفس جدول الجوائز والاحتمالات (SPIN_SEGMENTS)،
// وكل واحدة منفصلة تماماً عن الأخرى (محاولة يومية مستقلة لكل ميزة).
// الاختيار عشوائي مرجّح بالكامل من السيرفر (crypto.getRandomValues)؛
// المتصفح لا يرسل ولا يقرر أي شيء سوى تشغيل الأنيميشن بعد استلام النتيجة.
// =====================================================================
async function handleSpinClaim(request, env) {
  return handleDailyPrizeClaim(request, env, {
    dateColumn: "last_spin_date",
    errorCode: "already_spun_today",
    transactionType: "spin"
  });
}

async function handleChestClaim(request, env) {
  return handleDailyPrizeClaim(request, env, {
    dateColumn: "last_chest_date",
    errorCode: "already_claimed_today",
    transactionType: "chest_open"
  });
}

async function handleGiftPickClaim(request, env) {
  return handleDailyPrizeClaim(request, env, {
    dateColumn: "last_giftpick_date",
    errorCode: "already_claimed_today",
    transactionType: "gift_pick"
  });
}

// المنطق العام المشترك بين Spin وChest وGift Pick: محاولة مجانية واحدة
// باليوم (تُصفَّر 00:00 UTC)، جائزة عشوائية مرجّحة من نفس SPIN_SEGMENTS،
// وتحديث ذري (Compare-And-Swap) يمنع استلام مكافأتين لنفس اليوم حتى لو
// تكرر نفس الطلب بسرعة.
async function handleDailyPrizeClaim(request, env, { dateColumn, errorCode, transactionType }) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const row = await env.DB.prepare(
    `SELECT coins, gram, ${dateColumn} AS last_date FROM users WHERE telegram_id = ?`
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
     WHERE telegram_id = ? AND (${dateColumn} IS NULL OR ${dateColumn} <> ?)`
  ).bind(prize.amount, today, telegramId, today);

  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, ?, ?, ?)"
  ).bind(telegramId, transactionType, prize.amount, prize.type);

  const [updateResult] = await env.DB.batch([updateStmt, txnStmt]);
  if (!updateResult.meta || updateResult.meta.changes === 0) {
    return jsonResponse({ error: errorCode }, 409);
  }

  return jsonResponse({
    segment_index: index,
    prize_type: prize.type,
    prize_amount: prize.amount,
    coins: prize.type === "coins" ? row.coins + prize.amount : row.coins,
    gram: prize.type === "gram" ? row.gram + prize.amount : row.gram,
    next_reset_utc: nextUtcMidnightIso()
  });
}

// اختيار عشوائي مرجّح (weighted random) من SPIN_SEGMENTS باستخدام
// Web Crypto بدل Math.random لعشوائية أفضل تناسب جائزة حقيقية.
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

// يضيف حقلي "هل استُلمت المحاولة اليومية اليوم؟" و"موعد التصفير القادم"
// لأي ميزة يومية (Spin/Chest/Gift Pick) بدون أي كتابة لقاعدة البيانات.
function withDailyPrizeView(user, dateColumn, claimedKey, resetKey) {
  return {
    ...user,
    [claimedKey]: user[dateColumn] === todayUTC(),
    [resetKey]: nextUtcMidnightIso()
  };
}

// =====================================================================
// نقطة /api/duck/buy — شراء شخصية The Duck (أول شخصية تعدين حقيقية).
// تخصم السعر بشرط توفر الرصيد (CAS)، ثم تنشئ صف user_pets عند Lv.1
// وتبدأ Storage بالتراكم فوراً (last_claim_at = الآن).
// =====================================================================
async function handleDuckBuy(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const existing = await env.DB.prepare(
    "SELECT 1 FROM user_pets WHERE telegram_id = ? AND pet_id = ?"
  ).bind(telegramId, DUCK_PET_ID).first();
  if (existing) return jsonResponse({ error: "already_owned" }, 409);

  const deductResult = await env.DB.prepare(
    `UPDATE users SET coins = coins - ?, total_speed = total_speed + ?
     WHERE telegram_id = ? AND coins >= ?`
  ).bind(DUCK_PRICE_COINS, DUCK_BASE_SPEED, telegramId, DUCK_PRICE_COINS).run();

  if (!deductResult.meta || deductResult.meta.changes === 0) {
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }

  const nowIso = new Date().toISOString();
  const insertPetStmt = env.DB.prepare(
    "INSERT INTO user_pets (telegram_id, pet_id, level, current_speed) VALUES (?, ?, 1, ?)"
  ).bind(telegramId, DUCK_PET_ID, DUCK_BASE_SPEED);
  const insertStorageStmt = env.DB.prepare(
    "INSERT OR IGNORE INTO user_storage (telegram_id, capacity_hours, last_claim_at) VALUES (?, ?, ?)"
  ).bind(telegramId, STORAGE_DEFAULT_CAPACITY_HOURS, nowIso);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'pet_purchase', ?, 'coins')"
  ).bind(telegramId, -DUCK_PRICE_COINS);

  try {
    await env.DB.batch([insertPetStmt, insertStorageStmt, txnStmt]);
  } catch (e) {
    // نادر جداً: طلب شراء متزامن سبقه بجزء من الثانية — نُرجع العملات والسرعة
    await env.DB.prepare(
      "UPDATE users SET coins = coins + ?, total_speed = total_speed - ? WHERE telegram_id = ?"
    ).bind(DUCK_PRICE_COINS, DUCK_BASE_SPEED, telegramId).run();
    return jsonResponse({ error: "already_owned" }, 409);
  }

  const updatedUser = await env.DB.prepare(
    "SELECT coins, total_speed FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    level: 1,
    speed: DUCK_BASE_SPEED,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins
  });
}

// =====================================================================
// نقطة /api/duck/upgrade — ترقية The Duck مستوى واحد. التكلفة ثابتة
// (30,000)، والسرعة الجديدة تُحسب دائماً من السرعة الأساسية + 10% لكل
// مستوى (وليس تراكمياً فوق السرعة الحالية).
// =====================================================================
async function handleDuckUpgrade(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const pet = await env.DB.prepare(
    "SELECT level, current_speed FROM user_pets WHERE telegram_id = ? AND pet_id = ?"
  ).bind(telegramId, DUCK_PET_ID).first();
  if (!pet) return jsonResponse({ error: "not_owned" }, 400);

  if (pet.level >= DUCK_MAX_LEVEL) {
    return jsonResponse({ error: "max_level_reached", level: pet.level }, 400);
  }

  const newLevel = pet.level + 1;
  const newSpeed = duckSpeedForLevel(newLevel);
  const speedDelta = newSpeed - pet.current_speed;

  const deductResult = await env.DB.prepare(
    `UPDATE users SET coins = coins - ?, total_speed = total_speed + ?
     WHERE telegram_id = ? AND coins >= ?`
  ).bind(DUCK_UPGRADE_COST_COINS, speedDelta, telegramId, DUCK_UPGRADE_COST_COINS).run();

  if (!deductResult.meta || deductResult.meta.changes === 0) {
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }

  // شرط "level = المستوى القديم" يمنع تطبيق ترقيتين متزامنتين على نفس الشخصية
  const updatePetStmt = env.DB.prepare(
    `UPDATE user_pets SET level = ?, current_speed = ?
     WHERE telegram_id = ? AND pet_id = ? AND level = ?`
  ).bind(newLevel, newSpeed, telegramId, DUCK_PET_ID, pet.level);

  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'pet_upgrade', ?, 'coins')"
  ).bind(telegramId, -DUCK_UPGRADE_COST_COINS);

  const [updatePetResult] = await env.DB.batch([updatePetStmt, txnStmt]);

  if (!updatePetResult.meta || updatePetResult.meta.changes === 0) {
    // نادر: طلب ترقية متزامن سبقه — نُرجع العملات والسرعة المخصومة
    await env.DB.prepare(
      "UPDATE users SET coins = coins + ?, total_speed = total_speed - ? WHERE telegram_id = ?"
    ).bind(DUCK_UPGRADE_COST_COINS, speedDelta, telegramId).run();
    return jsonResponse({ error: "level_changed" }, 409);
  }

  const updatedUser = await env.DB.prepare(
    "SELECT coins, total_speed FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    level: newLevel,
    speed: newSpeed,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins,
    is_max_level: newLevel >= DUCK_MAX_LEVEL
  });
}

// =====================================================================
// نقطة /api/storage/claim — استلام ما تراكم في Storage. المبلغ المتراكم
// يُحسب من الوقت المنقضي منذ آخر Claim (بحد أقصى سعة التخزين بالساعات)
// × Total Speed، بحد أدنى 10 عملات (وإلا يُرفض الطلب دون تصفير المؤقت).
// =====================================================================
async function handleStorageClaim(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const row = await env.DB.prepare(
    `SELECT u.total_speed, s.capacity_hours, s.last_claim_at
     FROM users u LEFT JOIN user_storage s ON s.telegram_id = u.telegram_id
     WHERE u.telegram_id = ?`
  ).bind(telegramId).first();

  if (!row || !row.last_claim_at) {
    return jsonResponse({ error: "no_storage" }, 400);
  }

  const capacitySeconds = (row.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
  const perSecondRate = (row.total_speed || 0) / 3600;
  const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(row.last_claim_at)) / 1000);
  const accrued = Math.min(elapsedSeconds, capacitySeconds) * perSecondRate;

  if (accrued < STORAGE_MIN_CLAIM_COINS) {
    return jsonResponse({
      error: "below_minimum_claim",
      minimum: STORAGE_MIN_CLAIM_COINS,
      accrued
    }, 400);
  }

  const nowIso = new Date().toISOString();

  // شرط CAS على last_claim_at يمنع استلام مكافأتين لنفس التراكم
  const resetResult = await env.DB.prepare(
    "UPDATE user_storage SET last_claim_at = ? WHERE telegram_id = ? AND last_claim_at = ?"
  ).bind(nowIso, telegramId, row.last_claim_at).run();

  if (!resetResult.meta || resetResult.meta.changes === 0) {
    return jsonResponse({ error: "already_claimed" }, 409);
  }

  const creditStmt = env.DB.prepare(
    "UPDATE users SET coins = coins + ? WHERE telegram_id = ?"
  ).bind(accrued, telegramId);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'storage_claim', ?, 'coins')"
  ).bind(telegramId, accrued);

  await env.DB.batch([creditStmt, txnStmt]);

  const updatedUser = await env.DB.prepare(
    "SELECT coins FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    claimed_amount: accrued,
    coins: updatedUser.coins,
    capacity_seconds: capacitySeconds
  });
}

// يحسب حالة Storage الحالية (كم تراكم؟ هل امتلأ؟ كم تبقّى؟) بدون أي
// كتابة لقاعدة البيانات — يُستخدم فقط للعرض في /api/user.
function withStorageView(user) {
  const hasPet = !!user.duck_level; // فقط The Duck مفعّلة حالياً؛ تُوسَّع لاحقاً لبقية الحيوانات
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
    duck_level: user.duck_level || 0,
    duck_speed: user.duck_speed || 0,
    storage_has_pet: hasPet,
    storage_accrued: accrued,
    storage_capacity_seconds: capacitySeconds,
    storage_remaining_seconds: remainingSeconds,
    storage_is_full: isFull,
    storage_min_claim: STORAGE_MIN_CLAIM_COINS
  };
}

// يحسب حالة التسلسل الحالية (أي يوم القادم؟ هل انقطع؟ هل استُلم اليوم؟)
// بدون أي كتابة لقاعدة البيانات — يُستخدم للعرض في /api/user وللتحقق
// قبل الكتابة الفعلية في /api/streak/claim.
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
    pendingDay = 1; // أول مرة على الإطلاق
  } else if (lastClaim === yesterday) {
    pendingDay = storedDay; // استمرار طبيعي للتسلسل
  } else {
    pendingDay = 1; // انقطاع يوم كامل على الأقل — عقوبة إعادة من اليوم الأول
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

// تاريخ الغد بتوقيت UTC الساعة 00:00 بالضبط — لحظة انتهاء صلاحية Claim الحالي
// وبداية اليوم التالي في كل من التعدين والـ Daily Streak.
function nextUtcMidnightIso() {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  return next.toISOString();
}

// يزيح تاريخ UTC (بصيغة YYYY-MM-DD) بعدد أيام (موجب أو سالب)
function shiftUTCDate(dateStr, deltaDays) {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

// تاريخ اليوم الحالي بتوقيت UTC بصيغة YYYY-MM-DD (لتصفير عداد الدورات كل 00:00 UTC)
function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

// يحوّل صف المستخدم الخام إلى شكل يراعي "التصفير الكسول" لعداد الدورات
// اليومي بدون أي كتابة لقاعدة البيانات (يُحسب فقط عند العرض).
function withMiningView(user) {
  const today = todayUTC();
  const cyclesToday = user.mining_cycle_date === today ? (user.mining_cycles_today || 0) : 0;
  return {
    ...user,
    mining_cycles_today: cyclesToday,
    mining_cycles_max: MINING_DAILY_LIMIT,
    mining_cycle_duration_seconds: MINING_CYCLE_SECONDS
  };
}

// =====================================================================
// تتحقق من initData وترجع معرّف المستخدم تيليجرام + بيانات الدعوة.
// تُستخدم من طرف كل نقاط /api/* المحمية.
// =====================================================================
async function authenticateRequest(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return { ok: false, response: jsonResponse({ error: "invalid_body" }, 400) };
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

  // referred_by يجي من رابط الدعوة (t.me/MinerXRealmBot?start=ref_84213) عبر start_param
  const startParam = params.get("start_param");
  let referredBy = null;
  if (startParam && startParam.startsWith("ref_")) {
    const parsed = parseInt(startParam.replace("ref_", ""), 10);
    if (!isNaN(parsed) && parsed !== telegramId) referredBy = parsed;
  }

  return { ok: true, telegramId, username, referredBy };
}

// =====================================================================
// التحقق من صحة initData حسب خوارزمية تيليجرام الرسمية (HMAC-SHA256)
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
// =====================================================================
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

  // secret_key = HMAC_SHA256(bot_token, key="WebAppData")
  const baseKey = await crypto.subtle.importKey(
    "raw", encoder.encode("WebAppData"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const secretKeyBytes = await crypto.subtle.sign("HMAC", baseKey, encoder.encode(botToken));

  // computed_hash = HMAC_SHA256(dataCheckString, key=secret_key)
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
    headers: { "Content-Type": "application/json" }
  });
}

async function handleTelegram(request, env) {
  if (request.method !== "POST") {
    return new Response("OK");
  }

  const update = await request.json();
  const message = update.message;

  if (message && message.text === "/start") {
    await sendMessage(env, message.chat.id, {
      text: "Welcome to MinerXRealm!\nStart mining now and earn coins for free.",
      reply_markup: {
        inline_keyboard: [[
          {
            text: "Open App",
            web_app: { url: WEBAPP_URL }
          }
        ]]
      }
    });
  }

  return new Response("OK");
}

async function sendMessage(env, chatId, payload) {
  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, ...payload })
  });
}
