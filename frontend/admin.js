// Admin panel: its windows, styles and code. Loaded only when the admin opens the panel (index.html keeps just the
// button and the loader); the server checks the admin on every request anyway
(function(){
  var style = document.createElement('style');
  style.textContent = "#modal-admin{ z-index:200; align-items:flex-start; padding:0; overflow-y:auto; -webkit-overflow-scrolling:touch; }\n#modal-admin .ap-wrap{\n  width:100%; min-height:100%; box-sizing:border-box; padding:calc(20px * var(--s)) calc(16px * var(--s)) calc(40px * var(--s));\n  background:radial-gradient(calc(600px * var(--s)) calc(380px * var(--s)) at 50% 0%, var(--bg-glow-1), transparent 60%), var(--bg);\n}\n.ap-card{ background:rgba(36,28,56,.75); border:1px solid rgba(196,181,253,.14); border-radius:calc(16px * var(--s)); padding:calc(16px * var(--s)); margin-bottom:calc(14px * var(--s)); }\n/* the task editor opens over the admin panel: a solid card so nothing behind it shows through */\n#modal-admin-task .ap-card{\n  background:linear-gradient(180deg, #2a2142, #1b1530);\n  border-color:rgba(196,181,253,.3);\n  box-shadow:0 calc(18px * var(--s)) calc(40px * var(--s)) rgba(0,0,0,.6);\n}\n.ap-title{ font-family:var(--font-display); font-weight:800; font-size:calc(14px * var(--s)); color:#f0d878; margin:0 0 calc(10px * var(--s)); }\n.ap-label{ font-size:calc(10px * var(--s)); color:var(--ink-dim); text-transform:uppercase; letter-spacing:.3px; margin-bottom:calc(5px * var(--s)); display:block; }\n.ap-input{ width:100%; background:rgba(16,12,26,.6); border:1px solid rgba(196,181,253,.18); border-radius:calc(10px * var(--s)); padding:calc(9px * var(--s)) calc(11px * var(--s)); color:var(--ink); font-size:calc(13px * var(--s)); box-sizing:border-box; }\n.ap-row{ display:flex; align-items:center; gap:calc(8px * var(--s)); }\n.ap-btn{ background:linear-gradient(135deg,#f0d878,#c9973a); color:#100c1a; font-family:var(--font-display); font-weight:800; font-size:calc(12px * var(--s)); border:none; border-radius:calc(10px * var(--s)); padding:calc(9px * var(--s)) calc(14px * var(--s)); cursor:pointer; flex-shrink:0; }\n.ap-btn-outline{ background:transparent; border:1px solid rgba(196,181,253,.3); color:var(--ink); font-size:calc(11px * var(--s)); font-weight:700; border-radius:calc(10px * var(--s)); padding:calc(8px * var(--s)) calc(12px * var(--s)); cursor:pointer; }\n.ap-tab{ flex:1; text-align:center; border:1px solid rgba(196,181,253,.2); color:var(--ink-dim); font-size:calc(11px * var(--s)); font-weight:700; border-radius:calc(20px * var(--s)); padding:calc(7px * var(--s)) 0; cursor:pointer; }\n.ap-tab.is-active{ background:rgba(240,216,120,.16); border-color:rgba(240,216,120,.4); color:#f0d878; }\n.ap-btn-danger{ background:linear-gradient(135deg,#e2725f,#b4402f); color:#fff; }\n.ap-linked-row{ display:flex; justify-content:space-between; gap:calc(8px * var(--s)); padding:calc(6px * var(--s)) 0; border-bottom:1px solid rgba(196,181,253,.08); font-size:calc(12px * var(--s)); }\n.ap-linked-row span:first-child{ color:var(--ink); font-weight:600; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }\n.ap-linked-row span:last-child{ color:var(--ink-dim); flex-shrink:0; }\n.ap-info-row{ display:flex; justify-content:space-between; padding:calc(6px * var(--s)) 0; border-bottom:1px solid rgba(196,181,253,.08); font-size:calc(12px * var(--s)); }\n.ap-info-row span:first-child{ color:var(--ink-dim); }\n.ap-info-row span:last-child{ color:var(--ink); font-weight:600; }\n.ap-task-row{ display:flex; align-items:center; gap:calc(8px * var(--s)); background:rgba(16,12,26,.4); border-radius:calc(10px * var(--s)); padding:calc(8px * var(--s)); margin-bottom:calc(8px * var(--s)); }\n.ap-task-icon{ width:calc(34px * var(--s)); height:calc(34px * var(--s)); border-radius:calc(8px * var(--s)); background:rgba(196,181,253,.14); flex-shrink:0; object-fit:cover; }\n.ap-task-actions{ display:flex; gap:calc(6px * var(--s)); flex-shrink:0; }\n.ap-task-actions span{ cursor:pointer; font-size:calc(14px * var(--s)); color:var(--ink-dim); }";
  document.head.appendChild(style);
  var holder = document.createElement('div');
  holder.innerHTML = "  <!-- Admin Panel -->\n  <div class=\"modal-overlay\" id=\"modal-admin\" data-no-i18n>\n    <div class=\"ap-wrap\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:calc(16px * var(--s));\">\n        <button class=\"ap-btn-outline\" onclick=\"closeModal('modal-admin')\">\u2190 Back</button>\n        <div style=\"font-family:var(--font-display);font-weight:800;font-size:calc(16px * var(--s));color:#f0d878;\">Admin</div>\n        <span style=\"width:calc(60px * var(--s));\"></span>\n      </div>\n\n      <!-- Admin: Find User -->\n      <div class=\"ap-card\">\n        <h2 class=\"ap-title\">\ud83d\udd0d Find User</h2>\n        <div class=\"ap-row\">\n          <input class=\"ap-input\" id=\"ap-find-input\" placeholder=\"Telegram ID\" inputmode=\"numeric\">\n          <button class=\"ap-btn\" onclick=\"adminFindUser()\">Search</button>\n        </div>\n        <div id=\"ap-find-result\" style=\"display:none;margin-top:calc(14px * var(--s));padding-top:calc(14px * var(--s));border-top:1px solid rgba(196,181,253,.1);\">\n          <div id=\"ap-find-name\" style=\"font-weight:700;font-size:calc(13px * var(--s));color:var(--ink);margin-bottom:calc(10px * var(--s));\">\u2014</div>\n          <div class=\"ap-row\">\n            <div style=\"flex:1;\">\n              <label class=\"ap-label\">Coins (Exchangeable)</label>\n              <input class=\"ap-input\" id=\"ap-find-coins\" inputmode=\"decimal\" oninput=\"adminRenderTotalCoins()\">\n            </div>\n          </div>\n          <div class=\"ap-row\" style=\"margin-top:calc(8px * var(--s));\">\n            <div style=\"flex:1;\">\n              <label class=\"ap-label\">Locked Coins (Deposited)</label>\n              <input class=\"ap-input\" id=\"ap-find-locked\" inputmode=\"decimal\" oninput=\"adminRenderTotalCoins()\">\n            </div>\n          </div>\n          <div class=\"ap-row\" style=\"margin-top:calc(8px * var(--s));\">\n            <div style=\"flex:1;\">\n              <label class=\"ap-label\">Gram</label>\n              <input class=\"ap-input\" id=\"ap-find-gram\" inputmode=\"decimal\">\n            </div>\n          </div>\n          <div class=\"ap-info-row\" style=\"border-bottom:none;margin-top:calc(4px * var(--s));\"><span>Total Coins</span><span id=\"ap-find-total-coins\">0</span></div>\n          <button class=\"ap-btn\" style=\"width:100%;margin-top:calc(10px * var(--s));box-sizing:border-box;\" onclick=\"adminSaveBalance()\">Save Balance</button>\n          <div style=\"margin-top:calc(14px * var(--s));\">\n            <div class=\"ap-info-row\"><span>Registered</span><span id=\"ap-find-registered\">\u2014</span></div>\n            <div class=\"ap-info-row\"><span>Ads Watched</span><span id=\"ap-find-ads\">0</span></div>\n            <div class=\"ap-info-row\"><span>Invites</span><span id=\"ap-find-invites\">0</span></div>\n            <div class=\"ap-info-row\"><span>Active Invites</span><span id=\"ap-find-active-invites\">0</span></div>\n            <div class=\"ap-info-row\"><span>Referrals Commission</span><span id=\"ap-find-referral-commission\">0</span></div>\n            <div class=\"ap-info-row\"><span>Total Speed</span><span id=\"ap-find-speed\">+0 Coins/hr</span></div>\n            <div class=\"ap-info-row\"><span>Total Deposit</span><span id=\"ap-find-deposit\">0 Gram</span></div>\n            <div class=\"ap-info-row\"><span>Total Withdraw</span><span id=\"ap-find-withdraw\">0 Gram</span></div>\n            <div class=\"ap-info-row\" style=\"border-bottom:none;\"><span>Status</span><span id=\"ap-find-status\">\u2014</span></div>\n            <label class=\"ap-label\" style=\"margin-top:calc(12px * var(--s));\">Linked Accounts</label>\n            <div id=\"ap-find-linked\"></div>\n            <button class=\"ap-btn ap-btn-danger\" id=\"ap-find-ban-linked\" style=\"display:none;width:100%;margin-top:calc(10px * var(--s));box-sizing:border-box;\" onclick=\"adminBanLinked()\">Ban All Linked</button>\n          </div>\n        </div>\n      </div>\n\n      <!-- Admin: Ban User -->\n      <div class=\"ap-card\">\n        <h2 class=\"ap-title\">\ud83d\udeab Ban User</h2>\n        <label class=\"ap-label\">Telegram ID</label>\n        <input class=\"ap-input\" id=\"ap-ban-id\" placeholder=\"Telegram ID\" inputmode=\"numeric\">\n        <div class=\"ap-row\" style=\"margin-top:calc(12px * var(--s));\">\n          <button class=\"ap-btn ap-btn-danger\" style=\"flex:1;\" onclick=\"adminSetBan(true)\">Ban</button>\n          <button class=\"ap-btn-outline\" style=\"flex:1;\" onclick=\"adminSetBan(false)\">Unban</button>\n        </div>\n        <button class=\"ap-btn-outline\" id=\"ap-ban-history-btn\" style=\"width:100%;margin-top:calc(8px * var(--s));box-sizing:border-box;\" onclick=\"adminToggleBannedList()\">Banned Users</button>\n        <div id=\"ap-ban-list\" style=\"margin-top:calc(14px * var(--s));display:none;\"></div>\n      </div>\n\n      <!-- Admin: Tasks -->\n      <div class=\"ap-card\">\n        <h2 class=\"ap-title\">\ud83d\uddc2 Tasks \u2014 Special / Partner</h2>\n        <button class=\"ap-btn\" style=\"width:100%;margin-top:calc(12px * var(--s));box-sizing:border-box;\" onclick=\"adminOpenTaskModal(null)\">+ Add A Task</button>\n        <button class=\"ap-btn-outline\" id=\"ap-tasks-history-btn\" style=\"width:100%;margin-top:calc(8px * var(--s));box-sizing:border-box;\" onclick=\"adminToggleTasksList()\">Show Tasks</button>\n        <div id=\"ap-tasks-section\" style=\"display:none;margin-top:calc(14px * var(--s));\">\n          <div class=\"ap-row\">\n            <div class=\"ap-tab ap-task-tab is-active\" data-section=\"special\" onclick=\"adminSwitchTaskTab('special')\">Special</div>\n            <div class=\"ap-tab ap-task-tab\" data-section=\"partner\" onclick=\"adminSwitchTaskTab('partner')\">Partner</div>\n          </div>\n          <div id=\"ap-tasks-list\" style=\"margin-top:calc(12px * var(--s));\"></div>\n        </div>\n      </div>\n\n      <!-- Admin: Promo Code -->\n      <div class=\"ap-card\">\n        <h2 class=\"ap-title\">\ud83c\udff7 Create Promo Code</h2>\n        <label class=\"ap-label\">Code</label>\n        <input class=\"ap-input\" id=\"ap-promo-code\" placeholder=\"e.g. MINERX2026\">\n        <div class=\"ap-row\" style=\"margin-top:calc(10px * var(--s));\">\n          <div style=\"flex:1;\">\n            <label class=\"ap-label\">Reward</label>\n            <input class=\"ap-input\" id=\"ap-promo-reward\" inputmode=\"decimal\" placeholder=\"e.g. 500\">\n          </div>\n          <div style=\"flex:1;\">\n            <label class=\"ap-label\">Currency</label>\n            <select class=\"ap-input\" id=\"ap-promo-currency\">\n              <option value=\"coins\">Coins</option>\n              <option value=\"gram\">Gram</option>\n            </select>\n          </div>\n        </div>\n        <label class=\"ap-label\" style=\"margin-top:calc(10px * var(--s));\">Usage Limit (blank = unlimited)</label>\n        <input class=\"ap-input\" id=\"ap-promo-maxuses\" inputmode=\"numeric\" placeholder=\"e.g. 500\">\n        <button class=\"ap-btn\" style=\"width:100%;margin-top:calc(12px * var(--s));box-sizing:border-box;\" onclick=\"adminCreatePromo()\">Create</button>\n        <button class=\"ap-btn-outline\" id=\"ap-promo-history-btn\" style=\"width:100%;margin-top:calc(8px * var(--s));box-sizing:border-box;\" onclick=\"adminTogglePromoHistory()\">Show History</button>\n        <div id=\"ap-promo-list\" style=\"margin-top:calc(14px * var(--s));display:none;\"></div>\n      </div>\n\n      <!-- Admin: The Ambassador -->\n      <div class=\"ap-card\">\n        <h2 class=\"ap-title\">\u2b50 The Ambassador</h2>\n        <label class=\"ap-label\">Telegram ID</label>\n        <input class=\"ap-input\" id=\"ap-amb-id\" placeholder=\"Telegram ID\" inputmode=\"numeric\">\n        <label class=\"ap-label\" style=\"margin-top:calc(10px * var(--s));\">Speed (Coins/hr)</label>\n        <input class=\"ap-input\" id=\"ap-amb-speed\" inputmode=\"numeric\" placeholder=\"e.g. 1000\">\n        <label class=\"ap-label\" style=\"margin-top:calc(10px * var(--s));\">Value ($)</label>\n        <input class=\"ap-input\" id=\"ap-amb-value\" inputmode=\"decimal\" placeholder=\"e.g. 50 (empty = unchanged)\">\n        <div class=\"ap-row\" style=\"margin-top:calc(12px * var(--s));\">\n          <button class=\"ap-btn\" style=\"flex:1;\" onclick=\"adminAmbassadorGrant()\">Grant / Update Speed</button>\n          <button class=\"ap-btn-outline\" style=\"flex:1;\" onclick=\"adminAmbassadorRevoke()\">Revoke</button>\n        </div>\n        <button class=\"ap-btn-outline\" id=\"ap-amb-history-btn\" style=\"width:100%;margin-top:calc(8px * var(--s));box-sizing:border-box;\" onclick=\"adminToggleAmbassadorHistory()\">Show History</button>\n        <div id=\"ap-amb-list\" style=\"margin-top:calc(14px * var(--s));display:none;\"></div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Admin Task Editor Modal -->\n  <div class=\"modal-overlay\" id=\"modal-admin-task\" style=\"z-index:210;\" data-no-i18n>\n    <div class=\"ap-card\" style=\"width:100%;max-width:calc(360px * var(--s));max-height:88vh;overflow-y:auto;\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:calc(10px * var(--s));\">\n        <div class=\"ap-title\" id=\"ap-task-modal-title\" style=\"margin:0;\">Add A Task</div>\n        <button class=\"ap-btn-outline\" onclick=\"closeModal('modal-admin-task')\">\u2715</button>\n      </div>\n      <label class=\"ap-label\">Task Name</label>\n      <input class=\"ap-input\" id=\"ap-task-title\" placeholder=\"e.g. Follow our X account\">\n      <label class=\"ap-label\" style=\"margin-top:calc(10px * var(--s));\">Description</label>\n      <input class=\"ap-input\" id=\"ap-task-desc\" placeholder=\"Short text shown under the title\">\n      <label class=\"ap-label\" style=\"margin-top:calc(10px * var(--s));\">Link</label>\n      <input class=\"ap-input\" id=\"ap-task-link\" placeholder=\"https://...\">\n      <label class=\"ap-label\" style=\"margin-top:calc(10px * var(--s));\">Show In</label>\n      <div class=\"ap-row\">\n        <div class=\"ap-tab\" id=\"ap-task-section-special\" onclick=\"adminSetTaskFormSection('special')\">Special</div>\n        <div class=\"ap-tab\" id=\"ap-task-section-partner\" onclick=\"adminSetTaskFormSection('partner')\">Partner</div>\n      </div>\n      <div class=\"ap-row\" style=\"margin-top:calc(10px * var(--s));\">\n        <div style=\"flex:1;\">\n          <label class=\"ap-label\">Reward (Coins)</label>\n          <input class=\"ap-input\" id=\"ap-task-reward\" inputmode=\"numeric\" placeholder=\"e.g. 20\">\n        </div>\n        <div style=\"flex:1;\">\n          <label class=\"ap-label\">Max Claims (blank = \u221e)</label>\n          <input class=\"ap-input\" id=\"ap-task-maxclaims\" inputmode=\"numeric\" placeholder=\"e.g. 1000\">\n        </div>\n      </div>\n      <label class=\"ap-label\" style=\"margin-top:calc(10px * var(--s));\">Task Image</label>\n      <div class=\"ap-row\">\n        <div id=\"ap-task-icon-preview\" style=\"width:calc(56px * var(--s));height:calc(56px * var(--s));border-radius:calc(12px * var(--s));background-size:cover;background-position:center;border:calc(1.5px * var(--s)) dashed rgba(196,181,253,.35);flex-shrink:0;\"></div>\n        <label class=\"ap-btn-outline\" style=\"flex:1;text-align:center;\">\n          Upload\n          <input type=\"file\" accept=\"image/*\" style=\"display:none;\" onchange=\"adminHandleTaskImageInput(this)\">\n        </label>\n      </div>\n      <div class=\"ap-row\" style=\"margin-top:calc(16px * var(--s));\">\n        <button class=\"ap-btn-outline\" style=\"flex:1;\" onclick=\"closeModal('modal-admin-task')\">Cancel</button>\n        <button class=\"ap-btn\" style=\"flex:1;\" onclick=\"adminSaveTask()\">Save Task</button>\n      </div>\n    </div>\n  </div>";
  // the windows go where they were in the page, before the Upgrade Storage window
  var before = document.getElementById('modal-upgrade-storage');
  while (holder.firstChild) before.parentNode.insertBefore(holder.firstChild, before);
  // like every other window (set up at start, before these existed): a tap outside closes it
  ['modal-admin', 'modal-admin-task'].forEach(function(id){
    var overlay = document.getElementById(id);
    overlay.addEventListener('click', function(e){
      if (e.target === overlay){ overlay.classList.remove('is-open'); }
    });
  });
})();

// Admin Panel
var adminPanelState = {
  currentTaskTab: 'special',
  tasks: { special: [], partner: [] },
  tasksFetched: { special: false, partner: false },
  tasksListShown: false,
  editingTaskId: null,
  taskIconDataUrl: null,
  taskFormSection: 'special',
  taskChannelId: null,
  foundUser: null,
  promoListFetched: false,
  ambListFetched: false,
  bannedListFetched: false
};
function adminApiPost(path, extraBody, onSuccess, onError){
  var initData = getTelegramInitData();
  if (!initData) return;
  var body = { initData: initData };
  for (var k in extraBody){ if (extraBody.hasOwnProperty(k)) body[k] = extraBody[k]; }
  fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  .then(function(res){ return res.json().then(function(data){ return { ok: res.ok, data: data }; }); })
  .then(function(r){
    if (!r.ok){ if (onError) onError(r.data || {}); return; }
    if (onSuccess) onSuccess(r.data || {});
  })
  .catch(function(){ if (onError) onError({ error: 'network_error' }); });
}
function adminToast(message){
  showAppToast({ title: 'Admin', amount: message });
}

// Admin: Find User
function adminFindUser(){
  var idInput = document.getElementById('ap-find-input');
  var id = parseInt(idInput.value, 10);
  if (!Number.isInteger(id)){ adminToast('Enter a valid Telegram ID'); return; }
  adminApiPost('/api/admin/user/find', { target_id: id }, function(data){
    adminPanelState.foundUser = data;
    document.getElementById('ap-find-result').style.display = '';
    document.getElementById('ap-find-name').textContent = data.username ? ('@' + data.username) : ('Player ' + data.telegram_id);
    var locked = Number(data.locked_coins) || 0;
    document.getElementById('ap-find-coins').value = Math.round(Math.max(0, data.coins - locked));
    document.getElementById('ap-find-locked').value = Math.round(locked);
    adminRenderTotalCoins();
    document.getElementById('ap-find-gram').value = Number(data.gram).toFixed(3);
    document.getElementById('ap-find-registered').textContent = data.registered_date;
    document.getElementById('ap-find-ads').textContent = Number(data.ads_watched || 0).toLocaleString('en-US');
    document.getElementById('ap-find-invites').textContent = data.invites;
    document.getElementById('ap-find-active-invites').textContent = data.active_invites;
    document.getElementById('ap-find-referral-commission').textContent = Number(data.referral_commission_total).toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('ap-find-speed').textContent = '+' + Number(data.total_speed).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' Coins/hr';
    document.getElementById('ap-find-deposit').textContent = Number(data.total_deposit_gram).toFixed(3) + ' Gram';
    document.getElementById('ap-find-withdraw').textContent = Number(data.total_withdraw_gram).toFixed(3) + ' Gram';
    renderAdminFoundUserBan(data);
  }, function(){
    adminPanelState.foundUser = null;
    document.getElementById('ap-find-result').style.display = 'none';
    adminToast('User not found');
  });
}
function renderAdminFoundUserBan(data){
  var statusEl = document.getElementById('ap-find-status');
  statusEl.textContent = data.banned_date ? ('🚫 Banned (' + data.banned_date + ')') : '✅ Active';
  statusEl.style.color = data.banned_date ? '#e2725f' : '';
  var linked = data.linked_accounts || [];
  var list = document.getElementById('ap-find-linked');
  list.innerHTML = linked.length ? linked.map(function(a){
    var name = a.username ? ('@' + a.username) : ('Player ' + a.telegram_id);
    return '<div class="ap-linked-row"><span>' + escapeHtmlClient(name) + ' · ' + Number(a.telegram_id) + '</span><span>' + Number(a.ads_watched).toLocaleString('en-US') + ' Ads</span></div>';
  }).join('') : '<div style="font-size:calc(12px * var(--s));color:var(--ink-dim);">—</div>';
  document.getElementById('ap-find-ban-linked').style.display = linked.length ? '' : 'none';
}
// re-reads the found user so Status and Linked Accounts show the result of a ban
function adminRefreshFoundUser(telegramId){
  var found = adminPanelState.foundUser;
  if (!found || (telegramId !== undefined && found.telegram_id !== telegramId && !(found.linked_accounts || []).some(function(a){ return a.telegram_id === telegramId; }))) return;
  adminApiPost('/api/admin/user/find', { target_id: found.telegram_id }, function(data){
    adminPanelState.foundUser = data;
    renderAdminFoundUserBan(data);
  });
}
// Coins (exchangeable) + Locked Coins (deposited) = the user's coin balance
function adminRenderTotalCoins(){
  var free = Number(document.getElementById('ap-find-coins').value) || 0;
  var locked = Number(document.getElementById('ap-find-locked').value) || 0;
  document.getElementById('ap-find-total-coins').textContent = Math.round(free + locked).toLocaleString('en-US');
}
function adminSaveBalance(){
  if (!adminPanelState.foundUser) return;
  var coins = Number(document.getElementById('ap-find-coins').value);
  var locked = Number(document.getElementById('ap-find-locked').value);
  var gram = Number(document.getElementById('ap-find-gram').value);
  if (!Number.isFinite(coins) || coins < 0 || !Number.isFinite(locked) || locked < 0 || !Number.isFinite(gram) || gram < 0){ adminToast('Invalid amount'); return; }
  adminApiPost('/api/admin/user/edit_balance', { target_id: adminPanelState.foundUser.telegram_id, coins: coins, locked_coins: locked, gram: gram }, function(){
    adminToast('Balance updated');
  }, function(){
    adminToast('Failed to update balance');
  });
}

// Admin: Ban User
function adminSetBan(ban){
  var id = parseInt(document.getElementById('ap-ban-id').value, 10);
  if (!Number.isInteger(id)){ adminToast('Enter a valid Telegram ID'); return; }
  adminApiPost('/api/admin/user/ban', { target_id: id, banned: ban }, function(){
    adminToast(ban ? 'User banned' : 'User unbanned');
    if (adminPanelState.bannedListFetched) adminFetchBannedList();
    adminRefreshFoundUser(id);
  }, function(err){
    adminToast(err.error === 'user_not_found' ? 'User not found' : (ban ? 'Failed to ban' : 'Failed to unban'));
  });
}
function adminBanLinked(){
  var found = adminPanelState.foundUser;
  if (!found) return;
  adminApiPost('/api/admin/user/ban_linked', { target_id: found.telegram_id }, function(data){
    adminToast(data.banned_count + ' account(s) banned');
    if (adminPanelState.bannedListFetched) adminFetchBannedList();
    adminRefreshFoundUser();
  }, function(){
    adminToast('Failed to ban linked accounts');
  });
}
function adminToggleBannedList(){
  var list = document.getElementById('ap-ban-list');
  var btn = document.getElementById('ap-ban-history-btn');
  if (!list) return;
  var showing = list.style.display !== 'none';
  if (showing){
    list.style.display = 'none';
    if (btn) btn.textContent = 'Banned Users';
    return;
  }
  list.style.display = '';
  if (btn) btn.textContent = 'Hide Banned Users';
  if (!adminPanelState.bannedListFetched){
    adminPanelState.bannedListFetched = true;
    adminFetchBannedList();
  }
}
function adminFetchBannedList(){
  adminApiPost('/api/admin/banned/list', {}, function(data){
    renderAdminBannedList(data.banned || []);
  });
}
function renderAdminBannedList(banned){
  var list = document.getElementById('ap-ban-list');
  if (!list) return;
  if (!banned.length){
    list.innerHTML = '<div style="font-size:calc(11px * var(--s));color:var(--ink-dim);text-align:center;padding:calc(10px * var(--s)) 0;">No banned users</div>';
    return;
  }
  list.innerHTML = banned.map(function(b){
    var name = b.username ? ('@' + b.username) : ('Player ' + b.telegram_id);
    return (
      '<div class="ap-task-row" style="cursor:pointer;" onclick="document.getElementById(\'ap-ban-id\').value=' + Number(b.telegram_id) + '">' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:calc(12px * var(--s));font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtmlClient(name) + '</div>' +
          '<div style="font-size:calc(10px * var(--s));color:var(--ink-dim);">ID: ' + Number(b.telegram_id) + ' · Banned ' + escapeHtmlClient(b.banned_date) + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

// Admin: Tasks
function adminToggleTasksList(){
  var section = document.getElementById('ap-tasks-section');
  var btn = document.getElementById('ap-tasks-history-btn');
  if (!section) return;
  var showing = section.style.display !== 'none';
  if (showing){
    section.style.display = 'none';
    adminPanelState.tasksListShown = false;
    if (btn) btn.textContent = 'Show Tasks';
    return;
  }
  section.style.display = '';
  adminPanelState.tasksListShown = true;
  if (btn) btn.textContent = 'Hide Tasks';
  if (!adminPanelState.tasksFetched[adminPanelState.currentTaskTab]){
    adminPanelState.tasksFetched[adminPanelState.currentTaskTab] = true;
    adminFetchTasks(adminPanelState.currentTaskTab);
  }
}
function adminSwitchTaskTab(section){
  adminPanelState.currentTaskTab = section;
  document.querySelectorAll('.ap-task-tab').forEach(function(t){
    t.classList.toggle('is-active', t.getAttribute('data-section') === section);
  });
  if (!adminPanelState.tasksFetched[section]){
    adminPanelState.tasksFetched[section] = true;
    adminFetchTasks(section);
  } else {
    renderAdminPanelTasks(section);
  }
}
function adminFetchTasks(section){
  adminApiPost('/api/admin/tasks/list', { section: section }, function(data){
    adminPanelState.tasks[section] = data.tasks || [];
    renderAdminPanelTasks(section);
  });
}
function renderAdminPanelTasks(section){
  if (adminPanelState.currentTaskTab !== section) return;
  var list = document.getElementById('ap-tasks-list');
  if (!list) return;
  var tasks = adminPanelState.tasks[section] || [];
  if (!tasks.length){
    list.innerHTML = '<div style="font-size:calc(11px * var(--s));color:var(--ink-dim);text-align:center;padding:calc(10px * var(--s)) 0;">No tasks yet</div>';
    return;
  }
  list.innerHTML = tasks.map(function(t){
    var iconHtml = t.icon_url
      ? '<img class="ap-task-icon" src="' + escapeHtmlClient(t.icon_url) + '" alt="">'
      : '<div class="ap-task-icon"></div>';
    var limitText = t.max_claims ? (t.claims_count + '/' + t.max_claims + ' claims') : (t.claims_count + ' claims');
    var isPinned = !!t.pinned_at;
    return (
      '<div class="ap-task-row">' + iconHtml +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:calc(12px * var(--s));font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (isPinned ? '📌 ' : '') + escapeHtmlClient(t.title) + '</div>' +
          '<div style="font-size:calc(10px * var(--s));color:var(--ink-dim);">+' + Number(t.reward_coins) + ' Coins · ' + limitText + '</div>' +
        '</div>' +
        '<div class="ap-task-actions">' +
          '<span onclick="adminTogglePinTask(' + Number(t.id) + ', ' + (!isPinned) + ')" title="' + (isPinned ? 'Unpin' : 'Pin to top') + '">' + (isPinned ? '📍' : '📌') + '</span>' +
          '<span onclick="adminOpenTaskModal(' + Number(t.id) + ')">✎</span>' +
          '<span onclick="adminDeleteTask(' + Number(t.id) + ')">🗑</span>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}
function adminTogglePinTask(id, pin){
  adminApiPost('/api/admin/tasks/pin', { id: id, pin: pin }, function(){
    adminPanelState.tasksFetched[adminPanelState.currentTaskTab] = false;
    adminFetchTasks(adminPanelState.currentTaskTab);
  }, function(){
    adminToast('Failed to update pin');
  });
}
function adminDeleteTask(id){
  if (!window.confirm('Delete this task?')) return;
  adminApiPost('/api/admin/tasks/delete', { id: id }, function(){
    adminPanelState.tasksFetched[adminPanelState.currentTaskTab] = false;
    adminFetchTasks(adminPanelState.currentTaskTab);
  }, function(){
    adminToast('Failed to delete task');
  });
}
function adminSetTaskFormSection(section){
  adminPanelState.taskFormSection = section;
  var specialTab = document.getElementById('ap-task-section-special');
  var partnerTab = document.getElementById('ap-task-section-partner');
  if (specialTab) specialTab.classList.toggle('is-active', section === 'special');
  if (partnerTab) partnerTab.classList.toggle('is-active', section === 'partner');
}
function adminOpenTaskModal(id){
  adminPanelState.editingTaskId = id || null;
  adminPanelState.taskIconDataUrl = null;
  var task = id ? (adminPanelState.tasks[adminPanelState.currentTaskTab] || []).find(function(t){ return t.id === id; }) : null;
  adminPanelState.taskChannelId = task ? (task.channel_id || null) : null;
  document.getElementById('ap-task-modal-title').textContent = task ? 'Edit Task' : 'Add A Task';
  document.getElementById('ap-task-title').value = task ? task.title : '';
  document.getElementById('ap-task-desc').value = task ? (task.description || '') : '';
  document.getElementById('ap-task-link').value = task ? task.link : '';
  document.getElementById('ap-task-reward').value = task ? task.reward_coins : '';
  document.getElementById('ap-task-maxclaims').value = (task && task.max_claims) ? task.max_claims : '';
  adminSetTaskFormSection(adminPanelState.currentTaskTab);
  var preview = document.getElementById('ap-task-icon-preview');
  if (task && task.icon_url){
    preview.style.backgroundImage = 'url(' + task.icon_url + ')';
    adminPanelState.taskIconDataUrl = task.icon_url;
  } else {
    preview.style.backgroundImage = '';
  }
  openModal('modal-admin-task');
}
function adminHandleTaskImageInput(input){
  var file = input.files && input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e){
    var img = new Image();
    img.onload = function(){
      var maxSize = 128;
      var scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      var w = Math.max(1, Math.round(img.width * scale));
      var h = Math.max(1, Math.round(img.height * scale));
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      var dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      adminPanelState.taskIconDataUrl = dataUrl;
      document.getElementById('ap-task-icon-preview').style.backgroundImage = 'url(' + dataUrl + ')';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function adminSaveTask(){
  var title = document.getElementById('ap-task-title').value.trim();
  var description = document.getElementById('ap-task-desc').value.trim();
  var link = document.getElementById('ap-task-link').value.trim();
  var reward = parseInt(document.getElementById('ap-task-reward').value, 10);
  var maxClaimsRaw = document.getElementById('ap-task-maxclaims').value.trim();
  var maxClaims = maxClaimsRaw ? parseInt(maxClaimsRaw, 10) : null;
  var section = adminPanelState.taskFormSection || adminPanelState.currentTaskTab;
  if (!title || !link || !Number.isInteger(reward) || reward <= 0){
    adminToast('Fill title, link and a valid reward');
    return;
  }
  adminApiPost('/api/admin/tasks/save', {
    id: adminPanelState.editingTaskId,
    section: section,
    title: title,
    description: description,
    link: link,
    channel_id: adminPanelState.taskChannelId,
    reward_coins: reward,
    max_claims: maxClaims,
    icon_url: adminPanelState.taskIconDataUrl
  }, function(){
    closeModal('modal-admin-task');
    adminPanelState.tasksFetched.special = false;
    adminPanelState.tasksFetched.partner = false;
    if (adminPanelState.tasksListShown){
      adminPanelState.tasksFetched[adminPanelState.currentTaskTab] = true;
      adminFetchTasks(adminPanelState.currentTaskTab);
    }
  }, function(){
    adminToast('Failed to save task');
  });
}

// Admin: Promo Code
function adminTogglePromoHistory(){
  var list = document.getElementById('ap-promo-list');
  var btn = document.getElementById('ap-promo-history-btn');
  if (!list) return;
  var showing = list.style.display !== 'none';
  if (showing){
    list.style.display = 'none';
    if (btn) btn.textContent = 'Show History';
    return;
  }
  list.style.display = '';
  if (btn) btn.textContent = 'Hide History';
  if (!adminPanelState.promoListFetched){
    adminPanelState.promoListFetched = true;
    adminFetchPromoList();
  }
}
function adminFetchPromoList(){
  adminApiPost('/api/admin/promo/list', {}, function(data){
    renderAdminPromoList(data.codes || []);
  });
}
function renderAdminPromoList(codes){
  var list = document.getElementById('ap-promo-list');
  if (!list) return;
  if (!codes.length){
    list.innerHTML = '<div style="font-size:calc(11px * var(--s));color:var(--ink-dim);text-align:center;padding:calc(10px * var(--s)) 0;">No promo codes yet</div>';
    return;
  }
  list.innerHTML = codes.map(function(c){
    var usesText = c.max_uses ? (c.uses_count + '/' + c.max_uses + ' uses') : (c.uses_count + ' uses');
    return (
      '<div class="ap-task-row">' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:calc(12px * var(--s));font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtmlClient(c.code) + '</div>' +
          '<div style="font-size:calc(10px * var(--s));color:var(--ink-dim);">+' + Number(c.reward) + ' ' + (c.currency === 'gram' ? 'Gram' : 'Coins') + ' · ' + usesText + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}
function adminCreatePromo(){
  var code = document.getElementById('ap-promo-code').value.trim();
  var reward = Number(document.getElementById('ap-promo-reward').value);
  var currency = document.getElementById('ap-promo-currency').value;
  var maxUsesRaw = document.getElementById('ap-promo-maxuses').value.trim();
  var maxUses = maxUsesRaw ? parseInt(maxUsesRaw, 10) : null;
  if (!code || !Number.isFinite(reward) || reward <= 0){ adminToast('Fill code and a valid reward'); return; }
  adminApiPost('/api/admin/promo/create', {
    code: code, reward: reward, currency: currency, max_uses: maxUses
  }, function(data){
    adminToast('Promo code created: ' + data.code);
    document.getElementById('ap-promo-code').value = '';
    document.getElementById('ap-promo-reward').value = '';
    document.getElementById('ap-promo-maxuses').value = '';
    if (adminPanelState.promoListFetched) adminFetchPromoList();
  }, function(err){
    adminToast(err.error === 'code_exists' ? 'Code already exists' : 'Failed to create code');
  });
}

// Admin: The Ambassador
function adminToggleAmbassadorHistory(){
  var list = document.getElementById('ap-amb-list');
  var btn = document.getElementById('ap-amb-history-btn');
  if (!list) return;
  var showing = list.style.display !== 'none';
  if (showing){
    list.style.display = 'none';
    if (btn) btn.textContent = 'Show History';
    return;
  }
  list.style.display = '';
  if (btn) btn.textContent = 'Hide History';
  if (!adminPanelState.ambListFetched){
    adminPanelState.ambListFetched = true;
    adminFetchAmbassadorList();
  }
}
function adminFetchAmbassadorList(){
  adminApiPost('/api/admin/ambassador/list', {}, function(data){
    renderAdminAmbassadorList(data.ambassadors || []);
  });
}
function renderAdminAmbassadorList(ambassadors){
  var list = document.getElementById('ap-amb-list');
  if (!list) return;
  if (!ambassadors.length){
    list.innerHTML = '<div style="font-size:calc(11px * var(--s));color:var(--ink-dim);text-align:center;padding:calc(10px * var(--s)) 0;">No ambassadors yet</div>';
    return;
  }
  list.innerHTML = ambassadors.map(function(a){
    var name = a.username ? ('@' + a.username) : ('Player ' + a.telegram_id);
    var statusText = a.status === 'pending' ? 'Pending claim' : 'Claimed';
    var hasValue = a.value !== null && a.value !== undefined;
    var valueText = hasValue ? (' · Value ' + formatAmbassadorValue(a.value) + '$') : '';
    return (
      '<div class="ap-task-row" style="cursor:pointer;" onclick="adminFillAmbassadorFields(' + Number(a.telegram_id) + ', ' + Number(a.speed) + ', ' + (hasValue ? Number(a.value) : 'null') + ')">' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:calc(12px * var(--s));font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtmlClient(name) + '</div>' +
          '<div style="font-size:calc(10px * var(--s));color:var(--ink-dim);">ID: ' + Number(a.telegram_id) + ' · +' + Number(a.speed) + ' Coins/hr' + valueText + ' · ' + statusText + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}
function adminFillAmbassadorFields(telegramId, speed, value){
  document.getElementById('ap-amb-id').value = telegramId;
  document.getElementById('ap-amb-speed').value = speed;
  document.getElementById('ap-amb-value').value = value === null ? '' : value;
}
function adminAmbassadorGrant(){
  var id = parseInt(document.getElementById('ap-amb-id').value, 10);
  var speed = parseInt(document.getElementById('ap-amb-speed').value, 10);
  var valueRaw = document.getElementById('ap-amb-value').value.trim();
  var value = valueRaw === '' ? null : Number(valueRaw);
  if (!Number.isInteger(id) || !Number.isInteger(speed) || speed <= 0){ adminToast('Fill Telegram ID and a valid speed'); return; }
  if (value !== null && (!Number.isFinite(value) || value < 0)){ adminToast('Value must be a number (0 or more)'); return; }
  adminApiPost('/api/admin/ambassador/grant', { target_id: id, speed: speed, value: value }, function(data){
    adminToast(data.mode === 'pending' ? 'Grant pending — user can claim it now' : 'Ambassador speed updated');
    if (adminPanelState.ambListFetched) adminFetchAmbassadorList();
  }, function(err){
    adminToast(err.error === 'user_not_found' ? 'User not found' : err.error === 'invalid_value' ? 'Invalid value' : 'Failed to grant');
  });
}
function adminAmbassadorRevoke(){
  var id = parseInt(document.getElementById('ap-amb-id').value, 10);
  if (!Number.isInteger(id)){ adminToast('Fill a valid Telegram ID'); return; }
  if (!window.confirm('Revoke Ambassador for this user?')) return;
  adminApiPost('/api/admin/ambassador/revoke', { target_id: id }, function(){
    adminToast('Ambassador revoked');
    if (adminPanelState.ambListFetched) adminFetchAmbassadorList();
  }, function(err){
    adminToast(err.error === 'not_found' ? 'Nothing to revoke for this user' : 'Failed to revoke');
  });
}
