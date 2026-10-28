/* Account authentication uses an HttpOnly, server-managed session cookie. */
const Auth = {
  currentUser: null,
  getCurrentUser() { return this.currentUser; },
  isAuthenticated() { return !!this.currentUser; },
  async login(email, password) {
    try {
      const { user } = await StorageManager.request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      this.currentUser = user;
      return { success: true, user };
    } catch (err) { return { success: false, message: err.message }; }
  },
  async signup(name, email, password) {
    try {
      const { user } = await StorageManager.request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
      this.currentUser = user;
      return { success: true, user };
    } catch (err) { return { success: false, message: err.message }; }
  },
  async demoLogin() {
    try {
      const { user } = await StorageManager.request('/api/auth/demo', { method: 'POST' });
      this.currentUser = user;
      return { success: true, user };
    } catch (err) { return { success: false, message: err.message }; }
  },
  async logout() {
    try {
      await StorageManager.queue;
      await StorageManager.request('/api/auth/logout', { method: 'POST' });
    }
    catch (err) { console.error('Logout failed:', err); Toast.error('Could not log out. Please retry.'); return; }
    this.currentUser = null;
    location.href = location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
  }
};
