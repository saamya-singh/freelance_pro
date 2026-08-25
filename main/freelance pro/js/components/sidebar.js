/* ============================================================
   TAILWIND SIDEBAR COMPONENT — FREELANCEPRO
   ============================================================ */

const Sidebar = {
  init() {
    const sidebarEl = document.getElementById('app-sidebar');
    if (!sidebarEl) return;

    const currentRoute = Router.getCurrentRoute();
    const user = Auth.getCurrentUser() || { name: 'Ankit', email: 'ankit@freelancedger.in' };
    const isSubfolder = window.location.pathname.includes('/pages/');

    const navItems = [
      { route: 'dashboard', label: 'Dashboard', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>' },
      { route: 'clients', label: 'Clients', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>' },
      { route: 'work', label: 'Work Entries', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
      { route: 'invoices', label: 'Invoices', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>' },
      { route: 'tax', label: 'Tax Calculator', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>' },
      { route: 'settings', label: 'Settings', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>' }
    ];

    let navHtml = `
      <aside class="w-[250px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen fixed top-0 left-0 flex flex-col z-50 transition-colors duration-200">
        <!-- Sidebar Brand Logo Header -->
        <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <a href="${isSubfolder ? 'dashboard.html' : 'pages/dashboard.html'}" class="flex items-center gap-3">
            <svg class="w-8 h-8" viewBox="0 0 100 100" fill="none">
              <path d="M20 20 H60 V35 H35 V45 H55 V60 H35 V80 H20 Z" fill="#2563EB"/>
              <path d="M45 45 H80 V60 H60 V80 H45 Z" fill="#84CC16"/>
            </svg>
            <div>
              <div class="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">FREELANCE<span class="text-blue-600">PRO</span></div>
              <div class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase">INDIA EDITION</div>
            </div>
          </a>
        </div>

        <!-- Navigation Menu Links -->
        <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto">
    `;

    navItems.forEach(item => {
      const isActive = currentRoute === item.route || (currentRoute === 'client-detail' && item.route === 'clients') || (currentRoute === 'invoice-detail' && item.route === 'invoices');
      const href = isSubfolder ? `${item.route}.html` : `pages/${item.route}.html`;

      navHtml += `
        <a href="${href}" class="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-bold transition-all ${
          isActive 
            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-2 border-slate-900 dark:border-blue-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
        }">
          <svg class="w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${item.icon}</svg>
          <span>${item.label}</span>
        </a>
      `;
    });

    navHtml += `
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">${Utils.escapeHtml(user.name)}</div>
            <div class="text-[11px] text-slate-500 truncate">${Utils.escapeHtml(user.email)}</div>
          </div>
          <div class="flex items-center gap-1">
            <button class="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 theme-toggle-btn rounded-full hover:bg-slate-200 dark:hover:bg-slate-800" title="Toggle Theme">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            </button>
            <button id="logout-btn" class="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-950/40" title="Logout">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </div>
      </aside>
    `;

    sidebarEl.innerHTML = navHtml;

    sidebarEl.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.onclick = () => ThemeManager.toggle();
    });

    const logoutBtn = sidebarEl.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        ConfirmDialog.show(
          'Confirm Logout',
          'Are you sure you want to log out of FreelancePro?',
          'Log Out',
          () => Auth.logout(),
          false
        );
      };
    }

    ThemeManager.updateToggleIcons(ThemeManager.getTheme());
  }
};
