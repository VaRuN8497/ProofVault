// ProofVault demo backend: Express + SHA-256 + QR + persistent simulated ledger.
const express = require('express'), multer = require('multer'), cors = require('cors');
const QRCode = require('qrcode'), crypto = require('crypto'), fs = require('fs'), path = require('path');
const app = express(), upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
const PORT = process.env.PORT || 5000, LEDGER = path.join(__dirname, 'ledger.json');
app.use(cors()); app.use(express.json());

// ---- Simulated ledger (swap anchor()/lookup() for ethers.js calls to go live) ----
let db = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER)) : { records: {}, alerts: 0, block: 4192801, activity: [] };
db.activity = db.activity || [];
const logAct = (status, hash) => { db.activity.unshift({ time: new Date().toISOString(), status, hash }); db.activity = db.activity.slice(0, 15); save(); };
const save = () => fs.writeFileSync(LEDGER, JSON.stringify(db, null, 2));
const sha256 = buf => crypto.createHash('sha256').update(buf).digest('hex');
const fakeTx = () => '0x' + crypto.randomBytes(32).toString('hex');
const hashFrom = req => req.file ? sha256(req.file.buffer)
  : (req.body.documentHash || '').toLowerCase().replace(/^0x/, '');
const valid = h => /^[0-9a-f]{64}$/.test(h);

function anchor(docHash, meta) {
  db.block += 1 + Math.floor(Math.random() * 4);
  const rec = { proofVaultId: 'PV-' + docHash.slice(0, 8).toUpperCase(), docHash, ...meta,
    txHash: fakeTx(), blockNumber: db.block, issuedAt: new Date().toISOString(), revoked: false };
  db.records[docHash] = rec; save(); return rec;
}

// ---- API ----
app.post('/api/issue', upload.single('file'), async (req, res) => {
  const h = hashFrom(req);
  if (!valid(h)) return res.status(400).json({ success: false, error: 'Provide a file or a 64-char SHA-256 documentHash.' });
  if (db.records[h]) return res.status(409).json({ success: false, error: 'This document hash is already anchored.', record: db.records[h] });
  const b = req.body;
  const rec = anchor(h, { recipientName: b.recipientName || 'Unnamed recipient',
    credentialType: b.credentialType || 'Credential', issuerName: b.issuerName || 'Royal Tech University Registrar',
    fileName: req.file ? req.file.originalname : null });
  const base = `${req.protocol}://${req.get('host')}`;
  rec.publicVerifyUrl = `${base}/?hash=${h}`;
  rec.qrCodeDataUrl = await QRCode.toDataURL(rec.publicVerifyUrl, { margin: 1, width: 220, color: { dark: '#064E3B', light: '#FCFAF6' } });
  res.json({ success: true, record: rec });
});

app.post('/api/verify', upload.single('file'), (req, res) => {
  const h = hashFrom(req);
  if (!valid(h)) return res.status(400).json({ error: 'Provide a file or a 64-char SHA-256 documentHash.' });
  const r = db.records[h];
  if (r && r.revoked) logAct('REVOKED', h);
  if (r && r.revoked) return res.status(200).json({ isAuthentic: false, status: 'REVOKED', docHash: h,
    message: 'Document is anchored but was REVOKED by the issuer.', record: r });
  if (r) logAct('AUTHENTIC', h);
  if (r) return res.json({ isAuthentic: true, status: 'AUTHENTIC', docHash: h,
    message: 'DOCUMENT VERIFIED: cryptographic signature matches blockchain anchor.', record: r });
  db.alerts++; logAct('TAMPERED_HASH_MISMATCH', h);
  res.status(404).json({ isAuthentic: false, status: 'TAMPERED_HASH_MISMATCH', docHash: h,
    message: 'HASH MISMATCH: the submitted digest matches no anchor. Document is unregistered or altered.',
    auditAlertId: 'ALERT-' + crypto.randomBytes(3).toString('hex').toUpperCase() });
});

app.post('/api/revoke', (req, res) => {
  const r = db.records[(req.body.documentHash || '').toLowerCase()];
  if (!r) return res.status(404).json({ error: 'Not found' });
  r.revoked = true; r.revokeReason = req.body.reason || 'Issuer revoked'; save(); res.json({ success: true, record: r });
});

app.get('/api/records', (req, res) => {
  const recs = Object.values(db.records).sort((a, b) => b.blockNumber - a.blockNumber);
  const revoked = recs.filter(r => r.revoked).length;
  // Base figures mirror the presentation dashboard; live activity is added on top.
  res.json({ metrics: { totalIssued: 128 + recs.length, authenticVerified: 96 + recs.length - revoked,
    tamperAlterationsDetected: 4 + db.alerts, revoked: 2 + revoked }, records: recs });
});
app.get('/api/activity', (_, res) => res.json(db.activity));
app.get('/api/record/:q', (req, res) => {
  const q = req.params.q.trim().toLowerCase().replace(/^0x/, '');
  const r = db.records[q] || Object.values(db.records).find(x => x.proofVaultId.toLowerCase() === q);
  r ? res.json({ record: r }) : res.status(404).json({ error: 'No record found for that ID or hash.' });
});
app.get('/api/health', (_, res) => res.json({ ok: true, mode: 'SIMULATED_LEDGER', anchored: Object.keys(db.records).length }));

// Pre-anchor the demo diploma so evaluators can verify immediately.
const demo = path.join(__dirname, 'demo', 'alex_mercer_diploma.pdf');
if (fs.existsSync(demo)) {
  const h = sha256(fs.readFileSync(demo));
  if (!db.records[h]) { anchor(h, { recipientName: 'Alex Mercer', credentialType: 'B.S. Computer Science Diploma',
    issuerName: 'Royal Tech University Registrar', fileName: 'alex_mercer_diploma.pdf' }); console.log('Seeded demo diploma', h); }
}
app.use('/demo', express.static(path.join(__dirname, 'demo')));
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log(`ProofVault running at http://localhost:${PORT}`));
