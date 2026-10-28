/* ============================================================
   TAILWIND HEADER COMPONENT — FREELANCER.OS
   ============================================================ */

const Header = {
  init() {
    const headerEl = document.getElementById('app-header');
    if (!headerEl) return;

    const user = Auth.getCurrentUser() || { name: 'Ankit', email: 'user@freelancedger.in' };
    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    headerEl.className = "h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-6 flex items-center justify-between transition-colors duration-200";

    headerEl.innerHTML = `
      <div class="flex items-center gap-4">
        <!-- Mobile Menu Toggle -->
        <button id="mobile-menu-btn" class="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>

        <!-- Breadcrumb & Route Name -->
        <div class="flex items-center gap-2 text-sm font-semibold text-slate-400 dark:text-slate-500">
          <span>FREELANCER.OS</span>
          <span>/</span>
          <span class="text-slate-900 dark:text-slate-100 font-bold capitalize">${Router.getCurrentRoute().replace('-', ' ')}</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Command Palette Trigger -->
        <button id="global-search-btn" class="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold transition-all">
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <span>Search invoices, clients, work...</span>
          <kbd class="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono text-slate-500">⌘K</kbd>
        </button>

        <!-- Notification Bell -->
        <button id="notification-bell-btn" class="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-all" title="Notifications">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          <span class="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        <!-- Aesthetic Theme Toggle Button -->
        <button class="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full theme-toggle-btn transition-all" id="header-theme-toggle" title="Toggle Light/Dark Theme">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
        </button>

        <!-- User Avatar Capsule -->
        <div class="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-blue-500/20">
            ${initials}
          </div>
        </div>
      </div>
    `;

    const searchBtn = headerEl.querySelector('#global-search-btn');
    if (searchBtn) {
      searchBtn.onclick = () => {
        if (typeof CommandPalette !== 'undefined') CommandPalette.toggle();
      };
    }

    const themeToggleBtn = headerEl.querySelector('#header-theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.onclick = () => ThemeManager.toggle();
    }

    ThemeManager.updateToggleIcons(ThemeManager.getTheme());
  }
};
