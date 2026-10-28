const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../server');

// Minimal MongoDB collection double; production uses the MongoDB driver.
function memoryDb() {
  const tables = new Map();
  const matches = (doc, filter) => Object.entries(filter).every(([key, value]) => {
    if (value && typeof value === 'object' && '$gt' in value) return doc[key] > value.$gt;
    return doc[key] === value;
  });
  return {
    collection(name) {
      if (!tables.has(name)) tables.set(name, []);
      const rows = tables.get(name);
      return {
        async findOne(filter) { return structuredClone(rows.find(row => matches(row, filter)) || null); },
        async insertOne(doc) {
          if (rows.some(row => (doc._id && row._id === doc._id) || (name === 'users' && row.email === doc.email))) {
            const err = new Error('Duplicate key'); err.code = 11000; throw err;
          }
          rows.push(structuredClone(doc));
        },
        async updateOne(filter, update) {
          const row = rows.find(item => matches(item, filter));
          assert.ok(row, `Missing ${name} record`);
          Object.assign(row, structuredClone(update.$set));
        },
        async deleteOne(filter) {
          const index = rows.findIndex(item => matches(item, filter));
          if (index >= 0) rows.splice(index, 1);
        }
      };
    }
  };
}

test('Mongo-backed API isolates users, survives app recreation, and protects account identity', async () => {
  const db = memoryDb();
  const server = createApp(db).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = async (url, options = {}, cookie = '') => {
    const res = await fetch(`${base}${url}`, { ...options, headers: { 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}), ...options.headers } });
    return { status: res.status, body: await res.text(), cookie: res.headers.get('set-cookie')?.split(';')[0] };
  };
  try {
    assert.equal((await request('/api/clients')).status, 401);
    assert.equal((await request('/api/health')).status, 200);
    assert.equal((await request('/pages/dashboard.html')).status, 200);
    assert.equal((await request('/.env')).status, 404);
    assert.equal((await request('/server.js')).status, 404);
    const signup = await request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name: 'Test User', email: 'TEST@example.com', password: 'Secret123!' }) });
    assert.equal(signup.status, 200);
    const cookie = signup.cookie;
    assert.ok(cookie?.startsWith('ledger_session='));
    const clients = [{ id: 'cli_test', name: 'Test Client' }];
    assert.equal((await request('/api/clients', { method: 'PUT', body: JSON.stringify(clients) }, cookie)).status, 200);
    assert.deepEqual((await db.collection('workspaces').findOne({ _id: JSON.parse(signup.body).user.id })).clients, clients);
    assert.equal((await request('/api/invoices', { method: 'PUT', body: '{}' }, cookie)).status, 400);
    assert.equal((await request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name: 'Again', email: 'test@example.com', password: 'Secret123!' }) })).status, 409);
    assert.equal((await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'test@example.com', password: 'wrong' }) })).status, 401);
    const second = await request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name: 'Other User', email: 'other@example.com', password: 'Secret123!' }) });
    assert.deepEqual(JSON.parse((await request('/api/clients', {}, second.cookie)).body), []);
    assert.deepEqual(JSON.parse((await request('/api/clients', {}, cookie)).body), clients);
    assert.equal((await request('/api/workspace', { method: 'PUT', body: JSON.stringify({ clients: [], invoices: [], settings: { email: 'steal@example.com', id: 'wrong' } }) }, cookie)).status, 200);
    assert.equal(JSON.parse((await request('/api/settings', {}, cookie)).body).email, 'test@example.com');
    assert.equal(JSON.parse((await request('/api/settings', {}, cookie)).body).id, JSON.parse(signup.body).user.id);
    const login = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'test@example.com', password: 'Secret123!' }) });
    assert.equal(login.status, 200);
    const secondServer = createApp(db).listen(0);
    try {
      const res = await fetch(`http://127.0.0.1:${secondServer.address().port}/api/clients`, { headers: { cookie: login.cookie } });
      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), []);
    } finally { secondServer.close(); }
    assert.equal((await request('/api/auth/logout', { method: 'POST' }, cookie)).status, 200);
    assert.equal((await request('/api/clients', {}, cookie)).status, 401);
  } finally { server.close(); }
});
