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
const tabModelsSection = document.getElementById('tabModelsSection');
const tabAdsSection = document.getElementById('tabAdsSection');
const tabAnalyticsSection = document.getElementById('tabAnalyticsSection');
const tabSettingsSection = document.getElementById('tabSettingsSection');

// Models List
const adminModelsTableBody = document.getElementById('adminModelsTableBody');
const adminModelSearch = document.getElementById('adminModelSearch');
const btnOpenAddModel = document.getElementById('btnOpenAddModel');
const tabCountModels = document.getElementById('tabCountModels');

// Stats
const statTotalModels = document.getElementById('statTotalModels');
const statActiveModels = document.getElementById('statActiveModels');
const statTotalClicks = document.getElementById('statTotalClicks');
const statFeaturedModels = document.getElementById('statFeaturedModels');
const topModelsLeaderboard = document.getElementById('topModelsLeaderboard');

// Form Modal
const modelFormModal = document.getElementById('modelFormModal');
const btnCloseModelForm = document.getElementById('btnCloseModelForm');
const btnCancelModelForm = document.getElementById('btnCancelModelForm');
const modelUpsertForm = document.getElementById('modelUpsertForm');
const formModalTitle = document.getElementById('formModalTitle');

// Form Inputs
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

// Ads Form
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

// Site Settings Form
const siteSettingsForm = document.getElementById('siteSettingsForm');
const settingSiteName = document.getElementById('settingSiteName');
const settingSiteTagline = document.getElementById('settingSiteTagline');
const settingAnnouncement = document.getElementById('settingAnnouncement');
const settingHeroTitle = document.getElementById('heroTitle');
const settingHeroSubtitle = document.getElementById('settingHeroSubtitle');
const settingCtaButtonText = document.getElementById('settingCtaButtonText');
const settingGlobalCtaLink = document.getElementById('settingGlobalCtaLink');
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

// Check Auth on load
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

// Login Handler
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
      showToast('लॉगिन सफल! एडमिन डैशबोर्ड खुला।', 'success');
      showDashboard();
      loadAllAdminData();
    } else {
      showToast(data.message || 'अमान्य पासवर्ड!', 'error');
    }
  } catch (err) {
    showToast('सर्वर से कनेक्ट करने में त्रुटि!', 'error');
  }
});

// Toggle Password Visibility
togglePasswordBtn.addEventListener('click', () => {
  const type = adminPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  adminPasswordInput.setAttribute('type', type);
});

// Logout
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
  showToast('सफलतापूर्वक लॉगआउट किया गया।', 'success');
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
    tabModelsSection.classList.add('hidden');
    tabAdsSection.classList.add('hidden');
    tabAnalyticsSection.classList.add('hidden');
    tabSettingsSection.classList.add('hidden');

    if (targetTab === 'models') tabModelsSection.classList.remove('hidden');
    if (targetTab === 'ads') tabAdsSection.classList.remove('hidden');
    if (targetTab === 'analytics') tabAnalyticsSection.classList.remove('hidden');
    if (targetTab === 'settings') tabSettingsSection.classList.remove('hidden');
  });
});

// Load All Data
async function loadAllAdminData() {
  await Promise.all([
    loadAdminModels(),
    loadAdminStats(),
    loadAdminSettings()
  ]);
  if (window.lucide) window.lucide.createIcons();
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
    showToast('मॉडल्स लोड करने में विफल!', 'error');
  }
}

// Render Models Table
function renderAdminModelsTable(models) {
  if (!models || models.length === 0) {
    adminModelsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-10 text-gray-500">
          कोई मॉडल नहीं मिला। नया मॉडल जोड़ने के लिए ऊपर '+ नया मॉडल' बटन पर क्लिक करें।
        </td>
      </tr>
    `;
    return;
  }

  adminModelsTableBody.innerHTML = models.map(model => {
    const statusBg = model.status === 'live' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : (model.status === 'online' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400');
    const statusText = model.status === 'live' ? '🔴 लाइव' : (model.status === 'online' ? '🟢 ऑनलाइन' : '⚪ ऑफलाइन');
    const hasTelegram = Boolean(model.telegramEmbed && model.telegramEmbed.trim());

    return `
      <tr class="hover:bg-white/[0.02] transition">
        <!-- Photo & Info -->
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img src="${model.image}" class="w-12 h-14 object-cover rounded-xl border border-white/10 shadow-md" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'">
            <div>
              <p class="font-bold text-white text-sm">${model.name}</p>
              <p class="text-[11px] text-gray-400">${model.age || 22} साल • ${model.location || 'मुंबई'}</p>
              <p class="text-[10px] text-pink-400 font-semibold">${model.videoCount || 30}+ 4K वीडियो</p>
            </div>
          </div>
        </td>

        <!-- Badge & Status -->
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

        <!-- Analytics -->
        <td class="py-3 px-4">
          <div class="font-mono text-[11px]">
            <p class="text-pink-400 font-bold">🔥 ${model.clicks || 0} क्लिक्स</p>
            <p class="text-gray-400">👁️ ${model.views || 0} व्यूज</p>
            <p class="text-amber-400">⭐ ${model.rating || '5.0'} रेटिंग</p>
          </div>
        </td>

        <!-- Telegram Video / Links -->
        <td class="py-3 px-4 max-w-[200px]">
          <div class="space-y-1">
            ${hasTelegram ? `
              <span class="inline-flex items-center gap-1 text-[10px] bg-blue-950/60 text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/30 truncate max-w-full">
                <i data-lucide="video" class="w-3 h-3 text-blue-400"></i>
                <span class="truncate">टेलीग्राम वीडियो एम्बेडेड</span>
              </span>
            ` : `
              <span class="text-[10px] text-gray-500">कोई वीडियो एम्बेड नहीं</span>
            `}
            <a href="${model.premiumVideoLink || '#'}" target="_blank" class="block text-[10px] text-gray-400 hover:text-pink-400 truncate max-w-full">
              🔗 ${model.premiumVideoLink || 'डिफ़ॉल्ट लिंक'}
            </a>
          </div>
        </td>

        <!-- Active Toggle -->
        <td class="py-3 px-4">
          <span class="px-2 py-1 rounded-md text-[10px] font-bold ${model.active !== false ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-red-950/60 text-red-400 border border-red-500/30'}">
            ${model.active !== false ? '🟢 लाइव' : '🔴 छुपा हुआ'}
          </span>
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-2">
            <button onclick="editModel('${model.id}')" class="p-2 bg-white/5 hover:bg-pink-600/30 text-gray-300 hover:text-pink-300 rounded-xl transition">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteModel('${model.id}')" class="p-2 bg-white/5 hover:bg-red-600/30 text-gray-300 hover:text-red-300 rounded-xl transition">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// Search Models in Admin
adminModelSearch.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  const filtered = adminModels.filter(m => 
    m.name.toLowerCase().includes(q) || 
    (m.badge && m.badge.toLowerCase().includes(q)) ||
    (m.location && m.location.toLowerCase().includes(q))
  );
  renderAdminModelsTable(filtered);
});

// Load Stats & Leaderboard
async function loadAdminStats() {
  try {
    const res = await fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success && data.stats) {
      const s = data.stats;
      statTotalModels.innerText = s.totalModels;
      statActiveModels.innerText = s.activeModels;
      statTotalClicks.innerText = s.totalClicks;
      statFeaturedModels.innerText = s.featuredCount;

      renderLeaderboard(s.topModels || []);
    }
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
}

function renderLeaderboard(models) {
  if (!models || models.length === 0) {
    topModelsLeaderboard.innerHTML = '<p class="text-xs text-gray-500">अभी कोई क्लिक डेटा उपलब्ध नहीं है।</p>';
    return;
  }

  topModelsLeaderboard.innerHTML = models.map((m, idx) => `
    <div class="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 rounded-2xl hover:border-pink-500/30 transition">
      <div class="flex items-center gap-3">
        <span class="w-6 h-6 rounded-full bg-pink-900/60 border border-pink-500/40 text-pink-300 text-xs font-bold flex items-center justify-center">
          #${idx + 1}
        </span>
        <img src="${m.image}" class="w-10 h-10 object-cover rounded-xl">
        <div>
          <p class="font-bold text-white text-xs">${m.name}</p>
          <p class="text-[10px] text-gray-400">${m.location || 'मुंबई'}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs font-mono font-bold text-pink-400">🔥 ${m.clicks || 0} क्लिक्स</p>
        <p class="text-[10px] text-gray-400">👁️ ${m.views || 0} व्यूज</p>
      </div>
    </div>
  `).join('');
}

// Load Settings
async function loadAdminSettings() {
  try {
    const res = await fetch('/api/admin/settings', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success && data.settings) {
      siteSettings = data.settings;
      
      // Ad Settings
      settingSmartLinkUrl.value = siteSettings.adsterraSmartLink || '';
      settingEnableSmartLink.checked = siteSettings.enableSmartLinkOnClicks !== false;
      settingSocialBarScript.value = siteSettings.socialBarScript || '';
      settingEnableSocialBar.checked = siteSettings.enableSocialBar !== false;
      settingNativeBannerScript.value = siteSettings.nativeBannerScript || '';
      settingNativeBannerContainerId.value = siteSettings.nativeBannerContainerId || '';
      settingEnableNativeBanner.checked = siteSettings.enableNativeBanner !== false;
      settingBanner728Key.value = siteSettings.banner728x90Key || '';
      settingEnableBanner728x90.checked = siteSettings.enableBanner728x90 !== false;

      // Site Settings
      settingSiteName.value = siteSettings.siteName || '';
      settingSiteTagline.value = siteSettings.siteTagline || '';
      settingAnnouncement.value = siteSettings.announcement || '';
      const heroTitleInput = document.getElementById('settingHeroTitle');
      if (heroTitleInput) heroTitleInput.value = siteSettings.heroTitle || '';
      settingHeroSubtitle.value = siteSettings.heroSubtitle || '';
      settingCtaButtonText.value = siteSettings.ctaButtonText || '';
      settingGlobalCtaLink.value = siteSettings.globalCtaLink || '';
      settingTelegramLink.value = siteSettings.telegramLink || '';
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }
}

// Save Ad Settings
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
      showToast('Adsterra विज्ञापन सेटिंग्स सफलतापूर्वक सेव हो गईं!', 'success');
    } else {
      showToast('विज्ञापन सेटिंग्स सेव करने में त्रुटि!', 'error');
    }
  } catch (err) {
    showToast('सर्वर से कनेक्ट करने में त्रुटि!', 'error');
  }
});

// Save Site Settings
siteSettingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const heroTitleInput = document.getElementById('settingHeroTitle');
  const payload = {
    siteName: settingSiteName.value.trim(),
    siteTagline: settingSiteTagline.value.trim(),
    announcement: settingAnnouncement.value.trim(),
    heroTitle: heroTitleInput ? heroTitleInput.value.trim() : '',
    heroSubtitle: settingHeroSubtitle.value.trim(),
    ctaButtonText: settingCtaButtonText.value.trim(),
    globalCtaLink: settingGlobalCtaLink.value.trim(),
    telegramLink: settingTelegramLink.value.trim()
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
      showToast('साइट सेटिंग्स सफलतापूर्वक सेव हो गईं!', 'success');
      settingAdminPassword.value = '';
    } else {
      showToast('सेटिंग्स सेव करने में त्रुटि!', 'error');
    }
  } catch (err) {
    showToast('सर्वर से कनेक्ट करने में त्रुटि!', 'error');
  }
});

// Open Add Model Modal
btnOpenAddModel.addEventListener('click', () => {
  formModalTitle.innerText = '+ नया VIP मॉडल प्रोफाइल जोड़ें';
  modelUpsertForm.reset();
  modelFormId.value = '';
  formModelAge.value = 22;
  formModelRating.value = '5.0';
  formModelVideos.value = 45;
  formModelFeatured.checked = false;
  formModelActive.checked = true;
  modelFormModal.classList.add('show');
});

// Close Model Modal
function closeModalForm() {
  modelFormModal.classList.remove('show');
}
btnCloseModelForm.addEventListener('click', closeModalForm);
btnCancelModelForm.addEventListener('click', closeModalForm);

// Edit Model
window.editModel = function(id) {
  const model = adminModels.find(m => m.id === id);
  if (!model) return;

  formModalTitle.innerText = `मॉडल संपादित करें: ${model.name}`;
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
  if (!confirm('क्या आप वाकई इस मॉडल प्रोफाइल को हटाना चाहते हैं?')) return;

  try {
    const res = await fetch(`/api/admin/models/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success) {
      showToast('मॉडल सफलतापूर्वक डिलीट हो गया!', 'success');
      loadAdminModels();
      loadAdminStats();
    } else {
      showToast('हटाने में त्रुटि!', 'error');
    }
  } catch (err) {
    showToast('सर्वर त्रुटि!', 'error');
  }
};

// Model Upsert Form Submit
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
      showToast(id ? 'मॉडल अपडेट हो गया!' : 'नया मॉडल जोड़ा गया!', 'success');
      closeModalForm();
      loadAdminModels();
      loadAdminStats();
    } else {
      showToast(data.message || 'त्रुटि!', 'error');
    }
  } catch (err) {
    showToast('सर्वर त्रुटि!', 'error');
  }
});

// Boot
document.addEventListener('DOMContentLoaded', checkAuth);
