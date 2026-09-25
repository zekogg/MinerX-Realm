// URL of the deployed Mini App (same Worker serving the static assets)
const WEBAPP_URL = "https://minerxrealm.zekobusiness0.workers.dev/";

// إعدادات رسالة الترحيب (sendWelcomeMessage) — صورة + أزرار الدعم/السحوبات (رابط القناة نفسه موجود مسبقاً في NEWS_CHANNEL_URL أدناه).
const WELCOME_PHOTO_URL = "https://raw.githubusercontent.com/zekogg/MinerX-Realm/refs/heads/main/frontend/MinerX%20Welcome%20.webp";
const PAYOUTS_CHANNEL_URL = "https://t.me/MinerXRealmWithdrawals";
// استبدل هذا باليوزرنيم الحقيقي لحساب الدعم — بمجرد التغيير يعمل زر Support فوراً بلا أي تعديل آخر بالكود.
const SUPPORT_USERNAME = "REPLACE_WITH_SUPPORT_USERNAME";

// ===================================================================== إعدادات دورة "Start Mining" الأساسية (شخصية Doge — منفصلة تماماً عن حيوانات Realm والتخزين). كل القيم ثابتة هنا ولا تُقرأ أبداً من المتصفح. =====================================================================
const MINING_CYCLE_SECONDS = 60 * 60; // 60 دقيقة لكل دورة
const MINING_REWARD_COINS = 80;       // مكافأة كل دورة كاملة
const MINING_DAILY_LIMIT = 5;         // أقصى عدد دورات باليوم (يُصفَّر 00:00 UTC)

// ===================================================================== إعدادات Daily Streak: دورة أسبوعية متكررة (بعد اليوم 7 يرجع لليوم 1)، وأي انقطاع يوم كامل بدون Claim يُعيد التسلسل لليوم 1 (عقوبة انقطاع). المكافآت ثابتة هنا فقط وتطابق ما هو معروض بالواجهة. =====================================================================
const STREAK_REWARDS = [50, 100, 150, 200, 250, 300, 500]; // index 0 = اليوم 1

// ===================================================================== إعدادات عجلة الحظ (Spin): دورة واحدة مجانية باليوم، تُصفَّر 00:00 UTC. الترتيب هنا يطابق تماماً ترتيب الشرائح الثمانية بالواجهة (كل شريحة 45 درجة، بدءاً من الأعلى وباتجاه عقارب الساعة). الاختيار عشوائي مرجّح (weighted random) من السيرفر فقط — لا شيء يُستقبل من المتصفح سوى initData. وزن كل جائزة من 10000 (يساوي نسبتها المئوية × 100): 50 عملة = 88% ، 100 = 5% ، 250 = 5% ، 1000 = 1%  (المجموع 99%) كل جوائز Gram الأربع تتقاسم الـ1% المتبقي بالتساوي (0.25% لكل واحدة) =====================================================================
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

// سعر صرف Coins <-> Gram الموحّد (يُستخدم في الواجهة لعرض "≈ Gram" وفي نافذة Exchange) — مصدر واحد بدل تكرار الرقم في أكثر من مكان.
const EXCHANGE_RATE_COIN_TO_GRAM = 0.00001;
const EXCHANGE_MIN_COINS = 1000; // الحد الأدنى لعملية Exchange واحدة

// ===================================================================== إعدادات الإيداع (Deposit): إيداع Gram على شبكة TON يُحوَّل مباشرة إلى Coins بنفس سعر صرف Exchange بالعكس (1 Gram = 1/EXCHANGE_RATE_COIN_TO_GRAM Coins) — نفس الرقم المعروض حالياً بالواجهة (val * 100000). الفحص الفعلي لبلوكتشين TON يتم داخل DepositChecker (Durable Object واحد لكل مستخدم). =====================================================================
const DEPOSIT_GRAM_TO_COINS_RATE = 1 / EXCHANGE_RATE_COIN_TO_GRAM; // 100000
const DEPOSIT_MIN_GRAM = 3; // أقل مبلغ إيداع مسموح به
const DEPOSIT_CHECK_TIMEOUT_MS = 120_000; // ينتقل status إلى "timeout" بعد هذا الوقت من بدء الفحص
const DEPOSIT_CHECK_MAX_ATTEMPTS = 8;
const DEPOSIT_CHECK_FIRST_DELAY_MS = 5_000;
const DEPOSIT_CHECK_RETRY_DELAY_MS = 15_000;

// ===================================================================== إعدادات السحب (Withdraw): سحب يدوي بالكامل — المستخدم يطلب، يُخصم المبلغ فوراً من رصيده (حجز)، ويُرسَل منشور للقناة الإدارية بزري Approve/Reject. لا يوجد فحص بلوكتشين آلي هنا (الإرسال يدوي من الأدمن خارج البوت بالكامل). "Amount" الظاهر في الرسائل = المبلغ الصافي (Net) بعد خصم الرسوم — هو الرقم الذي يجب على الأدمن إرساله فعلياً. =====================================================================
const WITHDRAW_MIN_GRAM = 0.1;
const WITHDRAW_FEE_GRAM = 0.02;
const WITHDRAW_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 ساعة، تبدأ فور الطلب بغض النظر عن النتيجة
const ADMIN_TELEGRAM_ID = 1018495986;
const ADMIN_CHANNEL_ID = -1004325013522;
const PLAY_GAME_URL = "https://t.me/MinerXRealmBot/app";
const NEWS_CHANNEL_URL = "https://t.me/MinerXRealmNews";

// ===================================================================== إعدادات Daily Combo: عند 00:00 UTC كل يوم (Cron Trigger — انظر [triggers] في wrangler.toml) يختار السيرفر ترتيباً عشوائياً جديداً لنفس البطاقات الثلاث الثابتة (Duck, Polar Bear, Penguin) ويحفظه في daily_combo، ثم يرسل الإجابة الصحيحة للأدمن فقط عبر رسالة خاصة — لا يصل أي جزء منها للمستخدم أو للواجهة إطلاقاً. للمستخدم محاولتان فقط يومياً لتخمين نفس التسلسل بالضبط (الترتيب مهم، وليس فقط اختيار البطاقات الصحيحة)، مقابل مكافأة ثابتة عند النجاح. =====================================================================
const COMBO_CARDS = ["duck", "polar_bear", "penguin"];
const COMBO_CARD_LABELS = { duck: "Duck", polar_bear: "Polar Bear", penguin: "Penguin" };
const COMBO_REWARD_COINS = 100;
const COMBO_MAX_ATTEMPTS = 2;

// ===================================================================== إعدادات مهمة "Watch Adsgram Ad" (بطاقة Daily Ads الوحيدة المربوطة بشبكة إعلانات حقيقية حالياً — باقي البطاقات ما زالت تصميماً ثابتاً). المكافأة تُمنح فقط عند استدعاء Adsgram الفعلي لـ Reward URL من سيرفرهم (server-to-server) بعد تأكدهم من مشاهدة الإعلان بالكامل — لا شيء يُمنح بناءً على أي شيء يرسله المتصفح مباشرة، ومحمي بالرمز السري ADSGRAM_REWARD_SECRET (Cloudflare Secret). =====================================================================
const ADS_TASK_REWARD_COINS = 15;
const ADS_TASK_DAILY_LIMIT = 10;

// ===================================================================== إعدادات صفحة Friends: مكافآت الإحالة الثلاث (تسجيل + نشاط + عمولة إيداع) تتجمّع كلها في users.referral_pending_earnings، ولا تُضاف لـ coins إلا بالضغط على Claim صراحة (بحد أدنى REFERRAL_MIN_CLAIM_COINS). "نشط" = وصول الصديق لـACTIVE_FRIEND_ADS_THRESHOLD إعلان Adsgram تراكمياً مدى الحياة (ads_task_total) — منفصل تماماً عن ads_task_count اليومي الذي يُصفَّر كل 00:00 UTC. مكافآت Milestone Missions تُضاف مباشرة لـcoins عند الاستحقاق، ولا تمر عبر الرصيد المعلّق. عتبات/مكافآت Milestone Missions تُقرأ من جدول milestone_missions الموجود مسبقاً بالقاعدة (وليست أرقاماً ثابتة هنا) — قابلة للتعديل من القاعدة مباشرة بدون نشر كود جديد. حالة "نشط" وأرباح كل صديق تُخزَّن في عمودين جديدين على جدول referrals الموجود مسبقاً (is_active, earned_coins) بدل جدول منفصل، تفادياً لتكرار نفس المفهوم في مكانين. أما علم "تم الاستلام" لكل عتبة (milestone_*_claimed) فبقي كأعمدة مسطّحة على users (وليس جدولاً منفصلاً user_milestones) لأنها أرخص فعلياً على /api/user — أكثر نقطة استدعاءً بالتطبيق — إذ لا تتطلب أي JOIN إضافي. =====================================================================
const REFERRAL_SIGNUP_BONUS_COINS = 20;
const REFERRAL_ACTIVE_BONUS_COINS = 180;
const REFERRAL_DEPOSIT_COMMISSION_RATE = 0.05;
const REFERRAL_MIN_CLAIM_COINS = 5000;
const ACTIVE_FRIEND_ADS_THRESHOLD = 10;

// ===================================================================== Weekly Leaderboard: ترتيب أسبوعي بقسمين (By Ads / By Referrals) من weekly_ads_watched/weekly_active_referrals (عدادان منفصلان تماماً عن lifetime_ads_watched/active_referrals_count، يُصفَّران فقط هما كل جمعة 00:30 UTC بعد منح الجوائز — انظر handleLeaderboardPayout وscheduled()). =====================================================================
const LEADERBOARD_RANK_LIMIT = 20;
const LEADERBOARD_PRIZES = [20000, 15000, 10000, 5000, 5000, 5000, 5000, 5000, 5000, 5000]; // رتب 1-10، 11-20 بلا جائزة

// ===================================================================== "نشط" يعتمد الآن على lifetime_ads_watched (عدّاد موحّد: GigaPub وMonetixAds — مهمتاهما الحقيقيتان + بوابات الأزرار الست كلها — انظر bumpLifetimeAdsWatched)، بدل ads_task_total الخاص بـAdsgram وحده، لأن Adsgram لم توافق عليه الشبكة بعد. نفس هذا العدّاد يفتح شخصية The Guardian الحصرية عند GUARDIAN_ADS_THRESHOLD (لا علاقة له بـACTIVE_FRIEND_ADS_THRESHOLD أعلاه، رقمان منفصلان لغرضين مختلفين تماماً). =====================================================================
const GUARDIAN_ADS_THRESHOLD = 4000;
const GUARDIAN_SPEED = 50;
const HAPPY_DOG_FRIENDS_THRESHOLD = 100;
const HAPPY_DOG_SPEED = 50;

// ===================================================================== إعدادات مهام Check-in الأربع اليومية (تُصفَّر 00:00 UTC، نفس أسلوب باقي الميزات اليومية). المهمتان 1 و2 بدون أي تحقق حقيقي (النقر على الرابط ثم انتظار 5 ثوانٍ فقط من الواجهة). المهمتان 3 و4 لهما تحقق حقيقي من طرف السيرفر قبل السماح بالاستلام: - المهمة 3: هل يحتوي اسم المستخدم الظاهر (first_name+last_name، يصل مع كل initData) على "@MinerXRealmBot"؟ - المهمة 4: هل تحتوي نبذته (bio) — عبر Telegram getChat، تُرجع bio للمحادثات الخاصة — على رابط إحالته الخاص "ref_<telegram_id>" تحديداً؟ =====================================================================
const CHECKIN_TASK_REWARDS = { 1: 10, 2: 10, 3: 20, 4: 20 };

// ===================================================================== إعدادات "Bonus AD Every 1H": إعلان Adsgram إضافي كل ساعة، بحد أقصى 5 مرات باليوم. يستخدم Block منفصل تماماً عن Watch Adsgram Ad اليومية (Reward URL مختلف يحمل ?task=bonus_ad) لأن Adsgram لا يرسل أي شيء غير userid في نداء Reward URL، فلا توجد طريقة أخرى للتمييز بين الميزتين على مستوى السيرفر. =====================================================================
const BONUS_AD_REWARD_COINS = 15;
const BONUS_AD_DAILY_LIMIT = 5;
const BONUS_AD_COOLDOWN_MS = 60 * 60 * 1000; // ساعة واحدة بين كل إعلان والتالي

// ===================================================================== إعدادات "Watch gigapub ads": GigaPub أكّد دعمه Postback URL حقيقي (GET، معامل uid يحمل معرّف المستخدم + event=ad_shown، ويُطلَب الرد بـ200 على كل طلب) — نفس مبدأ Adsgram تماماً. الحماية: معامل secret ثابت نضيفه نحن للرابط عند تسجيله بلوحة GigaPub (وليس من ضمن قيمهم)، يجب أن يطابق GIGAPUB_POSTBACK_SECRET (Cloudflare Secret) بالضبط. =====================================================================
const GIGAPUB_REWARD_COINS = 15;
const GIGAPUB_DAILY_LIMIT = 8;

// ===================================================================== إعدادات "Watch MonetixAds": MonetixAds لا يوفّر Postback/Reward URL من سيرفره — التأكيد بالكامل من طرف العميل (window.showRewardAd(callback)) حسب تعليماتهم الرسمية. لتقليل خطر التلاعب قدر الإمكان بدون Postback: هذه النقطة POST محمية بـinitData الموثّق من تيليجرام (توقيع حقيقي لا يمكن تزويره من Console)، والسيرفر هو من يحسم الحد اليومي والمكافأة بشرط CAS، لا الواجهة. =====================================================================
const MONETIX_REWARD_COINS = 15;
const MONETIX_DAILY_LIMIT = 10;

// ===================================================================== إعدادات حيوانات Realm القابلة للشراء + Storage. نفس القاعدة لكل الحيوانات الستة (مطابقة لما طُبِّق على The Duck): - السرعة عند الشراء (Lv.1) = basespeed الخاص بالحيوان، وكل مستوى يضيف 10% من هذه القيمة الأساسية بشكل ثابت (وليس من السرعة المحدَّثة)، حتى الحد الأقصى PET_MAX_LEVEL (30) لكل الحيوانات. - تكلفة الترقية ثابتة لكل مستوى = 10% من سعر الشراء (نفس نسبة Duck). - Storage: يبدأ بالتراكم فور شراء أول حيوان (أي حيوان)، يمتلئ حسب Total Speed الكلي (مجموع كل الحيوانات المملوكة معاً)، وله حد أدنى للاستلام (10 عملات) حتى لا يُستنزف بمبالغ ضئيلة جداً. =====================================================================
const PETS = {
  duck:         { basespeed: 114,   price: 300000 },
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

// مستويات مدة التخزين (Storage) بالساعات — الفهرس 0 = Lv.1 (الافتراضي عند أول شراء لأي شخصية). كل ترقية تكلّف نفس المبلغ الثابت (300,000، مطابق لسعر شراء The Duck)، وتُشتق قيمة المستوى الحالي مباشرة من capacity_hours المخزّنة بدون الحاجة لعمود منفصل.
const STORAGE_LEVELS = [6, 8, 12, 16, 24];
const STORAGE_MAX_LEVEL = STORAGE_LEVELS.length;
const STORAGE_UPGRADE_COST_COINS = 300000;

function storageLevelForCapacityHours(capacityHours) {
  const index = STORAGE_LEVELS.indexOf(capacityHours);
  return index === -1 ? 1 : index + 1;
}

export default {
  // Cron Triggers بلا أي تكلفة إضافية — استدعاء واحد فقط لكل جدولة، لا علاقة له بحصة الطلبات العادية أو rows read. يفرّق بين الجدولتين عبر event.cron كي لا تُنفَّذ مهمة اليوم الأخرى بالخطأ عند تنفيذ الأسبوعية.
  async scheduled(event, env, ctx) {
    if (event.cron === "0 0 * * *") {
      // يومياً 00:00 UTC: يختار تركيبة Daily Combo الجديدة ويرسلها للأدمن فقط.
      ctx.waitUntil(generateDailyCombo(env));
    } else if (event.cron === "30 0 * * 5") {
      // أسبوعياً الجمعة 00:30 UTC فقط: توزيع جوائز Weekly Leaderboard.
      ctx.waitUntil(handleLeaderboardPayout(env));
    }
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    // أداة تشخيص خاصة بالأدمن فقط (ADMIN_TELEGRAM_ID) — لا تُغيّر أي منطق موجود
    // ولا تُنفَّذ إطلاقاً لغير الأدمن: تعدّ عدد استعلامات D1 و rows_read/written
    // خلال هذا الطلب فقط، وترفقها في رد الـAPI كحقل _debug ليعرضه Eruda بالواجهة.
    const dbStats = { queries: 0, rows_read: 0, rows_written: 0, rows_read_exact: true };
    let isAdminDebug = false;
    if (request.method === "POST") {
      try {
        const peekBody = await request.clone().json();
        if (peekBody && peekBody.initData && await validateInitData(peekBody.initData, env.BOT_TOKEN)) {
          const tgUser = JSON.parse(new URLSearchParams(peekBody.initData).get("user") || "null");
          if (tgUser && tgUser.id === ADMIN_TELEGRAM_ID) isAdminDebug = true;
        }
      } catch (e) { /* أي فشل هنا يعني فقط عدم تفعيل التشخيص — لا يؤثر على الطلب نفسه */ }
    }

    let dbEnv = env;
    if (isAdminDebug) {
      // REAL_STMT يسمح باستخراج العنصر الحقيقي (D1PreparedStatement) من خلف
      // أي Proxy قبل تمريره لـ.batch() الحقيقي — بعض معالجات المكافآت (تعدين،
      // storage، شراء/ترقية الحيوانات، سحب/إيداع...) تبني عناصر batch عبر
      // env.DB.prepare().bind() ثم تمررها لـ.batch(); لو مرّرنا الـProxy نفسه
      // بدل العنصر الحقيقي قد يفشل تنفيذ D1 الفعلي — هذا يضمن عدم حدوث ذلك
      // حتى لحساب الأدمن نفسه أثناء استخدام أي ميزة عادية بالتطبيق.
      const REAL_STMT = Symbol("realStmt");
      const wrapStatement = (stmt) => new Proxy(stmt, {
        get(target, prop) {
          if (prop === REAL_STMT) return target;
          if (prop === "bind") return (...args) => wrapStatement(target.bind(...args));
          if (prop === "run" || prop === "all") {
            return async (...args) => {
              const result = await target[prop](...args);
              dbStats.queries++;
              if (result && result.meta) {
                dbStats.rows_read += result.meta.rows_read || 0;
                dbStats.rows_written += result.meta.rows_written || 0;
              }
              return result;
            };
          }
          if (prop === "first" || prop === "raw") {
            return async (...args) => {
              dbStats.queries++;
              dbStats.rows_read_exact = false; // first()/raw() لا يرجعان rows_read من Cloudflare أصلاً
              return target[prop](...args);
            };
          }
          return target[prop];
        }
      });
      dbEnv = new Proxy(env, {
        get(target, prop) {
          if (prop !== "DB") return target[prop];
          return new Proxy(target.DB, {
            get(dbTarget, dbProp) {
              if (dbProp === "prepare") return (sql) => wrapStatement(dbTarget.prepare(sql));
              if (dbProp === "batch") {
                return async (stmts) => {
                  const realStmts = stmts.map((s) => (s && s[REAL_STMT]) ? s[REAL_STMT] : s);
                  const results = await dbTarget.batch(realStmts);
                  dbStats.queries += stmts.length;
                  for (const r of results) {
                    if (r && r.meta) {
                      dbStats.rows_read += r.meta.rows_read || 0;
                      dbStats.rows_written += r.meta.rows_written || 0;
                    }
                  }
                  return results;
                };
              }
              return dbTarget[dbProp];
            }
          });
        }
      });
    }

    const response = await routeRequest(request, dbEnv, url);
    if (!isAdminDebug) return response;

    try {
      const ct = response.headers.get("content-type") || "";
      if (!ct.includes("application/json")) return response;
      const data = await response.clone().json();
      data._debug = { route: url.pathname, ...dbStats };
      return new Response(JSON.stringify(data), { status: response.status, headers: response.headers });
    } catch (e) {
      return response; // أي فشل بالإرفاق يعيد الرد الأصلي كما هو دون أي تأثير
    }
  }
};

async function routeRequest(request, env, url) {
    // Telegram sends updates here
    if (url.pathname === "/telegram-webhook") {
      return handleTelegram(request, env);
    }

    // Mini App calls this on load: validates the user and returns their balance
    if (url.pathname === "/api/user" && request.method === "POST") {
      return handleGetUser(request, env);
    }

    if (url.pathname === "/api/realm/status" && request.method === "POST") {
      return handleRealmStatus(request, env);
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

    // يُستدعى من سيرفر Adsgram مباشرة (server-to-server)، وليس من واجهتنا — بدون initData، محمي فقط بمعامل secret (انظر handleAdsReward).
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

    if (url.pathname === "/api/checkin/verify" && request.method === "POST") {
      return handleCheckinVerify(request, env);
    }

    if (url.pathname === "/api/tasks/list" && request.method === "POST") {
      return handleTasksList(request, env);
    }

    if (url.pathname === "/api/tasks/claim" && request.method === "POST") {
      return handleTasksClaim(request, env);
    }

    // يُستدعى من سيرفر GigaPub مباشرة (server-to-server، GET) بعد تأكدهم فعلياً من عرض الإعلان — بدون initData، محمي فقط بمعامل secret (انظر handleGigapubPostback). يجب الرد بـ200 على كل طلب حسب طلبهم.
    if (url.pathname === "/api/gigapub/postback" && request.method === "GET") {
      return handleGigapubPostback(url, env);
    }

    if (url.pathname === "/api/monetix/reward" && request.method === "POST") {
      return handleMonetixReward(request, env);
    }

    if (url.pathname === "/api/ads/gate-watched" && request.method === "POST") {
      return handleAdsGateWatched(request, env);
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

    // نقطة منفصلة عن /api/user عمداً — تُستدعى فقط عند فتح نافذة Profile فعلياً (وليس في كل تحديث دوري)، لأنها تحتوي استعلامات SUM إضافية (إجمالي الإيداع/السحب) لا حاجة لتكرارها في أكثر نقطة استدعاءً بالتطبيق.
    if (url.pathname === "/api/profile" && request.method === "POST") {
      return handleProfile(request, env);
    }

    // نقاط لوحة الأدمن — كلها محمية بـauthenticateAdmin (انظر تعريفها أعلاه)، لا تُنفَّذ إطلاقاً لغير ADMIN_TELEGRAM_ID حتى مع initData حقيقي وموثَّق لحساب آخر.
    if (url.pathname === "/api/admin/user/find" && request.method === "POST") {
      return handleAdminUserFind(request, env);
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
    if (url.pathname === "/api/admin/promo/create" && request.method === "POST") {
      return handleAdminPromoCreate(request, env);
    }
    if (url.pathname === "/api/admin/ambassador/grant" && request.method === "POST") {
      return handleAdminAmbassadorGrant(request, env);
    }
    if (url.pathname === "/api/admin/ambassador/revoke" && request.method === "POST") {
      return handleAdminAmbassadorRevoke(request, env);
    }

    // نقطة منفصلة عن /api/user عمداً — تُستدعى فقط عند فتح نافذة Leaderboard فعلياً، ومحمية بكاش يومي (Cache API) لا يلمس D1 إلا مرة واحدة يومياً.
    if (url.pathname === "/api/leaderboard" && request.method === "POST") {
      return handleLeaderboard(request, env);
    }

    // Everything else -> serve the Mini App static files. الصفحة الرئيسية (index.html) تُعاد دائماً بلا أي Cache — متصفح Telegram الداخلي (WebView) يخزّنها بقوة أحياناً حتى مع تحديثات فعلية على السيرفر، فيظهر للمستخدم كود قديم رغم نشر تعديل حقيقي؛ فرض no-store يمنع ذلك.
    const assetResponse = await env.ASSETS.fetch(request);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const noCacheResponse = new Response(assetResponse.body, assetResponse);
      noCacheResponse.headers.set("Cache-Control", "no-store, must-revalidate");
      return noCacheResponse;
    }
    return assetResponse;
}

// ===================================================================== نقطة /api/user — تُستدعى من الواجهة عند فتح التطبيق. تتحقق من initData (توقيع تيليجرام)، تنشئ صف المستخدم لو ما كان موجود، وترجع بياناته (الرصيد، السرعة، حالة التعدين، إلخ) عشان الواجهة تعرضها بدل الأرقام الثابتة. =====================================================================
async function handleGetUser(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId, username, referredBy, photoUrl } = auth;

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
           u.gigapub_task_count, u.gigapub_task_date, u.photo_url,
           u.monetix_task_count, u.monetix_task_date, u.lifetime_ads_watched,
           ca.attempts_used AS combo_attempts_used, ca.solved AS combo_solved
    FROM users u
    LEFT JOIN combo_attempts ca ON ca.telegram_id = u.telegram_id AND ca.date = ?
    WHERE u.telegram_id = ?
  `;

  // موجود أصلاً؟ رجّع بياناته الحالية
  let user = await env.DB.prepare(userQuery).bind(today, telegramId).first();

  if (!user) {
    // أول مرة يفتح التطبيق — أنشئ له صف جديد
    await env.DB.prepare(
      "INSERT INTO users (telegram_id, username, referred_by, created_at, photo_url) VALUES (?, ?, ?, ?, ?)"
    ).bind(telegramId, username, referredBy, Date.now(), photoUrl).run();

    // لو جاء بدعوة، سجّل العلاقة بجدول referrals الموجود مسبقاً + امنح مكافأة التسجيل الفورية (+20) للمُحيل — مرة واحدة فقط لكل صديق (هذا الفرع بالكامل لا يُنفَّذ إلا عند إنشاء صف المستخدم الجديد لأول مرة، فلا حاجة لأي CAS إضافي).
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

    // فتح البوت عبر رابط Mini App المباشر (t.me/MinerXRealmBot/app) لا يُرسل /start
    // إطلاقاً، فهذا أول فتح فعلي هو الفرصة الوحيدة لإرسال رسالة الترحيب. أي فشل هنا
    // (مثلاً تيليجرام لم يُنشئ محادثة خاصة بعد) لا يجب أن يمنع إنشاء المستخدم إطلاقاً.
    try {
      await sendWelcomeMessage(env, telegramId);
    } catch (e) { /* تجاهل — لا علاقة له بنجاح إنشاء المستخدم أو تحميل التطبيق */ }

    user = await env.DB.prepare(userQuery).bind(today, telegramId).first();
  } else if (photoUrl && photoUrl !== user.photo_url) {
    // تحديث الصورة المخزَّنة فقط لو تغيّرت فعلاً (نادر) — تفيد لاحقاً بعرض صور الأصدقاء بأماكن كقائمة Friends التي لا تملك initData الخاص بهم.
    await env.DB.prepare("UPDATE users SET photo_url = ? WHERE telegram_id = ?").bind(photoUrl, telegramId).run();
    user.photo_url = photoUrl;
  }

  let view = withMiningView(user);
  view = withStreakView(view);
  view = withDailyPrizeView(view, "last_spin_date", "spin_claimed_today", "spin_next_reset_utc");
  view = withDailyPrizeView(view, "last_chest_date", "chest_claimed_today", "chest_next_reset_utc");
  view = withDailyPrizeView(view, "last_giftpick_date", "giftpick_claimed_today", "giftpick_next_reset_utc");
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

  view.gigapub_watched_today = user.gigapub_task_date === today ? (user.gigapub_task_count || 0) : 0;
  view.gigapub_daily_limit = GIGAPUB_DAILY_LIMIT;
  view.gigapub_reward_coins = GIGAPUB_REWARD_COINS;

  view.monetix_watched_today = user.monetix_task_date === today ? (user.monetix_task_count || 0) : 0;
  view.monetix_daily_limit = MONETIX_DAILY_LIMIT;
  view.monetix_reward_coins = MONETIX_REWARD_COINS;

  return jsonResponse({ user: view });
}

// ===================================================================== نقطة /api/realm/status — تُستدعى فقط عند أول فتح فعلي لصفحة Realm أو نافذتي Free Pet/Quick Free Pet (وليس مع كل /api/user). تجمع: الحيوانات المملوكة، توفّر/استلام Happy Dog وGuardian والAmbassador، وحالة Storage الكاملة (withStorageView نفسها المستخدمة سابقاً بـ/api/user) — كل هذا لا يظهر في أي واجهة أخرى غير هذه الثلاث، فعزله يوفّر 3 استعلامات كاملة (JOIN + pets.all + ambassador.first) من أكثر نقطة استدعاءً بالتطبيق. =====================================================================
async function handleRealmStatus(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const [row, petsResult, ambassadorGrant] = await Promise.all([
    env.DB.prepare(
      `SELECT u.total_speed, u.lifetime_ads_watched,
              s.capacity_hours AS storage_capacity_hours, s.last_claim_at AS storage_last_claim_at
       FROM users u
       LEFT JOIN user_storage s ON s.telegram_id = u.telegram_id
       WHERE u.telegram_id = ?`
    ).bind(telegramId).first(),
    env.DB.prepare(
      "SELECT pet_id, level, current_speed FROM user_pets WHERE telegram_id = ?"
    ).bind(telegramId).all(),
    env.DB.prepare(
      "SELECT 1 FROM ambassador_grants WHERE telegram_id = ?"
    ).bind(telegramId).first()
  ]);

  if (!row) return jsonResponse({ error: "user_not_found" }, 404);

  const pets = {};
  for (const r of (petsResult.results || [])) {
    pets[r.pet_id] = { level: r.level, speed: r.current_speed };
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
    ambassador_available: !!ambassadorGrant,
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

// ===================================================================== نقطة /api/mine/start — بدء دورة تعدين جديدة (شخصية Doge الأساسية). السيرفر هو من يسجّل وقت البدء؛ لا شيء يُستقبل من المتصفح سوى initData. =====================================================================
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

// ===================================================================== نقطة /api/mine/claim — استلام مكافأة دورة تعدين مكتملة. المدة المنقضية تُحسب من وقت السيرفر المخزّن، والتحديث يتم بشرط (Compare-And-Swap) على mining_started_at لمنع استلام المكافأة مرتين حتى لو وصل نفس الطلب للسيرفر أكثر من مرة في نفس اللحظة. =====================================================================
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

// ===================================================================== نقطة /api/streak/claim — استلام مكافأة اليوم من Daily Streak. كل الحساب من السيرفر: أي يوم في التسلسل الحالي، هل انقطع التسلسل، وهل تم الاستلام اليوم بالفعل. لا شيء يُستقبل من المتصفح سوى initData. =====================================================================
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

// ===================================================================== نقطة /api/spin/claim — تنفيذ دورة الحظ المجانية اليومية. نقطة /api/chest/claim — فتح الصندوق المجاني اليومي. نقطة /api/giftpick/claim — فتح إحدى الهدايا الثلاث المجانية يومياً. الثلاثة تستخدم بالضبط نفس جدول الجوائز والاحتمالات (SPIN_SEGMENTS)، وكل واحدة منفصلة تماماً عن الأخرى (محاولة يومية مستقلة لكل ميزة). الاختيار عشوائي مرجّح بالكامل من السيرفر (crypto.getRandomValues)؛ المتصفح لا يرسل ولا يقرر أي شيء سوى تشغيل الأنيميشن بعد استلام النتيجة. =====================================================================
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

// المنطق العام المشترك بين Spin وChest وGift Pick: محاولة مجانية واحدة باليوم (تُصفَّر 00:00 UTC)، جائزة عشوائية مرجّحة من نفس SPIN_SEGMENTS، وتحديث ذري (Compare-And-Swap) يمنع استلام مكافأتين لنفس اليوم حتى لو تكرر نفس الطلب بسرعة.
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

// اختيار عشوائي مرجّح (weighted random) من SPIN_SEGMENTS باستخدام Web Crypto بدل Math.random لعشوائية أفضل تناسب جائزة حقيقية.
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

// يضيف حقلي "هل استُلمت المحاولة اليومية اليوم؟" و"موعد التصفير القادم" لأي ميزة يومية (Spin/Chest/Gift Pick) بدون أي كتابة لقاعدة البيانات.
function withDailyPrizeView(user, dateColumn, claimedKey, resetKey) {
  return {
    ...user,
    [claimedKey]: user[dateColumn] === todayUTC(),
    [resetKey]: nextUtcMidnightIso()
  };
}

// ===================================================================== نقطة /api/pet/<pet_id>/buy — شراء أي حيوان من PETS. تخصم السعر بشرط توفر الرصيد (CAS)، ثم تنشئ صف user_pets عند Lv.1، وتبدأ Storage بالتراكم فوراً إن لم تكن قد بدأت من حيوان سابق (INSERT OR IGNORE). =====================================================================
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
    `SELECT u.total_speed, s.capacity_hours, s.last_claim_at
     FROM users u LEFT JOIN user_storage s ON s.telegram_id = u.telegram_id
     WHERE u.telegram_id = ?`
  ).bind(telegramId).first();

  // نُصفّي (checkpoint) ما تراكم في Storage بالسرعة الكلية القديمة *قبل* شراء هذه الشخصية — تنطبق فقط عند شراء ثانية شخصية فأكثر (صف user_storage موجود بالفعل من الشراء الأول)، نفس أسلوب handlePetUpgrade/ handleClaimHappyDog بالضبط، لمنع احتساب كل الوقت المنقضي منذ آخر Claim (حتى ما قبل هذا الشراء) بالسرعة الجديدة الأعلى.
  let preBuyAccrued = 0;
  if (storageRow && storageRow.last_claim_at) {
    const capacitySeconds = (storageRow.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(storageRow.last_claim_at)) / 1000);
    preBuyAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((storageRow.total_speed || 0) / 3600);
  }

  const deductResult = await env.DB.prepare(
    `UPDATE users SET coins = coins - ? + ?, total_speed = total_speed + ?
     WHERE telegram_id = ? AND coins >= ?`
  ).bind(pet.price, preBuyAccrued, pet.basespeed, telegramId, pet.price).run();

  if (!deductResult.meta || deductResult.meta.changes === 0) {
    return jsonResponse({ error: "insufficient_funds" }, 400);
  }

  const nowIso = new Date().toISOString();
  const insertPetStmt = env.DB.prepare(
    "INSERT INTO user_pets (telegram_id, pet_id, level, current_speed) VALUES (?, ?, 1, ?)"
  ).bind(telegramId, petId, pet.basespeed);
  const storageStmt = (storageRow && storageRow.last_claim_at)
    ? env.DB.prepare("UPDATE user_storage SET last_claim_at = ? WHERE telegram_id = ?").bind(nowIso, telegramId)
    : env.DB.prepare(
        "INSERT OR IGNORE INTO user_storage (telegram_id, capacity_hours, last_claim_at) VALUES (?, ?, ?)"
      ).bind(telegramId, STORAGE_DEFAULT_CAPACITY_HOURS, nowIso);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'pet_purchase', ?, 'coins')"
  ).bind(telegramId, -pet.price);

  const stmts = [insertPetStmt, storageStmt, txnStmt];
  if (preBuyAccrued > 0) {
    stmts.push(env.DB.prepare(
      "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'storage_auto_collect', ?, 'coins')"
    ).bind(telegramId, preBuyAccrued));
  }

  try {
    await env.DB.batch(stmts);
  } catch (e) {
    // نادر جداً: طلب شراء متزامن سبقه بجزء من الثانية — نُرجع العملات (بما فيها ما صُفِّي) والسرعة
    await env.DB.prepare(
      "UPDATE users SET coins = coins + ? - ?, total_speed = total_speed - ? WHERE telegram_id = ?"
    ).bind(pet.price, preBuyAccrued, pet.basespeed, telegramId).run();
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
    coins: updatedUser.coins,
    storage_credited: preBuyAccrued
  });
}

// ===================================================================== نقطة /api/pet/<pet_id>/upgrade — ترقية أي حيوان مستوى واحد. التكلفة ثابتة (10% من سعر الشراء)، والسرعة الجديدة تُحسب دائماً من السرعة الأساسية + 10% لكل مستوى (وليس تراكمياً فوق السرعة الحالية). =====================================================================
async function handlePetUpgrade(request, env, petId) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  // ملاحظة مهمة: نجلب total_speed *الكلي* من users (وليس سرعة هذا الحيوان فقط) لأن أكثر من حيوان قد يساهم بنفس Storage في آن واحد — إن استخدمنا سرعة الحيوان المُرقّى فقط لحساب ما تراكم فسنُغفل مساهمة الحيوانات الأخرى.
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

  // نُصفّي (checkpoint) ما تراكم في Storage بالسرعة الكلية القديمة *قبل* رفع سرعة هذا الحيوان — وإلا فإن كل الوقت المنقضي منذ آخر Claim سيُحتسب لاحقاً بالسرعة الكلية الجديدة الأعلى، فتقفز قيمة Storage فجأة بشكل خاطئ.
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

// ===================================================================== نقطة /api/storage/claim — استلام ما تراكم في Storage. المبلغ المتراكم يُحسب من الوقت المنقضي منذ آخر Claim (بحد أقصى سعة التخزين بالساعات) × Total Speed، بحد أدنى 10 عملات (وإلا يُرفض الطلب دون تصفير المؤقت). =====================================================================
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

  // الزر معطّل في الواجهة حتى الامتلاء الكامل — هذا هو نفس الشرط مُطبَّقاً على السيرفر أيضاً (وليس فقط تعطيلاً بصرياً)، لمنع أي طلب مباشر يتجاوز الواجهة قبل اكتمال Storage فعلياً.
  if (elapsedSeconds < capacitySeconds) {
    return jsonResponse({
      error: "not_full_yet",
      remaining_seconds: capacitySeconds - elapsedSeconds
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

// ===================================================================== نقطة /api/storage/upgrade — ترقية مدة Storage (5 مستويات: 6→8→12→16→24 ساعة). التكلفة ثابتة لكل مستوى (300,000). قبل رفع السعة نُصفّي (checkpoint) ما تراكم بالسعة القديمة أولاً — وإلا فإن رفع السقف سيجعل نفس الوقت المنقضي يُحتسب فجأة بسعة أكبر (نفس مشكلة ترقية The Duck)، فنضمن أن السعة الجديدة تسري فقط من هذه اللحظة فصاعداً. =====================================================================
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

// ===================================================================== نقطة /api/promo/redeem — استبدال كود خصم. غير قابل للتلاعب: صحة الكود، تاريخ الانتهاء، الحد الأقصى للاستخدام، ومنع الاستخدام المزدوج لنفس المستخدم — كلها تُتحقَّق وتُفرَض من السيرفر فقط عبر قاعدة البيانات. =====================================================================
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

  // "نحجز" هذا الاستخدام أولاً عبر INSERT — يفشل تلقائياً لو استُخدم نفس الكود من نفس المستخدم من قبل (PRIMARY KEY telegram_id+code)، فيمنع أي محاولة استبدال مزدوج حتى لو تكرر نفس الطلب بسرعة.
  try {
    await env.DB.prepare(
      "INSERT INTO promo_redemptions (telegram_id, code) VALUES (?, ?)"
    ).bind(telegramId, code).run();
  } catch (e) {
    return jsonResponse({ error: "already_redeemed" }, 409);
  }

  // نستخدم عدّاداً مخزَّناً (uses_count) بدل COUNT(*) على promo_redemptions في كل محاولة — قراءة/كتابة صف واحد ثابتة التكلفة بدل مسح كل السجلات المتراكمة لكل كود، وأرخص بكثير على D1 كلما زاد عدد المستخدمين له. شرط "uses_count < max_uses" ذرّي: يمنع تجاوز الحد حتى مع طلبات متزامنة.
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

// ===================================================================== نقطة /api/exchange — تحويل Coins إلى Gram بسعر الصرف الموحّد. خصم ذري بشرط توفر الرصيد (CAS) يمنع تحويل رصيد غير موجود. =====================================================================
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

// ===================================================================== نقطة /api/deposit/info — تُرجع عنوان محفظة الإيداع + memo (تعليق TON) الخاص بهذا المستخدم فقط (= telegram_id كنص)، تُستخدم الواجهة هذا الـ memo لمطابقة معاملة هذا المستخدم بالتحديد على البلوكتشين. =====================================================================
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

// ===================================================================== نقطة /api/deposit/check — تُشغّل (أو تُرجع حالة) DepositChecker: Durable Object واحد لكل مستخدم (idFromName) يفحص بلوكتشين TON بشكل دوري (alarm) بحثاً عن معاملة بنفس memo، بغض النظر عن حالة اتصال المتصفح. =====================================================================
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

// ===================================================================== نقطة /api/deposit/status — تجلب حالة الفحص الحالية من DepositChecker. عند اكتمال الفحص (found/already_processed) تُرفق أيضاً رصيد Coins المُحدَّث حتى تُحدِّث الواجهة الرصيد المعروض فوراً بدون طلب /api/user إضافي. =====================================================================
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

// ===================================================================== DepositChecker — Durable Object واحد لكل مستخدم (idFromName(`user_${id}`)). يفحص TonCenter بشكل دوري (alarm) عن معاملة واردة على DEPOSIT_ADDRESS بنفس memo، ثم يحسب Coins المقابلة (Gram × DEPOSIT_GRAM_TO_COINS_RATE) ويحصّلها في D1 مرة واحدة فقط لكل tx_hash (قيد UNIQUE في جدول deposits يمنع أي تحصيل مضاعف حتى مع إعادة محاولة الـ alarm). =====================================================================
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

            // عمولة إحالة 5% من قيمة الإيداع بالعملات — تُضاف لرصيد المُحيل المعلّق ضمن نفس الدفعة الذرّية أدناه (تتراجع تلقائياً معها لو فشلت الدفعة بالكامل، ولا تتكرر أبداً بفضل قيد tx_hash الفريد).
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
              // D1 يُرجع الدفعة (batch) بالكامل ذرّية: لو فشل الإدراج بسبب tx_hash مكرر (UNIQUE) فهذا يعني أن هذه المعاملة سُجِّلت واحتُسبت في محاولة سابقة بالفعل — لا تُكرَّر. أي خطأ آخر (فشل D1 مؤقت مثلاً) لم تُكتب فيه أي عملية بالفعل (الدفعة كلها تراجعت) فيجب ألا تُصنَّف كحالة نهائية "already_processed" (كذبة تُوقف كل إعادة محاولة لاحقة) — بل تُترك بدون تغيير الحالة حتى يعيد alarm التالي فحص نفس المعاملة.
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

// ===================================================================== نقطة /api/withdraw/request — سحب يدوي بالكامل. يخصم المبلغ فوراً (حجز CAS ذرّي يتحقق أيضاً من انتهاء فترة الـ24 ساعة في نفس الاستعلام)، يسجّل الطلب "pending"، وينشر منشوراً بالقناة الإدارية بزري Approve/Reject. =====================================================================
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

  // شرط CAS واحد يضمن ذرّياً: الرصيد كافٍ + انتهاء فترة الـ24 ساعة معاً — يمنع سباقاً بين طلبين متزامنين من نفس المستخدم يتجاوزان أي من الشرطين.
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

  // حجز الرصيد + تسجيل الطلب في batch واحد ذرّي: إما الاثنان معاً أو لا شيء إطلاقاً — لو فشل الإدراج (مثلاً جدول withdrawals غير موجود بعد) لن يُخصَم أي رصيد بدون سجل مقابل له، بدل ترك المستخدم بخصم بلا أثر.
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

  // إشعارات تيليجرام (منشور القناة + رسالة خاصة للمستخدم) بعد تأكيد نجاح الحجز والتسجيل بالكامل. أي فشل هنا لا يُفشل الطلب نفسه (الرصيد محجوز والسجل موجود فعلاً في withdrawals) لكن يُسجَّل بالتفصيل عبر console.error ليمكن تشخيصه (مثلاً: البوت ليس أدمن في القناة، أو ADMIN_CHANNEL_ID خطأ).
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

// ===================================================================== نقطة /api/wallet/history — سجل معاملات Wallet: آخر 5 إيداعات مؤكدة (status='confirmed') + آخر 5 طلبات سحب (pending/approved/rejected) — 10 كحد أقصى إجمالاً بعد الدمج والترتيب حسب التاريخ. =====================================================================
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

// ===================================================================== نقطة /api/ads/reward — يستدعيها سيرفر Adsgram مباشرة (server-to-server، GET request) بعد تأكدهم فعلياً من مشاهدة المستخدم للإعلان بالكامل. هذا هو المصدر الوحيد لمنح مكافأة هذه المهمة — لا شيء في الواجهة يستطيع منحها بنفسه. الحماية: معامل secret يجب أن يطابق ADSGRAM_REWARD_SECRET (Cloudflare Secret) بالضبط، وإلا يُرفض الطلب فوراً بدون أي تأثير. =====================================================================
async function handleAdsReward(url, env) {
  const secret = url.searchParams.get("secret");
  if (!env.ADSGRAM_REWARD_SECRET || secret !== env.ADSGRAM_REWARD_SECRET) {
    return new Response("forbidden", { status: 403 });
  }

  const telegramId = parseInt(url.searchParams.get("userid"), 10);
  if (!Number.isFinite(telegramId)) {
    return new Response("bad request", { status: 400 });
  }

  // "Bonus AD Every 1H" يستخدم Block منفصل تماماً (Reward URL يحمل ?task=bonus_ad) — منطق مختلف بالكامل (تبريد ساعة + حد 5/يوم بدل 10/يوم).
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

  // شرط CAS على القيمة السابقة بالتحديد (نفس أسلوب mining_started_at) — لو وصل نفس الطلب مرتين (إعادة إرسال من Adsgram) لن يُمنح إلا مرة واحدة، لأن المنح والحماية في نفس عبارة UPDATE الواحدة.
  const updateStmt = env.DB.prepare(
    `UPDATE users SET coins = coins + ?, ads_task_count = ?, ads_task_date = ?, ads_task_total = ?
     WHERE telegram_id = ? AND (ads_task_date IS NULL OR ads_task_date <> ? OR ads_task_count = ?)`
  ).bind(ADS_TASK_REWARD_COINS, newCount, today, newTotal, telegramId, today, countToday);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'ads_task', ?, 'coins')"
  ).bind(telegramId, ADS_TASK_REWARD_COINS);

  const [updateResult] = await env.DB.batch([updateStmt, txnStmt]);

  // لو هذا أول عبور لعتبة "نشط" (ads_task_total تجاوز الحد للتو) ولهذا المستخدم مُحيل: امنح المُحيل مكافأة +130 مرة واحدة فقط، محمية بشرط is_active=0 في نفس عبارة UPDATE (نفس أسلوب الحماية أعلاه). is_active وearned_coins عمودان على جدول referrals الموجود مسبقاً بالقاعدة.
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

// ===================================================================== عدّاد "إجمالي الإعلانات المشاهدة مدى الحياة" (lifetime_ads_watched) — موحّد بين مهمتي Watch gigapub ads/Watch MonetixAds الحقيقيتين وبوابات الأزرار الست (كلاهما عبر GigaPub أو MonetixAds)، لغرضين معاً: 1) تفعيل "صديق نشط" لصالح مُحيل هذا المستخدم بعد ACTIVE_FRIEND_ADS_THRESHOLD إعلاناً (بدل الاعتماد على Adsgram وحده). 2) فتح شخصية The Guardian الحصرية عند GUARDIAN_ADS_THRESHOLD (انظر handleClaimGuardian). شرط CAS على القيمة السابقة بالتحديد يمنع أي زيادة مضاعفة لو تكرر نفس الطلب (نفس أسلوب باقي نقاط المنح في الملف). =====================================================================
async function bumpLifetimeAdsWatched(env, telegramId) {
  const row = await env.DB.prepare(
    "SELECT lifetime_ads_watched, referred_by FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) return;

  const previous = row.lifetime_ads_watched || 0;
  const newTotal = previous + 1;

  // weekly_ads_watched يتراكم هنا بجانب lifetime_ads_watched (نفس شرط CAS) — يُصفَّر فقط أسبوعياً عبر handleLeaderboardPayout، لا علاقة له بهذا الشرط.
  const updateResult = await env.DB.prepare(
    "UPDATE users SET lifetime_ads_watched = ?, weekly_ads_watched = weekly_ads_watched + 1 WHERE telegram_id = ? AND lifetime_ads_watched = ?"
  ).bind(newTotal, telegramId, previous).run();

  if (!updateResult.meta || updateResult.meta.changes === 0) return;

  if (row.referred_by && newTotal >= ACTIVE_FRIEND_ADS_THRESHOLD) {
    const activateResult = await env.DB.prepare(
      `UPDATE referrals SET is_active = 1, earned_coins = earned_coins + ?
       WHERE referrer_id = ? AND referred_id = ? AND is_active = 0`
    ).bind(REFERRAL_ACTIVE_BONUS_COINS, row.referred_by, telegramId).run();

    if (activateResult.meta && activateResult.meta.changes > 0) {
      // weekly_active_referrals لصالح المُحيل — نفس منطق active_referrals_count لكن يُصفَّر أسبوعياً (Weekly Leaderboard، قسم By Referrals).
      await env.DB.prepare(
        `UPDATE users SET referral_pending_earnings = referral_pending_earnings + ?, active_referrals_count = active_referrals_count + 1, weekly_active_referrals = weekly_active_referrals + 1
         WHERE telegram_id = ?`
      ).bind(REFERRAL_ACTIVE_BONUS_COINS, row.referred_by).run();
    }
  }
}

// ===================================================================== نقطة /api/pets/claim_happy_dog — فتح شخصية Happy Dog الحصرية مجاناً بعد دعوة 100 صديق نشط (active_referrals_count). تُخزَّن بنفس جدول user_pets المستخدم للحيوانات العادية (pet_id='happy_dog')، فتظهر تلقائياً في استجابة /api/user (view.pets) بنفس الآلية الموجودة — نفس أسلوب handlePetBuy بالضبط لكن مجانية ومشروطة بالأهلية بدل السعر. لا علاقة لها بميزة Milestone Missions (مكافأة عملات منفصلة تماماً تصادف نفس رقم 100). =====================================================================
async function handleClaimHappyDog(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const existing = await env.DB.prepare(
    "SELECT 1 FROM user_pets WHERE telegram_id = ? AND pet_id = 'happy_dog'"
  ).bind(telegramId).first();
  if (existing) return jsonResponse({ error: "already_claimed" }, 409);

  const row = await env.DB.prepare(
    `SELECT u.active_referrals_count, u.total_speed, s.capacity_hours, s.last_claim_at
     FROM users u LEFT JOIN user_storage s ON s.telegram_id = u.telegram_id
     WHERE u.telegram_id = ?`
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);

  if ((row.active_referrals_count || 0) < HAPPY_DOG_FRIENDS_THRESHOLD) {
    return jsonResponse({ error: "not_eligible", active_referrals_count: row.active_referrals_count || 0 }, 403);
  }

  // نُصفّي (checkpoint) ما تراكم في Storage بالسرعة الكلية القديمة *قبل* إضافة سرعة Happy Dog — نفس أسلوب handlePetUpgrade بالضبط، لمنع احتساب كل الوقت المنقضي منذ آخر Claim (حتى ما قبل حصوله على الشخصية) بالسرعة الجديدة الأعلى.
  const capacitySeconds = (row.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
  let preClaimAccrued = 0;
  if (row.last_claim_at) {
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(row.last_claim_at)) / 1000);
    preClaimAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((row.total_speed || 0) / 3600);
  }

  const nowIso = new Date().toISOString();
  const insertPetStmt = env.DB.prepare(
    "INSERT INTO user_pets (telegram_id, pet_id, level, current_speed) VALUES (?, 'happy_dog', 1, ?)"
  ).bind(telegramId, HAPPY_DOG_SPEED);
  const speedStmt = env.DB.prepare(
    "UPDATE users SET total_speed = total_speed + ?, coins = coins + ? WHERE telegram_id = ?"
  ).bind(HAPPY_DOG_SPEED, preClaimAccrued, telegramId);
  const storageStmt = row.last_claim_at
    ? env.DB.prepare("UPDATE user_storage SET last_claim_at = ? WHERE telegram_id = ?").bind(nowIso, telegramId)
    : env.DB.prepare(
        "INSERT OR IGNORE INTO user_storage (telegram_id, capacity_hours, last_claim_at) VALUES (?, ?, ?)"
      ).bind(telegramId, STORAGE_DEFAULT_CAPACITY_HOURS, nowIso);

  const stmts = [insertPetStmt, speedStmt, storageStmt];
  if (preClaimAccrued > 0) {
    stmts.push(env.DB.prepare(
      "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'storage_auto_collect', ?, 'coins')"
    ).bind(telegramId, preClaimAccrued));
  }

  try {
    await env.DB.batch(stmts);
  } catch (e) {
    return jsonResponse({ error: "already_claimed" }, 409);
  }

  const updatedUser = await env.DB.prepare(
    "SELECT total_speed, coins FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    pet_id: "happy_dog",
    level: 1,
    speed: HAPPY_DOG_SPEED,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins,
    storage_credited: preClaimAccrued
  });
}

// ===================================================================== نقطة /api/pets/claim_guardian — فتح شخصية The Guardian الحصرية مجاناً بعد مشاهدة 4000 إعلان إجمالياً (lifetime_ads_watched، من أي شبكة/بوابة) — نفس أسلوب handleClaimHappyDog أعلاه بالضبط، فقط شرط الاستحقاق مختلف. =====================================================================
async function handleClaimGuardian(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const existing = await env.DB.prepare(
    "SELECT 1 FROM user_pets WHERE telegram_id = ? AND pet_id = 'guardian'"
  ).bind(telegramId).first();
  if (existing) return jsonResponse({ error: "already_claimed" }, 409);

  const row = await env.DB.prepare(
    `SELECT u.lifetime_ads_watched, u.total_speed, s.capacity_hours, s.last_claim_at
     FROM users u LEFT JOIN user_storage s ON s.telegram_id = u.telegram_id
     WHERE u.telegram_id = ?`
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);

  if ((row.lifetime_ads_watched || 0) < GUARDIAN_ADS_THRESHOLD) {
    return jsonResponse({ error: "not_eligible", lifetime_ads_watched: row.lifetime_ads_watched || 0 }, 403);
  }

  // نفس تصفية Storage المُطبَّقة في handleClaimHappyDog أعلاه — انظر التعليق هناك.
  const capacitySeconds = (row.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
  let preClaimAccrued = 0;
  if (row.last_claim_at) {
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(row.last_claim_at)) / 1000);
    preClaimAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((row.total_speed || 0) / 3600);
  }

  const nowIso = new Date().toISOString();
  const insertPetStmt = env.DB.prepare(
    "INSERT INTO user_pets (telegram_id, pet_id, level, current_speed) VALUES (?, 'guardian', 1, ?)"
  ).bind(telegramId, GUARDIAN_SPEED);
  const speedStmt = env.DB.prepare(
    "UPDATE users SET total_speed = total_speed + ?, coins = coins + ? WHERE telegram_id = ?"
  ).bind(GUARDIAN_SPEED, preClaimAccrued, telegramId);
  const storageStmt = row.last_claim_at
    ? env.DB.prepare("UPDATE user_storage SET last_claim_at = ? WHERE telegram_id = ?").bind(nowIso, telegramId)
    : env.DB.prepare(
        "INSERT OR IGNORE INTO user_storage (telegram_id, capacity_hours, last_claim_at) VALUES (?, ?, ?)"
      ).bind(telegramId, STORAGE_DEFAULT_CAPACITY_HOURS, nowIso);

  const stmts = [insertPetStmt, speedStmt, storageStmt];
  if (preClaimAccrued > 0) {
    stmts.push(env.DB.prepare(
      "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'storage_auto_collect', ?, 'coins')"
    ).bind(telegramId, preClaimAccrued));
  }

  try {
    await env.DB.batch(stmts);
  } catch (e) {
    return jsonResponse({ error: "already_claimed" }, 409);
  }

  const updatedUser = await env.DB.prepare(
    "SELECT total_speed, coins FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    pet_id: "guardian",
    level: 1,
    speed: GUARDIAN_SPEED,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins,
    storage_credited: preClaimAccrued
  });
}

// ===================================================================== نقطة /api/pets/claim_ambassador — فتح شخصية The Ambassador الحصرية. الاستحقاق هنا يدوي بالكامل من الأدمن (وليس تلقائياً من أي عداد): وجود صف في ambassador_grants (يُضاف/يُحذف مباشرة على D1 من قِبل الأدمن) هو الشرط الوحيد، والسرعة تُقرأ من هذا الصف نفسه (يحددها الأدمن حرفياً عند المنح، وليست ثابتة بالكود كباقي الشخصيات الحصرية). نفس أسلوب handleClaimHappyDog بالضبط (تصفية Storage قبل رفع السرعة)، ثم يُحذف صف ambassador_grants بعد الاستلام (استُهلك). =====================================================================
async function handleClaimAmbassador(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const existing = await env.DB.prepare(
    "SELECT 1 FROM user_pets WHERE telegram_id = ? AND pet_id = 'ambassador'"
  ).bind(telegramId).first();
  if (existing) return jsonResponse({ error: "already_claimed" }, 409);

  const grantRow = await env.DB.prepare(
    "SELECT speed FROM ambassador_grants WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!grantRow) return jsonResponse({ error: "not_eligible" }, 403);
  const ambassadorSpeed = grantRow.speed;

  const storageRow = await env.DB.prepare(
    `SELECT u.total_speed, s.capacity_hours, s.last_claim_at
     FROM users u LEFT JOIN user_storage s ON s.telegram_id = u.telegram_id
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
  const insertPetStmt = env.DB.prepare(
    "INSERT INTO user_pets (telegram_id, pet_id, level, current_speed) VALUES (?, 'ambassador', 1, ?)"
  ).bind(telegramId, ambassadorSpeed);
  const speedStmt = env.DB.prepare(
    "UPDATE users SET total_speed = total_speed + ?, coins = coins + ? WHERE telegram_id = ?"
  ).bind(ambassadorSpeed, preClaimAccrued, telegramId);
  const storageStmt = storageRow.last_claim_at
    ? env.DB.prepare("UPDATE user_storage SET last_claim_at = ? WHERE telegram_id = ?").bind(nowIso, telegramId)
    : env.DB.prepare(
        "INSERT OR IGNORE INTO user_storage (telegram_id, capacity_hours, last_claim_at) VALUES (?, ?, ?)"
      ).bind(telegramId, STORAGE_DEFAULT_CAPACITY_HOURS, nowIso);
  const deleteGrantStmt = env.DB.prepare(
    "DELETE FROM ambassador_grants WHERE telegram_id = ?"
  ).bind(telegramId);

  const stmts = [insertPetStmt, speedStmt, storageStmt, deleteGrantStmt];
  if (preClaimAccrued > 0) {
    stmts.push(env.DB.prepare(
      "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'storage_auto_collect', ?, 'coins')"
    ).bind(telegramId, preClaimAccrued));
  }

  try {
    await env.DB.batch(stmts);
  } catch (e) {
    return jsonResponse({ error: "already_claimed" }, 409);
  }

  const updatedUser = await env.DB.prepare(
    "SELECT total_speed, coins FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();

  return jsonResponse({
    pet_id: "ambassador",
    level: 1,
    speed: ambassadorSpeed,
    total_speed: updatedUser.total_speed,
    coins: updatedUser.coins,
    storage_credited: preClaimAccrued
  });
}

// ===================================================================== لوحة الأدمن — كل نقاط /api/admin/* محمية بطبقتين لا يمكن التلاعب بهما من المتصفح: (1) authenticateRequest نفسها المستخدمة بكل نقطة أخرى بالتطبيق (توقيع HMAC حقيقي من تيليجرام على initData، لا يمكن تزويره من Console)، (2) authenticateAdmin تتحقق أن telegram_id الموثَّق من هذا التوقيع يطابق ADMIN_TELEGRAM_ID بالضبط — أي طلب من أي حساب آخر (حتى مع body مزوَّر يدّعي id الأدمن) يُرفض فوراً بـ403 لأن الid الحقيقي يأتي من initData الموثَّق نفسه، وليس من أي حقل يرسله المتصفح صراحة. =====================================================================
async function authenticateAdmin(request, env, preParsedBody) {
  const auth = await authenticateRequest(request, env, preParsedBody);
  if (!auth.ok) return auth;
  if (auth.telegramId !== ADMIN_TELEGRAM_ID) {
    return { ok: false, response: jsonResponse({ error: "forbidden" }, 403) };
  }
  return auth;
}

// ===================================================================== نقطة /api/admin/user/find — بحث عن مستخدم بمعرّف تيليجرام (بحث واحد فقط، بلا أي قائمة/تصفّح). =====================================================================
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
      "SELECT telegram_id, username, coins, gram, total_speed, invites_count, active_referrals_count, created_at FROM users WHERE telegram_id = ?"
    ).bind(targetId).first(),
    env.DB.prepare(
      "SELECT COALESCE(SUM(amount_gram), 0) AS total FROM deposits WHERE telegram_id = ? AND status = 'confirmed'"
    ).bind(targetId).first(),
    env.DB.prepare(
      "SELECT COALESCE(SUM(net_gram), 0) AS total FROM withdrawals WHERE telegram_id = ? AND status = 'approved'"
    ).bind(targetId).first()
  ]);

  if (!user) return jsonResponse({ error: "user_not_found" }, 404);

  return jsonResponse({
    telegram_id: user.telegram_id,
    username: user.username,
    coins: user.coins,
    gram: user.gram,
    total_speed: user.total_speed,
    invites: user.invites_count || 0,
    active_invites: user.active_referrals_count || 0,
    registered_date: user.created_at ? formatDateDDMMYYYY(user.created_at) : "—",
    total_deposit_gram: depositResult.total || 0,
    total_withdraw_gram: withdrawResult.total || 0
  });
}

// ===================================================================== نقطة /api/admin/user/edit_balance — تعيين رصيد Coins/Gram مباشرة (قيمة مطلقة جديدة، وليست إضافة). الفرق بين القيمة القديمة والجديدة يُسجَّل في transactions (type='admin_adjustment') لكل عملة تغيّرت فعلاً — نفس أسلوب تسجيل كل تغيير رصيد آخر بالتطبيق، حتى تبقى admin_adjustment قابلة للتتبع في سجل المحفظة. =====================================================================
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

  const newCoins = Number(body.coins);
  const newGram = Number(body.gram);
  if (!Number.isFinite(newCoins) || newCoins < 0 || !Number.isFinite(newGram) || newGram < 0) {
    return jsonResponse({ error: "invalid_amount" }, 400);
  }

  const row = await env.DB.prepare("SELECT coins, gram FROM users WHERE telegram_id = ?").bind(targetId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);

  const coinsDelta = newCoins - row.coins;
  const gramDelta = newGram - row.gram;

  const stmts = [
    env.DB.prepare("UPDATE users SET coins = ?, gram = ? WHERE telegram_id = ?").bind(newCoins, newGram, targetId)
  ];
  if (coinsDelta !== 0) {
    stmts.push(env.DB.prepare(
      "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'admin_adjustment', ?, 'coins')"
    ).bind(targetId, coinsDelta));
  }
  if (gramDelta !== 0) {
    stmts.push(env.DB.prepare(
      "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'admin_adjustment', ?, 'gram')"
    ).bind(targetId, gramDelta));
  }
  await env.DB.batch(stmts);

  return jsonResponse({ ok: true, coins: newCoins, gram: newGram });
}

// ===================================================================== نقطة /api/admin/tasks/list — كل مهام قسم Special أو Partner (النشطة فقط)، مع claims_count/max_claims الظاهرين فقط للأدمن (المستخدمون العاديون يستخدمون /api/tasks/list الذي لا يُرجعهما). =====================================================================
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
    `SELECT id, title, description, icon_url, reward_coins, link, channel_id, max_claims, claims_count, display_order
     FROM admin_tasks WHERE section = ? AND is_active = 1
     ORDER BY display_order ASC, id ASC`
  ).bind(section).all();

  return jsonResponse({ tasks: result.results || [] });
}

// ===================================================================== نقطة /api/admin/tasks/save — إضافة مهمة جديدة (بدون id) أو تعديل مهمة موجودة (مع id). icon_url قد يكون رابطاً خارجياً حقيقياً أو Data URI (صورة مضغوطة base64 من الهاتف مباشرة عبر Canvas بالواجهة) — كلاهما يُخزَّن ويُعرَض بنفس الطريقة تماماً بلا أي فرق بكود العرض. =====================================================================
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
      `UPDATE admin_tasks SET title = ?, description = ?, icon_url = ?, reward_coins = ?, link = ?, channel_id = ?, max_claims = ?, display_order = ?
       WHERE id = ? AND section = ?`
    ).bind(title, description, iconUrl, rewardCoins, link, channelId, maxClaims, displayOrder, id, section).run();
    if (!result.meta || result.meta.changes === 0) return jsonResponse({ error: "task_not_found" }, 404);
    return jsonResponse({ ok: true, id });
  }

  const insertResult = await env.DB.prepare(
    `INSERT INTO admin_tasks (section, title, description, icon_url, reward_coins, link, channel_id, max_claims, claims_count, is_active, display_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?, ?)`
  ).bind(section, title, description, iconUrl, rewardCoins, link, channelId, maxClaims, displayOrder, Date.now()).run();

  return jsonResponse({ ok: true, id: insertResult.meta.last_row_id });
}

// ===================================================================== نقطة /api/admin/tasks/delete — حذف ناعم (is_active = 0) وليس DELETE حقيقي، لتفادي ترك صفوف admin_task_claims يتيمة (تشير لمهمة محذوفة) — نفس ما يفعله is_active مسبقاً لإخفاء أي مهمة عن handleTasksList/handleAdminTasksList دون حذف تاريخها. =====================================================================
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

  const result = await env.DB.prepare("UPDATE admin_tasks SET is_active = 0 WHERE id = ?").bind(id).run();
  if (!result.meta || result.meta.changes === 0) return jsonResponse({ error: "task_not_found" }, 404);

  return jsonResponse({ ok: true });
}

// ===================================================================== نقطة /api/admin/promo/create — إنشاء كود جديد في جدول promo_codes الموجود مسبقاً (نفس الجدول الذي يقرأه handlePromoRedeem). قيد PRIMARY KEY على code يمنع إنشاء نفس الكود مرتين. =====================================================================
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

// ===================================================================== نقطة /api/admin/ambassador/grant — منح The Ambassador بسرعة يحددها الأدمن. لو لم يستلمها المستخدم بعد (لا صف في user_pets)، تُنشئ/تُحدِّث "منحاً معلّقاً" في ambassador_grants (يُستلَم لاحقاً عبر Claim بالواجهة بهذه السرعة). لو استلمها المستخدم فعلاً بالفعل، هذا الطلب يُعدِّل سرعتها الحالية مباشرة (نفس أسلوب تصفية Storage قبل أي تغيير سرعة المستخدم بكل مكان آخر بالتطبيق). =====================================================================
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
  if (!Number.isInteger(targetId)) return jsonResponse({ error: "invalid_target_id" }, 400);
  if (!Number.isInteger(speed) || speed <= 0) return jsonResponse({ error: "invalid_speed" }, 400);

  const petRow = await env.DB.prepare(
    `SELECT p.current_speed, u.total_speed, s.capacity_hours, s.last_claim_at
     FROM user_pets p
     JOIN users u ON u.telegram_id = p.telegram_id
     LEFT JOIN user_storage s ON s.telegram_id = p.telegram_id
     WHERE p.telegram_id = ? AND p.pet_id = 'ambassador'`
  ).bind(targetId).first();

  if (!petRow) {
    // لم يُستلَم بعد — فقط أنشئ/حدِّث المنح المعلّق بالسرعة الجديدة
    const userExists = await env.DB.prepare("SELECT 1 FROM users WHERE telegram_id = ?").bind(targetId).first();
    if (!userExists) return jsonResponse({ error: "user_not_found" }, 404);

    await env.DB.prepare(
      "INSERT INTO ambassador_grants (telegram_id, speed, granted_at) VALUES (?, ?, ?) ON CONFLICT(telegram_id) DO UPDATE SET speed = excluded.speed"
    ).bind(targetId, speed, Date.now()).run();

    return jsonResponse({ ok: true, mode: "pending", speed });
  }

  // مُستلَمة فعلاً — نُعدِّل سرعتها مباشرة. نُصفّي (checkpoint) ما تراكم في Storage بالسرعة الكلية القديمة أولاً، نفس أسلوب handlePetUpgrade بالضبط.
  const speedDelta = speed - petRow.current_speed;
  const capacitySeconds = (petRow.capacity_hours || STORAGE_DEFAULT_CAPACITY_HOURS) * 3600;
  let preChangeAccrued = 0;
  if (petRow.last_claim_at) {
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(petRow.last_claim_at)) / 1000);
    preChangeAccrued = Math.min(elapsedSeconds, capacitySeconds) * ((petRow.total_speed || 0) / 3600);
  }

  const nowIso = new Date().toISOString();
  const stmts = [
    env.DB.prepare("UPDATE user_pets SET current_speed = ? WHERE telegram_id = ? AND pet_id = 'ambassador'").bind(speed, targetId),
    env.DB.prepare("UPDATE users SET total_speed = total_speed + ?, coins = coins + ? WHERE telegram_id = ?").bind(speedDelta, preChangeAccrued, targetId)
  ];
  if (petRow.last_claim_at) {
    stmts.push(env.DB.prepare("UPDATE user_storage SET last_claim_at = ? WHERE telegram_id = ?").bind(nowIso, targetId));
  }
  if (preChangeAccrued > 0) {
    stmts.push(env.DB.prepare(
      "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'storage_auto_collect', ?, 'coins')"
    ).bind(targetId, preChangeAccrued));
  }
  await env.DB.batch(stmts);

  return jsonResponse({ ok: true, mode: "updated", speed });
}

// ===================================================================== نقطة /api/admin/ambassador/revoke — سحب The Ambassador بالكامل. لو كانت منحاً معلّقاً لم يُستلَم بعد، يُحذَف المنح فقط (لا شيء آخر تغيَّر). لو كانت مُستلَمة فعلاً، تُصفَّى Storage بالسرعة القديمة أولاً، ثم تُخصَم سرعتها من total_speed ويُحذَف صفها من user_pets — يمكن منحها للمستخدم مجدداً لاحقاً من الصفر. =====================================================================
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

  // نتحقق من الحالتين معاً (وليس واحدة فقط ثم نتوقف) — في حال تصادم نادر جداً (استلام
  // المستخدم للـAmbassador في نفس اللحظة التي يسحبها الأدمن منه) قد ينشأ منح معلّق جديد
  // بعد الاستلام مباشرة؛ حذف الحالتين معاً هنا يضمن عدم ترك أي أثر متبقٍّ في كل الأحوال.
  const pendingGrant = await env.DB.prepare("SELECT 1 FROM ambassador_grants WHERE telegram_id = ?").bind(targetId).first();
  const petRow = await env.DB.prepare(
    `SELECT p.current_speed, u.total_speed, s.capacity_hours, s.last_claim_at
     FROM user_pets p
     JOIN users u ON u.telegram_id = p.telegram_id
     LEFT JOIN user_storage s ON s.telegram_id = p.telegram_id
     WHERE p.telegram_id = ? AND p.pet_id = 'ambassador'`
  ).bind(targetId).first();

  if (!pendingGrant && !petRow) return jsonResponse({ error: "not_found" }, 404);

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
  const stmts = [
    env.DB.prepare("DELETE FROM user_pets WHERE telegram_id = ? AND pet_id = 'ambassador'").bind(targetId),
    env.DB.prepare("UPDATE users SET total_speed = total_speed - ?, coins = coins + ? WHERE telegram_id = ?").bind(petRow.current_speed, preRevokeAccrued, targetId)
  ];
  if (petRow.last_claim_at) {
    stmts.push(env.DB.prepare("UPDATE user_storage SET last_claim_at = ? WHERE telegram_id = ?").bind(nowIso, targetId));
  }
  if (preRevokeAccrued > 0) {
    stmts.push(env.DB.prepare(
      "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'storage_auto_collect', ?, 'coins')"
    ).bind(targetId, preRevokeAccrued));
  }
  if (pendingGrant) {
    stmts.push(env.DB.prepare("DELETE FROM ambassador_grants WHERE telegram_id = ?").bind(targetId));
  }
  await env.DB.batch(stmts);

  return jsonResponse({ ok: true, mode: "removed" });
}

// ===================================================================== نقطة /api/leaderboard — Weekly Leaderboard (By Ads وBy Referrals معاً في استجابة واحدة، لا طلبان منفصلان). كاش عبر Cache API (caches.default — بلا أي حد قراءة/كتابة يومي، بعكس KV) بصلاحية محسوبة حتى 00:00 UTC القادمة. أول طلب فقط بعد انتهاء الصلاحية ينفّذ استعلامي D1 (بالـindex، أعلى 20 فقط بصرف النظر عن عدد المستخدمين الإجمالي)، وكل الطلبات بعده لنفس اليوم تُقرأ من الكاش مباشرة بلا أي لمس لـD1. شرط WHERE > 0 يمنع عرض/منح جوائز لمستخدمين بلا أي نشاط حقيقي هذا الأسبوع. =====================================================================
async function handleLeaderboard(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;

  const cache = caches.default;
  const cacheKey = new Request("https://internal.minerxrealm/leaderboard-cache");

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const [adsResult, refsResult] = await Promise.all([
    env.DB.prepare(
      `SELECT telegram_id, username, photo_url, weekly_ads_watched AS val
       FROM users WHERE weekly_ads_watched > 0
       ORDER BY weekly_ads_watched DESC LIMIT ?`
    ).bind(LEADERBOARD_RANK_LIMIT).all(),
    env.DB.prepare(
      `SELECT telegram_id, username, photo_url, weekly_active_referrals AS val
       FROM users WHERE weekly_active_referrals > 0
       ORDER BY weekly_active_referrals DESC LIMIT ?`
    ).bind(LEADERBOARD_RANK_LIMIT).all()
  ]);

  const shape = (rows) => (rows.results || []).map((r, i) => ({
    rank: i + 1,
    name: r.username || ("Player " + r.telegram_id),
    photo_url: r.photo_url || null,
    value: r.val,
    prize: LEADERBOARD_PRIZES[i] || 0
  }));

  const payload = {
    ads: shape(adsResult),
    referrals: shape(refsResult),
    next_payout_at: nextLeaderboardPayoutAt()
  };

  const response = jsonResponse(payload);
  response.headers.set("Cache-Control", "public, max-age=" + secondsUntilNextMidnightUTC());
  await cache.put(cacheKey, response.clone());
  return response;
}

// ===================================================================== يُنفَّذ مرة واحدة أسبوعياً فقط (الجمعة 00:30 UTC عبر scheduled()) — يمنح جوائز Top 20 لكل قسم فعلياً (بحساب طازج من D1 مباشرة، لا من كاش العرض اليومي، لأن هذا يمنح عملات حقيقية)، ثم يُصفّر العدادين الأسبوعيين. كل هذا في batch() واحد ذرّي يبدأ بـINSERT في leaderboard_payouts (قيد PRIMARY KEY على week_key) — لو كان هذا الأسبوع مدفوعاً مسبقاً، يفشل هذا الإدراج فتفشل الدفعة كلها ولا يُمنح أو يُصفَّر أي شيء إطلاقاً. =====================================================================
async function handleLeaderboardPayout(env) {
  const weekKey = isoWeekKeyUTC();

  const [adsResult, refsResult] = await Promise.all([
    env.DB.prepare(
      `SELECT telegram_id, weekly_ads_watched AS val FROM users
       WHERE weekly_ads_watched > 0 ORDER BY weekly_ads_watched DESC LIMIT ?`
    ).bind(LEADERBOARD_RANK_LIMIT).all(),
    env.DB.prepare(
      `SELECT telegram_id, weekly_active_referrals AS val FROM users
       WHERE weekly_active_referrals > 0 ORDER BY weekly_active_referrals DESC LIMIT ?`
    ).bind(LEADERBOARD_RANK_LIMIT).all()
  ]);

  const stmts = [
    env.DB.prepare("INSERT INTO leaderboard_payouts (week_key, paid_at) VALUES (?, ?)")
      .bind(weekKey, Date.now())
  ];

  const creditWinners = (rows) => {
    (rows.results || []).forEach((r, i) => {
      const prize = LEADERBOARD_PRIZES[i] || 0;
      if (prize <= 0) return;
      stmts.push(env.DB.prepare("UPDATE users SET coins = coins + ? WHERE telegram_id = ?").bind(prize, r.telegram_id));
      stmts.push(env.DB.prepare(
        "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'leaderboard_reward', ?, 'coins')"
      ).bind(r.telegram_id, prize));
    });
  };
  creditWinners(adsResult);
  creditWinners(refsResult);

  // تصفير مقيّد فقط بمن شارك فعلياً هذا الأسبوع (لا كل المستخدمين) — تكلفة كتابة أقل، ونفس النتيجة تماماً لمن لم يتحرك عداده أصلاً.
  stmts.push(env.DB.prepare(
    "UPDATE users SET weekly_ads_watched = 0, weekly_active_referrals = 0 WHERE weekly_ads_watched != 0 OR weekly_active_referrals != 0"
  ));

  try {
    await env.DB.batch(stmts);
  } catch (e) {
    // week_key مكرر (دُفع مسبقاً) أو أي فشل آخر — الدفعة كلها لم تُنفَّذ إطلاقاً
    console.error("leaderboard payout skipped/failed:", e?.message || e);
    return;
  }

  await caches.default.delete(new Request("https://internal.minerxrealm/leaderboard-cache"));
}

// ===================================================================== منطق "Bonus AD Every 1H" — إعلان إضافي كل ساعة، بحد أقصى 5/يوم. شرط CAS يجمع ثلاثة أمور في عبارة UPDATE واحدة: القيمة السابقة بالتحديد لـbonus_ad_last_watched_at (يمنع الاستلام المضاعف من نفس النداء المكرر)، تصفير العداد اليومي ضمنياً عند تغيّر اليوم، والحد الأقصى 5. =====================================================================
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

// ===================================================================== نقطة /api/gigapub/postback — يستدعيها سيرفر GigaPub مباشرة (server-to- server، GET) بعد تأكدهم فعلياً من عرض الإعلان (uid + event=ad_shown). هذا هو المصدر الوحيد لمنح مكافأة هذه المهمة — لا شيء في الواجهة يستطيع منحها بنفسه. الحماية: معامل secret يجب أن يطابق GIGAPUB_POSTBACK_SECRET (Cloudflare Secret) بالضبط، وإلا يُرفض الطلب فوراً بدون أي تأثير. يُرَد بـ200 على كل طلب صحيح السر (حتى لو رُفض المنح لتجاوز الحد اليومي) لأن GigaPub طلبوا ذلك صراحة. =====================================================================
async function handleGigapubPostback(url, env) {
  const secret = url.searchParams.get("secret");
  if (!env.GIGAPUB_POSTBACK_SECRET || secret !== env.GIGAPUB_POSTBACK_SECRET) {
    return new Response("forbidden", { status: 403 });
  }

  const telegramId = parseInt(url.searchParams.get("uid"), 10);
  if (!Number.isFinite(telegramId)) {
    return new Response("bad request", { status: 200 });
  }

  // "gate" = بوابة إعلان أمام مميزات موجودة أصلاً (Start Mining، Claim Daily Rewards، Chest، Spin، Gift، Promo Redeem) — لا تمنح شيئاً هنا، الفعل الحقيقي يُنفَّذ من الواجهة مباشرة بعد نجاح مشاهدة الإعلان (window.showGiga({ showTag }).then())، فقط نرد 200 كما تطلب GigaPub من كل طلب. معامل tag يأتي من showTag الذي مررناه عند استدعاء showGiga — مهمة Watch gigapub ads الحقيقية لا تمرر showTag إطلاقاً فلن يتطابق أبداً مع 'gate' (أو أي قيمة بوابة مستقبلية أخرى نخصصها بنفسنا).
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

  // شرط CAS على القيمة السابقة بالتحديد لمنع الاستلام المضاعف لو أعاد GigaPub إرسال نفس الطلب (نفس أسلوب handleAdsReward).
  const updateStmt = env.DB.prepare(
    `UPDATE users SET coins = coins + ?, gigapub_task_count = ?, gigapub_task_date = ?
     WHERE telegram_id = ? AND (gigapub_task_date IS NULL OR gigapub_task_date <> ? OR gigapub_task_count = ?)`
  ).bind(GIGAPUB_REWARD_COINS, newCount, today, telegramId, today, countToday);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'gigapub_ad', ?, 'coins')"
  ).bind(telegramId, GIGAPUB_REWARD_COINS);

  await env.DB.batch([updateStmt, txnStmt]);
  await bumpLifetimeAdsWatched(env, telegramId);

  return new Response("OK", { status: 200 });
}

// ===================================================================== نقطة /api/monetix/reward — تُستدعى من واجهتنا نفسها بعد نجاح window.showRewardAd().then(status: completed/closed) (لا يوجد Postback من سيرفر MonetixAds). محمية بـinitData الموثّق من تيليجرام (توقيع لا يمكن تزويره من Console)، والسيرفر هو من يحسم الحد اليومي والمنح بشرط CAS — أقوى ما يمكن تحقيقه بدون تأكيد خارجي من MonetixAds نفسها. =====================================================================
async function handleMonetixReward(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const row = await env.DB.prepare(
    "SELECT coins, monetix_task_count, monetix_task_date FROM users WHERE telegram_id = ?"
  ).bind(telegramId).first();
  if (!row) return jsonResponse({ error: "user_not_found" }, 404);

  const today = todayUTC();
  const countToday = row.monetix_task_date === today ? (row.monetix_task_count || 0) : 0;
  if (countToday >= MONETIX_DAILY_LIMIT) {
    return jsonResponse({ error: "daily_limit_reached", watched_today: countToday, daily_limit: MONETIX_DAILY_LIMIT }, 409);
  }

  const newCount = countToday + 1;

  const updateStmt = env.DB.prepare(
    `UPDATE users SET coins = coins + ?, monetix_task_count = ?, monetix_task_date = ?
     WHERE telegram_id = ? AND (monetix_task_date IS NULL OR monetix_task_date <> ? OR monetix_task_count = ?)`
  ).bind(MONETIX_REWARD_COINS, newCount, today, telegramId, today, countToday);
  const txnStmt = env.DB.prepare(
    "INSERT INTO transactions (telegram_id, type, amount, currency) VALUES (?, 'monetix_ad', ?, 'coins')"
  ).bind(telegramId, MONETIX_REWARD_COINS);

  const [updateResult] = await env.DB.batch([updateStmt, txnStmt]);
  if (!updateResult.meta || updateResult.meta.changes === 0) {
    return jsonResponse({ error: "daily_limit_reached", watched_today: countToday, daily_limit: MONETIX_DAILY_LIMIT }, 409);
  }

  await bumpLifetimeAdsWatched(env, telegramId);

  return jsonResponse({
    watched_today: newCount,
    daily_limit: MONETIX_DAILY_LIMIT,
    reward_coins: MONETIX_REWARD_COINS,
    coins: row.coins + MONETIX_REWARD_COINS
  });
}

// ===================================================================== نقطة /api/ads/gate-watched — تُستدعى من الواجهة فقط بعد نجاح بوابة إعلان عبر MonetixAds تحديداً (بوابة GigaPub تُحتسَب أصلاً عبر Postback الحقيقي أعلاه في handleGigapubPostback، فلا داعي لاستدعاء مضاعف). لا تمنح أي مكافأة بنفسها — فقط تزيد lifetime_ads_watched. =====================================================================
async function handleAdsGateWatched(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  await bumpLifetimeAdsWatched(env, auth.telegramId);
  return jsonResponse({ ok: true });
}

// ===================================================================== نقطة /api/profile — تُستدعى فقط عند فتح نافذة Profile فعلياً. تُرجع بيانات لا تحتاجها /api/user في كل استدعاء (إجمالي الإيداع/السحب الحقيقيين، تاريخ التسجيل) لتوفير قراءات D1 على أكثر نقطة استدعاءً بالتطبيق. Total Withdraw يحسب فقط السحوبات المُعتمَدة (status='approved') وليس Pending/Rejected. =====================================================================
async function handleProfile(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId, rawUsername, firstName, lastName } = auth;

  const [user, depositResult, withdrawResult] = await Promise.all([
    env.DB.prepare(
      "SELECT coins, gram, total_speed, invites_count, active_referrals_count, created_at FROM users WHERE telegram_id = ?"
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
    invites: user.invites_count || 0,
    active_invites: user.active_referrals_count || 0,
    coins: user.coins,
    gram: user.gram,
    total_speed: user.total_speed,
    total_deposit_gram: depositResult.total || 0,
    total_withdraw_gram: withdrawResult.total || 0
  });
}

// ===================================================================== نقطة /api/friends/claim_earnings — تحوّل رصيد الإحالة المعلّق (تسجيل + نشاط + عمولة إيداع) إلى coins فعلية، بشرط ألا يقل عن REFERRAL_MIN_CLAIM_COINS. القيمة تُلتقَط أولاً ثم تُستخدم كشرط CAS بالتحديد في عبارة التحديث، فيبقى الرقم المُرجَع (claimed) مضموناً أن يطابق ما أُضيف فعلياً. =====================================================================
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

  // CAS على القيمة المعلّقة المُلتقَطة بالتحديد أعلاه — يضمن أن الرقم المُرجَع (claimed) يطابق فعلياً ما أُضيف لـcoins، حتى لو وصلت مكافأة إحالة جديدة بالتزامن (عندها فقط تفشل هذه المحاولة، ويحاول المستخدم مجدداً بالقيمة الجديدة الأحدث بدل استلام رقم غير دقيق).
  const claimStmt = await env.DB.prepare(
    `UPDATE users SET coins = coins + ?, referral_pending_earnings = referral_pending_earnings - ?
     WHERE telegram_id = ? AND referral_pending_earnings = ?`
  ).bind(pending, pending, telegramId, pending).run();

  if (!claimStmt.meta || claimStmt.meta.changes === 0) {
    return jsonResponse({ error: "try_again" }, 409);
  }

  return jsonResponse({ claimed: pending, coins: row.coins + pending });
}

// ===================================================================== نقطة /api/friends/claim_milestone — تمنح مكافأة عتبة "أصدقاء نشطون" مباشرة كـcoins (لا تمر عبر الرصيد المعلّق). العتبة والمكافأة تُقرأان من جدول milestone_missions (وليستا رقمين ثابتين)، وtier يجب أن يطابق friends_required لصف موجود فعلاً قبل استخدامه في اسم العمود، فلا خطر حقن SQL رغم استخدام template literal هنا. =====================================================================
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

// ===================================================================== نقطة /api/friends/milestones — تُستدعى فقط عند أول فتح فعلي لصفحة Friends (وليس مع كل /api/user)، لأن milestone_missions بيانات ثابتة لا تعتمد على المستخدم إطلاقاً ولا داعي لقراءتها في أكثر نقطة استدعاءً بالتطبيق. =====================================================================
async function handleFriendsMilestones(request, env) {
  const auth = await authenticateRequest(request, env);
  if (!auth.ok) return auth.response;
  const { telegramId } = auth;

  const [user, milestonesResult] = await Promise.all([
    env.DB.prepare(
      "SELECT milestone_10_claimed, milestone_25_claimed, milestone_50_claimed, milestone_100_claimed FROM users WHERE telegram_id = ?"
    ).bind(telegramId).first(),
    env.DB.prepare(
      "SELECT friends_required, reward FROM milestone_missions ORDER BY friends_required ASC"
    ).all()
  ]);

  if (!user) return jsonResponse({ error: "user_not_found" }, 404);

  const milestones = (milestonesResult.results || []).map((m) => ({
    count: m.friends_required,
    reward: m.reward,
    claimed: !!user[`milestone_${m.friends_required}_claimed`]
  }));

  return jsonResponse({ milestones });
}

// ===================================================================== نقطة /api/friends/list — تُستدعى فقط عند ضغط المستخدم على "Show The List" (وليس مع كل /api/user) لتفادي أي كلفة إضافية على أكثر نقطة استدعاءً بالتطبيق. LIMIT 100 يحدّ من كلفة القراءة حتى لمُحيل ضخم جداً. =====================================================================
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

// يهرّب أي نص قبل إرساله كمعامل URL لطلب Telegram API — يمنع أي حقن أو كسر تنسيق الرابط.
function telegramApiUrl(env, method, params) {
  const url = new URL(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

// تحقق حقيقي: هل يحتوي الاسم الظاهر (يصل مع initData في كل طلب، ولا حاجة لأي استدعاء إضافي لتيليجرام) على "@MinerXRealmBot"؟
function verifyNameContainsBotMention(auth) {
  const fullName = `${auth.firstName || ""} ${auth.lastName || ""}`.toLowerCase();
  return fullName.includes("@minerxrealmbot") || fullName.includes("minerxrealmbot");
}

// تحقق حقيقي: getChat تُرجع حقل bio للمحادثات الخاصة (طالما المستخدم لم يحظر البوت، وهو محقَّق هنا لأنه فتح البوت أصلاً ليشغّل التطبيق) — نتأكد أن الـbio يحتوي رابط إحالة هذا المستخدم تحديداً وليس أي رابط عشوائي.
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

// ===================================================================== نقطة /api/checkin/claim — تستلم مكافأة إحدى مهام Check-in الأربع اليومية. الحماية: عبارة UPDATE واحدة تجمع بين التحقق من التاريخ (لم تُستلَم اليوم) ومنح المكافأة معاً، فلا خطر من استلام مضاعف حتى لو تكرر نفس الطلب بسرعة. =====================================================================
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

// ===================================================================== نقطة /api/checkin/verify — تحقق فقط (بدون منح أي مكافأة) لمهام 3/4، تُستخدم لإظهار زر Claim للمستخدم فقط بعد إتمام الشرط فعلياً. الحماية الحقيقية تبقى في handleCheckinClaim نفسه الذي يعيد التحقق قبل المنح، فحتى لو تلاعب أحدهم بالواجهة فلن يحصل على المكافأة دون تحقق حقيقي. =====================================================================
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

// ===================================================================== نقطة /api/tasks/list — تُرجع مهام Partner أو Special الفعّالة من جدول admin_tasks (يُدار حالياً يدوياً عبر D1 Console، ولاحقاً من لوحة أدمن) مع حالة "تم الاستلام؟" لكل مهمة بالنسبة لهذا المستخدم تحديداً. =====================================================================
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
    `SELECT t.id, t.title, t.description, t.icon_url, t.reward_coins, t.link, t.channel_id,
            c.telegram_id AS claimed
     FROM admin_tasks t
     LEFT JOIN admin_task_claims c ON c.task_id = t.id AND c.telegram_id = ?
     WHERE t.section = ? AND t.is_active = 1 AND (t.max_claims IS NULL OR t.claims_count < t.max_claims)
     ORDER BY t.display_order ASC, t.id ASC`
  ).bind(telegramId, section).all();

  const tasks = (result.results || []).map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description || "",
    icon_url: t.icon_url,
    reward: t.reward_coins,
    link: t.link,
    requires_membership: !!t.channel_id,
    claimed: !!t.claimed
  }));

  return jsonResponse({ tasks });
}

// ===================================================================== نقطة /api/tasks/claim — تمنح مكافأة مهمة Partner/Special واحدة (مرة واحدة فقط مدى الحياة، وليست يومية). لو كانت المهمة مرتبطة بقناة (channel_id)، تُتحقَّق العضوية فعلياً عبر getChatMember قبل المنح. الحماية من الاستلام المضاعف: INSERT OR IGNORE في admin_task_claims يُنفَّذ بمفرده أولاً (قيد UNIQUE هو الـCAS)، ولا يُمنح أي عملة إلا لو نجح هذا الإدراج بالتحديد. =====================================================================
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

  const insertResult = await env.DB.prepare(
    "INSERT OR IGNORE INTO admin_task_claims (telegram_id, task_id, claimed_at) VALUES (?, ?, ?)"
  ).bind(telegramId, taskId, Date.now()).run();

  if (!insertResult.meta || insertResult.meta.changes === 0) {
    return jsonResponse({ error: "already_claimed" }, 409);
  }

  // شرط "claims_count < max_claims" ذرّي — يمنع تجاوز حد المهمة حتى مع طلبات متزامنة على آخر مقعد متاح. لو استُنفد الحد بين لحظة عرض المهمة للمستخدم واستلامه، نُلغي حجز الاستلام أعلاه (نفس أسلوب handlePromoRedeem بالضبط) ولا يُمنح أي عملة.
  const counterResult = await env.DB.prepare(
    `UPDATE admin_tasks SET claims_count = claims_count + 1
     WHERE id = ? AND (max_claims IS NULL OR claims_count < max_claims)`
  ).bind(taskId).run();

  if (!counterResult.meta || counterResult.meta.changes === 0) {
    await env.DB.prepare(
      "DELETE FROM admin_task_claims WHERE telegram_id = ? AND task_id = ?"
    ).bind(telegramId, taskId).run();
    return jsonResponse({ error: "task_full" }, 400);
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

// ===================================================================== تُستدعى تلقائياً من scheduled() عند 00:00 UTC فقط (انظر أعلى الملف). تختار ترتيباً عشوائياً جديداً لبطاقات Daily Combo، تحفظه، وترسل الإجابة الصحيحة للأدمن فقط عبر رسالة خاصة تيليجرام — لا شيء غير هذا يكشف الترتيب الصحيح (لا استجابة API ولا رسالة عامة تحتويه إطلاقاً). =====================================================================
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

// خلط Fisher-Yates باستخدام Web Crypto (نفس أسلوب pickWeightedSpinIndex) بدل Math.random لعشوائية أفضل تناسب تركيبة يومية حقيقية.
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===================================================================== نقطة /api/combo/check — يرسل المستخدم ترتيبه المخمَّن لبطاقات اليوم الثلاث. لا تُرسَل أبداً الإجابة الصحيحة لأي طلب هنا (لا عند النجاح ولا عند الفشل) — فقط "صحيح/خطأ" و"كم محاولة تبقّت". السلامة من السباقات: خطوة استهلاك المحاولة (UPDATE على combo_attempts بشرط solved=0 AND attempts_used<الحد) تُنفَّذ بمفردها أولاً عبر .run() وليس ضمن batch مع منح المكافأة — لو فشلت (changes=0) نتوقف فوراً بدون تنفيذ أي شيء آخر. فقط لو نجحت هذه الخطوة الذرّية بالتحديد ننتقل لمنح الـ100 عملة، فيستحيل منح المكافأة أكثر من مرة أو تجاوز المحاولتين حتى لو وصل نفس الطلب للسيرفر أكثر من مرة في نفس اللحظة. =====================================================================
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

  // وصلنا هنا فقط لو التحديث الذرّي أعلاه نجح بالتحديد لهذا الطلب — أي طلب آخر متزامن كان سيفشل بشرط "solved = 0"، فلا خطر من منح المكافأة أكثر من مرة حتى بدون شرط CAS إضافي هنا.
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

// يحسب حالة Storage الحالية (كم تراكم؟ هل امتلأ؟ كم تبقّى؟) بدون أي كتابة لقاعدة البيانات — يُستخدم فقط للعرض في /api/realm/status.
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

// يحسب حالة التسلسل الحالية (أي يوم القادم؟ هل انقطع؟ هل استُلم اليوم؟) بدون أي كتابة لقاعدة البيانات — يُستخدم للعرض في /api/user وللتحقق قبل الكتابة الفعلية في /api/streak/claim.
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

// تاريخ الغد بتوقيت UTC الساعة 00:00 بالضبط — لحظة انتهاء صلاحية Claim الحالي وبداية اليوم التالي في كل من التعدين والـ Daily Streak.
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

// أقرب جمعة 00:30 UTC قادمة (موعد توزيع جوائز Weekly Leaderboard) بالمللي ثانية — يُرسَل للواجهة فقط لعرض عدّاد تنازلي حقيقي، لا نص ثابت.
function nextLeaderboardPayoutAt() {
  const now = new Date();
  const result = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 30, 0, 0
  ));
  const currentDay = result.getUTCDay(); // 0=الأحد..6=السبت، الجمعة=5
  let daysUntilFriday = (5 - currentDay + 7) % 7;
  if (daysUntilFriday === 0 && now.getTime() >= result.getTime()) {
    daysUntilFriday = 7; // اليوم جمعة لكن تجاوزنا 00:30 بالفعل — الجمعة القادمة
  }
  result.setUTCDate(result.getUTCDate() + daysUntilFriday);
  return result.getTime();
}

// ثوانٍ متبقية حتى 00:00 UTC القادمة — TTL لكاش Leaderboard اليومي (Cache API)، بحد أدنى 60 ثانية لتفادي max-age صفري/سالب عند حافة اليوم.
function secondsUntilNextMidnightUTC() {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
  return Math.max(60, Math.floor((next.getTime() - now.getTime()) / 1000));
}

// مفتاح فريد لهذا الأسبوع بالتحديد بصيغة "YYYY-Www" (رقم أسبوع ISO) — حماية Idempotency الحقيقية لتوزيع جوائز Weekly Leaderboard (قيد PRIMARY KEY في leaderboard_payouts، لا مجرد علم يُقرأ ثم يُكتَب).
function isoWeekKeyUTC() {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return d.getUTCFullYear() + "-W" + String(weekNo).padStart(2, "0");
}

// يحوّل created_at (مللي ثانية) إلى صيغة DD-MM-YYYY لعرضها في نافذة Profile
function formatDateDDMMYYYY(ms) {
  const d = new Date(ms);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// يحوّل صف المستخدم الخام إلى شكل يراعي "التصفير الكسول" لعداد الدورات اليومي بدون أي كتابة لقاعدة البيانات (يُحسب فقط عند العرض).
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

// ===================================================================== تتحقق من initData وترجع معرّف المستخدم تيليجرام + بيانات الدعوة. تُستخدم من طرف كل نقاط /api/* المحمية. =====================================================================
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

  // referred_by يجي من رابط الدعوة (t.me/MinerXRealmBot/app?startapp=ref_<telegram_id الخاص بالمُحيل>) عبر start_param
  const startParam = params.get("start_param");
  let referredBy = null;
  if (startParam && startParam.startsWith("ref_")) {
    const parsed = parseInt(startParam.replace("ref_", ""), 10);
    if (!isNaN(parsed) && parsed !== telegramId) referredBy = parsed;
  }

  // rawUsername/firstName منفصلان عن username (الذي يخلط بينهما) — لازمان لبناء اسم عرض صحيح في رسائل السحب: "@user" فقط لو كان اسم مستخدم حقيقياً، وإلا الاسم الأول بدون "@" (لا نضع "@" أمام اسم عادي، سيظهر كمنشن مكسور).
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

// ===================================================================== التحقق من صحة initData حسب خوارزمية تيليجرام الرسمية (HMAC-SHA256) https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app =====================================================================
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
    await sendWelcomeMessage(env, message.chat.id);
  }

  // أزرار Approve/Reject لطلبات السحب — فقط ADMIN_TELEGRAM_ID يُنفَّذ له أي إجراء، أي ضغطة من أي شخص آخر تُرفض بتنبيه بدون أي تأثير على البيانات.
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

async function sendPhoto(env, chatId, payload) {
  const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, ...payload })
  });
  return res.json().catch(() => null);
}

// نفس رسالة /start بالضبط — تُستدعى أيضاً من handleGetUser عند إنشاء صف مستخدم جديد،
// لأن فتح البوت عبر رابط Mini App المباشر (t.me/MinerXRealmBot/app) لا يُرسل /start
// إطلاقاً (يفتح التطبيق مباشرة متجاوزاً محادثة البوت)، فهذه الطريقة الوحيدة لضمان
// وصول رسالة الترحيب لأول فتح فعلي. فشل الإرسال هنا لا يجب أن يمنع إنشاء المستخدم أو
// تحميل التطبيق أبداً — لذلك يُستدعى دائماً داخل try/catch من طرف المستدعي.
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

// ===================================================================== يبني نص رسالة السحب الثلاث حالاتها (pending/approved/rejected) — نفس البيانات، فقط العنوان/الإيموجي يتغيّر، ويُحذف قسم الأزرار عند الرفض. ===================================================================== يهرب الرموز الخاصة بـ HTML قبل تضمين أي نص مصدره المستخدم (اسم المستخدم، الاسم الأول، عنوان المحفظة) داخل رسالة بصيغة parse_mode=HTML — يمنع كسر تنسيق الرسالة أو حقن وسوم غير مقصودة.
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

  // <code> يجعل تيليجرام يعرض النص بخط أحادي المسافة قابل للضغط للنسخ بضغطة واحدة — مطبَّق على ID المستخدم وعنوان المحفظة تحديداً.
  return (
    `${title}\n\n` +
    `👤 ${nameLine}\n` +
    `🆔 <code>${w.telegramId}</code>\n\n` +
    `💵 Amount: ${w.netGram} Gram\n\n` +
    `📍 Address:\n<code>${escapeHtml(w.address)}</code>`
  );
}

// ===================================================================== يعالج ضغطة Approve/Reject على منشور السحب في القناة. يتحقق أولاً أن الضاغط هو ADMIN_TELEGRAM_ID، ثم يستخدم شرط "status='pending'" كـ CAS ذرّي يمنع تنفيذ الزر مرتين (مثلاً لو ضُغط Approve وReject في نفس اللحظة). =====================================================================
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
