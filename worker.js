// URL of the deployed Mini App (same Worker serving the static assets)
const WEBAPP_URL = "https://minerxrealm.zekobusiness0.workers.dev/";

// =====================================================================
// إعدادات دورة "Start Mining" الأساسية (شخصية Doge — منفصلة تماماً عن
// حيوانات Realm والتخزين). كل القيم ثابتة هنا ولا تُقرأ أبداً من المتصفح.
// =====================================================================
const MINING_CYCLE_SECONDS = 60 * 60; // 60 دقيقة لكل دورة
const MINING_REWARD_COINS = 65;       // مكافأة كل دورة كاملة
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
//   50 عملة = 88% ، 100 = 5% ، 250 = 5% ، 1000 = 1%  (المجموع 99%)
//   كل جوائز Gram الأربع تتقاسم الـ1% المتبقي بالتساوي (0.25% لكل واحدة)
// =====================================================================
const SPIN_SEGMENTS = [
  { type: "coins", amount: 100,    weight: 500  }, // 0°   (5%)
  { type: "gram",  amount: 0.0025, weight: 25   }, // 45°  (0.25%)
  { type: "coins", amount: 500,    weight: 100  }, // 90°  (1%)
  { type: "gram",  amount: 0.005,  weight: 25   }, // 135° (0.25%)
  { type: "coins", amount: 150,    weight: 500  }, // 180° (5%)
  { type: "gram",  amount: 0.001,  weight: 25   }, // 225° (0.25%)
  { type: "coins", amount: 50,     weight: 8800 }, // 270° (88%)
  { type: "gram",  amount: 0.01,   weight: 25   }  // 315° (0.25%)
];

// سعر صرف Coins <-> Gram الموحّد (يُستخدم في الواجهة لعرض "≈ Gram" وفي
// نافذة Exchange) — مصدر واحد بدل تكرار الرقم في أكثر من مكان.
const EXCHANGE_RATE_COIN_TO_GRAM = 0.00001;
const EXCHANGE_MIN_COINS = 1000; // الحد الأدنى لعملية Exchange واحدة

// =====================================================================
// إعدادات الإيداع (Deposit): إيداع Gram على شبكة TON يُحوَّل مباشرة إلى
// Coins بنفس سعر صرف Exchange بالعكس (1 Gram = 1/EXCHANGE_RATE_COIN_TO_GRAM
// Coins) — نفس الرقم المعروض حالياً بالواجهة (val * 100000). الفحص الفعلي
// لبلوكتشين TON يتم داخل DepositChecker (Durable Object واحد لكل مستخدم).
// =====================================================================
const DEPOSIT_GRAM_TO_COINS_RATE = 1 / EXCHANGE_RATE_COIN_TO_GRAM; // 100000
const DEPOSIT_MIN_GRAM = 3; // أقل مبلغ إيداع مسموح به
const DEPOSIT_CHECK_TIMEOUT_MS = 120_000; // ينتقل status إلى "timeout" بعد هذا الوقت من بدء الفحص
const DEPOSIT_CHECK_MAX_ATTEMPTS = 8;
const DEPOSIT_CHECK_FIRST_DELAY_MS = 5_000;
const DEPOSIT_CHECK_RETRY_DELAY_MS = 15_000;

// =====================================================================
// إعدادات السحب (Withdraw): سحب يدوي بالكامل — المستخدم يطلب، يُخصم
// المبلغ فوراً من رصيده (حجز)، ويُرسَل منشور للقناة الإدارية بزري
// Approve/Reject. لا يوجد فحص بلوكتشين آلي هنا (الإرسال يدوي من الأدمن
// خارج البوت بالكامل). "Amount" الظاهر في الرسائل = المبلغ الصافي
// (Net) بعد خصم الرسوم — هو الرقم الذي يجب على الأدمن إرساله فعلياً.
// =====================================================================
const WITHDRAW_MIN_GRAM = 0.1;
const WITHDRAW_FEE_GRAM = 0.03;
const WITHDRAW_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 ساعة، تبدأ فور الطلب بغض النظر عن النتيجة
const ADMIN_TELEGRAM_ID = 1018495986;
const ADMIN_CHANNEL_ID = -1004325013522;
const PLAY_GAME_URL = "https://t.me/MinerXRealmBot/app";
const NEWS_CHANNEL_URL = "https://t.me/MinerXRealmNews";

// =====================================================================
// إعدادات Daily Combo: عند 00:00 UTC كل يوم (Cron Trigger — انظر
// [triggers] في wrangler.toml) يختار السيرفر ترتيباً عشوائياً جديداً
// لنفس البطاقات الثلاث الثابتة (Duck, Polar Bear, Penguin) ويحفظه في
// daily_combo، ثم يرسل الإجابة الصحيحة للأدمن فقط عبر رسالة خاصة —
// لا يصل أي جزء منها للمستخدم أو للواجهة إطلاقاً. للمستخدم محاولتان
// فقط يومياً لتخمين نفس التسلسل بالضبط (الترتيب مهم، وليس فقط اختيار
// البطاقات الصحيحة)، مقابل مكافأة ثابتة عند النجاح.
// =====================================================================
const COMBO_CARDS = ["duck", "polar_bear", "penguin"];
const COMBO_CARD_LABELS = { duck: "Duck", polar_bear: "Polar Bear", penguin: "Penguin" };
const COMBO_REWARD_COINS = 100;
const COMBO_MAX_ATTEMPTS = 2;

// =====================================================================
// إعدادات مهمة "Watch Adsgram Ad" (بطاقة Daily Ads الوحيدة المربوطة
// بشبكة إعلانات حقيقية حالياً — باقي البطاقات ما زالت تصميماً ثابتاً).
// المكافأة تُمنح فقط عند استدعاء Adsgram الفعلي لـ Reward URL من
// سيرفرهم (server-to-server) بعد تأكدهم من مشاهدة الإعلان بالكامل —
// لا شيء يُمنح بناءً على أي شيء يرسله المتصفح مباشرة، ومحمي بالرمز
// السري ADSGRAM_REWARD_SECRET (Cloudflare Secret).
// =====================================================================
const ADS_TASK_REWARD_COINS = 15;
const ADS_TASK_DAILY_LIMIT = 10;

// =====================================================================
// إعدادات صفحة Friends: مكافآت الإحالة الثلاث (تسجيل + نشاط + عمولة
// إيداع) تتجمّع كلها في users.referral_pending_earnings، ولا تُضاف لـ
// coins إلا بالضغط على Claim صراحة (بحد أدنى REFERRAL_MIN_CLAIM_COINS).
// "نشط" = وصول الصديق لـACTIVE_FRIEND_ADS_THRESHOLD إعلان Adsgram
// تراكمياً مدى الحياة (ads_task_total) — منفصل تماماً عن ads_task_count
// اليومي الذي يُصفَّر كل 00:00 UTC. مكافآت Milestone Missions تُضاف
// مباشرة لـcoins عند الاستحقاق، ولا تمر عبر الرصيد المعلّق.
//
// عتبات/مكافآت Milestone Missions تُقرأ من جدول milestone_missions
// الموجود مسبقاً بالقاعدة (وليست أرقاماً ثابتة هنا) — قابلة للتعديل من
// القاعدة مباشرة بدون نشر كود جديد. حالة "نشط" وأرباح كل صديق تُخزَّن في
// عمودين جديدين على جدول referrals الموجود مسبقاً (is_active, earned_coins)
// بدل جدول منفصل، تفادياً لتكرار نفس المفهوم في مكانين. أما علم "تم
// الاستلام" لكل عتبة (milestone_*_claimed) فبقي كأعمدة مسطّحة على users
// (وليس جدولاً منفصلاً user_milestones) لأنها أرخص فعلياً على /api/user —
// أكثر نقطة استدعاءً بالتطبيق — إذ لا تتطلب أي JOIN إضافي.
// =====================================================================
const REFERRAL_SIGNUP_BONUS_COINS = 20;
const REFERRAL_ACTIVE_BONUS_COINS = 130;
const REFERRAL_DEPOSIT_COMMISSION_RATE = 0.05;
const REFERRAL_MIN_CLAIM_COINS = 5000;
const ACTIVE_FRIEND_ADS_THRESHOLD = 10;

// =====================================================================
// إعدادات مهام Check-in الأربع اليومية (تُصفَّر 00:00 UTC، نفس أسلوب باقي
// الميزات اليومية). المهمتان 1 و2 بدون أي تحقق حقيقي (النقر على الرابط ثم
// انتظار 5 ثوانٍ فقط من الواجهة). المهمتان 3 و4 لهما تحقق حقيقي من طرف
// السيرفر قبل السماح بالاستلام:
// - المهمة 3: هل يحتوي اسم المستخدم الظاهر (first_name+last_name، يصل مع
//   كل initData) على "@MinerXRealmBot"؟
// - المهمة 4: هل تحتوي نبذته (bio) — عبر Telegram getChat، تُرجع bio
//   للمحادثات الخاصة — على رابط إحالته الخاص "ref_<telegram_id>" تحديداً؟
// =====================================================================
const CHECKIN_TASK_REWARDS = { 1: 10, 2: 10, 3: 20, 4: 20 };

// =====================================================================
// إعدادات "Bonus AD Every 1H": إعلان Adsgram إضافي كل ساعة، بحد أقصى
// 5 مرات باليوم. يستخدم Block منفصل تماماً عن Watch Adsgram Ad اليومية
// (Reward URL مختلف يحمل ?task=bonus_ad) لأن Adsgram لا يرسل أي شيء غير
// userid في نداء Reward URL، فلا توجد طريقة أخرى للتمييز بين الميزتين
// على مستوى السيرفر.
// =====================================================================
const BONUS_AD_REWARD_COINS = 15;
const BONUS_AD_DAILY_LIMIT = 5;
const BONUS_AD_COOLDOWN_MS = 60 * 60 * 1000; // ساعة واحدة بين كل إعلان والتالي

// =====================================================================
// إعدادات حيوانات Realm القابلة للشراء + Storage. نفس القاعدة لكل
// الحيوانات الستة (مطابقة لما طُبِّق على The Duck):
// - السرعة عند الشراء (Lv.1) = basespeed الخاص بالحيوان، وكل مستوى يضيف
//   10% من هذه القيمة الأساسية بشكل ثابت (وليس من السرعة المحدَّثة)،
//   حتى الحد الأقصى PET_MAX_LEVEL (30) لكل الحيوانات.
// - تكلفة الترقية ثابتة لكل مستوى = 10% من سعر الشراء (نفس نسبة Duck).
// - Storage: يبدأ بالتراكم فور شراء أول حيوان (أي حيوان)، يمتلئ حسب
//   Total Speed الكلي (مجموع كل الحيوانات المملوكة معاً)، وله حد أدنى
//   للاستلام (10 عملات) حتى لا يُستنزف بمبالغ ضئيلة جداً.
// =====================================================================
const PETS = {
  duck:         { basespeed: 114,   price: 300000 },
  polar_bear:   { basespeed: 191,   price: 500000 },
  scorpion:     { basespeed: 379,   price: 1000000 },
  penguin:      { basespeed: 1894,  price: 5000000 },
  dancing_bear: { basespeed: 3788,  price: 10000000 },
  the_cat:      { basespeed: 18940, price: 50000000 }
};
const PET_MAX_LEVEL = 30;
const PET_SPEED_INCREMENT_RATIO = 0.10;
const PET_UPGRADE_COST_RATIO = 0.10;
const STORAGE_DEFAULT_CAPACITY_HOURS = 6;
const STORAGE_MIN_CLAIM_COINS = 10;

function petSpeedForLevel(petId, level) {
  const pet = PETS[petId];
  return pet.basespeed + (level - 1) * (pet.basespeed * PET_SPEED_INCREMENT_RATIO);
}

function petUpgradeCost(petId) {
  return Math.round(PETS[petId].price * PET_UPGRADE_COST_RATIO);
}

// مستويات مدة التخزين (Storage) بالساعات — الفهرس 0 = Lv.1 (الافتراضي عند
// أول شراء لأي شخصية). كل ترقية تكلّف نفس المبلغ الثابت (300,000، مطابق
// لسعر شراء The Duck)، وتُشتق قيمة المستوى الحالي مباشرة من capacity_hours
// المخزّنة بدون الحاجة لعمود منفصل.
const STORAGE_LEVELS = [6, 8, 12, 16, 24];
const STORAGE_MAX_LEVEL = STORAGE_LEVELS.length;
const STORAGE_UPGRADE_COST_COINS = 300000;

function storageLevelForCapacityHours(capacityHours) {
  const index = STORAGE_LEVELS.indexOf(capacityHours);
  return index === -1 ? 1 : index + 1;
}

export default {
  // يعمل تلقائياً كل يوم عند 00:00 UTC (Cron Trigger بلا أي تكلفة إضافية —
  // استدعاء واحد فقط باليوم، لا علاقة له بحصة الطلبات العادية أو rows read).
  async scheduled(event, env, ctx) {
    ctx.waitUntil(generateDailyCombo(env));
  },

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

    // شراء/ترقية أي حيوان: /api/pet/<pet_id>/buy أو /api/pet/<pet_id>/upgrade
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
      return handlePromoRedeem(request, env);
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

    // يُستدعى من سيرفر Adsgram مباشرة (server-to-server)، وليس من واجهتنا —
    // بدون initData، محمي فقط بمعامل secret (انظر handleAdsReward).
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

    if (url.pathname === "/api/checkin/claim" && request.method === "POST") {
      return handleCheckinClaim(request, env);
    }

    if (url.pathname === "/api/checkin/verify" && request.method === "POST") {
      return handleCheckinVerify(request, env);
    }

    if (url.pathname === "/api/tasks/list" && request.method === "POST") {
      return handleTasksList(request, env);
    }

    if (url.pathname === "/api/tasks/claim" && request.method === "POST") {
      return handleTasksClaim(request, env);
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

  const today = todayUTC();

  const userQuery = `
    SELECT u.telegram_id, u.username, u.coins, u.gram, u.total_speed, u.total_mined, u.is_admin,
           u.mining_started_at, u.mining_cycles_today, u.mining_cycle_date,
           u.streak_day, u.streak_last_claim_date,
           u.last_spin_date, u.last_chest_date, u.last_giftpick_date,
           u.last_withdraw_request_at,
           u.ads_task_count, u.ads_task_date,
           u.invites_count, u.active_referrals_count, u.referral_pending_earnings,
           u.milestone_10_claimed, u.milestone_25_claimed, u.milestone_50_claimed, u.milestone_100_claimed,
           u.checkin1_claimed_date, u.checkin2_claimed_date, u.checkin3_claimed_date, u.checkin4_claimed_date,
           u.bonus_ad_count_today, u.bonus_ad_date, u.bonus_ad_last_watched_at,
           s.capacity_hours AS storage_capacity_hours, s.last_claim_at AS storage_last_claim_at,
           ca.attempts_used AS combo_attempts_used, ca.solved AS combo_solved
    FROM users u
    LEFT JOIN user_storage s ON s.telegram_id = u.telegram_id
    LEFT JOIN combo_attempts ca ON ca.telegram_id = u.telegram_id AND ca.date = ?
    WHERE u.telegram_id = ?
  `;

  // موجود أصلاً؟ رجّع بياناته الحالية
  let user = await env.DB.prepare(userQuery).bind(today, telegramId).first();

  if (!user) {
    // أول مرة يفتح التطبيق — أنشئ له صف جديد
    await env.DB.prepare(
      "INSERT INTO users (telegram_id, username, referred_by) VALUES (?, ?, ?)"
    ).bind(telegramId, username, referredBy).run();

    // لو جاء بدعوة، سجّل العلاقة بجدول referrals الموجود مسبقاً + امنح
    // مكافأة التسجيل الفورية (+20) للمُحيل — مرة واحدة فقط لكل صديق (هذا
    // الفرع بالكامل لا يُنفَّذ إلا عند إنشاء صف المستخدم الجديد لأول مرة،
    // فلا حاجة لأي CAS إضافي).
    if (referredBy) {
      await env.DB.batch([
        env.DB.prepare(
          "INSERT OR IGNORE INTO referrals (referrer_id, referred_id, invited_at) VALUES (?, ?, ?)"
        ).bind(referredBy, telegramId, Date.now()),
        env.DB.prepare(
          "UPDATE users SET referral_pending_earnings = referral_pending_earnings + ?, invites_count = invites_count + 1 WHERE telegram_id = ?"
        ).bind(REFERRAL_SIGNUP_BONUS_COINS, referredBy)
      ]);
    }

    user = await env.DB.prepare(userQuery).bind(today, telegramId).first();
  }

  // كل الحيوانات المملوكة (قد يكون أكثر من واحد الآن) — استعلام منفصل
  // لأن LEFT JOIN مع .first() لا يصلح إذا كان هناك أكثر من صف مطابق.
  const petsResult = await env.DB.prepare(
    "SELECT pet_id, level, current_speed FROM user_pets WHERE telegram_id = ?"
  ).bind(telegramId).all();
  const pets = {};
  for (const row of (petsResult.results || [])) {
    pets[row.pet_id] = { level: row.level, speed: row.current_speed };
  }
  user.pets = pets;

  let view = withMiningView(user);
  view = withStreakView(view);
  view = withDailyPrizeView(view, "last_spin_date", "spin_claimed_today", "spin_next_reset_utc");
  view = withDailyPrizeView(view, "last_chest_date", "chest_claimed_today", "chest_next_reset_utc");
  view = withDailyPrizeView(view, "last_giftpick_date", "giftpick_claimed_today", "giftpick_next_reset_utc");
  view = withStorageView(view);
  view.exchange_rate_coin_to_gram = EXCHANGE_RATE_COIN_TO_GRAM;
  view.exchange_min_coins = EXCHANGE_MIN_COINS;
  view.withdraw_min_gram = WITHDRAW_MIN_GRAM;
  view.withdraw_fee_gram = WITHDRAW_FEE_GRAM;
  view.next_withdraw_allowed_at = user.last_withdraw_request_at
    ? user.last_withdraw_request_at + WITHDRAW_COOLDOWN_MS
    : null;
  view.combo_solved_today = !!user.combo_solved;
  view.combo_attempts_used = user.combo_attempts_used || 0;
  view.combo_max_attempts = COMBO_MAX_ATTEMPTS;

  view.ads_watched_today = user.ads_task_date === today ? (user.ads_task_count || 0) : 0;
  view.ads_daily_limit = ADS_TASK_DAILY_LIMIT;
  view.ads_reward_coins = ADS_TASK_REWARD_COINS;

  view.friends_invites = user.invites_count || 0;
  view.friends_active = user.active_referrals_count || 0;
  view.friends_pending_earnings = user.referral_pending_earnings || 0;
  view.friends_min_claim = REFERRAL_MIN_CLAIM_COINS;

  const milestonesResult = await env.DB.prepare(
    "SELECT friends_required, reward FROM milestone_missions ORDER BY friends_required ASC"
  ).all();
  view.friends_milestones = (milestonesResult.results || []).map((m) => ({
    count: m.friends_required,
    reward: m.reward,
    claimed: !!user[`milestone_${m.friends_required}_claimed`]
  }));

  view.checkin_claimed_today = {
    1: user.checkin1_claimed_date === today,
    2: user.checkin2_claimed_date === today,
    3: user.checkin3_claimed_date === today,
    4: user.checkin4_claimed_date === today
  };
  view.checkin_rewards = CHECKIN_TASK_REWARDS;

  view.bonus_ad_watched_today = user.bonus_ad_date === today ? (user.bonus_ad_count_today || 0) : 0;
  view.bonus_ad_daily_limit = BONUS_AD_DAILY_LIMIT;
  view.bonus_ad_reward_coins = BONUS_AD_REWARD_COINS;
  view.bonus_ad_next_available_at = user.bonus_ad_last_watched_at
    ? user.bonus_ad_last_watched_at + BONUS_AD_COOLDOWN_MS
    : null;

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
// نقطة /api/pet/<pet_id>/buy — شراء أي حيوان من PETS. تخصم السعر بشرط
// توفر الرصيد (CAS)، ثم تنشئ صف user_pets عند Lv.1، وتبدأ Storage
// بالتراكم فوراً إن لم تكن قد بدأت من حيوان سابق (INSERT OR IGNORE).
// =====================================================================
async function handlePetBuy(request, env, petId) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;
  const pet = PETS[petId];

  const existing = await env.DB.prepare(
    "SELECT 1 FROM user_pets WHERE telegram_id = ? AND pet_id = ?"
  ).bind(telegramId, petId).first();
  if (existing) return jsonResponse({ error: "already_owned" }, 409);

  const deductResult = await env.DB.prepare(
    `UPDATE users SET coins = coins - ?, total_speed = total_speed + ?
     WHERE telegram_id = ? AND coins >= ?`
  ).bind(pet.price, pet.basespeed, telegramId, pet.price).run();

  if (!deductResult.meta || deductResult.meta.changes === 0) {
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }

  const nowIso = new Date().toISOString();
  const insertPetStmt = env.DB.prepare(
    "INSERT INTO user_pets (telegram_id, pet_id, level, current_speed) VALUES (?, ?, 1, ?)"
  ).bind(telegramId, petId, pet.basespeed);
  const insertStorageStmt = env.DB.prepare(
    "INSERT OR IGNORE INTO user_storage (telegram_id, capacity_hours, last_claim_at) VALUES (?, ?, ?)"
  ).bind(telegramId, STORAGE_DEFAULT_CAPACITY_HOURS, nowIso);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'pet_purchase', ?, 'coins')"
  ).bind(telegramId, -pet.price);

  try {
    await env.DB.batch([insertPetStmt, insertStorageStmt, txnStmt]);
  } catch (e) {
    // نادر جداً: طلب شراء متزامن سبقه بجزء من الثانية — نُرجع العملات والسرعة
    await env.DB.prepare(
      "UPDATE users SET coins = coins + ?, total_speed = total_speed - ? WHERE telegram_id = ?"
    ).bind(pet.price, pet.basespeed, telegramId).run();
    return jsonResponse({ error: "already_owned" }, 409);
  }

  const updatedUser = await env.DB.prepare(
    "SELECT coins, total_speed FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    pet_id: petId,
    level: 1,
    speed: pet.basespeed,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins
  });
}

// =====================================================================
// نقطة /api/pet/<pet_id>/upgrade — ترقية أي حيوان مستوى واحد. التكلفة
// ثابتة (10% من سعر الشراء)، والسرعة الجديدة تُحسب دائماً من السرعة
// الأساسية + 10% لكل مستوى (وليس تراكمياً فوق السرعة الحالية).
// =====================================================================
async function handlePetUpgrade(request, env, petId) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  // ملاحظة مهمة: نجلب total_speed *الكلي* من users (وليس سرعة هذا الحيوان
  // فقط) لأن أكثر من حيوان قد يساهم بنفس Storage في آن واحد — إن استخدمنا
  // سرعة الحيوان المُرقّى فقط لحساب ما تراكم فسنُغفل مساهمة الحيوانات الأخرى.
  const row = await env.DB.prepare(
    `SELECT p.level, p.current_speed, u.total_speed, s.capacity_hours, s.last_claim_at
     FROM user_pets p
     JOIN users u ON u.telegram_id = p.telegram_id
     LEFT JOIN user_storage s ON s.telegram_id = p.telegram_id
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

  // نُصفّي (checkpoint) ما تراكم في Storage بالسرعة الكلية القديمة *قبل*
  // رفع سرعة هذا الحيوان — وإلا فإن كل الوقت المنقضي منذ آخر Claim سيُحتسب
  // لاحقاً بالسرعة الكلية الجديدة الأعلى، فتقفز قيمة Storage فجأة بشكل خاطئ.
  const capacitySeconds = (row.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
  let preUpgradeAccrued = 0;
  if (row.last_claim_at) {
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(row.last_claim_at)) / 1000);
    preUpgradeAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((row.total_speed || 0) / 3600);
  }

  const deductResult = await env.DB.prepare(
    `UPDATE users SET coins = coins - ? + ?, total_speed = total_speed + ?
     WHERE telegram_id = ? AND coins >= ?`
  ).bind(upgradeCost, preUpgradeAccrued, speedDelta, telegramId, upgradeCost).run();

  if (!deductResult.meta || deductResult.meta.changes === 0) {
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }

  const nowIso = new Date().toISOString();

  // شرط "level = المستوى القديم" يمنع تطبيق ترقيتين متزامنتين على نفس الحيوان
  const updatePetStmt = env.DB.prepare(
    `UPDATE user_pets SET level = ?, current_speed = ?
     WHERE telegram_id = ? AND pet_id = ? AND level = ?`
  ).bind(newLevel, newSpeed, telegramId, petId, row.level);

  // تصفير نقطة بداية التراكم الآن — السرعة الجديدة تُحسب من هذه اللحظة فقط
  const resetStorageStmt = env.DB.prepare(
    "UPDATE user_storage SET last_claim_at = ? WHERE telegram_id = ?"
  ).bind(nowIso, telegramId);

  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'pet_upgrade', ?, 'coins')"
  ).bind(telegramId, -upgradeCost);

  const stmts = [updatePetStmt, resetStorageStmt, txnStmt];
  if (preUpgradeAccrued > 0) {
    stmts.push(env.DB.prepare(
      "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'storage_auto_collect', ?, 'coins')"
    ).bind(telegramId, preUpgradeAccrued));
  }

  const [updatePetResult] = await env.DB.batch(stmts);

  if (!updatePetResult.meta || updatePetResult.meta.changes === 0) {
    // نادر: طلب ترقية متزامن سبقه — نُرجع العملات (بما فيها ما صُفِّي من Storage) والسرعة
    await env.DB.prepare(
      "UPDATE users SET coins = coins + ? - ?, total_speed = total_speed - ? WHERE telegram_id = ?"
    ).bind(upgradeCost, preUpgradeAccrued, speedDelta, telegramId).run();
    return jsonResponse({ error: "level_changed" }, 409);
  }

  const updatedUser = await env.DB.prepare(
    "SELECT coins, total_speed FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    pet_id: petId,
    level: newLevel,
    speed: newSpeed,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins,
    storage_credited: preUpgradeAccrued,
    is_max_level: newLevel >= PET_MAX_LEVEL
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

// =====================================================================
// نقطة /api/storage/upgrade — ترقية مدة Storage (5 مستويات: 6→8→12→16→24
// ساعة). التكلفة ثابتة لكل مستوى (300,000). قبل رفع السعة نُصفّي
// (checkpoint) ما تراكم بالسعة القديمة أولاً — وإلا فإن رفع السقف
// سيجعل نفس الوقت المنقضي يُحتسب فجأة بسعة أكبر (نفس مشكلة ترقية
// The Duck)، فنضمن أن السعة الجديدة تسري فقط من هذه اللحظة فصاعداً.
// =====================================================================
async function handleStorageUpgrade(request, env) {
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

  const currentCapacityHours = row.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS;
  const currentLevel = storageLevelForCapacityHours(currentCapacityHours);
  if (currentLevel >= STORAGE_MAX_LEVEL) {
    return jsonResponse({ error: "max_level_reached", level: currentLevel }, 400);
  }

  const newLevel = currentLevel + 1;
  const newCapacityHours = STORAGE_LEVELS[newLevel - 1];
  const newCapacitySeconds = newCapacityHours * 3600;

  const oldCapacitySeconds = currentCapacityHours * 3600;
  const perSecondRate = (row.total_speed || 0) / 3600;
  const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(row.last_claim_at)) / 1000);
  const preUpgradeAccrued = Math.min(elapsedSeconds, oldCapacitySeconds) * perSecondRate;

  const deductResult = await env.DB.prepare(
    `UPDATE users SET coins = coins - ? + ?
     WHERE telegram_id = ? AND coins >= ?`
  ).bind(STORAGE_UPGRADE_COST_COINS, preUpgradeAccrued, telegramId, STORAGE_UPGRADE_COST_COINS).run();

  if (!deductResult.meta || deductResult.meta.changes === 0) {
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }

  const nowIso = new Date().toISOString();

  // شرط "capacity_hours = القيمة القديمة" يمنع تطبيق ترقيتين متزامنتين
  const updateStorageStmt = env.DB.prepare(
    `UPDATE user_storage SET capacity_hours = ?, last_claim_at = ?
     WHERE telegram_id = ? AND capacity_hours = ?`
  ).bind(newCapacityHours, nowIso, telegramId, currentCapacityHours);

  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'storage_upgrade', ?, 'coins')"
  ).bind(telegramId, -STORAGE_UPGRADE_COST_COINS);

  const stmts = [updateStorageStmt, txnStmt];
  if (preUpgradeAccrued > 0) {
    stmts.push(env.DB.prepare(
      "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'storage_auto_collect', ?, 'coins')"
    ).bind(telegramId, preUpgradeAccrued));
  }

  const [updateStorageResult] = await env.DB.batch(stmts);

  if (!updateStorageResult.meta || updateStorageResult.meta.changes === 0) {
    // نادر: طلب ترقية متزامن سبقه — نُرجع العملات (بما فيها ما صُفِّي من Storage)
    await env.DB.prepare(
      "UPDATE users SET coins = coins + ? - ? WHERE telegram_id = ?"
    ).bind(STORAGE_UPGRADE_COST_COINS, preUpgradeAccrued, telegramId).run();
    return jsonResponse({ error: "level_changed" }, 409);
  }

  const updatedUser = await env.DB.prepare(
    "SELECT coins FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    level: newLevel,
    capacity_hours: newCapacityHours,
    capacity_seconds: newCapacitySeconds,
    coins: updatedUser.coins,
    storage_credited: preUpgradeAccrued,
    is_max_level: newLevel >= STORAGE_MAX_LEVEL
  });
}

// =====================================================================
// نقطة /api/promo/redeem — استبدال كود خصم. غير قابل للتلاعب: صحة الكود،
// تاريخ الانتهاء، الحد الأقصى للاستخدام، ومنع الاستخدام المزدوج لنفس
// المستخدم — كلها تُتحقَّق وتُفرَض من السيرفر فقط عبر قاعدة البيانات.
// =====================================================================
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

  // "نحجز" هذا الاستخدام أولاً عبر INSERT — يفشل تلقائياً لو استُخدم نفس
  // الكود من نفس المستخدم من قبل (PRIMARY KEY telegram_id+code)، فيمنع
  // أي محاولة استبدال مزدوج حتى لو تكرر نفس الطلب بسرعة.
  try {
    await env.DB.prepare(
      "INSERT INTO promo_redemptions (telegram_id, code) VALUES (?, ?)"
    ).bind(telegramId, code).run();
  } catch (e) {
    return jsonResponse({ error: "already_redeemed" }, 409);
  }

  // نستخدم عدّاداً مخزَّناً (uses_count) بدل COUNT(*) على promo_redemptions
  // في كل محاولة — قراءة/كتابة صف واحد ثابتة التكلفة بدل مسح كل السجلات
  // المتراكمة لكل كود، وأرخص بكثير على D1 كلما زاد عدد المستخدمين له.
  // شرط "uses_count < max_uses" ذرّي: يمنع تجاوز الحد حتى مع طلبات متزامنة.
  const counterResult = await env.DB.prepare(
    `UPDATE promo_codes SET uses_count = uses_count + 1
     WHERE code = ? AND (max_uses IS NULL OR uses_count < max_uses)`
  ).bind(code).run();

  if (!counterResult.meta || counterResult.meta.changes === 0) {
    // الحد الأقصى استُنفد — نُلغي الحجز الذي أخذناه للتو
    await env.DB.prepare(
      "DELETE FROM promo_redemptions WHERE telegram_id = ? AND code = ?"
    ).bind(telegramId, code).run();
    return jsonResponse({ error: "code_exhausted" }, 400);
  }

  const column = promo.currency === "gram" ? "gram" : "coins";
  const creditStmt = env.DB.prepare(
    `UPDATE users SET ${column} = ${column} + ? WHERE telegram_id = ?`
  ).bind(promo.reward, telegramId);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'promo_redeem', ?, ?)"
  ).bind(telegramId, promo.reward, column);
  await env.DB.batch([creditStmt, txnStmt]);

  const updatedUser = await env.DB.prepare(
    "SELECT coins, gram FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    reward: promo.reward,
    currency: column,
    coins: updatedUser.coins,
    gram: updatedUser.gram
  });
}

// =====================================================================
// نقطة /api/exchange — تحويل Coins إلى Gram بسعر الصرف الموحّد. خصم
// ذري بشرط توفر الرصيد (CAS) يمنع تحويل رصيد غير موجود.
// =====================================================================
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

  const result = await env.DB.prepare(
    `UPDATE users SET coins = coins - ?, gram = gram + ?
     WHERE telegram_id = ? AND coins >= ?`
  ).bind(amountCoins, gramAmount, telegramId, amountCoins).run();

  if (!result.meta || result.meta.changes === 0) {
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }

  await env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'exchange', ?, 'coins')"
  ).bind(telegramId, -amountCoins).run();

  const updatedUser = await env.DB.prepare(
    "SELECT coins, gram FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    exchanged_coins: amountCoins,
    received_gram: gramAmount,
    coins: updatedUser.coins,
    gram: updatedUser.gram
  });
}

// =====================================================================
// نقطة /api/deposit/info — تُرجع عنوان محفظة الإيداع + memo (تعليق TON)
// الخاص بهذا المستخدم فقط (= telegram_id كنص)، تُستخدم الواجهة هذا الـ
// memo لمطابقة معاملة هذا المستخدم بالتحديد على البلوكتشين.
// =====================================================================
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

// =====================================================================
// نقطة /api/deposit/check — تُشغّل (أو تُرجع حالة) DepositChecker: Durable
// Object واحد لكل مستخدم (idFromName) يفحص بلوكتشين TON بشكل دوري (alarm)
// بحثاً عن معاملة بنفس memo، بغض النظر عن حالة اتصال المتصفح.
// =====================================================================
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

// =====================================================================
// نقطة /api/deposit/status — تجلب حالة الفحص الحالية من DepositChecker.
// عند اكتمال الفحص (found/already_processed) تُرفق أيضاً رصيد Coins
// المُحدَّث حتى تُحدِّث الواجهة الرصيد المعروض فوراً بدون طلب /api/user إضافي.
// =====================================================================
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
      "SELECT coins, gram FROM users WHERE telegram_id = ?"
    ).bind(telegramId).first();
    return jsonResponse({ ...doData, coins: updatedUser.coins, gram: updatedUser.gram });
  }

  return jsonResponse(doData);
}

// =====================================================================
// DepositChecker — Durable Object واحد لكل مستخدم (idFromName(`user_${id}`)).
// يفحص TonCenter بشكل دوري (alarm) عن معاملة واردة على DEPOSIT_ADDRESS
// بنفس memo، ثم يحسب Coins المقابلة (Gram × DEPOSIT_GRAM_TO_COINS_RATE)
// ويحصّلها في D1 مرة واحدة فقط لكل tx_hash (قيد UNIQUE في جدول deposits
// يمنع أي تحصيل مضاعف حتى مع إعادة محاولة الـ alarm).
// =====================================================================
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
        return jsonResponse({ status: "pending", alreadyRunning: true });
      }

      const { telegramId, memo } = await request.json();

      await this.state.storage.put("telegramId", telegramId);
      await this.state.storage.put("memo", String(memo));
      await this.state.storage.put("status", "pending");
      await this.state.storage.put("startTime", Date.now());
      await this.state.storage.put("attempts", 0);
      await this.state.storage.delete("amountGram");
      await this.state.storage.delete("coinsCredited");

      await this.state.storage.setAlarm(Date.now() + DEPOSIT_CHECK_FIRST_DELAY_MS);
      return jsonResponse({ status: "pending" });
    }

    if (url.pathname === "/status" && request.method === "GET") {
      const status = (await this.state.storage.get("status")) ?? "idle";
      const amountGram = (await this.state.storage.get("amountGram")) ?? null;
      const coinsCredited = (await this.state.storage.get("coinsCredited")) ?? null;
      return jsonResponse({ status, amount_gram: amountGram, coins_credited: coinsCredited });
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

            // عمولة إحالة 5% من قيمة الإيداع بالعملات — تُضاف لرصيد المُحيل
            // المعلّق ضمن نفس الدفعة الذرّية أدناه (تتراجع تلقائياً معها لو
            // فشلت الدفعة بالكامل، ولا تتكرر أبداً بفضل قيد tx_hash الفريد).
            const depositor = await this.env.DB.prepare(
              "SELECT referred_by FROM users WHERE telegram_id = ?"
            ).bind(telegramId).first();
            const referrerId = depositor?.referred_by || null;
            const referralCommission = referrerId ? coinsCredited * REFERRAL_DEPOSIT_COMMISSION_RATE : 0;

            const depositBatch = [
              this.env.DB.prepare(
                "INSERT INTO deposits (telegram_id, tx_hash, amount_gram, coins_credited, status, memo, created_at) VALUES (?, ?, ?, ?, 'confirmed', ?, ?)"
              ).bind(telegramId, txHash, amountGram, coinsCredited, memo, Date.now()),
              this.env.DB.prepare(
                "UPDATE users SET coins = coins + ? WHERE telegram_id = ?"
              ).bind(coinsCredited, telegramId),
              this.env.DB.prepare(
                "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'deposit', ?, 'coins')"
              ).bind(telegramId, coinsCredited)
            ];
            if (referrerId) {
              depositBatch.push(
                this.env.DB.prepare(
                  "UPDATE users SET referral_pending_earnings = referral_pending_earnings + ? WHERE telegram_id = ?"
                ).bind(referralCommission, referrerId),
                this.env.DB.prepare(
                  "UPDATE referrals SET earned_coins = earned_coins + ? WHERE referrer_id = ? AND referred_id = ?"
                ).bind(referralCommission, referrerId, telegramId)
              );
            }

            try {
              await this.env.DB.batch(depositBatch);
            } catch (e) {
              // D1 يُرجع الدفعة (batch) بالكامل ذرّية: لو فشل الإدراج بسبب tx_hash
              // مكرر (UNIQUE) فهذا يعني أن هذه المعاملة سُجِّلت واحتُسبت في محاولة
              // سابقة بالفعل — لا تُكرَّر. أي خطأ آخر (فشل D1 مؤقت مثلاً) لم تُكتب
              // فيه أي عملية بالفعل (الدفعة كلها تراجعت) فيجب ألا تُصنَّف كحالة
              // نهائية "already_processed" (كذبة تُوقف كل إعادة محاولة لاحقة) —
              // بل تُترك بدون تغيير الحالة حتى يعيد alarm التالي فحص نفس المعاملة.
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
      // شبكة/توكن سنتر غير متاح مؤقتاً — يُعاد المحاولة في الـ alarm التالي
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

// =====================================================================
// نقطة /api/withdraw/request — سحب يدوي بالكامل. يخصم المبلغ فوراً
// (حجز CAS ذرّي يتحقق أيضاً من انتهاء فترة الـ24 ساعة في نفس الاستعلام)،
// يسجّل الطلب "pending"، وينشر منشوراً بالقناة الإدارية بزري Approve/Reject.
// =====================================================================
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
  const netGram = Math.max(0, amountGram - WITHDRAW_FEE_GRAM);

  // شرط CAS واحد يضمن ذرّياً: الرصيد كافٍ + انتهاء فترة الـ24 ساعة معاً —
  // يمنع سباقاً بين طلبين متزامنين من نفس المستخدم يتجاوزان أي من الشرطين.
  const reserveStmt = env.DB.prepare(
    `UPDATE users SET gram = gram - ?, last_withdraw_request_at = ?
     WHERE telegram_id = ? AND gram >= ?
       AND (last_withdraw_request_at IS NULL OR last_withdraw_request_at <= ?)`
  ).bind(amountGram, now, telegramId, amountGram, cooldownCutoff);

  const insertStmt = env.DB.prepare(
    `INSERT INTO withdrawals
       (telegram_id, raw_username, first_name, amount_gram, fee_gram, net_gram, address, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
  ).bind(telegramId, rawUsername, firstName, amountGram, WITHDRAW_FEE_GRAM, netGram, address, now);

  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'withdraw_request', ?, 'gram')"
  ).bind(telegramId, -amountGram);

  // حجز الرصيد + تسجيل الطلب في batch واحد ذرّي: إما الاثنان معاً أو لا شيء
  // إطلاقاً — لو فشل الإدراج (مثلاً جدول withdrawals غير موجود بعد) لن
  // يُخصَم أي رصيد بدون سجل مقابل له، بدل ترك المستخدم بخصم بلا أثر.
  let batchResults;
  try {
    batchResults = await env.DB.batch([reserveStmt, insertStmt, txnStmt]);
  } catch (e) {
    console.error("withdraw request batch failed:", e?.message || e);
    return jsonResponse({ error: "server_error" }, 500);
  }

  const [reserveResult, insertResult] = batchResults;

  if (!reserveResult.meta || reserveResult.meta.changes === 0) {
    const user = await env.DB.prepare(
      "SELECT gram, last_withdraw_request_at FROM users WHERE telegram_id = ?"
    ).bind(telegramId).first();
    if (user && user.last_withdraw_request_at && user.last_withdraw_request_at > cooldownCutoff) {
      return jsonResponse({
        error: "cooldown_active",
        next_allowed_at: user.last_withdraw_request_at + WITHDRAW_COOLDOWN_MS
      }, 400);
    }
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }

  const withdrawalId = insertResult.meta.last_row_id;

  // إشعارات تيليجرام (منشور القناة + رسالة خاصة للمستخدم) بعد تأكيد نجاح
  // الحجز والتسجيل بالكامل. أي فشل هنا لا يُفشل الطلب نفسه (الرصيد محجوز
  // والسجل موجود فعلاً في withdrawals) لكن يُسجَّل بالتفصيل عبر console.error
  // ليمكن تشخيصه (مثلاً: البوت ليس أدمن في القناة، أو ADMIN_CHANNEL_ID خطأ).
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

  const updatedUser = await env.DB.prepare(
    "SELECT gram FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    gram: updatedUser.gram,
    net_gram: netGram,
    next_allowed_at: now + WITHDRAW_COOLDOWN_MS
  });
}

// =====================================================================
// نقطة /api/wallet/history — سجل معاملات Wallet: آخر 5 إيداعات مؤكدة
// (status='confirmed') + آخر 5 طلبات سحب (pending/approved/rejected) —
// 10 كحد أقصى إجمالاً بعد الدمج والترتيب حسب التاريخ.
// =====================================================================
async function handleWalletHistory(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const [depositsResult, withdrawalsResult] = await env.DB.batch([
    env.DB.prepare(
      "SELECT coins_credited AS amount, created_at FROM deposits WHERE telegram_id = ? AND status = 'confirmed' ORDER BY created_at DESC LIMIT 5"
    ).bind(telegramId),
    env.DB.prepare(
      "SELECT net_gram AS amount, status, created_at FROM withdrawals WHERE telegram_id = ? ORDER BY created_at DESC LIMIT 5"
    ).bind(telegramId)
  ]);

  const items = [];
  for (const row of (depositsResult.results || [])) {
    items.push({ type: "deposit", amount: row.amount, status: "confirmed", created_at: row.created_at });
  }
  for (const row of (withdrawalsResult.results || [])) {
    items.push({ type: "withdraw", amount: row.amount, status: row.status, created_at: row.created_at });
  }
  items.sort((a, b) => b.created_at - a.created_at);

  return jsonResponse({ items: items.slice(0, 10) });
}

// =====================================================================
// نقطة /api/ads/reward — يستدعيها سيرفر Adsgram مباشرة (server-to-server،
// GET request) بعد تأكدهم فعلياً من مشاهدة المستخدم للإعلان بالكامل.
// هذا هو المصدر الوحيد لمنح مكافأة هذه المهمة — لا شيء في الواجهة يستطيع
// منحها بنفسه. الحماية: معامل secret يجب أن يطابق ADSGRAM_REWARD_SECRET
// (Cloudflare Secret) بالضبط، وإلا يُرفض الطلب فوراً بدون أي تأثير.
// =====================================================================
async function handleAdsReward(url, env) {
  const secret = url.searchParams.get("secret");
  if (!env.ADSGRAM_REWARD_SECRET || secret !== env.ADSGRAM_REWARD_SECRET) {
    return new Response("forbidden", { status: 403 });
  }

  const telegramId = parseInt(url.searchParams.get("userid"), 10);
  if (!Number.isFinite(telegramId)) {
    return new Response("bad request", { status: 400 });
  }

  // "Bonus AD Every 1H" يستخدم Block منفصل تماماً (Reward URL يحمل
  // ?task=bonus_ad) — منطق مختلف بالكامل (تبريد ساعة + حد 5/يوم بدل 10/يوم).
  if (url.searchParams.get("task") === "bonus_ad") {
    return handleBonusAdReward(telegramId, env);
  }

  const row = await env.DB.prepare(
    "SELECT ads_task_count, ads_task_date, ads_task_total, referred_by FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) {
    return new Response("user not found", { status: 404 });
  }

  const today = todayUTC();
  const countToday = row.ads_task_date === today ? (row.ads_task_count || 0) : 0;
  if (countToday >= ADS_TASK_DAILY_LIMIT) {
    return new Response("limit reached", { status: 200 });
  }

  const newCount = countToday + 1;
  const newTotal = (row.ads_task_total || 0) + 1;

  // شرط CAS على القيمة السابقة بالتحديد (نفس أسلوب mining_started_at) —
  // لو وصل نفس الطلب مرتين (إعادة إرسال من Adsgram) لن يُمنح إلا مرة
  // واحدة، لأن المنح والحماية في نفس عبارة UPDATE الواحدة.
  const updateStmt = env.DB.prepare(
    `UPDATE users SET coins = coins + ?, ads_task_count = ?, ads_task_date = ?, ads_task_total = ?
     WHERE telegram_id = ? AND (ads_task_date IS NULL OR ads_task_date <> ? OR ads_task_count = ?)`
  ).bind(ADS_TASK_REWARD_COINS, newCount, today, newTotal, telegramId, today, countToday);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'ads_task', ?, 'coins')"
  ).bind(telegramId, ADS_TASK_REWARD_COINS);

  const [updateResult] = await env.DB.batch([updateStmt, txnStmt]);

  // لو هذا أول عبور لعتبة "نشط" (ads_task_total تجاوز الحد للتو) ولهذا
  // المستخدم مُحيل: امنح المُحيل مكافأة +130 مرة واحدة فقط، محمية بشرط
  // is_active=0 في نفس عبارة UPDATE (نفس أسلوب الحماية أعلاه). is_active
  // وearned_coins عمودان على جدول referrals الموجود مسبقاً بالقاعدة.
  if (updateResult.meta && updateResult.meta.changes > 0 && row.referred_by && newTotal >= ACTIVE_FRIEND_ADS_THRESHOLD) {
    const activateResult = await env.DB.prepare(
      `UPDATE referrals SET is_active = 1, earned_coins = earned_coins + ?
       WHERE referrer_id = ? AND referred_id = ? AND is_active = 0`
    ).bind(REFERRAL_ACTIVE_BONUS_COINS, row.referred_by, telegramId).run();

    if (activateResult.meta && activateResult.meta.changes > 0) {
      await env.DB.prepare(
        `UPDATE users SET referral_pending_earnings = referral_pending_earnings + ?, active_referrals_count = active_referrals_count + 1
         WHERE telegram_id = ?`
      ).bind(REFERRAL_ACTIVE_BONUS_COINS, row.referred_by).run();
    }
  }

  return new Response("OK", { status: 200 });
}

// =====================================================================
// منطق "Bonus AD Every 1H" — إعلان إضافي كل ساعة، بحد أقصى 5/يوم. شرط
// CAS يجمع ثلاثة أمور في عبارة UPDATE واحدة: القيمة السابقة بالتحديد
// لـbonus_ad_last_watched_at (يمنع الاستلام المضاعف من نفس النداء
// المكرر)، تصفير العداد اليومي ضمنياً عند تغيّر اليوم، والحد الأقصى 5.
// =====================================================================
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

  const updateStmt = env.DB.prepare(
    `UPDATE users SET coins = coins + ?, bonus_ad_count_today = ?, bonus_ad_date = ?, bonus_ad_last_watched_at = ?
     WHERE telegram_id = ?
       AND (bonus_ad_last_watched_at IS NULL OR bonus_ad_last_watched_at = ?)
       AND (bonus_ad_date IS NULL OR bonus_ad_date <> ? OR bonus_ad_count_today = ?)`
  ).bind(BONUS_AD_REWARD_COINS, newCount, today, now, telegramId, oldLastWatchedAt, today, countToday);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'bonus_ad', ?, 'coins')"
  ).bind(telegramId, BONUS_AD_REWARD_COINS);

  await env.DB.batch([updateStmt, txnStmt]);

  return new Response("OK", { status: 200 });
}

// =====================================================================
// نقطة /api/friends/claim_earnings — تحوّل رصيد الإحالة المعلّق (تسجيل +
// نشاط + عمولة إيداع) إلى coins فعلية، بشرط ألا يقل عن REFERRAL_MIN_CLAIM_COINS.
// القيمة تُلتقَط أولاً ثم تُستخدم كشرط CAS بالتحديد في عبارة التحديث،
// فيبقى الرقم المُرجَع (claimed) مضموناً أن يطابق ما أُضيف فعلياً.
// =====================================================================
async function handleFriendsClaimEarnings(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const row = await env.DB.prepare(
    "SELECT coins, referral_pending_earnings FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);

  const pending = row.referral_pending_earnings || 0;
  if (pending < REFERRAL_MIN_CLAIM_COINS) {
    return jsonResponse({ error: "below_minimum", minimum: REFERRAL_MIN_CLAIM_COINS, pending }, 400);
  }

  // CAS على القيمة المعلّقة المُلتقَطة بالتحديد أعلاه — يضمن أن الرقم
  // المُرجَع (claimed) يطابق فعلياً ما أُضيف لـcoins، حتى لو وصلت مكافأة
  // إحالة جديدة بالتزامن (عندها فقط تفشل هذه المحاولة، ويحاول المستخدم
  // مجدداً بالقيمة الجديدة الأحدث بدل استلام رقم غير دقيق).
  const claimStmt = await env.DB.prepare(
    `UPDATE users SET coins = coins + ?, referral_pending_earnings = referral_pending_earnings - ?
     WHERE telegram_id = ? AND referral_pending_earnings = ?`
  ).bind(pending, pending, telegramId, pending).run();

  if (!claimStmt.meta || claimStmt.meta.changes === 0) {
    return jsonResponse({ error: "try_again" }, 409);
  }

  return jsonResponse({ claimed: pending, coins: row.coins + pending });
}

// =====================================================================
// نقطة /api/friends/claim_milestone — تمنح مكافأة عتبة "أصدقاء نشطون"
// مباشرة كـcoins (لا تمر عبر الرصيد المعلّق). العتبة والمكافأة تُقرأان
// من جدول milestone_missions (وليستا رقمين ثابتين)، وtier يجب أن يطابق
// friends_required لصف موجود فعلاً قبل استخدامه في اسم العمود، فلا خطر
// حقن SQL رغم استخدام template literal هنا.
// =====================================================================
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
  const milestone = await env.DB.prepare(
    "SELECT friends_required, reward FROM milestone_missions WHERE friends_required = ?"
  ).bind(tier).first();
  if (!milestone) {
    return jsonResponse({ error: "invalid_tier" }, 400);
  }

  const column = `milestone_${milestone.friends_required}_claimed`;
  const claimStmt = await env.DB.prepare(
    `UPDATE users SET coins = coins + ?, ${column} = 1
     WHERE telegram_id = ? AND active_referrals_count >= ? AND ${column} = 0`
  ).bind(milestone.reward, telegramId, milestone.friends_required).run();

  if (!claimStmt.meta || claimStmt.meta.changes === 0) {
    return jsonResponse({ error: "not_eligible" }, 400);
  }

  const user = await env.DB.prepare(
    "SELECT coins FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({ reward: milestone.reward, coins: user.coins });
}

// =====================================================================
// نقطة /api/friends/list — تُستدعى فقط عند ضغط المستخدم على "Show The
// List" (وليس مع كل /api/user) لتفادي أي كلفة إضافية على أكثر نقطة
// استدعاءً بالتطبيق. LIMIT 100 يحدّ من كلفة القراءة حتى لمُحيل ضخم جداً.
// =====================================================================
async function handleFriendsList(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const result = await env.DB.prepare(
    `SELECT u.telegram_id, u.username, u.ads_task_total, r.earned_coins, r.is_active
     FROM referrals r
     JOIN users u ON u.telegram_id = r.referred_id
     WHERE r.referrer_id = ?
     ORDER BY r.invited_at DESC
     LIMIT 100`
  ).bind(telegramId).all();

  const friends = (result.results || []).map((r) => ({
    name: r.username || ("User " + r.telegram_id),
    ads_watched: r.ads_task_total || 0,
    earned_coins: r.earned_coins || 0,
    active: !!r.is_active
  }));

  return jsonResponse({ friends });
}

// يهرّب أي نص قبل إرساله كمعامل URL لطلب Telegram API — يمنع أي حقن أو
// كسر تنسيق الرابط.
function telegramApiUrl(env, method, params) {
  const url = new URL(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

// تحقق حقيقي: هل يحتوي الاسم الظاهر (يصل مع initData في كل طلب، ولا حاجة
// لأي استدعاء إضافي لتيليجرام) على "@MinerXRealmBot"؟
function verifyNameContainsBotMention(auth) {
  const fullName = `${auth.firstName || ""} ${auth.lastName || ""}`.toLowerCase();
  return fullName.includes("@minerxrealmbot") || fullName.includes("minerxrealmbot");
}

// تحقق حقيقي: getChat تُرجع حقل bio للمحادثات الخاصة (طالما المستخدم لم
// يحظر البوت، وهو محقَّق هنا لأنه فتح البوت أصلاً ليشغّل التطبيق) — نتأكد
// أن الـbio يحتوي رابط إحالة هذا المستخدم تحديداً وليس أي رابط عشوائي.
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

// =====================================================================
// نقطة /api/checkin/claim — تستلم مكافأة إحدى مهام Check-in الأربع
// اليومية. الحماية: عبارة UPDATE واحدة تجمع بين التحقق من التاريخ (لم
// تُستلَم اليوم) ومنح المكافأة معاً، فلا خطر من استلام مضاعف حتى لو تكرر
// نفس الطلب بسرعة.
// =====================================================================
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

  const today = todayUTC();
  const updateStmt = env.DB.prepare(
    `UPDATE users SET coins = coins + ?, ${column} = ?
     WHERE telegram_id = ? AND (${column} IS NULL OR ${column} <> ?)`
  ).bind(reward, today, telegramId, today);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, ?, ?, 'coins')"
  ).bind(telegramId, `checkin_task_${task}`, reward);

  const [result] = await env.DB.batch([updateStmt, txnStmt]);
  if (!result.meta || result.meta.changes === 0) {
    return jsonResponse({ error: "already_claimed_today" }, 409);
  }

  const user = await env.DB.prepare("SELECT coins FROM users WHERE telegram_id = ?").bind(telegramId).first();
  return jsonResponse({ reward, coins: user.coins });
}

// =====================================================================
// نقطة /api/checkin/verify — تحقق فقط (بدون منح أي مكافأة) لمهام 3/4،
// تُستخدم لإظهار زر Claim للمستخدم فقط بعد إتمام الشرط فعلياً. الحماية
// الحقيقية تبقى في handleCheckinClaim نفسه الذي يعيد التحقق قبل المنح،
// فحتى لو تلاعب أحدهم بالواجهة فلن يحصل على المكافأة دون تحقق حقيقي.
// =====================================================================
async function handleCheckinVerify(request, env) {
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
  if (task !== 3 && task !== 4) {
    return jsonResponse({ error: "invalid_task" }, 400);
  }

  const verified = task === 3
    ? verifyNameContainsBotMention(auth)
    : await verifyBioContainsReferralLink(env, telegramId);

  return jsonResponse({ verified });
}

// =====================================================================
// نقطة /api/tasks/list — تُرجع مهام Partner أو Special الفعّالة من جدول
// admin_tasks (يُدار حالياً يدوياً عبر D1 Console، ولاحقاً من لوحة أدمن)
// مع حالة "تم الاستلام؟" لكل مهمة بالنسبة لهذا المستخدم تحديداً.
// =====================================================================
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
    `SELECT t.id, t.title, t.icon_url, t.reward_coins, t.link, t.channel_id,
            c.telegram_id AS claimed
     FROM admin_tasks t
     LEFT JOIN admin_task_claims c ON c.task_id = t.id AND c.telegram_id = ?
     WHERE t.section = ? AND t.is_active = 1
     ORDER BY t.display_order ASC, t.id ASC`
  ).bind(telegramId, section).all();

  const tasks = (result.results || []).map((t) => ({
    id: t.id,
    title: t.title,
    icon_url: t.icon_url,
    reward: t.reward_coins,
    link: t.link,
    requires_membership: !!t.channel_id,
    claimed: !!t.claimed
  }));

  return jsonResponse({ tasks });
}

// =====================================================================
// نقطة /api/tasks/claim — تمنح مكافأة مهمة Partner/Special واحدة (مرة
// واحدة فقط مدى الحياة، وليست يومية). لو كانت المهمة مرتبطة بقناة
// (channel_id)، تُتحقَّق العضوية فعلياً عبر getChatMember قبل المنح.
// الحماية من الاستلام المضاعف: INSERT OR IGNORE في admin_task_claims
// يُنفَّذ بمفرده أولاً (قيد UNIQUE هو الـCAS)، ولا يُمنح أي عملة إلا لو
// نجح هذا الإدراج بالتحديد.
// =====================================================================
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
    "SELECT id, reward_coins, channel_id FROM admin_tasks WHERE id = ? AND is_active = 1"
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

  const insertResult = await env.DB.prepare(
    "INSERT OR IGNORE INTO admin_task_claims (telegram_id, task_id, claimed_at) VALUES (?, ?, ?)"
  ).bind(telegramId, taskId, Date.now()).run();

  if (!insertResult.meta || insertResult.meta.changes === 0) {
    return jsonResponse({ error: "already_claimed" }, 409);
  }

  await env.DB.batch([
    env.DB.prepare("UPDATE users SET coins = coins + ? WHERE telegram_id = ?").bind(task.reward_coins, telegramId),
    env.DB.prepare(
      "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'admin_task', ?, 'coins')"
    ).bind(telegramId, task.reward_coins)
  ]);

  const user = await env.DB.prepare("SELECT coins FROM users WHERE telegram_id = ?").bind(telegramId).first();
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

// =====================================================================
// تُستدعى تلقائياً من scheduled() عند 00:00 UTC فقط (انظر أعلى الملف).
// تختار ترتيباً عشوائياً جديداً لبطاقات Daily Combo، تحفظه، وترسل
// الإجابة الصحيحة للأدمن فقط عبر رسالة خاصة تيليجرام — لا شيء غير هذا
// يكشف الترتيب الصحيح (لا استجابة API ولا رسالة عامة تحتويه إطلاقاً).
// =====================================================================
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

// خلط Fisher-Yates باستخدام Web Crypto (نفس أسلوب pickWeightedSpinIndex)
// بدل Math.random لعشوائية أفضل تناسب تركيبة يومية حقيقية.
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// =====================================================================
// نقطة /api/combo/check — يرسل المستخدم ترتيبه المخمَّن لبطاقات اليوم
// الثلاث. لا تُرسَل أبداً الإجابة الصحيحة لأي طلب هنا (لا عند النجاح ولا
// عند الفشل) — فقط "صحيح/خطأ" و"كم محاولة تبقّت".
//
// السلامة من السباقات: خطوة استهلاك المحاولة (UPDATE على combo_attempts
// بشرط solved=0 AND attempts_used<الحد) تُنفَّذ بمفردها أولاً عبر .run()
// وليس ضمن batch مع منح المكافأة — لو فشلت (changes=0) نتوقف فوراً بدون
// تنفيذ أي شيء آخر. فقط لو نجحت هذه الخطوة الذرّية بالتحديد ننتقل لمنح
// الـ100 عملة، فيستحيل منح المكافأة أكثر من مرة أو تجاوز المحاولتين حتى
// لو وصل نفس الطلب للسيرفر أكثر من مرة في نفس اللحظة.
// =====================================================================
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
  const combo = await env.DB.prepare(
    "SELECT card_order FROM daily_combo WHERE date = ?"
  ).bind(today).first();
  if (!combo) {
    return jsonResponse({ error: "combo_not_ready" }, 409);
  }

  // يضمن وجود صف المحاولات لهذا المستخدم/اليوم قبل أي تحديث ذرّي عليه
  await env.DB.prepare(
    "INSERT OR IGNORE INTO combo_attempts (telegram_id, date, attempts_used, solved) VALUES (?, ?, 0, 0)"
  ).bind(telegramId, today).run();

  const attemptRow = await env.DB.prepare(
    "SELECT attempts_used, solved FROM combo_attempts WHERE telegram_id = ? AND date = ?"
  ).bind(telegramId, today).first();

  if (attemptRow.solved) {
    return jsonResponse({ error: "already_solved" }, 409);
  }
  if (attemptRow.attempts_used >= COMBO_MAX_ATTEMPTS) {
    return jsonResponse({ error: "no_attempts_left" }, 409);
  }

  const isCorrect = guess.join(",") === combo.card_order;

  const claimResult = await env.DB.prepare(
    `UPDATE combo_attempts SET attempts_used = attempts_used + 1, solved = ?
     WHERE telegram_id = ? AND date = ? AND solved = 0 AND attempts_used < ?`
  ).bind(isCorrect ? 1 : 0, telegramId, today, COMBO_MAX_ATTEMPTS).run();

  if (!claimResult.meta || claimResult.meta.changes === 0) {
    // طلب آخر (نفس اللحظة) سبقه واستهلك المحاولة الأخيرة أو حلّها بالفعل
    return jsonResponse({ error: "no_attempts_left" }, 409);
  }

  const newAttemptsUsed = attemptRow.attempts_used + 1;

  if (!isCorrect) {
    return jsonResponse({
      correct: false,
      attempts_used: newAttemptsUsed,
      attempts_left: COMBO_MAX_ATTEMPTS - newAttemptsUsed
    });
  }

  // وصلنا هنا فقط لو التحديث الذرّي أعلاه نجح بالتحديد لهذا الطلب — أي
  // طلب آخر متزامن كان سيفشل بشرط "solved = 0"، فلا خطر من منح المكافأة
  // أكثر من مرة حتى بدون شرط CAS إضافي هنا.
  const rewardStmt = env.DB.prepare(
    "UPDATE users SET coins = coins + ? WHERE telegram_id = ?"
  ).bind(COMBO_REWARD_COINS, telegramId);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'daily_combo', ?, 'coins')"
  ).bind(telegramId, COMBO_REWARD_COINS);
  await env.DB.batch([rewardStmt, txnStmt]);

  const user = await env.DB.prepare(
    "SELECT coins FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    correct: true,
    reward: COMBO_REWARD_COINS,
    coins: user.coins,
    attempts_used: newAttemptsUsed
  });
}

// يحسب حالة Storage الحالية (كم تراكم؟ هل امتلأ؟ كم تبقّى؟) بدون أي
// كتابة لقاعدة البيانات — يُستخدم فقط للعرض في /api/user.
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

  // referred_by يجي من رابط الدعوة (t.me/MinerXRealmBot/app?startapp=ref_84213) عبر start_param
  const startParam = params.get("start_param");
  let referredBy = null;
  if (startParam && startParam.startsWith("ref_")) {
    const parsed = parseInt(startParam.replace("ref_", ""), 10);
    if (!isNaN(parsed) && parsed !== telegramId) referredBy = parsed;
  }

  // rawUsername/firstName منفصلان عن username (الذي يخلط بينهما) — لازمان
  // لبناء اسم عرض صحيح في رسائل السحب: "@user" فقط لو كان اسم مستخدم حقيقياً،
  // وإلا الاسم الأول بدون "@" (لا نضع "@" أمام اسم عادي، سيظهر كمنشن مكسور).
  return {
    ok: true,
    telegramId,
    username,
    rawUsername: tgUser.username || null,
    firstName: tgUser.first_name || null,
    lastName: tgUser.last_name || null,
    referredBy
  };
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

  // أزرار Approve/Reject لطلبات السحب — فقط ADMIN_TELEGRAM_ID يُنفَّذ له أي إجراء،
  // أي ضغطة من أي شخص آخر تُرفض بتنبيه بدون أي تأثير على البيانات.
  if (update.callback_query) {
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

// =====================================================================
// يبني نص رسالة السحب الثلاث حالاتها (pending/approved/rejected) — نفس
// البيانات، فقط العنوان/الإيموجي يتغيّر، ويُحذف قسم الأزرار عند الرفض.
// =====================================================================
// يهرب الرموز الخاصة بـ HTML قبل تضمين أي نص مصدره المستخدم (اسم المستخدم،
// الاسم الأول، عنوان المحفظة) داخل رسالة بصيغة parse_mode=HTML — يمنع كسر
// تنسيق الرسالة أو حقن وسوم غير مقصودة.
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

  // <code> يجعل تيليجرام يعرض النص بخط أحادي المسافة قابل للضغط للنسخ
  // بضغطة واحدة — مطبَّق على ID المستخدم وعنوان المحفظة تحديداً.
  return (
    `${title}\n\n` +
    `👤 ${nameLine}\n` +
    `🆔 <code>${w.telegramId}</code>\n\n` +
    `💵 Amount: ${w.netGram} Gram\n\n` +
    `📍 Address:\n<code>${escapeHtml(w.address)}</code>`
  );
}

// =====================================================================
// يعالج ضغطة Approve/Reject على منشور السحب في القناة. يتحقق أولاً أن
// الضاغط هو ADMIN_TELEGRAM_ID، ثم يستخدم شرط "status='pending'" كـ CAS
// ذرّي يمنع تنفيذ الزر مرتين (مثلاً لو ضُغط Approve وReject في نفس اللحظة).
// =====================================================================
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
    const updateResult = await env.DB.prepare(
      "UPDATE withdrawals SET status = ?, resolved_at = ? WHERE id = ? AND status = 'pending'"
    ).bind(newStatus, Date.now(), withdrawalId).run();

    if (!updateResult.meta || updateResult.meta.changes === 0) {
      await answerCallbackQuery(env, cbq.id, "⚠️ Already processed");
      return;
    }

    const w = await env.DB.prepare(
      "SELECT * FROM withdrawals WHERE id = ?"
    ).bind(withdrawalId).first();

    if (newStatus === "rejected") {
      // إعادة المبلغ الكامل (المخصوم عند الطلب) لرصيد المستخدم
      await env.DB.batch([
        env.DB.prepare("UPDATE users SET gram = gram + ? WHERE telegram_id = ?")
          .bind(w.amount_gram, w.telegram_id),
        env.DB.prepare(
          "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'withdraw_refund', ?, 'gram')"
        ).bind(w.telegram_id, w.amount_gram)
      ]);
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
