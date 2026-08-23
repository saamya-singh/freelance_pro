/* ============================================================
   UTILITY HELPER FUNCTIONS - CURRENCY, DATES, IDS & BADGES
   ============================================================ */

const Utils = {
  // Format numbers to Indian Rupee (en-IN) format e.g. ₹4,82,500
  formatCurrency(amount, currency = 'INR', decimals = 0) {
    const numeric = Number(amount) || 0;
    if (currency === 'INR') {
      const formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
      }).format(numeric);
      return `₹${formatted}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(numeric);
  },

  // Format ISO Date String to human readable format (e.g. "15 Feb 2026")
  formatDate(dateString, style = 'medium') {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    if (style === 'iso') {
      return date.toISOString().split('T')[0];
    }

    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  },

  // Format Status Badge HTML
  formatStatusBadge(status) {
    const s = (status || 'draft').toLowerCase();
    if (s === 'paid') {
      return `<span class="px-3 py-1 bg-lime-400 text-slate-950 text-[10px] font-extrabold rounded-full uppercase shadow-sm">PAID</span>`;
    }
    if (s === 'sent') {
      return `<span class="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold rounded-full uppercase border border-blue-200 dark:border-blue-800">SENT</span>`;
    }
    if (s === 'overdue') {
      return `<span class="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-600 text-[10px] font-extrabold rounded-full uppercase border border-red-200 dark:border-red-900">OVERDUE</span>`;
    }
    return `<span class="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold rounded-full uppercase">DRAFT</span>`;
  },

  // Relative Time Ago e.g. "2 hours ago", "Just now"
  timeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return Utils.formatDate(dateString);
  },

  // Unique ID generator with prefix
  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  },

  // Parse URL search parameters (e.g. ?id=123 -> { id: '123' })
  getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    if (!queryString) return params;
    const pairs = queryString.split('&');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return params;
  },

  // Capitalize first letter
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Escape HTML string to prevent XSS
  escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
