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

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial seed models with professional glamour portraits & Telegram video support
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
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85"
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
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=85"
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
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=85"
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
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"
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
  onlyfansLink: "",
  adminPin: "admin123",
  adminPasswordHash: hashPassword("admin123"),
  enableAgeGate: false,
  themeColor: "ruby-glow"
};

// Database structure helper
class Database {
  constructor() {
    this.data = {
      models: [],
      settings: {},
      adminTokens: []
    };
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
    const id = "model-" + crypto.randomBytes(4).toString('hex');
    const newModel = {
      id,
      name: modelData.name || "VIP Model",
      age: parseInt(modelData.age) || 22,
      location: modelData.location || "मुंबई, भारत",
      badge: modelData.badge || "🔥 हॉट",
      status: modelData.status || "online",
      image: modelData.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
      gallery: Array.isArray(modelData.gallery) ? modelData.gallery : [modelData.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"],
      bio: modelData.bio || "एक्सक्लूसिव ग्लैमर शूट्स और वीडियो।",
      premiumVideoLink: modelData.premiumVideoLink || this.data.settings.globalCtaLink || "https://t.me/yourvipchannel",
      telegramEmbed: modelData.telegramEmbed || "",
      premiumPrice: modelData.premiumPrice || "VIP वीडियो पास",
      rating: parseFloat(modelData.rating) || 5.0,
      videoCount: parseInt(modelData.videoCount) || 30,
      tags: Array.isArray(modelData.tags) ? modelData.tags : (modelData.tags ? modelData.tags.split(',').map(t => t.trim()) : ["ग्लैमर", "VIP", "4K"]),
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
      age: updateData.age !== undefined ? parseInt(updateData.age) : existing.age,
      rating: updateData.rating !== undefined ? parseFloat(updateData.rating) : existing.rating,
      videoCount: updateData.videoCount !== undefined ? parseInt(updateData.videoCount) : existing.videoCount,
      tags: Array.isArray(updateData.tags) ? updateData.tags : (typeof updateData.tags === 'string' ? updateData.tags.split(',').map(t => t.trim()) : existing.tags),
      gallery: Array.isArray(updateData.gallery) ? updateData.gallery : existing.gallery,
      telegramEmbed: updateData.telegramEmbed !== undefined ? updateData.telegramEmbed : (existing.telegramEmbed || "")
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
    return { ...this.data.settings, adminPasswordHash: undefined };
  }

  updateSettings(newSettings) {
    if (newSettings.adminPassword) {
      this.data.settings.adminPasswordHash = hashPassword(newSettings.adminPassword);
      this.data.settings.adminPin = newSettings.adminPassword;
      delete newSettings.adminPassword;
    }
    this.data.settings = {
      ...this.data.settings,
      ...newSettings
    };
    this.save();
    return this.getSettings();
  }

  verifyAdmin(password) {
    const inputHash = hashPassword(password);
    const valid = inputHash === this.data.settings.adminPasswordHash || password === (this.data.settings.adminPin || "admin123");
    if (valid) {
      const token = "tok_" + crypto.randomBytes(16).toString('hex');
      this.data.adminTokens.push({
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7
      });
      this.data.adminTokens = this.data.adminTokens.filter(t => t.expiresAt > Date.now());
      this.save();
      return { success: true, token };
    }
    return { success: false, message: "गलत एडमिन पासवर्ड" };
  }

  validateToken(token) {
    if (!token) return false;
    const found = this.data.adminTokens.find(t => t.token === token && t.expiresAt > Date.now());
    return Boolean(found);
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
db.data.models = SEED_MODELS;
db.data.settings = DEFAULT_SETTINGS;
db.save();

module.exports = { db, hashPassword };
