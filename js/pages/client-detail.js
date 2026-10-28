/* ============================================================
   CLIENT DETAIL VIEW SCRIPT
   ============================================================ */

document.addEventListener('ledger-ready', () => {
  const params = Utils.getQueryParams();
  const clientId = params.id;

  if (!clientId) {
    Toast.error("No client ID provided.");
    Router.navigate('clients');
    return;
  }

  renderClientDetail(clientId);
});

function renderClientDetail(clientId) {
  const clients = AppState.getClients();
  const client = clients.find(c => c.id === clientId);

  if (!client) {
    Toast.error("Client record not found.");
    Router.navigate('clients');
    return;
  }

  // Calculate aggregates
  const allInvoices = AppState.getInvoices();
  const clientInvoices = allInvoices.filter(inv => inv.clientId === clientId);
  
  const allWork = AppState.getWork();
  const clientWork = allWork.filter(w => w.clientId === clientId);

  let totalRevenue = 0;
  let totalOutstanding = 0;

  clientInvoices.forEach(inv => {
    const total = Number(inv.total) || 0;
    if (inv.status === 'paid') totalRevenue += total;
    else if (inv.status === 'sent' || inv.status === 'overdue') totalOutstanding += total;
  });

  let totalHours = 0;
  clientWork.forEach(w => totalHours += (Number(w.hours) || 0));

  // Render Header Profile Card
  const profileContainer = document.getElementById('client-detail-header-card');
  if (profileContainer) {
    profileContainer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%;">
        <div>
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.25rem;">
            <h1 style="font-size:2rem; font-weight:800;">${Utils.escapeHtml(client.name)}</h1>
            <span class="badge ${client.status === 'active' ? 'badge-success' : 'badge-draft'}">${client.status}</span>
          </div>
          <p style="font-size:1rem; color:var(--text-secondary); margin-bottom:1rem;">${Utils.escapeHtml(client.company || 'Individual Client')} &bull; ${Utils.escapeHtml(client.email)}</p>

          <div style="display:flex; gap:1.5rem; font-size:0.85rem; color:var(--text-secondary);">
            <div><strong>Phone:</strong> ${Utils.escapeHtml(client.phone || 'N/A')}</div>
            <div><strong>Country:</strong> ${Utils.escapeHtml(client.country || 'India')}</div>
            <div><strong>GSTIN:</strong> <span class="text-mono">${Utils.escapeHtml(client.gstin || 'N/A')}</span></div>
            <div><strong>PAN:</strong> <span class="text-mono">${Utils.escapeHtml(client.pan || 'N/A')}</span></div>
          </div>
        </div>

        <div style="display:flex; gap:0.75rem;">
          <button class="btn btn-secondary" id="client-add-work-btn">+ Add Work</button>
          <button class="btn btn-primary" id="client-create-inv-btn">+ Create Invoice</button>
        </div>
      </div>
    `;

    document.getElementById('client-add-work-btn').onclick = () => {
      Router.navigate('work', { clientId: client.id });
    };

    document.getElementById('client-create-inv-btn').onclick = () => {
      Router.navigate('invoices', { clientId: client.id, action: 'create' });
    };
  }

  // Render Aggregate Financial Metrics Cards
  const kpiContainer = document.getElementById('client-detail-kpis');
  if (kpiContainer) {
    kpiContainer.innerHTML = `
      <div class="metric-card revenue">
        <div class="metric-title">Total Revenue</div>
        <div class="metric-value">${Utils.formatCurrency(totalRevenue)}</div>
        <div class="metric-sub">Paid invoices to date</div>
      </div>
      <div class="metric-card outstanding">
        <div class="metric-title">Outstanding Balance</div>
        <div class="metric-value">${Utils.formatCurrency(totalOutstanding)}</div>
        <div class="metric-sub">Unpaid sent invoices</div>
      </div>
      <div class="metric-card net">
        <div class="metric-title">Invoices Count</div>
        <div class="metric-value">${clientInvoices.length}</div>
        <div class="metric-sub">Total invoices generated</div>
      </div>
      <div class="metric-card tax">
        <div class="metric-title">Work Hours Logged</div>
        <div class="metric-value">${totalHours.toFixed(1)} hrs</div>
        <div class="metric-sub">Billable & unbilled work</div>
      </div>
    `;
  }

  // Render Linked Work Entries
  DataTable.render('client-work-table-container', {
    data: clientWork,
    emptyTitle: 'No work logged for this client',
    emptyDesc: 'Log billable hours to generate invoices for this client.',
    columns: [
      { header: 'Date', render: (w) => Utils.formatDate(w.date) },
      { header: 'Project', key: 'project' },
      { header: 'Description', key: 'description' },
      { header: 'Hours', render: (w) => `${w.hours} hrs` },
      { header: 'Amount', render: (w) => `<span style="font-weight:700;">${Utils.formatCurrency(w.amount)}</span>` },
      { header: 'Status', render: (w) => `<span class="badge ${w.status === 'invoiced' ? 'badge-info' : 'badge-warning'}">${w.status}</span>` }
    ]
  });

  // Render Linked Invoices
  DataTable.render('client-invoices-table-container', {
    data: clientInvoices,
    emptyTitle: 'No invoices issued for this client',
    emptyDesc: 'Create an invoice to bill this client.',
    onRowClick: (inv) => Router.navigate('invoice-detail', { id: inv.id }),
    columns: [
      { header: 'Invoice #', render: (inv) => `<span class="text-mono" style="font-weight:700;">${inv.number}</span>` },
      { header: 'Issue Date', render: (inv) => Utils.formatDate(inv.issueDate) },
      { header: 'Due Date', render: (inv) => Utils.formatDate(inv.dueDate) },
      { header: 'Total', render: (inv) => `<span style="font-weight:700;">${Utils.formatCurrency(inv.total)}</span>` },
      { header: 'Status', render: (inv) => `<span class="badge badge-${inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : 'warning'}">${inv.status}</span>` }
    ]
  });
}
