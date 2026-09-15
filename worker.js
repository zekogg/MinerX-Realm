// URL of the deployed Mini App (same Worker serving the static assets)
const WEBAPP_URL = "https://minerxrealm.zekobusiness0.workers.dev/";

// =====================================================================
// إعدادات دورة "Start Mining" الأساسية (شخصية Doge — منفصلة تماماً عن
// حيوانات Realm والتخزين). كل القيم ثابتة هنا ولا تُقرأ أبداً من المتصفح.
// =====================================================================
const MINING_CYCLE_SECONDS = 60 * 60; // 60 دقيقة لكل دورة
const MINING_REWARD_COINS = 75;       // مكافأة كل دورة كاملة
const MINING_DAILY_LIMIT = 7;         // أقصى عدد دورات باليوم (يُصفَّر 00:00 UTC)

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

  // موجود أصلاً؟ رجّع بياناته الحالية
  let user = await env.DB.prepare(
    "SELECT telegram_id, username, coins, gram, total_speed, is_admin, mining_started_at, mining_cycles_today, mining_cycle_date FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

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

    user = await env.DB.prepare(
      "SELECT telegram_id, username, coins, gram, total_speed, is_admin, mining_started_at, mining_cycles_today, mining_cycle_date FROM users WHERE telegram_id = ?"
    ).bind(telegramId).first();
  }

  return jsonResponse({ user: withMiningView(user) });
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
    "SELECT coins, mining_started_at, mining_cycles_today, mining_cycle_date FROM users WHERE telegram_id = ?"
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
    `UPDATE users SET coins = coins + ?, mining_started_at = NULL, mining_cycles_today = ?, mining_cycle_date = ?
     WHERE telegram_id = ? AND mining_started_at = ?`
  ).bind(MINING_REWARD_COINS, newCyclesToday, today, telegramId, row.mining_started_at);

  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'mining_claim', ?, 'coins')"
  ).bind(telegramId, MINING_REWARD_COINS);

  const [updateResult] = await env.DB.batch([updateStmt, txnStmt]);

  if (!updateResult.meta || updateResult.meta.changes === 0) {
    // طلب آخر (نفس الدورة) سبقه واستلم المكافأة بالفعل
    return jsonResponse({ error: "already_claimed" }, 409);
  }

  return jsonResponse({
    coins: row.coins + MINING_REWARD_COINS,
    cycles_today: newCyclesToday,
    cycles_max: MINING_DAILY_LIMIT
  });
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
