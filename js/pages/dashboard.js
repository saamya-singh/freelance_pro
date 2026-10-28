/* ============================================================
   DYNAMIC DASHBOARD CONTROLLER
   ============================================================ */

document.addEventListener('ledger-ready', () => {
  renderDashboard();
});

function renderDashboard() {
  const user = Auth.getCurrentUser();
  const greetingEl = document.getElementById('user-greeting-name');
  if (greetingEl && user) {
    greetingEl.textContent = user.name;
  }

  // Calculate Metrics from active User Storage
  const invoices = AppState.getInvoices();
  const workEntries = AppState.getWorkEntries();
  const activities = AppState.getActivities();

  let totalRevenue = 0;
  let totalOutstanding = 0;
  let unpaidCount = 0;

  invoices.forEach(inv => {
    const total = Number(inv.total) || 0;
    if (inv.status === 'paid') {
      totalRevenue += total;
    } else if (inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'draft') {
      totalOutstanding += total;
      unpaidCount++;
    }
  });

  // Render KPI values
  const revEl = document.getElementById('dash-revenue');
  if (revEl) revEl.textContent = Utils.formatCurrency(totalRevenue);

  const outEl = document.getElementById('dash-outstanding');
  if (outEl) outEl.textContent = Utils.formatCurrency(totalOutstanding);

  const unpaidCountEl = document.getElementById('dash-unpaid-subtext');
  if (unpaidCountEl) {
    unpaidCountEl.textContent = unpaidCount > 0 
      ? `${unpaidCount} unpaid invoice${unpaidCount > 1 ? 's' : ''} need attention` 
      : 'No unpaid invoices pending';
  }

  // Tax Engine Integration
  const taxConfig = StorageManager.getItem(STORAGE_KEYS.TAX_SETTINGS, DEFAULT_TAX_CONFIG);
  const taxCalc = TaxEngine.calculateTax({
    annualRevenue: totalRevenue,
    allowableExpenses: totalRevenue * 0.2, // Default 20% expense provision
    otherIncome: 0,
    regime: taxConfig ? taxConfig.defaultRegime : 'new'
  });

  const taxEl = document.getElementById('dash-tax');
  if (taxEl) taxEl.textContent = Utils.formatCurrency(taxCalc.totalTaxLiability);

  const netEl = document.getElementById('dash-net');
  if (netEl) netEl.textContent = Utils.formatCurrency(taxCalc.netTakeHome);

  // Render SVG Revenue Chart
  if (typeof Charts !== 'undefined') {
    Charts.renderRevenueChart('revenue-chart-container', '30d');
  }

  // Render Dynamic Recent Invoices List (No hardcoded sample invoices!)
  renderRecentInvoices(invoices);

  // Render Dynamic Recent Activities
  renderRecentActivities(activities);
}

function renderRecentInvoices(invoices) {
  const container = document.getElementById('recent-invoices-list');
  if (!container) return;

  if (!invoices || invoices.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-semibold">
        No recent invoices created yet.
      </div>
    `;
    return;
  }

  const recent = invoices.slice(0, 5);
  let html = '';

  recent.forEach(inv => {
    const client = AppState.getClientById(inv.clientId);
    const clientName = client ? client.name : 'Client';
    const statusBadge = Utils.formatStatusBadge(inv.status);

    html += `
      <div class="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/80 transition-colors cursor-pointer" onclick="window.location.href='invoice-detail.html?id=${inv.id}'">
        <div class="flex items-center gap-3">
          ${statusBadge}
          <div>
            <div class="font-bold text-sm text-slate-900 dark:text-slate-100">${Utils.escapeHtml(clientName)}</div>
            <div class="text-[11px] text-slate-400 font-mono">${inv.number}</div>
          </div>
        </div>
        <div class="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-mono">${Utils.formatCurrency(inv.total)}</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderRecentActivities(activities) {
  const container = document.getElementById('recent-activity-list');
  if (!container) return;

  if (!activities || activities.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-semibold">
        No activity recorded yet.
      </div>
    `;
    return;
  }

  const recent = activities.slice(0, 5);
  let html = '';

  recent.forEach(act => {
    html += `
      <div class="flex items-start gap-3 text-xs">
        <div class="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
        <div>
          <div class="font-bold text-slate-900 dark:text-slate-100">${Utils.escapeHtml(act.description || act.title)}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${Utils.formatDate(act.timestamp)}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}
