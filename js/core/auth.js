/* ============================================================
   AUTHENTICATION & SESSION MANAGEMENT SYSTEM WITH USER ISOLATION
   ============================================================ */

const Auth = {
  // Get active session user
  getCurrentUser() {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  // Check if current user is logged in
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  // Login with Email & Password
  login(email, password, rememberMe = true) {
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersStr ? JSON.parse(usersStr) : [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'No account found with this email address.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    // Set session state
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    StorageManager.logActivity('user_login', 'User Login', `${user.name} logged in successfully.`);
    return { success: true, user: sessionUser };
  },

  // Register New User — Starts with EMPTY isolated workspace!
  signup(name, email, password) {
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersStr ? JSON.parse(usersStr) : [];
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUserId = Utils.generateId('usr');
    const newUser = {
      id: newUserId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Initialize clean, empty isolated workspace for new user
    StorageManager.initNewUserData(newUserId, name.trim(), email.trim().toLowerCase());

    // Auto login
    return this.login(email, password);
  },

  // Instant Demo Login — Isolated to Demo User account
  demoLogin() {
    StorageManager.seedDemoUserData(DEMO_DATA.user.id);
    return this.login(DEMO_DATA.user.email, "Password123!");
  },

  // Logout current session
  logout() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      StorageManager.logActivity('user_logout', 'User Logout', `${currentUser.name} logged out.`);
    }
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    
    // Redirect to Landing page (index.html)
    const isSubfolder = window.location.pathname.includes('/pages/');
    window.location.href = isSubfolder ? '../index.html' : 'index.html';
  },

  // Auth Guard: Enforce access control across all pages
  checkAuthGuard() {
    const rawPath = window.location.pathname;
    const isSubfolder = rawPath.includes('/pages/');
    const filename = rawPath.split('/').pop().split('?')[0].split('#')[0] || 'index.html';
    const loggedIn = this.isAuthenticated();

    // Protected application routes
    const protectedPages = [
      'dashboard.html',
      'clients.html',
      'client-detail.html',
      'work.html',
      'invoices.html',
      'invoice-detail.html',
      'tax.html',
      'tax-settings.html',
      'settings.html'
    ];

    // If trying to access a protected dashboard page without being logged in, redirect to login
    if (!loggedIn && protectedPages.includes(filename)) {
      console.warn("Unauthenticated access attempt. Redirecting to Login.");
      window.location.href = isSubfolder ? 'login.html' : 'pages/login.html';
    }
  }
};

// Execute Auth Guard check on DOMReady
document.addEventListener('DOMContentLoaded', () => {
  Auth.checkAuthGuard();
});
