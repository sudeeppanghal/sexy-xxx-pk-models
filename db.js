const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

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

const DEFAULT_SETTINGS = {
  siteName: "GLAMOUR VIP MODELS",
  siteTagline: "Exclusive Glamour Models & 4K Video Hub",
  heroTitle: "टॉप ग्लैमर मॉडल्स के एक्सक्लूसिव और ट्रेंडिंग वीडियो देखें",
  heroSubtitle: "हाई-फैशन शूट्स, लाइव सेशन्स और एक्सक्लूसिव 4K वीडियो गैलरी। अपनी पसंदीदा मॉडल चुनें और पूरा वीडियो तुरंत देखें।",
  announcement: "⭐ आज का स्पेशल अपडेट: नए एक्सक्लूसिव फैशन वीडियो और फोटोशूट्स लाइव हैं! • 💎 100% वेरिफाइड प्रोफाइल्स • 🔥 टॉप ट्रेंडिंग मॉडल्स • ⭐",
  ctaButtonText: "🔥 मेरे सभी प्रीमियम वीडियो देखें - यहाँ क्लिक करें",
  globalCtaLink: "https://t.me/riyakumarix7",
  telegramLink: "https://t.me/riyakumarix7",
  adminPin: "Luxe@9211#Admin",
  adminPasswordHash: hashPassword("Luxe@9211#Admin"),
  enableAgeGate: true,
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
  enableBanner728x90: true,
  
  // Adsterra Official API Token for Live Stats
  adsterraApiToken: ""
};

class Database {
  constructor() {
    this.data = {
      models: [],
      settings: {},
      adminTokens: [],
      analytics: {
        uniqueVisitors: {}, // date_string -> Set/Array of hashed IPs
        pageviews: 0,
        clicks: 0,
        devices: { mobile: 0, desktop: 0 },
        countries: {},
        hourlyViews: {},
        recentEvents: []
      }
    };
    this.activeVisitors = new Map(); // ipHash -> lastSeenTimestamp
    this.failedAttempts = new Map();
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          models: parsed.models || [],
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          adminTokens: parsed.adminTokens || [],
          analytics: {
            uniqueVisitors: parsed.analytics?.uniqueVisitors || {},
            pageviews: parsed.analytics?.pageviews || 0,
            clicks: parsed.analytics?.clicks || 0,
            devices: parsed.analytics?.devices || { mobile: 0, desktop: 0 },
            countries: parsed.analytics?.countries || {},
            hourlyViews: parsed.analytics?.hourlyViews || {},
            recentEvents: parsed.analytics?.recentEvents || []
          }
        };
      } else {
        this.data.settings = DEFAULT_SETTINGS;
        this.save();
      }
    } catch (err) {
      console.error("Error loading database:", err);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Error saving database:", err);
    }
  }

  // Real visitor tracking (Excludes bots and admin requests)
  recordRealVisitor(ip, userAgent = '', country = 'IN') {
    if (!ip) return;
    
    // Ignore common search engine bots / crawlers
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse|headless/i.test(userAgent);
    if (isBot) return;

    const today = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();
    const isMobile = /mobile|iphone|android|ipad|tablet/i.test(userAgent);
    const ipHash = crypto.createHash('sha256').update(ip + today).digest('hex').slice(0, 16);

    // Update active online visitor heartbeat
    const now = Date.now();
    this.activeVisitors.set(ipHash, now);

    // Initialize analytics structure if needed
    if (!this.data.analytics) {
      this.data.analytics = { uniqueVisitors: {}, pageviews: 0, clicks: 0, devices: { mobile: 0, desktop: 0 }, countries: {}, hourlyViews: {}, recentEvents: [] };
    }
    if (!this.data.analytics.uniqueVisitors[today]) {
      this.data.analytics.uniqueVisitors[today] = [];
    }

    // Record Unique Visitor
    if (!this.data.analytics.uniqueVisitors[today].includes(ipHash)) {
      this.data.analytics.uniqueVisitors[today].push(ipHash);
    }

    // Record Pageview
    this.data.analytics.pageviews = (this.data.analytics.pageviews || 0) + 1;

    // Record Device
    if (isMobile) {
      this.data.analytics.devices.mobile = (this.data.analytics.devices.mobile || 0) + 1;
    } else {
      this.data.analytics.devices.desktop = (this.data.analytics.devices.desktop || 0) + 1;
    }

    // Record Country
    const safeCountry = (country || 'IN').toUpperCase().slice(0, 3);
    this.data.analytics.countries[safeCountry] = (this.data.analytics.countries[safeCountry] || 0) + 1;

    // Record Hourly
    this.data.analytics.hourlyViews[hour] = (this.data.analytics.hourlyViews[hour] || 0) + 1;

    // Save every 5th hit to save disk I/O
    if (this.data.analytics.pageviews % 5 === 0) {
      this.save();
    }
  }

  // Record Real Click
  recordRealClick(modelId) {
    if (!this.data.analytics) {
      this.data.analytics = { uniqueVisitors: {}, pageviews: 0, clicks: 0, devices: { mobile: 0, desktop: 0 }, countries: {}, hourlyViews: {}, recentEvents: [] };
    }
    this.data.analytics.clicks = (this.data.analytics.clicks || 0) + 1;
    
    if (modelId) {
      const model = this.data.models.find(m => m.id === modelId);
      if (model) {
        model.clicks = (model.clicks || 0) + 1;
      }
    }
    this.save();
    return this.data.analytics.clicks;
  }

  getRealMetrics() {
    const today = new Date().toISOString().split('T')[0];
    const todayUniques = this.data.analytics?.uniqueVisitors?.[today]?.length || 0;
    
    let totalAllTimeUniques = 0;
    if (this.data.analytics?.uniqueVisitors) {
      for (const day in this.data.analytics.uniqueVisitors) {
        totalAllTimeUniques += this.data.analytics.uniqueVisitors[day].length;
      }
    }

    // Active online in the last 5 minutes
    const now = Date.now();
    let onlineActiveNow = 0;
    for (const [hash, lastSeen] of this.activeVisitors.entries()) {
      if (now - lastSeen < 5 * 60 * 1000) {
        onlineActiveNow++;
      } else {
        this.activeVisitors.delete(hash);
      }
    }
    if (onlineActiveNow === 0) onlineActiveNow = 1; // at least admin or current visitor

    const totalPageviews = this.data.analytics?.pageviews || 0;
    const totalClicks = this.data.analytics?.clicks || 0;
    const ctr = totalPageviews > 0 ? ((totalClicks / totalPageviews) * 100).toFixed(1) : "0.0";

    return {
      onlineActiveNow,
      todayUniques,
      totalUniqueVisitors: totalAllTimeUniques || todayUniques,
      totalPageviews,
      totalClicks,
      ctr: ctr + "%",
      devices: this.data.analytics?.devices || { mobile: 0, desktop: 0 },
      countries: this.data.analytics?.countries || { "IN": 1 }
    };
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
      age: Math.min(Math.max(parseInt(modelData.age) || 22, 18), 99),
      location: String(modelData.location || "Mumbai, India").slice(0, 100),
      badge: String(modelData.badge || "🔥 Trending").slice(0, 50),
      status: ["online", "live", "offline"].includes(modelData.status) ? modelData.status : "online",
      image: String(modelData.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"),
      gallery: Array.isArray(modelData.gallery) ? modelData.gallery : [modelData.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"],
      bio: String(modelData.bio || "Exclusive glamour model portfolio and video gallery.").slice(0, 500),
      premiumVideoLink: String(modelData.premiumVideoLink || this.data.settings.globalCtaLink || "https://t.me/riyakumarix7"),
      telegramEmbed: String(modelData.telegramEmbed || ""),
      premiumPrice: String(modelData.premiumPrice || "VIP Pass").slice(0, 50),
      rating: parseFloat(Math.min(Math.max(parseFloat(modelData.rating) || 5.0, 1.0), 5.0).toFixed(1)),
      videoCount: Math.max(parseInt(modelData.videoCount) || 30, 0),
      tags: Array.isArray(modelData.tags) ? modelData.tags.map(t => String(t).slice(0, 30)) : (modelData.tags ? modelData.tags.split(',').map(t => t.trim().slice(0, 30)) : ["Glamour", "VIP", "4K"]),
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
      age: updateData.age !== undefined ? Math.min(Math.max(parseInt(updateData.age) || 22, 18), 99) : existing.age,
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
    return this.recordRealClick(id);
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
        message: `Security Lock: Too many failed attempts. Try again in ${waitMinutes} minutes.`
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
          message: "Security Lock: 5 consecutive failed passwords. Locked for 15 minutes."
        };
      } else {
        this.failedAttempts.set(clientIp, ipData);
        const remaining = 5 - ipData.count;
        return {
          success: false,
          message: `Incorrect password! ${remaining} attempt(s) remaining.`
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
    const metrics = this.getRealMetrics();

    return {
      totalModels,
      activeModels,
      ...metrics,
      featuredCount: this.data.models.filter(m => m.featured).length,
      topModels: [...this.data.models].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5)
    };
  }
}

const db = new Database();
module.exports = { db, hashPassword };
