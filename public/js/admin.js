// Admin State
let adminToken = localStorage.getItem('vip_admin_token') || '';
let adminModels = [];
let siteSettings = {};

// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const adminApp = document.getElementById('adminApp');
const logoutBtn = document.getElementById('logoutBtn');
const toastContainer = document.getElementById('toastContainer');

// Tabs
const adminTabs = document.querySelectorAll('.admin-tab');
const tabAnalyticsSection = document.getElementById('tabAnalyticsSection');
const tabModelsSection = document.getElementById('tabModelsSection');
const tabAdsSection = document.getElementById('tabAdsSection');
const tabSettingsSection = document.getElementById('tabSettingsSection');

// Models List
const adminModelsTableBody = document.getElementById('adminModelsTableBody');
const adminModelSearch = document.getElementById('adminModelSearch');
const btnOpenAddModel = document.getElementById('btnOpenAddModel');
const tabCountModels = document.getElementById('tabCountModels');

// Real Visitor Stats Elements
const statLiveOnline = document.getElementById('statLiveOnline');
const statTodayUniques = document.getElementById('statTodayUniques');
const statTotalPageviews = document.getElementById('statTotalPageviews');
const statTotalClicks = document.getElementById('statTotalClicks');
const statCtr = document.getElementById('statCtr');
const statMobilePercent = document.getElementById('statMobilePercent');
const statDesktopPercent = document.getElementById('statDesktopPercent');
const barMobile = document.getElementById('barMobile');
const barDesktop = document.getElementById('barDesktop');
const topModelsLeaderboard = document.getElementById('topModelsLeaderboard');

// Adsterra Live Earnings Elements
const adTodayRevenue = document.getElementById('adTodayRevenue');
const adTodayImpressions = document.getElementById('adTodayImpressions');
const adAverageCpm = document.getElementById('adAverageCpm');
const adTodayClicks = document.getElementById('adTodayClicks');
const inputAdsterraApiToken = document.getElementById('inputAdsterraApiToken');
const btnSaveAdsterraApiKey = document.getElementById('btnSaveAdsterraApiKey');
const btnRefreshAdStats = document.getElementById('btnRefreshAdStats');
const changeApiWrapper = document.getElementById('changeApiWrapper');

// Toggle Change API Input
window.toggleApiInput = function() {
  if (changeApiWrapper) {
    changeApiWrapper.classList.toggle('hidden');
  }
};

// Model Form Modal Elements
const modelFormModal = document.getElementById('modelFormModal');
const btnCloseModelForm = document.getElementById('btnCloseModelForm');
const btnCancelModelForm = document.getElementById('btnCancelModelForm');
const modelUpsertForm = document.getElementById('modelUpsertForm');
const formModalTitle = document.getElementById('formModalTitle');

const modelFormId = document.getElementById('modelFormId');
const formModelName = document.getElementById('formModelName');
const formModelAge = document.getElementById('formModelAge');
const formModelLocation = document.getElementById('formModelLocation');
const formModelBadge = document.getElementById('formModelBadge');
const formModelStatus = document.getElementById('formModelStatus');
const formModelVideos = document.getElementById('formModelVideos');
const formModelRating = document.getElementById('formModelRating');
const formModelFile = document.getElementById('formModelFile');
const formModelImageUrl = document.getElementById('formModelImageUrl');
const formModelTelegramEmbed = document.getElementById('formModelTelegramEmbed');
const formModelBio = document.getElementById('formModelBio');
const formModelVideoLink = document.getElementById('formModelVideoLink');
const formModelTags = document.getElementById('formModelTags');
const formModelFeatured = document.getElementById('formModelFeatured');
const formModelActive = document.getElementById('formModelActive');

// Ads Form Elements
const adSettingsForm = document.getElementById('adSettingsForm');
const settingSmartLinkUrl = document.getElementById('settingSmartLinkUrl');
const settingEnableSmartLink = document.getElementById('settingEnableSmartLink');
const settingSocialBarScript = document.getElementById('settingSocialBarScript');
const settingEnableSocialBar = document.getElementById('settingEnableSocialBar');
const settingNativeBannerScript = document.getElementById('settingNativeBannerScript');
const settingNativeBannerContainerId = document.getElementById('settingNativeBannerContainerId');
const settingEnableNativeBanner = document.getElementById('settingEnableNativeBanner');
const settingBanner728Key = document.getElementById('settingBanner728Key');
const settingEnableBanner728x90 = document.getElementById('settingEnableBanner728x90');

// Site Settings Form Elements
const siteSettingsForm = document.getElementById('siteSettingsForm');
const settingSiteName = document.getElementById('settingSiteName');
const settingSiteTagline = document.getElementById('settingSiteTagline');
const settingAnnouncement = document.getElementById('settingAnnouncement');
const settingHeroTitle = document.getElementById('settingHeroTitle');
const settingHeroSubtitle = document.getElementById('settingHeroSubtitle');
const settingCtaButtonText = document.getElementById('settingCtaButtonText');
const settingTelegramLink = document.getElementById('settingTelegramLink');
const settingAdminPassword = document.getElementById('settingAdminPassword');

// Toast Notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `p-4 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border transition duration-300 transform translate-y-2 pointer-events-auto ${
    type === 'success' ? 'bg-emerald-950 text-emerald-200 border-emerald-500/40' : 'bg-red-950 text-red-200 border-red-500/40'
  }`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-triangle'}" class="w-4 h-4"></i>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-4');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Auth Check
async function checkAuth() {
  if (!adminToken) {
    showLogin();
    return;
  }

  try {
    const res = await fetch('/api/admin/check', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success && data.authenticated) {
      showDashboard();
      loadAllAdminData();
      setInterval(loadRealStats, 30000);
      setInterval(loadAdsterraLiveStats, 45000);
    } else {
      showLogin();
    }
  } catch (err) {
    showLogin();
  }
}

function showLogin() {
  loginModal.classList.remove('hidden');
  adminApp.classList.add('hidden');
}

function showDashboard() {
  loginModal.classList.add('hidden');
  adminApp.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = adminPasswordInput.value.trim();
  if (!password) return;

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();

    if (data.success && data.token) {
      adminToken = data.token;
      localStorage.setItem('vip_admin_token', adminToken);
      showToast('Login successful! Welcome to VIP Admin Dashboard.', 'success');
      showDashboard();
      loadAllAdminData();
    } else {
      showToast(data.message || 'Invalid Password / PIN!', 'error');
    }
  } catch (err) {
    showToast('Failed to connect to server!', 'error');
  }
});

togglePasswordBtn.addEventListener('click', () => {
  const type = adminPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  adminPasswordInput.setAttribute('type', type);
});

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
  } catch (e) {}
  adminToken = '';
  localStorage.removeItem('vip_admin_token');
  showLogin();
  showToast('Logged out successfully.', 'success');
});

// Tab Switcher
adminTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    adminTabs.forEach(t => {
      t.classList.remove('active', 'bg-pink-600', 'text-white');
      t.classList.add('text-gray-400');
    });
    tab.classList.add('active', 'bg-pink-600', 'text-white');
    tab.classList.remove('text-gray-400');

    const targetTab = tab.dataset.tab;
    tabAnalyticsSection.classList.add('hidden');
    tabModelsSection.classList.add('hidden');
    tabAdsSection.classList.add('hidden');
    tabSettingsSection.classList.add('hidden');

    if (targetTab === 'analytics') tabAnalyticsSection.classList.remove('hidden');
    if (targetTab === 'models') tabModelsSection.classList.remove('hidden');
    if (targetTab === 'ads') tabAdsSection.classList.remove('hidden');
    if (targetTab === 'settings') tabSettingsSection.classList.remove('hidden');
  });
});

async function loadAllAdminData() {
  await Promise.all([
    loadRealStats(),
    loadAdsterraLiveStats(),
    loadAdminModels(),
    loadAdminSettings()
  ]);
  if (window.lucide) window.lucide.createIcons();
}

// Load Real Visitor & Traffic Stats
async function loadRealStats() {
  try {
    const res = await fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success && data.stats) {
      const s = data.stats;
      statLiveOnline.innerText = s.onlineActiveNow || 1;
      statTodayUniques.innerText = s.todayUniques || 0;
      statTotalPageviews.innerText = s.totalPageviews || 0;
      statTotalClicks.innerText = s.totalClicks || 0;
      statCtr.innerText = s.ctr || '0.0%';

      const mobile = s.devices?.mobile || 0;
      const desktop = s.devices?.desktop || 0;
      const totalDev = mobile + desktop;
      const mPct = totalDev > 0 ? Math.round((mobile / totalDev) * 100) : 85;
      const dPct = 100 - mPct;

      statMobilePercent.innerText = mPct + '%';
      statDesktopPercent.innerText = dPct + '%';
      barMobile.style.width = mPct + '%';
      barDesktop.style.width = dPct + '%';

      renderLeaderboard(s.topModels || []);
    }
  } catch (err) {
    console.error('Error fetching real stats:', err);
  }
}

// Load Adsterra Real-time Earnings from API
async function loadAdsterraLiveStats() {
  try {
    const res = await fetch('/api/admin/adsterra-stats', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success) {
      adTodayRevenue.innerText = data.todayRevenue || '$0.00';
      adTodayImpressions.innerText = data.todayImpressions || '0';
      adAverageCpm.innerText = data.averageCpm || '$3.40';
      adTodayClicks.innerText = data.todayClicks || '0';
    }
  } catch (err) {
    console.error('Error fetching Adsterra stats:', err);
  }
}

// Refresh button
if (btnRefreshAdStats) {
  btnRefreshAdStats.addEventListener('click', async () => {
    btnRefreshAdStats.classList.add('animate-spin');
    await Promise.all([loadRealStats(), loadAdsterraLiveStats()]);
    btnRefreshAdStats.classList.remove('animate-spin');
    showToast('Live traffic and Adsterra statistics synced!', 'success');
  });
}

// Save Adsterra API Key
if (btnSaveAdsterraApiKey) {
  btnSaveAdsterraApiKey.addEventListener('click', async () => {
    const key = inputAdsterraApiToken.value.trim();
    if (!key) return;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adsterraApiToken: key })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Adsterra API Token updated successfully!', 'success');
        if (changeApiWrapper) changeApiWrapper.classList.add('hidden');
        loadAdsterraLiveStats();
      }
    } catch (e) {
      showToast('Error saving Adsterra API Token!', 'error');
    }
  });
}

function renderLeaderboard(models) {
  if (!models || models.length === 0) {
    topModelsLeaderboard.innerHTML = '<p class="text-xs text-gray-500">No clicks recorded yet.</p>';
    return;
  }

  topModelsLeaderboard.innerHTML = models.map((m, idx) => `
    <div class="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-2xl hover:border-pink-500/30 transition">
      <div class="flex items-center gap-3">
        <span class="w-6 h-6 rounded-full bg-pink-900/60 border border-pink-500/40 text-pink-300 text-xs font-bold flex items-center justify-center">
          #${idx + 1}
        </span>
        <img src="${m.image}" class="w-9 h-9 object-cover rounded-xl border border-white/10">
        <div>
          <p class="font-bold text-white text-xs">${m.name}</p>
          <p class="text-[10px] text-gray-400">${m.location || 'Mumbai'}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs font-mono font-bold text-pink-400">🔥 ${m.clicks || 0} Clicks</p>
        <p class="text-[10px] text-gray-400">👁️ ${m.views || 0} Views</p>
      </div>
    </div>
  `).join('');
}

// Load Models
async function loadAdminModels() {
  try {
    const res = await fetch('/api/admin/models', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success) {
      adminModels = data.models;
      tabCountModels.innerText = adminModels.length;
      renderAdminModelsTable(adminModels);
    }
  } catch (err) {
    showToast('Failed to load models list!', 'error');
  }
}

function renderAdminModelsTable(models) {
  if (!models || models.length === 0) {
    adminModelsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-10 text-gray-500">
          No models found. Click '+ Add New VIP Model Profile' above.
        </td>
      </tr>
    `;
    return;
  }

  adminModelsTableBody.innerHTML = models.map(model => {
    const statusBg = model.status === 'live' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : (model.status === 'online' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400');
    const statusText = model.status === 'live' ? '🔴 Live' : (model.status === 'online' ? '🟢 Online' : '⚪ Offline');
    const hasTelegram = Boolean(model.telegramEmbed && model.telegramEmbed.trim());

    return `
      <tr class="hover:bg-white/[0.02] transition">
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img src="${model.image}" class="w-12 h-14 object-cover rounded-xl border border-white/10 shadow-md" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'">
            <div>
              <p class="font-bold text-white text-sm">${model.name}</p>
              <p class="text-[11px] text-gray-400">${model.age || 22} yrs • ${model.location || 'Mumbai'}</p>
              <p class="text-[10px] text-pink-400 font-semibold">${model.videoCount || 30}+ 4K Videos</p>
            </div>
          </div>
        </td>

        <td class="py-3 px-4">
          <div class="space-y-1">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBg}">
              ${statusText}
            </span>
            <div>
              <span class="inline-block text-[10px] font-bold text-pink-300 bg-pink-950/40 px-2 py-0.5 rounded-md border border-pink-500/20">
                ${model.badge || '🔥 VIP'}
              </span>
            </div>
          </div>
        </td>

        <td class="py-3 px-4">
          <div class="font-mono text-[11px]">
            <p class="text-pink-400 font-bold">🔥 ${model.clicks || 0} clicks</p>
            <p class="text-gray-400">👁️ ${model.views || 0} views</p>
            <p class="text-amber-400">⭐ ${model.rating || '5.0'} rating</p>
          </div>
        </td>

        <td class="py-3 px-4 max-w-[200px]">
          <div class="space-y-1">
            ${hasTelegram ? `
              <span class="inline-flex items-center gap-1 text-[10px] bg-blue-950/60 text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/30 truncate max-w-full">
                <i data-lucide="video" class="w-3 h-3 text-blue-400"></i>
                <span class="truncate">Telegram Embedded</span>
              </span>
            ` : `
              <span class="text-[10px] text-gray-500">No Embed</span>
            `}
            <a href="${model.premiumVideoLink || '#'}" target="_blank" class="block text-[10px] text-gray-400 hover:text-pink-400 truncate max-w-full">
              🔗 ${model.premiumVideoLink || 'Default Channel'}
            </a>
          </div>
        </td>

        <td class="py-3 px-4">
          <span class="px-2 py-1 rounded-md text-[10px] font-bold ${model.active !== false ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-red-950/60 text-red-400 border border-red-500/30'}">
            ${model.active !== false ? '🟢 Active' : '🔴 Hidden'}
          </span>
        </td>

        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-2">
            <button onclick="editModel('${model.id}')" class="p-2 bg-white/5 hover:bg-pink-600/30 text-gray-300 hover:text-pink-300 rounded-xl transition" title="Edit Model">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteModel('${model.id}')" class="p-2 bg-white/5 hover:bg-red-600/30 text-gray-300 hover:text-red-300 rounded-xl transition" title="Delete Model">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

adminModelSearch.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  const filtered = adminModels.filter(m => 
    m.name.toLowerCase().includes(q) || 
    (m.badge && m.badge.toLowerCase().includes(q)) ||
    (m.location && m.location.toLowerCase().includes(q))
  );
  renderAdminModelsTable(filtered);
});

// Load Settings
async function loadAdminSettings() {
  try {
    const res = await fetch('/api/admin/settings', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success && data.settings) {
      siteSettings = data.settings;
      
      settingSmartLinkUrl.value = siteSettings.adsterraSmartLink || '';
      settingEnableSmartLink.checked = siteSettings.enableSmartLinkOnClicks !== false;
      settingSocialBarScript.value = siteSettings.socialBarScript || '';
      settingEnableSocialBar.checked = siteSettings.enableSocialBar !== false;
      settingNativeBannerScript.value = siteSettings.nativeBannerScript || '';
      settingNativeBannerContainerId.value = siteSettings.nativeBannerContainerId || '';
      settingEnableNativeBanner.checked = siteSettings.enableNativeBanner !== false;
      settingBanner728Key.value = siteSettings.banner728x90Key || '';
      settingEnableBanner728x90.checked = siteSettings.enableBanner728x90 !== false;
      if (inputAdsterraApiToken) {
        inputAdsterraApiToken.value = siteSettings.adsterraApiToken || '3897aae75b2bfa4492f9bf4145aac236';
      }

      settingSiteName.value = siteSettings.siteName || '';
      settingSiteTagline.value = siteSettings.siteTagline || '';
      settingAnnouncement.value = siteSettings.announcement || '';
      if (settingHeroTitle) settingHeroTitle.value = siteSettings.heroTitle || '';
      settingHeroSubtitle.value = siteSettings.heroSubtitle || '';
      settingCtaButtonText.value = siteSettings.ctaButtonText || '';
      settingTelegramLink.value = siteSettings.telegramLink || '';
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }
}

// Save Adsterra Settings
adSettingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    adsterraSmartLink: settingSmartLinkUrl.value.trim(),
    enableSmartLinkOnClicks: settingEnableSmartLink.checked,
    socialBarScript: settingSocialBarScript.value.trim(),
    enableSocialBar: settingEnableSocialBar.checked,
    nativeBannerScript: settingNativeBannerScript.value.trim(),
    nativeBannerContainerId: settingNativeBannerContainerId.value.trim(),
    enableNativeBanner: settingEnableNativeBanner.checked,
    banner728x90Key: settingBanner728Key.value.trim(),
    enableBanner728x90: settingEnableBanner728x90.checked
  };

  try {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Adsterra ad monetization settings saved!', 'success');
    }
  } catch (err) {
    showToast('Failed to save ad settings!', 'error');
  }
});

// Save Site Settings
siteSettingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    siteName: settingSiteName.value.trim(),
    siteTagline: settingSiteTagline.value.trim(),
    announcement: settingAnnouncement.value.trim(),
    heroTitle: settingHeroTitle ? settingHeroTitle.value.trim() : '',
    heroSubtitle: settingHeroSubtitle.value.trim(),
    ctaButtonText: settingCtaButtonText.value.trim(),
    telegramLink: settingTelegramLink.value.trim(),
    globalCtaLink: settingTelegramLink.value.trim()
  };

  if (settingAdminPassword.value.trim()) {
    payload.adminPassword = settingAdminPassword.value.trim();
  }

  try {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Site settings updated successfully!', 'success');
      settingAdminPassword.value = '';
    }
  } catch (err) {
    showToast('Failed to save settings!', 'error');
  }
});

// Open Add Model Modal
btnOpenAddModel.addEventListener('click', () => {
  formModalTitle.innerText = '+ Add New VIP Model Profile';
  modelUpsertForm.reset();
  modelFormId.value = '';
  formModelAge.value = 22;
  formModelRating.value = '5.0';
  formModelVideos.value = 45;
  formModelFeatured.checked = false;
  formModelActive.checked = true;
  modelFormModal.classList.add('show');
});

function closeModalForm() {
  modelFormModal.classList.remove('show');
}
btnCloseModelForm.addEventListener('click', closeModalForm);
btnCancelModelForm.addEventListener('click', closeModalForm);

// Edit Model
window.editModel = function(id) {
  const model = adminModels.find(m => m.id === id);
  if (!model) return;

  formModalTitle.innerText = `Edit Model: ${model.name}`;
  modelFormId.value = model.id;
  formModelName.value = model.name || '';
  formModelAge.value = model.age || 22;
  formModelLocation.value = model.location || '';
  formModelBadge.value = model.badge || '';
  formModelStatus.value = model.status || 'online';
  formModelVideos.value = model.videoCount || 45;
  formModelRating.value = model.rating || '5.0';
  formModelImageUrl.value = model.image || '';
  formModelTelegramEmbed.value = model.telegramEmbed || '';
  formModelBio.value = model.bio || '';
  formModelVideoLink.value = model.premiumVideoLink || '';
  formModelTags.value = Array.isArray(model.tags) ? model.tags.join(', ') : (model.tags || '');
  formModelFeatured.checked = Boolean(model.featured);
  formModelActive.checked = model.active !== false;

  modelFormModal.classList.add('show');
};

// Delete Model
window.deleteModel = async function(id) {
  if (!confirm('Are you sure you want to permanently delete this model profile?')) return;

  try {
    const res = await fetch(`/api/admin/models/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success) {
      showToast('Model profile deleted successfully!', 'success');
      loadAdminModels();
      loadRealStats();
    }
  } catch (err) {
    showToast('Failed to delete model!', 'error');
  }
};

// Model Upsert Submit
modelUpsertForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = modelFormId.value;
  const formData = new FormData();

  formData.append('name', formModelName.value.trim());
  formData.append('age', formModelAge.value);
  formData.append('location', formModelLocation.value.trim());
  formData.append('badge', formModelBadge.value.trim());
  formData.append('status', formModelStatus.value);
  formData.append('videoCount', formModelVideos.value);
  formData.append('rating', formModelRating.value);
  formData.append('telegramEmbed', formModelTelegramEmbed.value.trim());
  formData.append('bio', formModelBio.value.trim());
  formData.append('premiumVideoLink', formModelVideoLink.value.trim());
  formData.append('tags', formModelTags.value.trim());
  formData.append('featured', formModelFeatured.checked);
  formData.append('active', formModelActive.checked);

  if (formModelFile.files.length > 0) {
    formData.append('imageFile', formModelFile.files[0]);
  } else if (formModelImageUrl.value.trim()) {
    formData.append('image', formModelImageUrl.value.trim());
  }

  const url = id ? `/api/admin/models/${id}` : '/api/admin/models';
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: formData
    });
    const data = await res.json();

    if (data.success) {
      showToast(id ? 'Model updated successfully!' : 'New model added successfully!', 'success');
      closeModalForm();
      loadAdminModels();
      loadRealStats();
    } else {
      showToast(data.message || 'Error saving model!', 'error');
    }
  } catch (err) {
    showToast('Server error while saving model!', 'error');
  }
});

// Boot
document.addEventListener('DOMContentLoaded', checkAuth);
