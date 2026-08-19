// State
let adminToken = localStorage.getItem('vip_admin_token') || '';
let adminModels = [];
let adminStats = {};
let adminSettings = {};

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
const tabAnalyticsSection = document.getElementById('tabAnalyticsSection');
const tabSettingsSection = document.getElementById('tabSettingsSection');

// Stats Elements
const statTotalModels = document.getElementById('statTotalModels');
const statActiveModels = document.getElementById('statActiveModels');
const statTotalClicks = document.getElementById('statTotalClicks');
const statFeaturedModels = document.getElementById('statFeaturedModels');
const tabCountModels = document.getElementById('tabCountModels');
const adminModelsTableBody = document.getElementById('adminModelsTableBody');
const adminModelSearch = document.getElementById('adminModelSearch');
const topModelsLeaderboard = document.getElementById('topModelsLeaderboard');

// Model Form Modal
const modelFormModal = document.getElementById('modelFormModal');
const btnOpenAddModel = document.getElementById('btnOpenAddModel');
const btnCloseModelForm = document.getElementById('btnCloseModelForm');
const btnCancelModelForm = document.getElementById('btnCancelModelForm');
const formModalTitle = document.getElementById('formModalTitle');
const modelUpsertForm = document.getElementById('modelUpsertForm');

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

// Settings Form Elements
const siteSettingsForm = document.getElementById('siteSettingsForm');
const settingSiteName = document.getElementById('settingSiteName');
const settingSiteTagline = document.getElementById('settingSiteTagline');
const settingAnnouncement = document.getElementById('settingAnnouncement');
const settingHeroTitle = document.getElementById('settingHeroTitle');
const settingHeroSubtitle = document.getElementById('settingHeroSubtitle');
const settingCtaButtonText = document.getElementById('settingCtaButtonText');
const settingGlobalCtaLink = document.getElementById('settingGlobalCtaLink');
const settingTelegramLink = document.getElementById('settingTelegramLink');
const settingAdminPassword = document.getElementById('settingAdminPassword');

// Toast Notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300' : 'bg-red-950/90 border-red-500/50 text-red-300';
  const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
  
  toast.className = `flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-xs font-semibold transform transition-all duration-300 pointer-events-auto ${bgClass}`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-4 h-4"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Password toggle
if (togglePasswordBtn) {
  togglePasswordBtn.addEventListener('click', () => {
    const isPass = adminPasswordInput.type === 'password';
    adminPasswordInput.type = isPass ? 'text' : 'password';
  });
}

// Authentication Check
async function checkAuth() {
  if (!adminToken) {
    loginModal.classList.remove('hidden');
    adminApp.classList.add('hidden');
    return;
  }

  try {
    const res = await fetch('/api/admin/check', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.authenticated) {
      loginModal.classList.add('hidden');
      adminApp.classList.remove('hidden');
      loadAllAdminData();
    } else {
      localStorage.removeItem('vip_admin_token');
      adminToken = '';
      loginModal.classList.remove('hidden');
      adminApp.classList.add('hidden');
    }
  } catch (err) {
    loginModal.classList.remove('hidden');
    adminApp.classList.add('hidden');
  }
}

// Login Submit
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
      loginModal.classList.add('hidden');
      adminApp.classList.remove('hidden');
      showToast('एडमिन एक्सेस स्वीकृत! स्वागत है।');
      loadAllAdminData();
    } else {
      showToast(data.message || 'गलत मास्टर पासवर्ड दर्ज किया गया है', 'error');
    }
  } catch (err) {
    showToast('सर्वर से कनेक्ट करने में विफल', 'error');
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('vip_admin_token');
  adminToken = '';
  loginModal.classList.remove('hidden');
  adminApp.classList.add('hidden');
  showToast('सफलतापूर्वक लॉगआउट कर दिया गया है।');
});

// Load All Data
async function loadAllAdminData() {
  await Promise.all([
    fetchAdminModels(),
    fetchAdminStats(),
    fetchAdminSettings()
  ]);
  refreshIcons();
}

// Fetch Models
async function fetchAdminModels() {
  try {
    const res = await fetch('/api/admin/models', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success) {
      adminModels = data.models;
      renderAdminTable(adminModels);
      updateStatCounts();
    }
  } catch (err) {
    console.error('Error fetching admin models:', err);
  }
}

// Fetch Stats
async function fetchAdminStats() {
  try {
    const res = await fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success) {
      adminStats = data.stats;
      statTotalModels.innerText = adminStats.totalModels;
      statActiveModels.innerText = adminStats.activeModels;
      statTotalClicks.innerText = adminStats.totalClicks;
      statFeaturedModels.innerText = adminStats.featuredCount;
      tabCountModels.innerText = adminStats.totalModels;
      renderLeaderboard(adminStats.topModels || []);
    }
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
}

// Fetch Settings
async function fetchAdminSettings() {
  try {
    const res = await fetch('/api/admin/settings', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success && data.settings) {
      adminSettings = data.settings;
      settingSiteName.value = adminSettings.siteName || '';
      settingSiteTagline.value = adminSettings.siteTagline || '';
      settingAnnouncement.value = adminSettings.announcement || '';
      settingHeroTitle.value = adminSettings.heroTitle || '';
      settingHeroSubtitle.value = adminSettings.heroSubtitle || '';
      settingCtaButtonText.value = adminSettings.ctaButtonText || '';
      settingGlobalCtaLink.value = adminSettings.globalCtaLink || '';
      settingTelegramLink.value = adminSettings.telegramLink || '';
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
  }
}

// Render Models Table
function renderAdminTable(models) {
  if (!models || models.length === 0) {
    adminModelsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-8 text-gray-500">
          कोई मॉडल नहीं मिला। नया प्रोफाइल बनाने के लिए "+ नया मॉडल प्रोफाइल जोड़ें" पर क्लिक करें।
        </td>
      </tr>
    `;
    return;
  }

  adminModelsTableBody.innerHTML = models.map(model => `
    <tr class="hover:bg-white/[0.02] transition">
      <!-- Photo & Info -->
      <td class="py-3.5 px-4">
        <div class="flex items-center gap-3">
          <img src="${model.image}" alt="${model.name}" class="w-12 h-14 object-cover rounded-xl border border-white/10" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'">
          <div>
            <div class="font-bold text-white text-sm flex items-center gap-1.5">
              <span>${model.name}</span>
              <span class="text-pink-400 font-mono text-xs font-normal">(${model.age || 22} साल)</span>
              ${model.featured ? '<span class="text-amber-400 text-xs">⭐</span>' : ''}
            </div>
            <p class="text-gray-400 text-[11px]">${model.location || 'मुंबई, भारत'}</p>
          </div>
        </div>
      </td>

      <!-- Status & Badge -->
      <td class="py-3.5 px-4">
        <div class="space-y-1">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${model.badge && (model.badge.includes('VIP') || model.badge.includes('एक्सक्लूसिव')) ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'}">
            ${model.badge || 'हॉट'}
          </span>
          <div class="text-[11px] text-gray-400">
            स्थिति: <span class="${model.status === 'live' ? 'text-red-400 font-bold' : (model.status === 'online' ? 'text-emerald-400 font-bold' : 'text-gray-500')}">${model.status === 'live' ? 'लाइव' : (model.status === 'online' ? 'ऑनलाइन' : 'ऑफलाइन')}</span>
          </div>
        </div>
      </td>

      <!-- Stats -->
      <td class="py-3.5 px-4">
        <div class="text-[11px] space-y-0.5">
          <div class="text-pink-400 font-bold flex items-center gap-1">
            <i data-lucide="mouse-pointer-click" class="w-3 h-3"></i>
            <span>${model.clicks || 0} वीडियो क्लिक्स</span>
          </div>
          <div class="text-gray-400 flex items-center gap-1">
            <i data-lucide="eye" class="w-3 h-3"></i>
            <span>${model.views || 0} व्यूज</span>
          </div>
        </div>
      </td>

      <!-- Destination Link & Telegram Embed -->
      <td class="py-3.5 px-4 max-w-xs">
        <div class="space-y-1">
          ${model.telegramEmbed ? `
            <span class="inline-flex items-center gap-1 text-[10px] text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-500/30 font-semibold">
              <i data-lucide="send" class="w-2.5 h-2.5"></i> Telegram Video
            </span>
          ` : '<span class="text-[10px] text-gray-500">फोटो व्यूअर</span>'}
          <a href="${model.premiumVideoLink || '#'}" target="_blank" class="text-blue-400 hover:underline text-[11px] truncate block max-w-[200px]" title="${model.premiumVideoLink}">
            ${model.premiumVideoLink || 'डिफ़ॉल्ट लिंक'}
          </a>
        </div>
      </td>

      <!-- Active Toggle -->
      <td class="py-3.5 px-4">
        <button onclick="toggleModelActive('${model.id}', ${!model.active})" class="px-3 py-1 rounded-full text-[10px] font-bold transition ${model.active ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'}">
          ${model.active ? '🟢 सक्रिय (Live)' : '⚪ छुपा हुआ'}
        </button>
      </td>

      <!-- Actions -->
      <td class="py-3.5 px-4 text-right">
        <div class="flex items-center justify-end gap-2">
          <button onclick="editModel('${model.id}')" class="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition" title="एडिट करें">
            <i data-lucide="edit-3" class="w-4 h-4 text-pink-400"></i>
          </button>
          <button onclick="deleteModel('${model.id}')" class="p-2 bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 rounded-xl transition" title="डिलीट करें">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  refreshIcons();
}

function updateStatCounts() {
  statTotalModels.innerText = adminModels.length;
  statActiveModels.innerText = adminModels.filter(m => m.active).length;
  statFeaturedModels.innerText = adminModels.filter(m => m.featured).length;
  tabCountModels.innerText = adminModels.length;
}

// Render Leaderboard
function renderLeaderboard(models) {
  if (!models || models.length === 0) {
    topModelsLeaderboard.innerHTML = `<p class="text-gray-500 text-xs">अभी कोई क्लिक डेटा उपलब्ध नहीं है।</p>`;
    return;
  }

  const maxClicks = Math.max(...models.map(m => m.clicks || 0), 1);

  topModelsLeaderboard.innerHTML = models.map((model, idx) => {
    const percent = Math.round(((model.clicks || 0) / maxClicks) * 100);
    return `
      <div class="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3.5 flex-1">
          <span class="font-black text-sm ${idx === 0 ? 'text-amber-400 font-serif' : 'text-gray-400'}">#${idx + 1}</span>
          <img src="${model.image}" class="w-11 h-11 object-cover rounded-xl border border-white/10" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'">
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-xs text-white truncate">${model.name}</h4>
            <div class="w-full bg-white/5 rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="bg-gradient-to-r from-pink-500 to-amber-500 h-full rounded-full" style="width: ${percent}%"></div>
            </div>
          </div>
        </div>
        <div class="text-right">
          <span class="font-black text-pink-400 text-sm">${model.clicks || 0}</span>
          <span class="block text-[10px] text-gray-400 uppercase font-semibold">क्लिक्स</span>
        </div>
      </div>
    `;
  }).join('');
}

// Filter Table
adminModelSearch.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = adminModels.filter(m => 
    m.name.toLowerCase().includes(q) ||
    (m.badge && m.badge.toLowerCase().includes(q)) ||
    (m.location && m.location.toLowerCase().includes(q))
  );
  renderAdminTable(filtered);
});

// Tab Switch
adminTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    adminTabs.forEach(t => {
      t.classList.remove('active', 'bg-pink-600', 'text-white');
      t.classList.add('text-gray-400');
    });
    tab.classList.add('active', 'bg-pink-600', 'text-white');
    tab.classList.remove('text-gray-400');

    const tabName = tab.dataset.tab;
    tabModelsSection.classList.add('hidden');
    tabAnalyticsSection.classList.add('hidden');
    tabSettingsSection.classList.add('hidden');

    if (tabName === 'models') tabModelsSection.classList.remove('hidden');
    else if (tabName === 'analytics') tabAnalyticsSection.classList.remove('hidden');
    else if (tabName === 'settings') tabSettingsSection.classList.remove('hidden');
  });
});

// Open Add Model Modal
btnOpenAddModel.addEventListener('click', () => {
  modelFormModal.classList.add('show');
  formModalTitle.innerText = "नया मॉडल प्रोफाइल जोड़ें";
  modelUpsertForm.reset();
  modelFormId.value = "";
  formModelRating.value = "5.0";
  formModelVideos.value = "45";
  formModelTelegramEmbed.value = "";
  formModelActive.checked = true;
  formModelFeatured.checked = false;
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

  modelFormId.value = model.id;
  formModalTitle.innerText = `मॉडल एडिट करें: ${model.name}`;
  formModelName.value = model.name || '';
  formModelAge.value = model.age || 22;
  formModelLocation.value = model.location || '';
  formModelBadge.value = model.badge || '';
  formModelStatus.value = model.status || 'online';
  formModelVideos.value = model.videoCount || 30;
  formModelRating.value = model.rating || 5.0;
  formModelImageUrl.value = model.image || '';
  formModelTelegramEmbed.value = model.telegramEmbed || '';
  formModelFile.value = '';
  formModelBio.value = model.bio || '';
  formModelVideoLink.value = model.premiumVideoLink || '';
  formModelTags.value = Array.isArray(model.tags) ? model.tags.join(', ') : (model.tags || '');
  formModelFeatured.checked = Boolean(model.featured);
  formModelActive.checked = model.active !== false;

  modelFormModal.classList.add('show');
};

// Delete Model
window.deleteModel = async function(id) {
  if (!confirm('क्या आप वाकई इस मॉडल प्रोफाइल को हमेशा के लिए डिलीट करना चाहते हैं?')) return;

  try {
    const res = await fetch(`/api/admin/models/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success) {
      showToast('मॉडल प्रोफाइल सफलतापूर्वक डिलीट हो गई');
      loadAllAdminData();
    } else {
      showToast(data.message || 'मॉडल डिलीट करने में विफल', 'error');
    }
  } catch (err) {
    showToast('मॉडल डिलीट करते समय सर्वर त्रुटि', 'error');
  }
};

// Toggle Active Quick Action
window.toggleModelActive = async function(id, newStatus) {
  try {
    const res = await fetch(`/api/admin/models/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ active: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      showToast(newStatus ? 'मॉडल अब पब्लिक को दिखाई देगा' : 'मॉडल अब छुपा दिया गया है');
      loadAllAdminData();
    }
  } catch (err) {
    showToast('स्टेटस अपडेट करने में विफल', 'error');
  }
};

// Model Form Submit (Add / Update)
modelUpsertForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = modelFormId.value;
  const isEditing = Boolean(id);
  const formData = new FormData();

  formData.append('name', formModelName.value.trim());
  formData.append('age', formModelAge.value);
  formData.append('location', formModelLocation.value.trim());
  formData.append('badge', formModelBadge.value.trim());
  formData.append('status', formModelStatus.value);
  formData.append('videoCount', formModelVideos.value);
  formData.append('rating', formModelRating.value);
  formData.append('bio', formModelBio.value.trim());
  formData.append('telegramEmbed', formModelTelegramEmbed.value.trim());
  formData.append('premiumVideoLink', formModelVideoLink.value.trim());
  formData.append('tags', formModelTags.value.trim());
  formData.append('featured', formModelFeatured.checked);
  formData.append('active', formModelActive.checked);

  if (formModelFile.files && formModelFile.files[0]) {
    formData.append('imageFile', formModelFile.files[0]);
  } else if (formModelImageUrl.value.trim()) {
    formData.append('image', formModelImageUrl.value.trim());
  }

  const endpoint = isEditing ? `/api/admin/models/${id}` : '/api/admin/models';
  const method = isEditing ? 'PUT' : 'POST';

  try {
    const res = await fetch(endpoint, {
      method: method,
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      showToast(isEditing ? 'मॉडल प्रोफाइल सफलतापूर्वक अपडेट हो गई!' : 'नया मॉडल सफलतापूर्वक बनाया गया!');
      closeModelForm();
      loadAllAdminData();
    } else {
      showToast(data.message || 'मॉडल प्रोफाइल सेव करने में विफल', 'error');
    }
  } catch (err) {
    showToast('मॉडल प्रोफाइल सेव करते समय त्रुटि', 'error');
  }
});

// Site Settings Form Submit
siteSettingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    siteName: settingSiteName.value.trim(),
    siteTagline: settingSiteTagline.value.trim(),
    announcement: settingAnnouncement.value.trim(),
    heroTitle: settingHeroTitle.value.trim(),
    heroSubtitle: settingHeroSubtitle.value.trim(),
    ctaButtonText: settingCtaButtonText.value.trim(),
    globalCtaLink: settingGlobalCtaLink.value.trim(),
    telegramLink: settingTelegramLink.value.trim()
  };

  const newPass = settingAdminPassword.value.trim();
  if (newPass) {
    payload.adminPassword = newPass;
  }

  try {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast('साइट सेटिंग्स सफलतापूर्वक अपडेट हो गईं!');
      settingAdminPassword.value = '';
    } else {
      showToast(data.message || 'सेटिंग्स अपडेट करने में विफल', 'error');
    }
  } catch (err) {
    showToast('सेटिंग्स सेव करते समय त्रुटि', 'error');
  }
});

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  refreshIcons();
});
