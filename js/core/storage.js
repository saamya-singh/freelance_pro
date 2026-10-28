/* Server-backed workspace cache. Protected pages render after ledger-ready. */
const STORAGE_KEYS = {
  SESSION: 'session', CLIENTS: 'clients', WORK: 'work', INVOICES: 'invoices',
  PAYMENTS: 'payments', TAX_SETTINGS: 'taxSettings', SETTINGS: 'settings', ACTIVITIES: 'activities'
};

const StorageManager = {
  cache: {},
  queue: Promise.resolve(),
  async request(url, options = {}) {
    const response = await fetch(url, {
      credentials: 'same-origin',
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Server request failed');
    return data;
  },
  getActiveUserId() { return Auth.getCurrentUser()?.id || 'guest'; },
  getItem(key, fallback = null) {
    if (key === STORAGE_KEYS.SESSION) return Auth.getCurrentUser() || fallback;
    return this.cache[key] === undefined ? fallback : this.cache[key];
  },
  save(key, value) {
    this.queue = this.queue.catch(() => {}).then(() => this.request(`/api/${key}`, {
      method: 'PUT', body: JSON.stringify(value)
    })).catch(err => { console.error('Unable to save workspace:', err); Toast.error('Could not save changes. Please retry.'); });
    return this.queue;
  },
  setItem(key, value) {
    if (key === STORAGE_KEYS.SESSION) { Auth.currentUser = value; return true; }
    this.cache[key] = value;
    this.save(key, value);
    return true;
  },
  exportBackup() {
    return JSON.stringify({ exportDate: new Date().toISOString(), userId: this.getActiveUserId(), version: '1.0.0', ...this.cache }, null, 2);
  },
  async importBackup(json) {
    try {
      const backup = JSON.parse(json);
      await this.queue;
      this.cache = await this.request('/api/workspace', { method: 'PUT', body: JSON.stringify(backup) });
      return true;
    } catch (err) { console.error('Import failed:', err); return false; }
  },
  async clearWorkspace() {
    await this.queue;
    this.cache = await this.request('/api/workspace', { method: 'DELETE' });
  },
  logActivity(type, title, description) {
    const activities = this.getItem(STORAGE_KEYS.ACTIVITIES, []);
    activities.unshift({ id: `act_${Date.now()}`, type, title, description, timestamp: new Date().toISOString() });
    if (activities.length > 50) activities.pop();
    this.setItem(STORAGE_KEYS.ACTIVITIES, activities);
  },
  async init() {
    const filename = location.pathname.split('/').pop();
    const protectedPages = ['dashboard.html', 'clients.html', 'client-detail.html', 'work.html', 'invoices.html', 'invoice-detail.html', 'tax.html', 'tax-settings.html', 'settings.html'];
    if (!protectedPages.includes(filename)) return;
    try {
      const { user } = await this.request('/api/auth/me');
      Auth.currentUser = user;
      this.cache = await this.request('/api/workspace');
      document.dispatchEvent(new Event('ledger-ready'));
    } catch (err) {
      if (err.message === 'Authentication required') location.replace('login.html');
      else { console.error('Failed to load workspace:', err); Toast.error('Could not load workspace. Please refresh.'); }
    }
  }
};
document.addEventListener('DOMContentLoaded', () => StorageManager.init());
