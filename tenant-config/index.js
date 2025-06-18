const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const DATA_FILE = path.join(__dirname, 'data', 'tenants.json');

//  step -1 ensuring public folder exist or not 
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Serving  static files 
app.use('/uploads', express.static(UPLOADS_DIR));

// confugiation  for the multer for handling files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Upload route is here 
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Other tenant routes
function readTenants() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeTenants(tenants) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tenants, null, 2));
}
app.get('/api/tenants', (req, res) => res.json(readTenants()));
app.get('/api/tenant/:id', (req, res) => {
  const tenants = readTenants();
  const config = tenants[req.params.id];
  if (!config) return res.status(404).json({ error: 'Tenant not found' });
  res.json(config);
});

app.post('/api/tenant/:id', (req, res) => {
  const tenants = readTenants();
  tenants[req.params.id] = req.body;
  writeTenants(tenants);
  res.json({ message: 'Tenant saved', tenant: tenants[req.params.id] });
});

app.delete('/api/tenant/:id', (req, res) => {
  const tenants = readTenants();
  if (!tenants[req.params.id]) return res.status(404).json({ error: 'Tenant not found' });
  delete tenants[req.params.id];
  writeTenants(tenants);
  res.json({ message: 'Tenant deleted' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Tenant service on ${PORT}`));
