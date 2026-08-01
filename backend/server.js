const express      = require('express');
const jwt          = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path         = require('path');
const fs           = require('fs');

const ACCESS_SECRET  = process.env.ACCESS_SECRET  || 'payerpath-access-dev-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'payerpath-refresh-dev-secret';
const ACCESS_TTL     = '15m';
const REFRESH_TTL    = '7d';
const PORT           = process.env.PORT || 3000;

// ── User store — loaded from database/users/{folder}/profile.json ─────────────
// To add a user: create database/users/{folder}/profile.json and restart.
// To add an avatar: drop photo.{jpeg,jpg,png,webp} in the same folder.
// No code changes required for either operation.
// username is the unique identifier — no separate id field.
const DB_DIR      = path.resolve(__dirname, '../database/users');
const AVATAR_EXTS = ['jpeg', 'jpg', 'png', 'webp'];

function loadUsers() {
  return fs.readdirSync(DB_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const userDir     = path.join(DB_DIR, entry.name);
      const profilePath = path.join(userDir, 'profile.json');
      if (!fs.existsSync(profilePath)) return null;
      const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
      return {
        ...profile,
        email:     profile.email?.toLowerCase(),
        username:  profile.username?.toLowerCase(),
        avatarDir: userDir,
      };
    })
    .filter(Boolean);
}

let USERS = loadUsers();

// ── Hot-reload — watch database/users for profile.json changes ────────────────
let reloadDebounce = null;
fs.watch(DB_DIR, { recursive: true }, (_, filename) => {
  if (!filename?.endsWith('profile.json')) return;
  clearTimeout(reloadDebounce);
  reloadDebounce = setTimeout(() => {
    USERS = loadUsers();
    console.log(`[hot-reload] Users reloaded: ${USERS.map(u => u.username).join(', ')}`);
  }, 300);
});

function findAvatarFile(avatarDir) {
  for (const ext of AVATAR_EXTS) {
    const filePath = path.join(avatarDir, `photo.${ext}`);
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

// ── In-memory refresh token store (replace with Redis/DB in production) ───────
const validRefreshTokens = new Set();

// ── Token helpers ─────────────────────────────────────────────────────────────
function signAccess(user) {
  return jwt.sign(
    { sub: user.username, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_TTL }
  );
}

function signRefresh(user) {
  return jwt.sign({ sub: user.username }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure:   false,        // set true in production (HTTPS)
    sameSite: 'strict',
    maxAge:   7 * 24 * 60 * 60 * 1000,
    path:     '/api/auth',
  });
}

// ── Auth middleware ───────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const auth  = req.headers.authorization ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ code: 'NO_TOKEN' });

  try {
    req.user = jwt.verify(token, ACCESS_SECRET);
    next();
  } catch {
    res.status(401).json({ code: 'INVALID_TOKEN' });
  }
}

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/auth/login
// Body: { email, username, password }
// Email is not unique — a person may have multiple accounts with different usernames.
// Username is the unique identifier. Both must match the same account to authenticate.
app.post('/api/auth/login', (req, res) => {
  const { email, username, password } = req.body ?? {};

  const byUsername = USERS.find(u => u.username === username?.toLowerCase());

  // Collect per-field errors independently so both can surface at once
  const fieldErrors = {};
  if (!byUsername) fieldErrors.username = 'USER_NOT_FOUND';

  // Email must match the specific account identified by username (email is not unique)
  const emailMatches = byUsername && byUsername.email === email?.toLowerCase();
  if (!emailMatches) fieldErrors.email = 'EMAIL_NOT_FOUND';

  if (Object.keys(fieldErrors).length > 0) {
    return res.status(401).json({ code: 'FIELD_ERRORS', fields: fieldErrors });
  }

  if (byUsername.password !== password) {
    return res.status(401).json({ code: 'INVALID_CREDENTIALS' });
  }

  const accessToken  = signAccess(byUsername);
  const refreshToken = signRefresh(byUsername);
  validRefreshTokens.add(refreshToken);

  setRefreshCookie(res, refreshToken);
  res.json({ accessToken });
});

// POST /api/auth/refresh
app.post('/api/auth/refresh', (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token || !validRefreshTokens.has(token)) {
    return res.status(401).json({ code: 'NO_REFRESH_TOKEN' });
  }

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const user    = USERS.find(u => u.username === payload.sub);
    if (!user) return res.status(401).json({ code: 'USER_NOT_FOUND' });

    validRefreshTokens.delete(token);
    const newRefresh = signRefresh(user);
    validRefreshTokens.add(newRefresh);

    setRefreshCookie(res, newRefresh);
    res.json({ accessToken: signAccess(user) });
  } catch {
    validRefreshTokens.delete(token);
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.status(401).json({ code: 'REFRESH_EXPIRED' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) validRefreshTokens.delete(token);
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json({ ok: true });
});

// GET /api/users/me
app.get('/api/users/me', authenticate, (req, res) => {
  const user = USERS.find(u => u.username === req.user.sub);
  if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' });

  const hasAvatar = !!findAvatarFile(user.avatarDir);
  res.json({
    username:  user.username,
    email:     user.email,
    name:      user.name,
    role:      user.role,
    avatarUrl: hasAvatar ? '/api/users/me/avatar' : null,
  });
});

// GET /api/users/me/avatar
// Streams the avatar from the user's own folder — requires authentication.
app.get('/api/users/me/avatar', authenticate, (req, res) => {
  const user = USERS.find(u => u.username === req.user.sub);
  if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' });

  const filePath = findAvatarFile(user.avatarDir);
  if (!filePath) return res.status(404).json({ code: 'NO_AVATAR' });

  res.sendFile(filePath);
});

// ── Eligibility Check data ────────────────────────────────────────────────────
const EC_DIR     = path.resolve(__dirname, '../database/eligibility-check');
const PAYER_SLOTS = ['core', 'primary', 'secondary', 'tertiary'];

function genSubscriberId(index, slot) {
  const seed = index * 1000 + PAYER_SLOTS.indexOf(slot) * 100;
  return [
    (seed + 0x1FE2) & 0xFFFF,
    (seed + 0xBDC2) & 0xFFFF,
    (seed + 0xFB32) & 0xFFFF,
    (seed + 0x4D24) & 0xFFFF,
    (seed + 0x93A2) & 0xFFFF,
    (seed + 0x2153) & 0xFFFF,
    (seed + 0xD5F7) & 0xFFFF,
    (seed + 0xB965) & 0xFFFF,
  ].map(n => n.toString(16).padStart(4, '0')).join('').toUpperCase();
}

function genTrn(index, slot) {
  const slotN  = PAYER_SLOTS.indexOf(slot);
  const seed   = index * 997 + slotN * 251;
  const h4     = n => (n & 0xFFFF).toString(16).padStart(4, '0');
  const h3     = n => (n & 0xFFF).toString(16).padStart(3, '0');
  const v      = ['8', '9', 'a', 'b'][slotN];
  return [
    h4(seed + 0x222e) + h4(seed + 0xc864),
    h4(seed + 0x7ca7),
    '4' + h3(seed + 0xd9e),
    v   + h3(seed + 0x417),
    h4(seed + 0xaa2f) + h4(seed + 0x8247) + h4(seed + 0x07dd),
  ].join('-');
}

function makePayerFound(name, entry, index, slot, providerObj, address, rec, result, benefits, alerts, relatedEntities) {
  return {
    found:           true,
    name,
    identification:  entry.identification,
    transactionDate: rec.transactionDate,
    providerName:    providerObj.name,
    npi:             providerObj.npi,
    payerpathTrn:    genTrn(index, slot),
    subscriberName:  rec.patientName,
    dateOfBirth:     rec.dateOfBirth,
    address,
    subscriberId:    genSubscriberId(index, slot),
    result,
    benefits:        benefits        ?? [],
    alerts:          alerts          ?? [],
    relatedEntities: relatedEntities ?? [],
  };
}

function buildEcRows() {
  const records                = JSON.parse(fs.readFileSync(path.join(EC_DIR, 'records.json'),                  'utf8'));
  const catalog                = JSON.parse(fs.readFileSync(path.join(EC_DIR, 'payer-catalog.json'),            'utf8'));
  const providers              = JSON.parse(fs.readFileSync(path.join(EC_DIR, 'providers.json'),                'utf8'));
  const addresses              = JSON.parse(fs.readFileSync(path.join(EC_DIR, 'addresses.json'),                'utf8'));
  const benefitsCatalog        = JSON.parse(fs.readFileSync(path.join(EC_DIR, 'benefits-catalog.json'),        'utf8'));
  const alertsCatalog          = JSON.parse(fs.readFileSync(path.join(EC_DIR, 'alerts-catalog.json'),          'utf8'));
  const relatedEntitiesCatalog = JSON.parse(fs.readFileSync(path.join(EC_DIR, 'related-entities-catalog.json'), 'utf8'));

  return records.map((rec, i) => {
    const provider = providers[i % providers.length];
    const address  = addresses[i % addresses.length];

    const coreEntry   = catalog[rec.insurance];
    const corePayer   = coreEntry
      ? makePayerFound(rec.insurance, coreEntry, i, 'core', provider, address, rec, rec.result, benefitsCatalog[rec.insurance] ?? [], alertsCatalog[rec.insurance] ?? [], relatedEntitiesCatalog[rec.insurance] ?? [])
      : { found: false };

    const primaryName  = coreEntry?.primary;
    const primaryEntry = catalog[primaryName];
    const primaryPayer = primaryEntry
      ? makePayerFound(primaryName, primaryEntry, i, 'primary', providers[(i + 1) % providers.length], address, rec, 'active', benefitsCatalog[primaryName] ?? [], alertsCatalog[primaryName] ?? [], relatedEntitiesCatalog[primaryName] ?? [])
      : { found: false };

    const secondaryName  = coreEntry?.secondary;
    const secondaryEntry = catalog[secondaryName];
    const secondaryPayer = (i % 2 === 0 && secondaryEntry)
      ? makePayerFound(secondaryName, secondaryEntry, i, 'secondary', providers[(i + 2) % providers.length], address, rec, 'active', benefitsCatalog[secondaryName] ?? [], alertsCatalog[secondaryName] ?? [], relatedEntitiesCatalog[secondaryName] ?? [])
      : { found: false };

    return {
      patientName:     rec.patientName,
      found:           rec.found,
      dateOfBirth:     rec.dateOfBirth,
      transactionDate: rec.transactionDate,
      insurance:       corePayer.found ? corePayer.name : rec.insurance,
      policyId:        corePayer.found ? corePayer.subscriberId : '',
      result:          rec.result,
      alerts:          rec.alerts,
      coPayments:      rec.coPayments,
      deductibles:     rec.deductibles,
      provider:        corePayer.found ? corePayer.providerName : null,
      payers: {
        core:      corePayer,
        primary:   primaryPayer,
        secondary: secondaryPayer,
        tertiary:  { found: false },
      },
    };
  });
}

let EC_ROWS = [];
try {
  EC_ROWS = buildEcRows();
  console.log(`[ec] Loaded ${EC_ROWS.length} eligibility check record(s).`);
} catch (err) {
  console.error('[ec] Failed to load eligibility check data:', err.message);
}

// GET /api/eligibility-check
app.get('/api/eligibility-check', authenticate, (_req, res) => {
  res.json(EC_ROWS);
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Payerpath API → http://localhost:${PORT}`);
  console.log(`Loaded ${USERS.length} user(s): ${USERS.map(u => u.username).join(', ')}`);
});
