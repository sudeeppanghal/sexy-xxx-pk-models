const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function hashPassword(password, salt = 'VIP_LUXE_SECURE_SALT_9211') {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

const SEED_MODELS = [
  {
    id: "model-1",
    name: "रिया शर्मा (Riya Sharma)",
    age: 22,
    location: "मुंबई, भारत",
    badge: "🔥 टॉप ट्रेंडिंग",
    status: "online",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"
    ],
    bio: "इंटरनेशनल फैशन मॉडल व इन्फ्लुएंसर। एक्सक्लूसिव फोटोशूट्स, बिहाइंड-द-सीन्स और स्पेशल प्रीमियम वीडियो यहाँ देखें।",
    premiumVideoLink: "https://t.me/yourvipchannel",
    telegramEmbed: "https://t.me/telegram/83",
    premiumPrice: "VIP वीडियो पास",
    rating: 5.0,
    videoCount: 64,
    tags: ["ग्लैमर", "फैशन मॉडल", "4K अल्ट्रा HD", "ट्रेंडिंग"],
    featured: true,
    active: true,
    clicks: 245,
    views: 3120,
    createdAt: new Date().toISOString()
  },
  {
    id: "model-2",
    name: "अनाहिता रॉय (Anahita Roy)",
    age: 24,
    location: "गोवा, भारत",
    badge: "💎 VIP एक्सक्लूसिव",
    status: "live",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=85"
    ],
    bio: "शानदार स्टाइल, बोल्ड लुक्स और एक्सक्लूसिव वीडियो का प्रीमियम कलेक्शन केवल मेरे खास फैंस के लिए।",
    premiumVideoLink: "https://t.me/yourvipchannel",
    telegramEmbed: "",
    premiumPrice: "एक्सक्लूसिव वॉल्ट",
    rating: 4.9,
    videoCount: 92,
    tags: ["बीच वाइब्स", "स्टाइलिश", "स्पेशल शूट", "VIP एक्सेस"],
    featured: true,
    active: true,
    clicks: 318,
    views: 4210,
    createdAt: new Date().toISOString()
  },
  {
    id: "model-3",
    name: "तान्या कपूर (Tanya Kapoor)",
    age: 21,
    location: "दिल्ली, भारत",
    badge: "✨ नई सेंसेशन",
    status: "online",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85"
    ],
    bio: "क्यूट स्माइल और दिलकश अंदाज़। मेरे नए डांस रील्स और प्राइवेट व्लॉग वीडियो अभी अनलॉक करें।",
    premiumVideoLink: "https://t.me/yourvipchannel",
    telegramEmbed: "",
    premiumPrice: "प्रीमियम क्लिप्स",
    rating: 4.9,
    videoCount: 45,
    tags: ["क्यूट", "ग्लैमरस", "डांस वीडियो", "HD क्लिप्स"],
    featured: true,
    active: true,
    clicks: 180,
    views: 2450,
    createdAt: new Date().toISOString()
  },
  {
    id: "model-4",
    name: "नताशा डिसूजा (Natasha D'Souza)",
    age: 23,
    location: "बेंगलुरु, भारत",
    badge: "👑 टॉप रेटेड",
    status: "online",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85"
    ],
    bio: "हाई-फैशन रनवे मॉडल। नए सिनेमैटिक एपिसोड्स और एक्सक्लूसिव वीडियो सीरीज तुरंत देखें।",
    premiumVideoLink: "https://t.me/yourvipchannel",
    telegramEmbed: "",
    premiumPrice: "फुल एचडी पास",
    rating: 5.0,
    videoCount: 110,
    tags: ["फैशन शो", "ग्लैम शूट", "VIP 4K", "सिनेमैटिक"],
    featured: true,
    active: true,
    clicks: 420,
    views: 5300,
    createdAt: new Date().toISOString()
  },
  {
    id: "model-5",
    name: "सिमरन कौर (Simran Kaur)",
    age: 22,
    location: "चंडीगढ़, भारत",
    badge: "⭐ मोस्ट पॉपुलर",
    status: "offline",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85"
    ],
    bio: "शाही खूबसूरती और लाजवाब स्टाइल। मेरे सभी नए वीडियो और फोटो सेट्स का तुरंत एक्सेस पाएं।",
    premiumVideoLink: "https://t.me/yourvipchannel",
    telegramEmbed: "",
    premiumPrice: "तुरंत एक्सेस",
    rating: 4.8,
    videoCount: 38,
    tags: ["देसी ग्लैम", "क्लासिक", "टीज़र", "स्पेशल"],
    featured: false,
    active: true,
    clicks: 130,
    views: 1650,
    createdAt: new Date().toISOString()
  },
  {
    id: "model-6",
    name: "ज़ोया खान (Zoya Khan)",
    age: 25,
    location: "दुबई / मुंबई",
    badge: "🔥 सुपर हॉट",
    status: "live",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=85"
    ],
    bio: "लक्ज़री लाइफस्टाइल और इंटरनेशनल मॉडलिंग शूट्स। मेरी एक्सक्लूसिव 4K वीडियो सीरीज़ अभी देखें।",
    premiumVideoLink: "https://t.me/yourvipchannel",
    telegramEmbed: "",
    premiumPrice: "VIP स्पेशल",
    rating: 4.9,
    videoCount: 84,
    tags: ["लक्ज़री", "दुबई शूट", "4K अल्ट्रा", "मेंबर ओनली"],
    featured: false,
    active: true,
    clicks: 290,
    views: 3400,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SETTINGS = {
  siteName: "GLAMOUR VIP MODELS",
  siteTagline: "एक्सक्लूसिव ग्लैमर मॉडल्स और प्रीमियम 4K वीडियो हब",
  heroTitle: "टॉप ग्लैमर मॉडल्स के एक्सक्लूसिव और ट्रेंडिंग वीडियो देखें",
  heroSubtitle: "हाई-फैशन शूट्स, लाइव सेशन्स और एक्सक्लूसिव 4K वीडियो गैलरी। अपनी पसंदीदा मॉडल चुनें और पूरा वीडियो तुरंत देखें।",
  announcement: "⭐ आज का स्पेशल अपडेट: नए एक्सक्लूसिव ग्लैमर वीडियो और लाइव सेशन्स लाइव हैं! ⭐",
  ctaButtonText: "🔥 मेरे सभी प्रीमियम वीडियो देखें - यहाँ क्लिक करें",
  globalCtaLink: "https://t.me/yourvipchannel",
  telegramLink: "https://t.me/yourvipchannel",
  adminPin: "Luxe@9211#Admin",
  adminPasswordHash: hashPassword("Luxe@9211#Admin"),
  enableAgeGate: false,
  themeColor: "ruby-glow",
  
  // Adsterra Monetization Settings
  adsterraSmartLink: "https://www.effectivecpmnetwork.com/rm9cqers?key=53f807fa771a60ba28a6dbc43af423a1",
  enableSmartLinkOnClicks: true,
  socialBarScript: "https://pl30926092.effectivecpmnetwork.com/7c/d7/31/7cd7318b8d42d394a693054855bc9ae9.js",
  enableSocialBar: true,
  nativeBannerScript: "https://pl30926090.effectivecpmnetwork.com/e57d2a5991c2d320d1835502c0693cb4/invoke.js",
  nativeBannerContainerId: "container-e57d2a5991c2d320d1835502c0693cb4",
  enableNativeBanner: true,
  banner728x90Key: "109bfc08902b9073c69aa9a8e3dda390",
  enableBanner728x90: true
};

class Database {
  constructor() {
    this.data = {
      models: [],
      settings: {},
      adminTokens: []
    };
    this.failedAttempts = new Map();
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.models || this.data.models.length === 0) {
          this.data.models = SEED_MODELS;
        }
        if (!this.data.settings || Object.keys(this.data.settings).length === 0) {
          this.data.settings = DEFAULT_SETTINGS;
        } else {
          // Merge any missing ad settings
          this.data.settings = { ...DEFAULT_SETTINGS, ...this.data.settings };
        }
        if (!this.data.adminTokens) {
          this.data.adminTokens = [];
        }
      } else {
        this.data = {
          models: SEED_MODELS,
          settings: DEFAULT_SETTINGS,
          adminTokens: []
        };
        this.save();
      }
    } catch (err) {
      console.error("Error loading database, resetting to seed defaults:", err);
      this.data = {
        models: SEED_MODELS,
        settings: DEFAULT_SETTINGS,
        adminTokens: []
      };
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Error saving database:", err);
    }
  }

  getModels(onlyActive = true) {
    if (onlyActive) {
      return this.data.models.filter(m => m.active !== false);
    }
    return this.data.models;
  }

  getModelById(id) {
    return this.data.models.find(m => m.id === id);
  }

  createModel(modelData) {
    const id = "model-" + crypto.randomBytes(6).toString('hex');
    const newModel = {
      id,
      name: String(modelData.name || "VIP Model").slice(0, 100),
      age: Math.min(Math.max(parseInt(modelData.age) || 21, 18), 99),
      location: String(modelData.location || "मुंबई, भारत").slice(0, 100),
      badge: String(modelData.badge || "🔥 हॉट").slice(0, 50),
      status: ["online", "live", "offline"].includes(modelData.status) ? modelData.status : "online",
      image: String(modelData.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"),
      gallery: Array.isArray(modelData.gallery) ? modelData.gallery : [modelData.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"],
      bio: String(modelData.bio || "एक्सक्लूसिव ग्लैमर शूट्स और वीडियो।").slice(0, 500),
      premiumVideoLink: String(modelData.premiumVideoLink || this.data.settings.globalCtaLink || "https://t.me/yourvipchannel"),
      telegramEmbed: String(modelData.telegramEmbed || ""),
      premiumPrice: String(modelData.premiumPrice || "VIP वीडियो पास").slice(0, 50),
      rating: parseFloat(Math.min(Math.max(parseFloat(modelData.rating) || 5.0, 1.0), 5.0).toFixed(1)),
      videoCount: Math.max(parseInt(modelData.videoCount) || 30, 0),
      tags: Array.isArray(modelData.tags) ? modelData.tags.map(t => String(t).slice(0, 30)) : (modelData.tags ? modelData.tags.split(',').map(t => t.trim().slice(0, 30)) : ["ग्लैमर", "VIP", "4K"]),
      featured: Boolean(modelData.featured),
      active: modelData.active !== undefined ? Boolean(modelData.active) : true,
      clicks: 0,
      views: 0,
      createdAt: new Date().toISOString()
    };

    this.data.models.unshift(newModel);
    this.save();
    return newModel;
  }

  updateModel(id, updateData) {
    const index = this.data.models.findIndex(m => m.id === id);
    if (index === -1) return null;

    const existing = this.data.models[index];
    this.data.models[index] = {
      ...existing,
      ...updateData,
      id: existing.id,
      name: updateData.name ? String(updateData.name).slice(0, 100) : existing.name,
      age: updateData.age !== undefined ? Math.min(Math.max(parseInt(updateData.age) || 21, 18), 99) : existing.age,
      location: updateData.location ? String(updateData.location).slice(0, 100) : existing.location,
      bio: updateData.bio ? String(updateData.bio).slice(0, 500) : existing.bio,
      rating: updateData.rating !== undefined ? parseFloat(Math.min(Math.max(parseFloat(updateData.rating) || 5.0, 1.0), 5.0).toFixed(1)) : existing.rating,
      videoCount: updateData.videoCount !== undefined ? Math.max(parseInt(updateData.videoCount) || 0, 0) : existing.videoCount,
      tags: Array.isArray(updateData.tags) ? updateData.tags.map(t => String(t).slice(0, 30)) : (typeof updateData.tags === 'string' ? updateData.tags.split(',').map(t => t.trim().slice(0, 30)) : existing.tags),
      gallery: Array.isArray(updateData.gallery) ? updateData.gallery : existing.gallery,
      telegramEmbed: updateData.telegramEmbed !== undefined ? String(updateData.telegramEmbed) : (existing.telegramEmbed || "")
    };

    this.save();
    return this.data.models[index];
  }

  deleteModel(id) {
    const initialLen = this.data.models.length;
    this.data.models = this.data.models.filter(m => m.id !== id);
    if (this.data.models.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  recordClick(id) {
    const model = this.data.models.find(m => m.id === id);
    if (model) {
      model.clicks = (model.clicks || 0) + 1;
      this.save();
      return model.clicks;
    }
    return 0;
  }

  recordView(id) {
    const model = this.data.models.find(m => m.id === id);
    if (model) {
      model.views = (model.views || 0) + 1;
      this.save();
      return model.views;
    }
    return 0;
  }

  getSettings() {
    const copy = { ...this.data.settings };
    delete copy.adminPasswordHash;
    delete copy.adminPin;
    return copy;
  }

  updateSettings(newSettings) {
    if (newSettings.adminPassword && newSettings.adminPassword.trim().length >= 6) {
      const cleanPass = newSettings.adminPassword.trim();
      this.data.settings.adminPasswordHash = hashPassword(cleanPass);
      this.data.settings.adminPin = cleanPass;
      delete newSettings.adminPassword;
    }
    this.data.settings = {
      ...this.data.settings,
      ...newSettings
    };
    this.save();
    return this.getSettings();
  }

  verifyAdmin(password, clientIp = '127.0.0.1') {
    const now = Date.now();
    const ipData = this.failedAttempts.get(clientIp) || { count: 0, lockedUntil: 0 };

    if (ipData.lockedUntil > now) {
      const waitMinutes = Math.ceil((ipData.lockedUntil - now) / 60000);
      return {
        success: false,
        message: `सुरक्षा लॉक: बहुत अधिक गलत प्रयास। कृपया ${waitMinutes} मिनट बाद पुनः प्रयास करें।`
      };
    }

    const inputHash = hashPassword(password);
    const valid = timingSafeCompare(inputHash, this.data.settings.adminPasswordHash) ||
                  timingSafeCompare(password, this.data.settings.adminPin || "Luxe@9211#Admin");

    if (valid) {
      this.failedAttempts.delete(clientIp);
      const token = "sec_" + crypto.randomBytes(32).toString('hex');
      this.data.adminTokens.push({
        token,
        clientIp,
        createdAt: now,
        expiresAt: now + (1000 * 60 * 60 * 24)
      });
      this.data.adminTokens = this.data.adminTokens.filter(t => t.expiresAt > now);
      this.save();
      return { success: true, token };
    } else {
      ipData.count += 1;
      if (ipData.count >= 5) {
        ipData.lockedUntil = now + (1000 * 60 * 15);
        this.failedAttempts.set(clientIp, ipData);
        return {
          success: false,
          message: "सुरक्षा लॉक: लगातार 5 गलत पासवर्ड दर्ज किए गए। 15 मिनट के लिए लॉक कर दिया गया है।"
        };
      } else {
        this.failedAttempts.set(clientIp, ipData);
        const remaining = 5 - ipData.count;
        return {
          success: false,
          message: `गलत पासवर्ड! आपके पास ${remaining} प्रयास शेष हैं।`
        };
      }
    }
  }

  validateToken(token) {
    if (!token || typeof token !== 'string') return false;
    const now = Date.now();
    const found = this.data.adminTokens.find(t => t.token === token && t.expiresAt > now);
    return Boolean(found);
  }

  revokeToken(token) {
    if (!token) return;
    this.data.adminTokens = this.data.adminTokens.filter(t => t.token !== token);
    this.save();
  }

  getStats() {
    const totalModels = this.data.models.length;
    const activeModels = this.data.models.filter(m => m.active).length;
    const totalClicks = this.data.models.reduce((acc, m) => acc + (m.clicks || 0), 0);
    const totalViews = this.data.models.reduce((acc, m) => acc + (m.views || 0), 0);
    const featuredCount = this.data.models.filter(m => m.featured).length;

    return {
      totalModels,
      activeModels,
      totalClicks,
      totalViews,
      featuredCount,
      topModels: [...this.data.models].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5)
    };
  }
}

const db = new Database();
db.data.settings = { ...DEFAULT_SETTINGS, ...db.data.settings };
db.save();

module.exports = { db, hashPassword };
