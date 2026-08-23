/* ============================================================
   CLIENT-SIDE ROUTING & RELATIVE PATH HELPER
   ============================================================ */

const Router = {
  // Get active route identifier e.g. 'dashboard', 'clients', 'invoices'
  getCurrentRoute() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    
    if (filename === 'index.html' || filename === '') return 'landing';
    return filename.replace('.html', '');
  },

  // Navigate to target page with relative path awareness
  navigate(page, params = {}) {
    const isSubfolder = window.location.pathname.includes('/pages/');
    let target = '';

    if (page === 'landing' || page === 'index') {
      target = isSubfolder ? '../index.html' : 'index.html';
    } else {
      target = isSubfolder ? `${page}.html` : `pages/${page}.html`;
    }

    const queryStr = Object.keys(params).length > 0 
      ? '?' + new URLSearchParams(params).toString() 
      : '';

    window.location.href = target + queryStr;
  }
};
