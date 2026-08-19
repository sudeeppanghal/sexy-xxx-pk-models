const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Multer storage setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, 'model-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static directories
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Admin authentication middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-token'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (authHeader) {
    token = authHeader;
  }

  if (!token || !db.validateToken(token)) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please login as admin.' });
  }
  next();
}

// -------------------------------------------------------------
// PUBLIC API ROUTES
// -------------------------------------------------------------

// Get site settings
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
        models = models.filter(m => (m.badge && m.badge.includes('NEW')) || (m.tags && m.tags.some(t => t.toLowerCase().includes('new'))));
      } else {
        models = models.filter(m => m.tags && m.tags.some(t => t.toLowerCase() === category.toLowerCase()));
      }
    }

    if (search) {
      const q = search.toLowerCase();
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
    res.status(500).json({ success: false, message: err.message });
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
    res.status(500).json({ success: false, message: err.message });
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
    res.status(500).json({ success: false, message: err.message });
  }
});

// Direct redirection link for marketing & buttons (e.g., /go/model-1)
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
// ADMIN AUTH & MANAGEMENT ROUTES
// -------------------------------------------------------------

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }
  const result = db.verifyAdmin(password);
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

// Admin stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Get all models (including inactive)
app.get('/api/admin/models', requireAdmin, (req, res) => {
  try {
    const models = db.getModels(false);
    res.json({ success: true, count: models.length, models });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Upload image
app.post('/api/admin/upload', requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
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
    if (modelData.featured === 'true' || modelData.featured === true) modelData.featured = true;
    else modelData.featured = false;

    if (modelData.active === 'false' || modelData.active === false) modelData.active = false;
    else modelData.active = true;

    const newModel = db.createModel(modelData);
    res.status(201).json({ success: true, model: newModel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Delete model
app.delete('/api/admin/models/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteModel(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }
    res.json({ success: true, message: 'Model deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Get settings
app.get('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Update settings
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const updatedSettings = db.updateSettings(req.body);
    res.json({ success: true, settings: updatedSettings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🔥 VIP Models & Premium Videos Platform Running!`);
  console.log(`🌐 Public Landing Page: http://localhost:${PORT}`);
  console.log(`👑 Admin Dashboard:     http://localhost:${PORT}/admin`);
  console.log(`🔑 Default Admin PIN:   admin123`);
  console.log(`====================================================`);
});
