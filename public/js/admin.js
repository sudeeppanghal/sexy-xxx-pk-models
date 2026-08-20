// Admin State
let adminToken = localStorage.getItem('vip_admin_token') || '';
let adminModels = [];
let siteSettings = {};
let currentRange = '7days';

// Chart Instances
let trafficChartInstance = null;
let deviceChartInstance = null;

// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const adminApp = document.getElementById('adminApp');
const logoutBtn = document.getElementById('logoutBtn');
const toastContainer = document.getElementById('toastContainer');
const labelLastUpdated = document.getElementById('labelLastUpdated');

// Date Range Pills
const datePills = document.querySelectorAll('.date-pill');

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
const labelMobileCount = document.getElementById('labelMobileCount');
const labelDesktopCount = document.getElementById('labelDesktopCount');
const topModelsLeaderboard = document.getElementById('topModelsLeaderboard');
const liveActivityLog = document.getElementById('liveActivityLog');

// Adsterra Live Earnings Elements
const adTodayRevenue = document.getElementById('adTodayRevenue');
const adTodayImpressions = document.getElementById('adTodayImpressions');
const adAverageCpm = document.getElementById('adAverageCpm');
const adPlacementsTableBody = document.getElementById('adPlacementsTableBody');
const btnRefreshAdStats = document.getElementById('btnRefreshAdStats');

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
const formModelPreviewImg = document.getElementById('formModelPreviewImg');
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

// Social Share Preview Elements
const settingShareFile = document.getElementById('settingShareFile');
const settingShareImage = document.getElementById('settingShareImage');
const settingShareTitle = document.getElementById('settingShareTitle');
const sharePreviewImg = document.getElementById('sharePreviewImg');
const sharePreviewNote = document.getElementById('sharePreviewNote');

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

// Client-Side Canvas Image Compressor
function compressImage(file, maxDimension = 800, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Model Photo Input Listeners
if (formModelFile) {
  formModelFile.addEventListener('change', async () => {
    if (formModelFile.files.length === 0) return;
    try {
      const dataUrl = await compressImage(formModelFile.files[0]);
      formModelImageUrl.value = dataUrl;
      if (formModelPreviewImg) formModelPreviewImg.src = dataUrl;
      showToast('Model photo optimized and preview loaded!', 'success');
    } catch (e) {
      showToast('Error processing model photo!', 'error');
    }
  });
}

if (formModelImageUrl) {
  formModelImageUrl.addEventListener('input', (e) => {
    if (formModelPreviewImg && e.target.value.trim()) {
      formModelPreviewImg.src = e.target.value.trim();
    }
  });
}

// Social Share File Input Listeners
if (settingShareFile) {
  settingShareFile.addEventListener('change', async () => {
    if (settingShareFile.files.length === 0) return;
    try {
      showToast('Processing social photo...', 'success');
      const dataUrl = await compressImage(settingShareFile.files[0], 1200, 0.85);
      settingShareImage.value = dataUrl;
      if (sharePreviewImg) {
        sharePreviewImg.src = dataUrl;
      }
      if (sharePreviewNote) {
        sharePreviewNote.innerText = "✓ Photo loaded! Click 'Save Site Settings' below.";
      }
      showToast('Photo loaded! Now click "Save Site Settings" button at bottom.', 'success');
    } catch (e) {
      showToast('Error processing selected photo!', 'error');
    }
  });
}

if (settingShareImage) {
  settingShareImage.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val && sharePreviewImg) {
      if (val.startsWith('http') || val.startsWith('data:image')) {
        sharePreviewImg.src = val;
        if (sharePreviewNote) sharePreviewNote.innerText = "Preview loaded from URL";
      }
    }
  });
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
      setInterval(() => {
        loadRealStats();
        loadAdsterraLiveStats();
      }, 35000);
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
      showToast('Login successful! Welcome to VIP Executive Dashboard.', 'success');
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

// Date Range Filter Handler
datePills.forEach(pill => {
  pill.addEventListener('click', () => {
    datePills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentRange = pill.dataset.range;
    loadRealStats();
    loadAdsterraLiveStats();
    showToast(`Timeframe switched to: ${pill.innerText}`, 'success');
  });
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
    const res = await fetch(`/api/admin/stats?range=${currentRange}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success && data.stats) {
      const s = data.stats;
      statLiveOnline.innerText = s.onlineActiveNow || 1;
      statTodayUniques.innerText = s.todayUniques || s.totalUniqueVisitors || 0;
      statTotalPageviews.innerText = s.totalPageviews || 0;
      statTotalClicks.innerText = s.totalClicks || 0;
      statCtr.innerText = s.ctr || '0.0%';

      const mobile = s.devices?.mobile || 0;
      const desktop = s.devices?.desktop || 0;
      const totalDev = mobile + desktop;
      const mPct = totalDev > 0 ? Math.round((mobile / totalDev) * 100) : 85;
      const dPct = 100 - mPct;

      labelMobileCount.innerText = `${mPct}% (${mobile})`;
      labelDesktopCount.innerText = `${dPct}% (${desktop})`;

      renderLeaderboard(s.topModels || []);
      renderLiveActivityLog(s.recentEvents || []);
      renderDeviceChart(mobile, desktop);
      renderTrafficChart(s.chartSeries);
    }
  } catch (err) {
    console.error('Error fetching real stats:', err);
  }
}

// Load Adsterra Real-time Earnings from API
async function loadAdsterraLiveStats() {
  try {
    const res = await fetch(`/api/admin/adsterra-stats?range=${currentRange}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.success) {
      adTodayRevenue.innerText = data.todayRevenue || '$0.00';
      adTodayImpressions.innerText = data.todayImpressions || '0';
      adAverageCpm.innerText = data.averageCpm || '$3.40';
      
      if (labelLastUpdated) {
        labelLastUpdated.innerText = data.lastUpdated || new Date().toLocaleTimeString();
      }

      renderPlacementsTable(data.placements || []);
    }
  } catch (err) {
    console.error('Error fetching Adsterra stats:', err);
  }
}

// Render Placements Breakdown Table
function renderPlacementsTable(placements) {
  if (!adPlacementsTableBody) return;
  if (!placements || placements.length === 0) {
    adPlacementsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-6 text-gray-500">
          No ad placement impressions recorded yet for this timeframe.
        </td>
      </tr>
    `;
    return;
  }

  adPlacementsTableBody.innerHTML = placements.map(p => `
    <tr class="hover:bg-white/[0.02] transition font-mono text-xs">
      <td class="py-3 px-4">
        <div class="font-sans font-bold text-white">${p.name}</div>
        <div class="text-[10px] text-gray-500">ID: ${p.id}</div>
      </td>
      <td class="py-3 px-4 font-bold text-gray-200">${p.impressions.toLocaleString()}</td>
      <td class="py-3 px-4 font-bold text-pink-400">${p.clicks.toLocaleString()}</td>
      <td class="py-3 px-4 text-amber-300 font-bold">${p.ctr}</td>
      <td class="py-3 px-4 text-emerald-400 font-bold">${p.cpm}</td>
      <td class="py-3 px-4 text-right font-extrabold text-emerald-300 text-sm">${p.revenue}</td>
    </tr>
  `).join('');
}

// Render Live Activity Stream Log
function renderLiveActivityLog(events) {
  if (!liveActivityLog) return;
  if (!events || events.length === 0) {
    liveActivityLog.innerHTML = '<p class="text-xs text-gray-500 text-center py-6">Listening for live visitor actions...</p>';
    return;
  }

  liveActivityLog.innerHTML = events.slice(0, 15).map(ev => {
    const isClick = ev.type === 'click';
    const badgeBg = isClick ? 'bg-pink-500/20 text-pink-300 border-pink-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    const badgeText = isClick ? '🔥 Video Click' : '👀 Pageview';

    return `
      <div class="flex items-center justify-between p-2.5 bg-black/40 border border-white/5 rounded-xl text-xs hover:border-pink-500/20 transition">
        <div class="flex items-center gap-2.5">
          <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badgeBg}">
            ${badgeText}
          </span>
          <div>
            <span class="text-white font-bold text-[11px] block">${ev.target || ev.path || 'Homepage'}</span>
            <span class="text-[10px] text-gray-400">🌍 ${ev.country || 'IN'} • 📱 ${ev.device || 'Mobile'}</span>
          </div>
        </div>
        <span class="text-[10px] font-mono text-gray-500 font-semibold">${ev.time}</span>
      </div>
    `;
  }).join('');
}

// Render Interactive Chart.js Area Graph
function renderTrafficChart(chartSeries) {
  const canvas = document.getElementById('trafficTrendChart');
  if (!canvas || !chartSeries) return;

  const ctx = canvas.getContext('2d');
  if (trafficChartInstance) {
    trafficChartInstance.destroy();
  }

  const gradientPageviews = ctx.createLinearGradient(0, 0, 0, 250);
  gradientPageviews.addColorStop(0, 'rgba(236, 72, 153, 0.4)');
  gradientPageviews.addColorStop(1, 'rgba(236, 72, 153, 0.0)');

  const gradientClicks = ctx.createLinearGradient(0, 0, 0, 250);
  gradientClicks.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
  gradientClicks.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

  trafficChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartSeries.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Pageviews',
          data: chartSeries.pageviews || [0, 0, 0, 0, 0, 0, 0],
          borderColor: '#ec4899',
          backgroundColor: gradientPageviews,
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#ec4899'
        },
        {
          label: 'Ad Impressions',
          data: (chartSeries.pageviews || []).map(v => Math.round(v * 2.2)),
          borderColor: '#a855f7',
          backgroundColor: 'transparent',
          borderDash: [4, 4],
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#a855f7'
        },
        {
          label: 'Video Clicks',
          data: chartSeries.clicks || [0, 0, 0, 0, 0, 0, 0],
          borderColor: '#10b981',
          backgroundColor: gradientClicks,
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#10b981'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(8, 4, 13, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#e5e7eb',
          borderColor: 'rgba(236, 72, 153, 0.3)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 12
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { size: 10, weight: 'bold' } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af', font: { size: 10, weight: 'bold' }, beginAtZero: true }
        }
      }
    }
  });
}

// Render Device Donut Chart
function renderDeviceChart(mobileCount, desktopCount) {
  const canvas = document.getElementById('deviceChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (deviceChartInstance) {
    deviceChartInstance.destroy();
  }

  const m = mobileCount || 85;
  const d = desktopCount || 15;

  deviceChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Mobile', 'Desktop'],
      datasets: [{
        data: [m, d],
        backgroundColor: ['#ec4899', '#8b5cf6'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(8, 4, 13, 0.95)',
          padding: 8,
          cornerRadius: 10
        }
      }
    }
  });
}

// Refresh button
if (btnRefreshAdStats) {
  btnRefreshAdStats.addEventListener('click', async () => {
    btnRefreshAdStats.classList.add('animate-spin');
    await Promise.all([loadRealStats(), loadAdsterraLiveStats()]);
    btnRefreshAdStats.classList.remove('animate-spin');
    showToast('Live telemetry & Adsterra earnings synchronized!', 'success');
  });
}

function renderLeaderboard(models) {
  if (!models || models.length === 0) {
    topModelsLeaderboard.innerHTML = '<p class="text-xs text-gray-500 text-center py-6">No model clicks recorded yet.</p>';
    return;
  }

  topModelsLeaderboard.innerHTML = models.map((m, idx) => `
    <div class="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-2xl hover:border-pink-500/30 transition">
      <div class="flex items-center gap-3">
        <span class="w-6 h-6 rounded-full bg-pink-900/60 border border-pink-500/40 text-pink-300 text-xs font-extrabold flex items-center justify-center">
          #${idx + 1}
        </span>
        <img src="${m.image}" class="w-10 h-10 object-cover rounded-xl border border-white/10 shadow-md">
        <div>
          <p class="font-bold text-white text-xs">${m.name}</p>
          <p class="text-[10px] text-gray-400">${m.location || 'Mumbai'} • ${m.videoCount || 30}+ Videos</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs font-mono font-extrabold text-pink-400">🔥 ${m.clicks || 0} Clicks</p>
        <p class="text-[10px] text-gray-400">👁️ ${m.views || 0} Views • ⭐ ${m.rating || '5.0'}</p>
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

      // Social Share Settings
      settingShareImage.value = siteSettings.shareImage || '';
      settingShareTitle.value = siteSettings.shareTitle || '';
      if (sharePreviewImg) {
        sharePreviewImg.src = siteSettings.shareImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
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
  
  let shareImg = settingShareImage.value.trim();
  if (shareImg.includes('tinyurl.com') || shareImg.includes('bit.ly') || shareImg.includes('sexy-xxx-pk.com')) {
    showToast('⚠️ Please choose an image file (e.g. .png / .jpg), not a website or TinyURL link!', 'error');
    return;
  }

  const payload = {
    siteName: settingSiteName.value.trim(),
    siteTagline: settingSiteTagline.value.trim(),
    announcement: settingAnnouncement.value.trim(),
    heroTitle: settingHeroTitle ? settingHeroTitle.value.trim() : '',
    heroSubtitle: settingHeroSubtitle.value.trim(),
    ctaButtonText: settingCtaButtonText.value.trim(),
    telegramLink: settingTelegramLink.value.trim(),
    globalCtaLink: settingTelegramLink.value.trim(),
    shareImage: shareImg || siteSettings.shareImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    shareTitle: settingShareTitle.value.trim()
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
      showToast('Site & Social Share Preview settings saved successfully!', 'success');
      settingAdminPassword.value = '';
      if (sharePreviewNote) sharePreviewNote.innerText = "✓ Saved & Live on WhatsApp / Web!";
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
  if (formModelPreviewImg) {
    formModelPreviewImg.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  }
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
  if (formModelPreviewImg) {
    formModelPreviewImg.src = model.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  }
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

  let modelImage = formModelImageUrl.value.trim();
  if (formModelFile.files.length > 0) {
    try {
      modelImage = await compressImage(formModelFile.files[0]);
    } catch (err) {}
  }

  if (!modelImage) {
    modelImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85';
  }

  const payload = {
    name: formModelName.value.trim(),
    age: formModelAge.value,
    location: formModelLocation.value.trim(),
    badge: formModelBadge.value.trim(),
    status: formModelStatus.value,
    videoCount: formModelVideos.value,
    rating: formModelRating.value,
    image: modelImage,
    telegramEmbed: formModelTelegramEmbed.value.trim(),
    bio: formModelBio.value.trim(),
    premiumVideoLink: formModelVideoLink.value.trim(),
    tags: formModelTags.value.trim(),
    featured: formModelFeatured.checked,
    active: formModelActive.checked
  };

  const url = id ? `/api/admin/models/${id}` : '/api/admin/models';
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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
