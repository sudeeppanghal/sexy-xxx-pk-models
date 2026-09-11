// =============================================================
// CYBER VIP | CLOUDFLARE PAGES EDGE ENGINE (MAX REVENUE & SPEED)
// =============================================================

const SMARTLINK_GATEWAY = "https://www.effectivecpmnetwork.com/rm9cqers?key=53f807fa771a60ba28a6dbc43af423a1";
const DEFAULT_TELEGRAM = "https://t.me/riyakumarix7";

let allModels = [];
let siteConfig = {};
let currentCategory = 'all';
let currentSearch = '';

// DOM Elements
const disclaimerModal = document.getElementById('disclaimerModal');
const btnAcceptDisclaimer = document.getElementById('btnAcceptDisclaimer');
const btnDeclineDisclaimer = document.getElementById('btnDeclineDisclaimer');
const adblockModal = document.getElementById('adblockModal');
const btnReloadAdblock = document.getElementById('btnReloadAdblock');
const btnDismissAdblock = document.getElementById('btnDismissAdblock');

const storiesContainer = document.getElementById('storiesContainer');
const modelsGrid = document.getElementById('modelsGrid');
const emptyState = document.getElementById('emptyState');
const countAll = document.getElementById('countAll');
const searchInput = document.getElementById('searchInput');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const filterTabs = document.querySelectorAll('.filter-tab');

// Model Detail Modal Elements
const modelModal = document.getElementById('modelModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const modalModelImg = document.getElementById('modalModelImg');
const modalModelName = document.getElementById('modalModelName');
const modalModelMeta = document.getElementById('modalModelMeta');
const modalModelBadge = document.getElementById('modalModelBadge');
const modalModelBio = document.getElementById('modalModelBio');
const modalTags = document.getElementById('modalTags');
const btnModalWatch = document.getElementById('btnModalWatch');
const btnModalTelegram = document.getElementById('btnModalTelegram');

// -------------------------------------------------------------
// BULLETPROOF SMARTLINK TRIGGER (HIGH CPM CONVERSIONS)
// -------------------------------------------------------------
function triggerSmartLinkSafely() {
  try {
    const link = document.createElement('a');
    link.href = SMARTLINK_GATEWAY;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => link.remove(), 250);
  } catch (e) {
    try {
      window.open(SMARTLINK_GATEWAY, '_blank');
    } catch (err) {}
  }
}

// -------------------------------------------------------------
// ALWAYS-ON ENTRY CONFIRMATION POPUP (EVERY VISIT)
// -------------------------------------------------------------
function initConfirmationPopup() {
  if (!disclaimerModal) return;

  // Always show confirmation popup every visit
  disclaimerModal.classList.remove('hidden', 'opacity-0', 'scale-95');

  const handleAccept = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    disclaimerModal.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      disclaimerModal.classList.add('hidden');
      checkAdBlocker();
      initSelfHealingBanners();
    }, 200);

    triggerSmartLinkSafely();
  };

  if (btnAcceptDisclaimer) {
    btnAcceptDisclaimer.onclick = handleAccept;
  }

  if (btnDeclineDisclaimer) {
    btnDeclineDisclaimer.onclick = (e) => {
      e.preventDefault();
      window.location.href = 'https://www.google.com';
    };
  }
}

// -------------------------------------------------------------
// ANTI-ADBLOCK DETECTION & RECOVERY
// -------------------------------------------------------------
function checkAdBlocker() {
  setTimeout(() => {
    let isBlocked = false;
    const bait = document.getElementById('adBlockBait');

    if (bait) {
      const isHidden = bait.offsetParent === null || 
                       bait.offsetHeight === 0 || 
                       bait.clientWidth === 0 ||
                       window.getComputedStyle(bait).getPropertyValue('display') === 'none' ||
                       window.getComputedStyle(bait).getPropertyValue('visibility') === 'hidden';
      if (isHidden) isBlocked = true;
    }

    if (isBlocked && sessionStorage.getItem('adblock_dismissed') !== 'true') {
      showAdblockModal();
    }
  }, 1800);
}

function showAdblockModal() {
  if (!adblockModal) return;
  adblockModal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();

  if (btnReloadAdblock) {
    btnReloadAdblock.onclick = () => window.location.reload();
  }

  if (btnDismissAdblock) {
    btnDismissAdblock.onclick = () => {
      sessionStorage.setItem('adblock_dismissed', 'true');
      adblockModal.classList.add('hidden');
      triggerSmartLinkSafely();
    };
  }
}

// Self-healing fallback banners if AdBlock intercepts Adsterra scripts
function initSelfHealingBanners() {
  setTimeout(() => {
    const topBanner = document.getElementById('topBanner728Container');
    if (topBanner) {
      const iframe = topBanner.querySelector('iframe');
      if (!iframe || iframe.offsetHeight === 0) {
        topBanner.innerHTML = `
          <a href="${SMARTLINK_GATEWAY}" target="_blank" class="block w-full max-w-4xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-pink-950/80 via-purple-950/80 to-cyan-950/80 border border-pink-500/40 shadow-xl hover:scale-[1.01] transition group">
            <div class="flex items-center justify-between flex-wrap gap-2 text-left">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-cyan-500 flex items-center justify-center text-white font-bold animate-pulse">
                  🔥
                </div>
                <div>
                  <h4 class="font-cyber font-black text-sm sm:text-base text-white group-hover:text-pink-300 transition">
                    ⭐ CYBER VIP 4K EXCLUSIVE CREATOR VAULT UNLOCKED
                  </h4>
                  <p class="text-xs text-gray-300">Instant Access to 120+ Full-Length 4K Video Shoots & Daily Drops</p>
                </div>
              </div>
              <span class="btn-cyber-glow px-4 py-2 text-xs font-black">
                🔥 UNLOCK PASS (FREE) →
              </span>
            </div>
          </a>
        `;
      }
    }
  }, 3200);
}

// -------------------------------------------------------------
// DATA LOADING & RENDERING
// -------------------------------------------------------------
async function loadData() {
  try {
    const res = await fetch('/data/models.json');
    const data = await res.json();
    if (data && data.models) {
      allModels = data.models;
      siteConfig = data.site || {};
      applySiteConfig(siteConfig);
      renderStories(allModels);
      filterAndRenderModels();
    }
  } catch (err) {
    console.error('Data load error:', err);
  }
}

function applySiteConfig(cfg) {
  if (cfg.siteName && document.getElementById('navSiteName')) {
    document.getElementById('navSiteName').innerText = cfg.siteName;
    document.title = `${cfg.siteName} | Exclusive 4K Creator Vault`;
  }
  if (cfg.announcement && document.getElementById('announcementText')) {
    document.getElementById('announcementText').innerText = cfg.announcement;
  }
  if (cfg.heroTitle && document.getElementById('heroTitle')) {
    document.getElementById('heroTitle').innerText = cfg.heroTitle;
  }
  if (cfg.heroSubtitle && document.getElementById('heroSubtitle')) {
    document.getElementById('heroSubtitle').innerText = cfg.heroSubtitle;
  }
  if (cfg.telegramLink && document.getElementById('telegramBtn')) {
    document.getElementById('telegramBtn').href = cfg.telegramLink;
  }
}

// Render Story Reels (Instagram/TikTok style)
function renderStories(models) {
  if (!storiesContainer || !models) return;

  storiesContainer.innerHTML = models.map(m => `
    <div onclick="openModelModal('${m.id}')" class="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group select-none transition-transform">
      <div class="story-ring-cyber">
        <div class="avatar-inner">
          <img src="${m.image}" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'">
        </div>
      </div>
      <span class="text-xs sm:text-sm font-bold text-gray-200 truncate max-w-[85px] text-center group-hover:text-pink-400 transition">
        ${m.name.split(' ')[0]}
      </span>
    </div>
  `).join('');
}

// Filter and Render Model Cards
function filterAndRenderModels() {
  let filtered = [...allModels];

  if (currentCategory !== 'all') {
    if (currentCategory === 'featured') {
      filtered = filtered.filter(m => m.featured);
    } else if (currentCategory === 'vip') {
      filtered = filtered.filter(m => m.badge.includes('VIP') || m.tags.some(t => t.toLowerCase().includes('vip')));
    } else if (currentCategory === 'top') {
      filtered = filtered.filter(m => m.rating >= 4.9);
    } else if (currentCategory === 'live') {
      filtered = filtered.filter(m => m.status === 'live');
    }
  }

  if (currentSearch) {
    const q = currentSearch.toLowerCase().trim();
    filtered = filtered.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.location.toLowerCase().includes(q) ||
      m.bio.toLowerCase().includes(q) ||
      m.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (countAll) countAll.innerText = allModels.length;

  if (filtered.length === 0) {
    modelsGrid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  modelsGrid.innerHTML = filtered.map(model => {
    const isLive = model.status === 'live';
    const statusBg = isLive ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    const statusText = isLive ? '🔴 LIVE STREAM' : '🟢 ONLINE NOW';

    return `
      <div class="cyber-card group flex flex-col justify-between">
        <!-- Top Image with Interactive Click -->
        <div onclick="openModelModal('${model.id}')" class="relative h-72 sm:h-80 w-full overflow-hidden cursor-pointer bg-black/40">
          <img src="${model.image}" alt="${model.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'">
          
          <div class="absolute inset-0 bg-gradient-to-t from-[#030008] via-transparent to-black/30"></div>

          <!-- Status & Badge Overlays -->
          <div class="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${statusBg}">
              ${statusText}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-pink-300 border border-pink-500/30 backdrop-blur-md">
              ${model.badge}
            </span>
          </div>

          <div class="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-xl text-xs font-black bg-black/70 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1">
            ⭐ ${model.rating.toFixed(1)}
          </div>

          <!-- Bottom Card Overlay Text -->
          <div class="absolute bottom-3 left-3.5 right-3.5">
            <h3 class="font-cyber font-black text-lg sm:text-xl text-white group-hover:text-pink-400 transition">${model.name}</h3>
            <p class="text-xs text-gray-300 flex items-center gap-2 mt-0.5">
              <span>📍 ${model.location}</span>
              <span>•</span>
              <span class="text-cyan-400 font-bold">🎬 ${model.videoCount}+ 4K Videos</span>
            </p>
          </div>
        </div>

        <!-- Card Body & High-Converting CTA Buttons -->
        <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
          <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            ${model.bio}
          </p>

          <div class="flex flex-wrap gap-1.5">
            ${model.tags.slice(0, 3).map(t => `<span class="px-2 py-0.5 bg-white/5 text-gray-300 rounded-md text-[10px] font-semibold border border-white/5">#${t}</span>`).join('')}
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2 pt-2 border-t border-white/5">
            <button onclick="handleWatchModel('${model.id}')" class="btn-cyber-glow w-full py-3 text-xs sm:text-sm font-black flex items-center justify-center gap-2">
              <span>🔥 WATCH 4K VIDEO REEL</span>
              <i data-lucide="play-circle" class="w-4 h-4"></i>
            </button>

            <button onclick="openModelModal('${model.id}')" class="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5">
              <span>👁️ View Full Bio & Gallery</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// -------------------------------------------------------------
// MODEL MODAL & WATCH HANDLERS
// -------------------------------------------------------------
window.handleWatchModel = function(modelId) {
  triggerSmartLinkSafely();
  const model = allModels.find(m => m.id === modelId);
  const dest = model?.premiumVideoLink || siteConfig.telegramLink || DEFAULT_TELEGRAM;
  setTimeout(() => {
    window.location.href = dest;
  }, 100);
};

window.openModelModal = function(modelId) {
  const model = allModels.find(m => m.id === modelId);
  if (!model) return;

  modalModelImg.src = model.image;
  modalModelName.innerText = model.name;
  modalModelMeta.innerText = `${model.age} yrs • ${model.location} • ${model.videoCount}+ 4K Videos`;
  modalModelBadge.innerText = model.badge;
  modalModelBio.innerText = model.bio;

  modalTags.innerHTML = model.tags.map(t => `<span class="px-2.5 py-1 bg-white/5 text-pink-300 rounded-lg text-xs font-bold border border-pink-500/20">#${t}</span>`).join('');

  btnModalWatch.onclick = () => handleWatchModel(model.id);
  btnModalTelegram.href = model.premiumVideoLink || siteConfig.telegramLink || DEFAULT_TELEGRAM;

  modelModal.classList.add('show');
  if (window.lucide) window.lucide.createIcons();
};

function closeModal() {
  modelModal.classList.remove('show');
}
if (btnCloseModal) btnCloseModal.onclick = closeModal;

// -------------------------------------------------------------
// EVENT LISTENERS & FILTER SETUP
// -------------------------------------------------------------
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.category;
    filterAndRenderModels();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    filterAndRenderModels();
  });
}

if (mobileSearchInput) {
  mobileSearchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    filterAndRenderModels();
  });
}

// Boot Engine
document.addEventListener('DOMContentLoaded', () => {
  initConfirmationPopup();
  loadData();
});
