const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Security: Enforce Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Multer storage setup for image uploads with strict sanitization
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const randomName = require('crypto').randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
    cb(null, `model-${Date.now()}-${randomName}${safeExt}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('सुरक्षा चेतावनी: केवल इमेज फाइल्स (.jpg, .png, .webp) की अनुमति है!'), false);
    }
  }
});

// Middleware with payload limits
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Helper to get real client IP (behind Cloudflare / Render proxy)
function getClientIp(req) {
  return req.headers['cf-connecting-ip'] || 
         req.headers['x-forwarded-for']?.split(',')[0].trim() || 
         req.socket.remoteAddress || 
         '127.0.0.1';
}

// Static directories
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Admin authentication middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-token'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (authHeader) {
    token = authHeader.trim();
  }

  if (!token || !db.validateToken(token)) {
    return res.status(401).json({ success: false, message: 'अनाधिकृत अनुरोध! कृपया एडमिन लॉगिन करें।' });
  }
  req.adminToken = token;
  next();
}

// -------------------------------------------------------------
// PUBLIC API ROUTES
// -------------------------------------------------------------

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get site settings (sensitive hashes stripped)
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get active models (with optional search, tag, sort filters)
app.get('/api/models', (req, res) => {
  try {
    let models = db.getModels(true);
    const { category, search, sort } = req.query;

    if (category && category !== 'all') {
      if (category === 'featured') {
        models = models.filter(m => m.featured);
      } else if (category === 'vip') {
        models = models.filter(m => (m.badge && m.badge.includes('VIP')) || (m.tags && m.tags.some(t => t.toLowerCase().includes('vip'))));
      } else if (category === 'top') {
        models = models.filter(m => m.rating >= 4.9);
      } else if (category === 'new') {
        models = models.filter(m => (m.badge && (m.badge.includes('NEW') || m.badge.includes('नया') || m.badge.includes('नई'))) || (m.tags && m.tags.some(t => t.toLowerCase().includes('new'))));
      } else {
        models = models.filter(m => m.tags && m.tags.some(t => t.toLowerCase() === String(category).toLowerCase()));
      }
    }

    if (search) {
      const q = String(search).toLowerCase().trim();
      models = models.filter(m =>
        m.name.toLowerCase().includes(q) ||
        (m.location && m.location.toLowerCase().includes(q)) ||
        (m.bio && m.bio.toLowerCase().includes(q)) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (sort === 'popular') {
      models.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    } else if (sort === 'rating') {
      models.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'videos') {
      models.sort((a, b) => (b.videoCount || 0) - (a.videoCount || 0));
    }

    res.json({ success: true, count: models.length, models });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single model details
app.get('/api/models/:id', (req, res) => {
  try {
    const model = db.getModelById(req.params.id);
    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }
    db.recordView(model.id);
    res.json({ success: true, model });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Track click on "Watch all my premium videos" button
app.post('/api/track-click/:id', (req, res) => {
  try {
    const model = db.getModelById(req.params.id);
    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }
    const clicks = db.recordClick(model.id);
    const destination = model.premiumVideoLink || db.getSettings().globalCtaLink || '#';
    res.json({ success: true, clicks, destination });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Direct redirection link
app.get('/go/:id', (req, res) => {
  try {
    const model = db.getModelById(req.params.id);
    if (!model) {
      return res.redirect('/');
    }
    db.recordClick(model.id);
    const destination = model.premiumVideoLink || db.getSettings().globalCtaLink || '/';
    res.redirect(destination);
  } catch (err) {
    res.redirect('/');
  }
});

// -------------------------------------------------------------
// SECURE ADMIN AUTH & MANAGEMENT ROUTES
// -------------------------------------------------------------

// Admin login with Brute-Force Rate Limiting
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'पासवर्ड आवश्यक है।' });
  }

  const clientIp = getClientIp(req);
  const result = db.verifyAdmin(password.trim(), clientIp);

  if (result.success) {
    res.json({ success: true, token: result.token });
  } else {
    res.status(401).json({ success: false, message: result.message });
  }
});

// Admin check token
app.get('/api/admin/check', requireAdmin, (req, res) => {
  res.json({ success: true, authenticated: true });
});

// Admin logout / Revoke Token
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  db.revokeToken(req.adminToken);
  res.json({ success: true, message: 'Logged out successfully' });
});

// Admin stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: Get all models
app.get('/api/admin/models', requireAdmin, (req, res) => {
  try {
    const models = db.getModels(false);
    res.json({ success: true, count: models.length, models });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: Upload image
app.post('/api/admin/upload', requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'कोई इमेज अपलोड नहीं की गई।' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl, filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Create model
app.post('/api/admin/models', requireAdmin, upload.single('imageFile'), (req, res) => {
  try {
    const modelData = { ...req.body };
    if (req.file) {
      modelData.image = `/uploads/${req.file.filename}`;
    }
    if (typeof modelData.gallery === 'string') {
      try {
        modelData.gallery = JSON.parse(modelData.gallery);
      } catch (e) {
        modelData.gallery = modelData.gallery.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (typeof modelData.tags === 'string') {
      modelData.tags = modelData.tags.split(',').map(s => s.trim()).filter(Boolean);
    }
    modelData.featured = modelData.featured === 'true' || modelData.featured === true;
    modelData.active = modelData.active !== 'false' && modelData.active !== false;

    const newModel = db.createModel(modelData);
    res.status(201).json({ success: true, model: newModel });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving model' });
  }
});

// Admin: Update model
app.put('/api/admin/models/:id', requireAdmin, upload.single('imageFile'), (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    if (typeof updateData.gallery === 'string') {
      try {
        updateData.gallery = JSON.parse(updateData.gallery);
      } catch (e) {
        updateData.gallery = updateData.gallery.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    }
    if (updateData.active !== undefined) {
      updateData.active = updateData.active === 'true' || updateData.active === true;
    }

    const updated = db.updateModel(req.params.id, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }
    res.json({ success: true, model: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating model' });
  }
});

// Admin: Delete model
app.delete('/api/admin/models/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteModel(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }
    res.json({ success: true, message: 'मॉडल प्रोफाइल सफलतापूर्वक डिलीट हो गई।' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting model' });
  }
});

// Admin: Get settings
app.get('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching settings' });
  }
});

// Admin: Update settings
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const updatedSettings = db.updateSettings(req.body);
    res.json({ success: true, settings: updatedSettings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating settings' });
  }
});

// Admin Page route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🔒 VIP Models Platform Running (Hardened Security Active)`);
  console.log(`🌐 Public Landing Page: http://localhost:${PORT}`);
  console.log(`👑 Admin Dashboard:     http://localhost:${PORT}/admin`);
  console.log(`====================================================`);
});
