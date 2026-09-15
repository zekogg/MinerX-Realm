// URL of the deployed Mini App (same Worker serving the static assets)
const WEBAPP_URL = "https://minerxrealm.zekobusiness0.workers.dev/";

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

    // Everything else -> serve the Mini App static files
    return env.ASSETS.fetch(request);
  }
};

// =====================================================================
// نقطة /api/user — تُستدعى من الواجهة عند فتح التطبيق.
// تتحقق من initData (توقيع تيليجرام)، تنشئ صف المستخدم لو ما كان موجود،
// وترجع بياناته (الرصيد، السرعة، إلخ) عشان الواجهة تعرضها بدل الأرقام الثابتة.
// =====================================================================
async function handleGetUser(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid_body" }, 400);
  }

  const initData = body.initData;
  if (!initData) {
    return jsonResponse({ error: "missing_init_data" }, 400);
  }

  const isValid = await validateInitData(initData, env.BOT_TOKEN);
  if (!isValid) {
    return jsonResponse({ error: "invalid_init_data" }, 401);
  }

  const params = new URLSearchParams(initData);
  const userJson = params.get("user");
  if (!userJson) {
    return jsonResponse({ error: "no_user_in_init_data" }, 400);
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

  // موجود أصلاً؟ رجّع بياناته الحالية
  let user = await env.DB.prepare(
    "SELECT telegram_id, username, coins, gram, total_speed, total_mined, is_admin FROM users WHERE telegram_id = ?"
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
      "SELECT telegram_id, username, coins, gram, total_speed, total_mined, is_admin FROM users WHERE telegram_id = ?"
    ).bind(telegramId).first();
  }

  return jsonResponse({ user });
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
