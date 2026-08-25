/* ============================================================
   THEME MANAGER — DEFAULT LIGHT MODE ENGINE
   ============================================================ */

const ThemeManager = {
  STORAGE_KEY: 'freelanceledger_theme',

  init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    // Explicitly default to Light Mode unless user saved 'dark' preference
    const theme = savedTheme === 'dark' ? 'dark' : 'light';

    this.setTheme(theme, false);

    // Bind event listeners to all theme toggle buttons on DOMReady
    document.addEventListener('DOMContentLoaded', () => {
      this.bindToggleButtons();
    });
  },

  bindToggleButtons() {
    const btns = document.querySelectorAll('.theme-toggle-btn');
    btns.forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = "true";
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggle();
        });
      }
    });
    this.updateToggleIcons(this.getTheme());
  },

  getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  },

  setTheme(theme, notify = true) {
    const activeTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem(this.STORAGE_KEY, activeTheme);

    this.updateToggleIcons(activeTheme);

    if (notify && typeof Toast !== 'undefined') {
      Toast.info(`Switched to ${activeTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    }

    if (typeof Charts !== 'undefined' && typeof renderDashboard === 'function') {
      try { renderDashboard(); } catch (e) {}
    }
  },

  toggle() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next, true);
  },

  updateToggleIcons(theme) {
    const btns = document.querySelectorAll('.theme-toggle-btn');
    btns.forEach(btn => {
      const isDark = theme === 'dark';
      btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.innerHTML = isDark ? `
        <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      ` : `
        <svg class="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      `;
    });
  }
};

// Initialize theme immediately on script load
ThemeManager.init();
