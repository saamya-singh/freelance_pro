/* ============================================================
   USER-ISOLATED LOCAL STORAGE MANAGER & REPOSITORY WRAPPER
   ============================================================ */

const STORAGE_KEYS = {
  USERS: 'freelanceledger_users',
  SESSION: 'freelanceledger_session',
  CLIENTS: 'freelanceledger_clients',
  WORK: 'freelanceledger_work',
  INVOICES: 'freelanceledger_invoices',
  PAYMENTS: 'freelanceledger_payments',
  TAX_SETTINGS: 'freelanceledger_tax_settings',
  TAX_CALCULATION: 'freelanceledger_tax_calculation',
  SETTINGS: 'freelanceledger_settings',
  ACTIVITIES: 'freelanceledger_activities'
};

const StorageManager = {
  // Get active logged-in user ID
  getActiveUserId() {
    try {
      const sessionStr = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!sessionStr) return 'guest';
      const session = JSON.parse(sessionStr);
      return session && session.id ? session.id : 'guest';
    } catch (e) {
      return 'guest';
    }
  },

  // Get user-scoped storage key e.g. "freelanceledger_usr_101_clients"
  getUserKey(baseKey) {
    // Users list and active session are global
    if (baseKey === STORAGE_KEYS.USERS || baseKey === STORAGE_KEYS.SESSION) {
      return baseKey;
    }
    const userId = this.getActiveUserId();
    const cleanKey = baseKey.replace('freelanceledger_', '');
    return `freelanceledger_${userId}_${cleanKey}`;
  },

  // Safe getItem wrapper
  getItem(key, defaultValue = null) {
    try {
      const actualKey = this.getUserKey(key);
      const item = localStorage.getItem(actualKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.error(`Error reading ${key} from localStorage:`, err);
      return defaultValue;
    }
  },

  // Safe setItem wrapper
  setItem(key, value) {
    try {
      const actualKey = this.getUserKey(key);
      localStorage.setItem(actualKey, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Error writing ${key} to localStorage:`, err);
      return false;
    }
  },

  // Safe removeItem wrapper
  removeItem(key) {
    try {
      const actualKey = this.getUserKey(key);
      localStorage.removeItem(actualKey);
      return true;
    } catch (err) {
      console.error(`Error removing ${key} from localStorage:`, err);
      return false;
    }
  },

  // Initialize storage state on app launch
  init() {
    // Ensure users array exists
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
        {
          id: DEMO_DATA.user.id,
          name: DEMO_DATA.user.name,
          email: DEMO_DATA.user.email,
          password: "Password123!"
        }
      ]));
    }

    // Ensure demo user data is loaded under demo user ID namespace
    const demoUserKey = `freelanceledger_${DEMO_DATA.user.id}_clients`;
    if (!localStorage.getItem(demoUserKey)) {
      this.seedDemoUserData(DEMO_DATA.user.id);
    }
  },

  // Seed rich demo data for Demo User account only
  seedDemoUserData(userId) {
    if (typeof DEMO_DATA === 'undefined') return;

    localStorage.setItem(`freelanceledger_${userId}_clients`, JSON.stringify(DEMO_DATA.clients));
    localStorage.setItem(`freelanceledger_${userId}_work`, JSON.stringify(DEMO_DATA.work));
    localStorage.setItem(`freelanceledger_${userId}_invoices`, JSON.stringify(DEMO_DATA.invoices));
    localStorage.setItem(`freelanceledger_${userId}_payments`, JSON.stringify(DEMO_DATA.payments));
    localStorage.setItem(`freelanceledger_${userId}_activities`, JSON.stringify(DEMO_DATA.activities));
    localStorage.setItem(`freelanceledger_${userId}_settings`, JSON.stringify(DEMO_DATA.user));
    
    if (typeof DEFAULT_TAX_CONFIG !== 'undefined') {
      localStorage.setItem(`freelanceledger_${userId}_tax_settings`, JSON.stringify(DEFAULT_TAX_CONFIG));
    }
  },

  // Initialize a NEW user account with clean empty workspace
  initNewUserData(userId, name, email) {
    const defaultSettings = {
      id: userId,
      name: name,
      email: email,
      phone: "",
      country: "India",
      businessName: `${name} Consulting`,
      gstin: "",
      pan: "",
      address: "",
      currency: "INR",
      dateFormat: "DD/MM/YYYY",
      invoicePrefix: "INV-2026-",
      paymentTerms: "15 Days"
    };

    localStorage.setItem(`freelanceledger_${userId}_clients`, JSON.stringify([]));
    localStorage.setItem(`freelanceledger_${userId}_work`, JSON.stringify([]));
    localStorage.setItem(`freelanceledger_${userId}_invoices`, JSON.stringify([]));
    localStorage.setItem(`freelanceledger_${userId}_payments`, JSON.stringify([]));
    localStorage.setItem(`freelanceledger_${userId}_activities`, JSON.stringify([
      {
        id: "act_init",
        type: "account_created",
        title: "Account Created",
        description: `Welcome to FreelanceLedger, ${name}! Your workspace is ready.`,
        timestamp: new Date().toISOString()
      }
    ]));
    localStorage.setItem(`freelanceledger_${userId}_settings`, JSON.stringify(defaultSettings));
    
    if (typeof DEFAULT_TAX_CONFIG !== 'undefined') {
      localStorage.setItem(`freelanceledger_${userId}_tax_settings`, JSON.stringify(DEFAULT_TAX_CONFIG));
    }
  },

  // Export full JSON backup for currently logged-in user
  exportBackup() {
    const backup = {
      exportDate: new Date().toISOString(),
      userId: this.getActiveUserId(),
      version: "1.0.0",
      clients: this.getItem(STORAGE_KEYS.CLIENTS, []),
      work: this.getItem(STORAGE_KEYS.WORK, []),
      invoices: this.getItem(STORAGE_KEYS.INVOICES, []),
      payments: this.getItem(STORAGE_KEYS.PAYMENTS, []),
      taxSettings: this.getItem(STORAGE_KEYS.TAX_SETTINGS, null),
      taxCalculation: this.getItem(STORAGE_KEYS.TAX_CALCULATION, null),
      settings: this.getItem(STORAGE_KEYS.SETTINGS, null),
      activities: this.getItem(STORAGE_KEYS.ACTIVITIES, [])
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import JSON backup into active user's workspace
  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.clients || !data.invoices) {
        throw new Error("Invalid backup JSON structure.");
      }
      if (data.clients) this.setItem(STORAGE_KEYS.CLIENTS, data.clients);
      if (data.work) this.setItem(STORAGE_KEYS.WORK, data.work);
      if (data.invoices) this.setItem(STORAGE_KEYS.INVOICES, data.invoices);
      if (data.payments) this.setItem(STORAGE_KEYS.PAYMENTS, data.payments);
      if (data.taxSettings) this.setItem(STORAGE_KEYS.TAX_SETTINGS, data.taxSettings);
      if (data.taxCalculation) this.setItem(STORAGE_KEYS.TAX_CALCULATION, data.taxCalculation);
      if (data.settings) this.setItem(STORAGE_KEYS.SETTINGS, data.settings);
      if (data.activities) this.setItem(STORAGE_KEYS.ACTIVITIES, data.activities);
      return true;
    } catch (err) {
      console.error("Import backup error:", err);
      return false;
    }
  },

  // Clear workspace data for current user only
  clearWorkspace() {
    this.setItem(STORAGE_KEYS.CLIENTS, []);
    this.setItem(STORAGE_KEYS.WORK, []);
    this.setItem(STORAGE_KEYS.INVOICES, []);
    this.setItem(STORAGE_KEYS.PAYMENTS, []);
    this.setItem(STORAGE_KEYS.ACTIVITIES, []);
  },

  // Activity Log helper
  logActivity(type, title, description) {
    const activities = this.getItem(STORAGE_KEYS.ACTIVITIES, []);
    const newAct = {
      id: "act_" + Date.now(),
      type,
      title,
      description,
      timestamp: new Date().toISOString()
    };
    activities.unshift(newAct);
    if (activities.length > 50) activities.pop();
    this.setItem(STORAGE_KEYS.ACTIVITIES, activities);
  }
};

// Automatically initialize storage
StorageManager.init();
