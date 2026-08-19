// State
let allModels = [];
let siteSettings = {};
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'default';

// DOM Elements
const modelsGrid = document.getElementById('modelsGrid');
const storiesContainer = document.getElementById('storiesContainer');
const emptyState = document.getElementById('emptyState');
const filterTabs = document.querySelectorAll('.filter-tab');
const searchInput = document.getElementById('searchInput');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const sortSelect = document.getElementById('sortSelect');
const countAll = document.getElementById('countAll');
const mobileDockTelegram = document.getElementById('mobileDockTelegram');

// Modal Elements
const modelModal = document.getElementById('modelModal');
const modalClose = document.getElementById('modalClose');
const modalMediaContainer = document.getElementById('modalMediaContainer');
const modalName = document.getElementById('modalName');
const modalLocation = document.getElementById('modalLocation');
const modalBadge = document.getElementById('modalBadge');
const modalStatus = document.getElementById('modalStatus');
const modalBio = document.getElementById('modalBio');
const modalTags = document.getElementById('modalTags');
const modalCtaBtn = document.getElementById('modalCtaBtn');

// Initialize Lucide icons
function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Scroll Reveal Observer
function initScrollObserver() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// Fetch Settings
async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    if (data.success && data.settings) {
      siteSettings = data.settings;
      applySettings(siteSettings);
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }
}

function applySettings(settings) {
  if (settings.siteName) {
    document.getElementById('navSiteName').innerText = settings.siteName;
    document.title = `${settings.siteName} | एक्सक्लूसिव फैशन व ग्लैमर मॉडल्स और 4K प्रीमियम वीडियो`;
  }
  if (settings.announcement) {
    document.getElementById('announcementText').innerText = settings.announcement;
  }
  if (settings.heroTitle) {
    document.getElementById('heroTitle').innerHTML = settings.heroTitle.replace(
      'एक्सक्लूसिव और ट्रेंडिंग वीडियो देखें',
      '<span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 glow-text-ruby">एक्सक्लूसिव और ट्रेंडिंग वीडियो देखें</span>'
    );
  }
  if (settings.heroSubtitle) {
    document.getElementById('heroSubtitle').innerText = settings.heroSubtitle;
  }
  if (settings.telegramLink) {
    document.getElementById('telegramBtn').href = settings.telegramLink;
    if (mobileDockTelegram) mobileDockTelegram.href = settings.telegramLink;
  }
  if (settings.globalCtaLink) {
    document.getElementById('globalCtaBtn').href = settings.globalCtaLink;
  }
}

// Fetch Models
async function loadModels() {
  try {
    let url = `/api/models?category=${encodeURIComponent(currentCategory)}&sort=${encodeURIComponent(currentSort)}`;
    if (currentSearch) {
      url += `&search=${encodeURIComponent(currentSearch)}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      allModels = data.models;
      if (currentCategory === 'all' && !currentSearch) {
        countAll.innerText = data.count || allModels.length;
        renderStories(allModels);
      }
      renderModels(allModels);
    }
  } catch (err) {
    console.error('Error fetching models:', err);
  }
}

// Render Top Stories / Reels Carousel
function renderStories(models) {
  if (!storiesContainer || !models) return;

  storiesContainer.innerHTML = models.map(model => {
    return `
      <div onclick="openModelModal('${model.id}')" class="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group select-none">
        <div class="story-avatar-ring">
          <div class="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-black bg-black">
            <img src="${model.image}" alt="${model.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-300" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'">
          </div>
        </div>
        <span class="text-[11px] font-bold text-gray-200 truncate max-w-[72px] text-center group-hover:text-pink-400 transition">
          ${model.name.split(' ')[0]}
        </span>
      </div>
    `;
  }).join('');
}

// Handle Model Video Button Click with Tracking
async function handleWatchPremium(modelId, fallbackLink) {
  try {
    fetch(`/api/track-click/${modelId}`, { method: 'POST' }).catch(() => {});
    const targetUrl = fallbackLink || `/go/${modelId}`;
    window.open(targetUrl, '_blank');
  } catch (e) {
    window.open(fallbackLink || '#', '_blank');
  }
}

// Helper to format Telegram embed URL
function getTelegramEmbedUrl(rawUrl) {
  if (!rawUrl) return null;
  let url = rawUrl.trim();
  if (url.includes('?embed=1')) return url;
  if (url.includes('t.me/')) {
    const clean = url.split('?')[0];
    return `${clean}?embed=1&dark=1`;
  }
  return url;
}

// Render Model Cards (Photo + Button ON TOP)
function renderModels(models) {
  if (!models || models.length === 0) {
    modelsGrid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  modelsGrid.innerHTML = models.map((model, idx) => {
    const ctaText = siteSettings.ctaButtonText || "🔥 मेरे सभी प्रीमियम वीडियो देखें - यहाँ क्लिक करें";
    const statusClass = model.status === 'live' ? 'badge-status-live' : (model.status === 'online' ? 'badge-status-online' : 'bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded-full');
    const statusText = model.status === 'live' ? '🔴 लाइव' : (model.status === 'online' ? '🟢 ऑनलाइन' : '⚪ ऑफलाइन');
    const videoDest = model.premiumVideoLink || siteSettings.globalCtaLink || '#';
    const delayClass = `delay-${(idx % 6) + 1}`;

    return `
      <div class="model-card group reveal-on-scroll ${delayClass}" data-id="${model.id}">
        
        <!-- 1. MODEL PHOTO ON TOP -->
        <div class="model-image-wrap">
          <img src="${model.image}" alt="${model.name}" loading="lazy" class="model-image" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85'">
          <div class="model-image-overlay"></div>

          <!-- Badges Overlay -->
          <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
            <span class="${model.badge && (model.badge.includes('VIP') || model.badge.includes('एक्सक्लूसिव')) ? 'badge-vip' : 'badge-hot'}">
              ${model.badge || '🔥 VIP मॉडल'}
            </span>
            <span class="${statusClass}">
              ${statusText}
            </span>
          </div>

          <!-- Quick Preview Overlay Button -->
          <button onclick="openModelModal('${model.id}')" 
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-black/80 hover:bg-pink-600 text-white text-xs font-bold rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300 shadow-2xl border border-white/20 flex items-center gap-1.5 z-20">
            <i data-lucide="${model.telegramEmbed ? 'play' : 'eye'}" class="w-3.5 h-3.5"></i>
            <span>${model.telegramEmbed ? 'टेलीग्राम वीडियो' : 'झलक (Preview)'}</span>
          </button>

          <!-- Bottom Floating Info on Photo -->
          <div class="absolute bottom-3 left-3.5 right-3.5 z-10 flex items-end justify-between">
            <div>
              <h3 class="font-serif font-extrabold text-xl text-white drop-shadow-md">
                ${model.name}, <span class="text-pink-300 text-base font-sans font-bold">${model.age || 22}</span>
              </h3>
              <p class="text-gray-300 text-[11px] flex items-center gap-1 mt-0.5 drop-shadow">
                <i data-lucide="map-pin" class="w-3 h-3 text-pink-400"></i>
                <span>${model.location || 'मुंबई, भारत'}</span>
              </p>
            </div>
            <div class="flex items-center gap-1 text-amber-400 text-xs font-bold bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-amber-400/30">
              <i data-lucide="star" class="w-3 h-3 fill-amber-400"></i>
              <span>${model.rating || '5.0'}</span>
            </div>
          </div>
        </div>

        <!-- 2. HIGH CONVERTING ACTION BUTTON DIRECTLY ON TOP OF CARD BODY -->
        <div class="p-3.5 sm:p-4 bg-black/20 border-b border-white/5">
          <button onclick="handleWatchPremium('${model.id}', '${videoDest}')" 
            class="btn-vip-glow w-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-pink-900/30">
            <i data-lucide="play-circle" class="w-4 h-4 text-white fill-white/20 animate-pulse"></i>
            <span>${ctaText}</span>
          </button>
        </div>

        <!-- 3. MODEL DETAILS & TAGS UNDER BUTTON -->
        <div class="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
          <p class="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-3">
            "${model.bio || 'एक्सक्लूसिव ग्लैमर शूट्स, बिहाइंड-द-सीन्स और स्पेशल प्रीमियम वीडियो।'}"
          </p>

          <div class="flex items-center justify-between pt-2 border-t border-white/5">
            <!-- Tags -->
            <div class="flex flex-wrap gap-1">
              ${(model.tags || ['ग्लैमर', '4K']).slice(0, 2).map(tag => `
                <span class="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-semibold text-gray-400">
                  #${tag}
                </span>
              `).join('')}
            </div>

            <!-- Video Count Badge -->
            <div class="text-[11px] font-bold text-pink-400 flex items-center gap-1">
              <i data-lucide="film" class="w-3 h-3 text-purple-400"></i>
              <span>${model.videoCount || 30}+ वीडियो</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
  initScrollObserver();
}

// Open Quick-View / Telegram Video Modal
window.openModelModal = async function(id) {
  const model = allModels.find(m => m.id === id);
  if (!model) return;

  modalName.innerText = `${model.name}, ${model.age || 22} साल`;
  modalLocation.innerHTML = `<i data-lucide="map-pin" class="w-3.5 h-3.5 text-pink-400"></i> <span>${model.location || 'मुंबई, भारत'}</span>`;
  modalBadge.innerText = model.badge || '🔥 VIP मॉडल';
  modalStatus.innerText = model.status === 'live' ? '🔴 लाइव स्ट्रीमिंग' : (model.status === 'online' ? '🟢 अभी ऑनलाइन' : '⚪ ऑफलाइन');
  modalBio.innerText = model.bio || 'एक्सक्लूसिव वीडियो के साथ ग्लैमर मॉडल आर्काइव।';

  const embedUrl = getTelegramEmbedUrl(model.telegramEmbed);
  if (embedUrl) {
    modalMediaContainer.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs text-pink-400 font-bold px-1">
          <span class="flex items-center gap-1.5"><i data-lucide="send" class="w-3.5 h-3.5"></i> टेलीग्राम वीडियो प्लेयर</span>
          <span class="text-gray-400 font-normal">HD क्वालिटी</span>
        </div>
        <div class="telegram-embed-container">
          <iframe src="${embedUrl}" allowfullscreen></iframe>
        </div>
      </div>
    `;
  } else {
    modalMediaContainer.innerHTML = `
      <div class="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-black">
        <img src="${model.image}" alt="${model.name}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <div class="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
            <i data-lucide="video" class="w-3.5 h-3.5 text-pink-400"></i>
            <span>${model.videoCount || 35}+ 4K वीडियो</span>
          </div>
          <div class="flex items-center gap-1 bg-amber-500/20 backdrop-blur-md px-3 py-1 rounded-lg border border-amber-500/30 text-amber-300 font-bold">
            <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
            <span>${model.rating || '5.0'}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  modalTags.innerHTML = (model.tags || []).map(tag => `
    <span class="px-2.5 py-0.5 bg-pink-950/40 border border-pink-500/30 text-pink-300 text-[11px] font-semibold rounded-full">
      #${tag}
    </span>
  `).join('');

  const dest = model.premiumVideoLink || siteSettings.globalCtaLink || '#';
  modalCtaBtn.onclick = (e) => {
    e.preventDefault();
    handleWatchPremium(model.id, dest);
  };

  modelModal.classList.add('show');
  refreshIcons();
};

modalClose.addEventListener('click', () => {
  modelModal.classList.remove('show');
});

// Close modal on backdrop click
modelModal.addEventListener('click', (e) => {
  if (e.target === modelModal) {
    modelModal.classList.remove('show');
  }
});

// Set category filter programmatically (used by mobile bottom dock)
window.setCategoryFilter = function(category) {
  currentCategory = category;
  filterTabs.forEach(t => {
    if (t.dataset.category === category) t.classList.add('active');
    else t.classList.remove('active');
  });
  loadModels();
  const grid = document.getElementById('modelsGrid');
  if (grid) grid.scrollIntoView({ behavior: 'smooth' });
};

// Event Listeners for Filters
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.category;
    loadModels();
  });
});

// Search input handling
let searchTimeout;
function handleSearch(e) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentSearch = e.target.value.trim();
    loadModels();
  }, 250);
}

searchInput.addEventListener('input', handleSearch);
mobileSearchInput.addEventListener('input', handleSearch);

// Sort dropdown
sortSelect.addEventListener('change', (e) => {
  currentSort = e.target.value;
  loadModels();
});

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadModels();
  refreshIcons();
});
