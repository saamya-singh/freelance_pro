/* ============================================================
   GLOBAL APPLICATION BOOTSTRAP & MAIN INITIALIZER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  console.log("FreelanceLedger India initializing...");

  // Initialize Global UI Components if on authenticated pages
  if (Auth.isAuthenticated()) {
    if (typeof Sidebar !== 'undefined') Sidebar.init();
    if (typeof Header !== 'undefined') Header.init();
    if (typeof CommandPalette !== 'undefined') CommandPalette.init();
    if (typeof ConfirmDialog !== 'undefined') ConfirmDialog.init();
  }

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (typeof CommandPalette !== 'undefined') {
        CommandPalette.toggle();
      }
    }
  });
});
