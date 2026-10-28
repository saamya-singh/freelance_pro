const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { MongoClient } = require('mongodb');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const root = __dirname;
const openapi = require('./openapi.json');
const demo = vm.runInNewContext(fs.readFileSync(path.join(root, 'js/data/demo-data.js'), 'utf8') + '\nDEMO_DATA');
const taxDefaults = vm.runInNewContext(fs.readFileSync(path.join(root, 'js/data/tax-slabs.js'), 'utf8') + '\nDEFAULT_TAX_CONFIG');
const collections = ['clients', 'work', 'invoices', 'payments', 'activities'];
const resources = [...collections, 'settings', 'taxSettings'];
const sessionDuration = 30 * 24 * 60 * 60 * 1000;

function passwordHash(password, salt = crypto.randomBytes(16).toString('hex')) {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
}
function passwordMatches(password, stored) {
  const [salt] = stored.split(':');
  const candidate = Buffer.from(passwordHash(password, salt).split(':')[1], 'hex');
  const actual = Buffer.from(stored.split(':')[1], 'hex');
  return actual.length === candidate.length && crypto.timingSafeEqual(actual, candidate);
}
function workspace(user, isDemo = false) {
  return {
    _id: user.id,
    clients: isDemo ? demo.clients : [], work: isDemo ? demo.work : [],
    invoices: isDemo ? demo.invoices : [], payments: isDemo ? demo.payments : [],
    activities: isDemo ? demo.activities : [{ id: crypto.randomUUID(), type: 'account_created', title: 'Account Created', description: `Welcome to FreelanceLedger, ${user.name}!`, timestamp: new Date().toISOString() }],
    settings: isDemo ? demo.user : { id: user.id, name: user.name, email: user.email, phone: '', country: 'India', businessName: `${user.name} Consulting`, gstin: '', pan: '', address: '', currency: 'INR', dateFormat: 'DD/MM/YYYY', invoicePrefix: 'INV-2026-', paymentTerms: '15 Days' },
    taxSettings: taxDefaults
  };
}
const publicUser = user => ({ id: user.id, name: user.name, email: user.email });
const error = (res, code, message) => res.status(code).json({ error: message });
const cookieToken = req => (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith('ledger_session='))?.slice(15);
const tokenHash = token => crypto.createHash('sha256').update(token).digest('hex');
function responseWorkspace(document) {
  const { _id, ...data } = document;
  return data;
}

function createApp(db) {
  const app = express();
  const users = db.collection('users');
  const sessions = db.collection('sessions');
  const workspaces = db.collection('workspaces');

  app.disable('x-powered-by');
  app.use(express.json({ limit: '2mb' }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi, { swaggerOptions: { persistAuthorization: true } }));
  app.get('/api/openapi.json', (req, res) => res.json(openapi));

  async function requireUser(req, res, next) {
    try {
      const token = cookieToken(req);
      if (!token) return error(res, 401, 'Authentication required');
      const session = await sessions.findOne({ _id: tokenHash(token), expiresAt: { $gt: new Date() } });
      if (!session) return error(res, 401, 'Authentication required');
      req.user = await users.findOne({ id: session.userId });
      if (!req.user) return error(res, 401, 'Authentication required');
      next();
    } catch (err) { next(err); }
  }
  async function signIn(res, user) {
    const token = crypto.randomBytes(32).toString('hex');
    await sessions.insertOne({ _id: tokenHash(token), userId: user.id, expiresAt: new Date(Date.now() + sessionDuration) });
    res.cookie('ledger_session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: sessionDuration });
    res.json({ user: publicUser(user) });
  }
  const route = handler => (req, res, next) => Promise.resolve().then(() => handler(req, res)).catch(next);

  app.post('/api/auth/signup', route(async (req, res) => {
    const { name, email, password } = req.body || {};
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || password.length < 8)
      return error(res, 400, 'Name, valid email and password of at least 8 characters required');
    const user = { id: `usr_${crypto.randomUUID()}`, name: name.trim(), email: email.trim().toLowerCase(), passwordHash: passwordHash(password) };
    try { await users.insertOne(user); }
    catch (err) {
      if (err.code === 11000) return error(res, 409, 'An account with this email address already exists.');
      throw err;
    }
    await workspaces.insertOne(workspace(user));
    await signIn(res, user);
  }));
  app.post('/api/auth/login', route(async (req, res) => {
    const { email, password } = req.body || {};
    const user = typeof email === 'string' ? await users.findOne({ email: email.trim().toLowerCase() }) : null;
    if (!user || typeof password !== 'string' || !passwordMatches(password, user.passwordHash)) return error(res, 401, 'Invalid email or password.');
    await signIn(res, user);
  }));
  app.post('/api/auth/demo', route(async (req, res) => {
    const user = await users.findOne({ id: demo.user.id });
    await signIn(res, user);
  }));
  app.get('/api/auth/me', requireUser, (req, res) => res.json({ user: publicUser(req.user) }));
  app.post('/api/auth/logout', requireUser, route(async (req, res) => {
    await sessions.deleteOne({ _id: tokenHash(cookieToken(req)) });
    res.clearCookie('ledger_session', { path: '/' });
    res.json({ success: true });
  }));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api', requireUser);
  app.get('/api/workspace', route(async (req, res) => res.json(responseWorkspace(await workspaces.findOne({ _id: req.user.id })))));
  app.delete('/api/workspace', route(async (req, res) => {
    const cleared = Object.fromEntries(collections.map(key => [key, []]));
    await workspaces.updateOne({ _id: req.user.id }, { $set: cleared });
    res.json(responseWorkspace(await workspaces.findOne({ _id: req.user.id })));
  }));
  app.put('/api/workspace', route(async (req, res) => {
    const input = req.body;
    if (!input || typeof input !== 'object' || Array.isArray(input) || !Array.isArray(input.clients) || !Array.isArray(input.invoices)) return error(res, 400, 'Backup requires clients and invoices arrays');
    for (const key of resources) {
      if (input[key] !== undefined && (collections.includes(key) ? !Array.isArray(input[key]) : !input[key] || typeof input[key] !== 'object' || Array.isArray(input[key]))) return error(res, 400, `Invalid ${key}`);
    }
    const updates = Object.fromEntries(resources.filter(key => input[key] !== undefined).map(key => [key, input[key]]));
    if (updates.settings) updates.settings = { ...updates.settings, id: req.user.id, email: req.user.email };
    await workspaces.updateOne({ _id: req.user.id }, { $set: updates });
    res.json(responseWorkspace(await workspaces.findOne({ _id: req.user.id })));
  }));
  for (const key of resources) {
    app.get(`/api/${key}`, route(async (req, res) => {
      const data = await workspaces.findOne({ _id: req.user.id });
      res.json(data[key]);
    }));
    app.put(`/api/${key}`, route(async (req, res) => {
      const value = req.body;
      if (collections.includes(key) ? !Array.isArray(value) : !value || typeof value !== 'object' || Array.isArray(value)) return error(res, 400, `Invalid ${key}`);
      const update = key === 'settings' ? { ...value, id: req.user.id, email: req.user.email } : value;
      await workspaces.updateOne({ _id: req.user.id }, { $set: { [key]: update } });
      if (key === 'settings' && typeof value.name === 'string' && value.name.trim()) {
        await users.updateOne({ id: req.user.id }, { $set: { name: value.name.trim() } });
      }
      res.json(update);
    }));
  }
  app.use('/api', (req, res) => error(res, 404, 'Endpoint not found'));
  app.get('/', (req, res) => res.sendFile(path.join(root, 'index.html')));
  app.get('/index.html', (req, res) => res.sendFile(path.join(root, 'index.html')));
  for (const directory of ['css', 'js', 'pages']) app.use(`/${directory}`, express.static(path.join(root, directory), { dotfiles: 'ignore' }));
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) return error(res, 400, 'Invalid JSON');
    if (err.status === 413) return error(res, 413, 'Request too large');
    console.error(err);
    error(res, 500, 'Internal server error');
  });
  return app;
}

async function startServer() {
  if (!process.env.MONGO_DB_URL) throw new Error('Set MONGO_DB_URL in .env before starting the server');
  const client = new MongoClient(process.env.MONGO_DB_URL, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB_NAME || 'freelanceledger');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ id: 1 }, { unique: true });
    await db.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    const demoUser = { id: demo.user.id, name: demo.user.name, email: demo.user.email, passwordHash: passwordHash('Password123!') };
    await db.collection('users').updateOne({ id: demoUser.id }, { $setOnInsert: demoUser }, { upsert: true });
    await db.collection('workspaces').updateOne({ _id: demoUser.id }, { $setOnInsert: workspace(demoUser, true) }, { upsert: true });
    const app = createApp(db);
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => console.log(`FreelanceLedger running at http://localhost:${port}`));
    return { client, server };
  } catch (err) { await client.close(); throw err; }
}
if (require.main === module) startServer().catch(err => { console.error('Unable to start MongoDB-backed server:', err); process.exitCode = 1; });
module.exports = { createApp, startServer };
