// URL of the deployed Mini App (same Worker serving the static assets)
const WEBAPP_URL = "https://minerxrealm.zekobusiness0.workers.dev/";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Telegram sends updates here
    if (url.pathname === "/telegram-webhook") {
      return handleTelegram(request, env);
    }

    // Everything else -> serve the Mini App static files
    return env.ASSETS.fetch(request);
  }
};

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
