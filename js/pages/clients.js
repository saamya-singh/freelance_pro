/* ============================================================
   CLIENTS CRM CONTROLLER WITH TAILWIND MODAL FORM
   ============================================================ */

let currentFilter = 'all';

document.addEventListener('ledger-ready', () => {
  renderClientsPage();
  setupEventListeners();
});

function setupEventListeners() {
  const addBtn = document.getElementById('add-client-btn');
  if (addBtn) addBtn.onclick = () => openClientModal();

  const searchInput = document.getElementById('client-search-input');
  if (searchInput) {
    searchInput.oninput = (e) => {
      renderClientsTable(e.target.value.trim(), currentFilter);
    };
  }

  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active', 'bg-white', 'dark:bg-slate-900', 'text-blue-600', 'dark:text-blue-400', 'shadow-sm'));
      btn.classList.add('active', 'bg-white', 'dark:bg-slate-900', 'text-blue-600', 'dark:text-blue-400', 'shadow-sm');
      currentFilter = btn.dataset.filter;
      const searchVal = searchInput ? searchInput.value.trim() : '';
      renderClientsTable(searchVal, currentFilter);
    };
  });
}

function renderClientsPage() {
  renderClientsTable('', currentFilter);
}

function renderClientsTable(searchQuery = '', filter = 'all') {
  let clients = AppState.getClients();

  if (filter === 'active') clients = clients.filter(c => c.status === 'active');
  if (filter === 'inactive') clients = clients.filter(c => c.status === 'inactive');

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    clients = clients.filter(c => 
      c.name.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  }

  const columns = [
    {
      header: 'Client / Company',
      render: (client) => `
        <div>
          <div class="font-bold text-slate-900 dark:text-slate-100">${Utils.escapeHtml(client.name)}</div>
          ${client.company ? `<div class="text-xs text-slate-400 font-medium">${Utils.escapeHtml(client.company)}</div>` : ''}
        </div>
      `
    },
    {
      header: 'Contact Details',
      render: (client) => `
        <div class="text-xs">
          <div class="font-medium text-slate-700 dark:text-slate-300">${Utils.escapeHtml(client.email)}</div>
          <div class="text-slate-400">${Utils.escapeHtml(client.phone || '-')}</div>
        </div>
      `
    },
    {
      header: 'Tax Info',
      render: (client) => `
        <div class="text-xs font-mono text-slate-500">
          <div>GST: ${Utils.escapeHtml(client.gstin || 'Unregistered')}</div>
          <div>PAN: ${Utils.escapeHtml(client.pan || '-')}</div>
        </div>
      `
    },
    {
      header: 'Total Billing',
      render: (client) => {
        const stats = AppState.getClientStats(client.id);
        return `<div class="font-extrabold text-sm font-mono text-slate-900 dark:text-slate-100">${Utils.formatCurrency(stats.totalInvoiced)}</div>`;
      }
    },
    {
      header: 'Actions',
      style: 'text-right',
      render: (client) => `
        <div class="flex items-center justify-end gap-2">
          <button onclick="event.stopPropagation(); window.location.href='client-detail.html?id=${client.id}'" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-full transition-all">View Profile</button>
          <button onclick="event.stopPropagation(); editClient('${client.id}')" class="p-1.5 text-slate-400 hover:text-blue-600 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/40" title="Edit">✏️</button>
        </div>
      `
    }
  ];

  DataTable.render('clients-table-container', {
    columns,
    data: clients,
    emptyTitle: 'No clients found',
    emptyDesc: 'Add your first client profile to start logging work and issuing invoices.',
    onRowClick: (client) => {
      window.location.href = `client-detail.html?id=${client.id}`;
    }
  });
}

function openClientModal(client = null) {
  const isEdit = !!client;
  const title = isEdit ? 'Edit Client Profile' : 'Add New Client';

  const content = `
    <form id="client-form" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Client / Contact Name <span class="text-red-500">*</span></label>
          <input type="text" id="client-name" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" placeholder="e.g. Acme Technologies" value="${isEdit ? Utils.escapeHtml(client.name) : ''}" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
          <input type="text" id="client-company" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" placeholder="e.g. Acme Group Pvt Ltd" value="${isEdit && client.company ? Utils.escapeHtml(client.company) : ''}" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address <span class="text-red-500">*</span></label>
          <input type="email" id="client-email" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" placeholder="billing@acme.in" value="${isEdit ? Utils.escapeHtml(client.email) : ''}" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
          <input type="text" id="client-phone" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" placeholder="+91 98765 43210" value="${isEdit && client.phone ? Utils.escapeHtml(client.phone) : ''}" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">GSTIN (India Tax ID)</label>
          <input type="text" id="client-gstin" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono uppercase focus:outline-none focus:border-blue-600" placeholder="27AAACA1234A1Z2" value="${isEdit && client.gstin ? Utils.escapeHtml(client.gstin) : ''}" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">PAN Number</label>
          <input type="text" id="client-pan" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono uppercase focus:outline-none focus:border-blue-600" placeholder="AAACA1234A" value="${isEdit && client.pan ? Utils.escapeHtml(client.pan) : ''}" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Registered Billing Address</label>
        <textarea id="client-address" rows="2" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" placeholder="Full billing address for invoice headers...">${isEdit && client.address ? Utils.escapeHtml(client.address) : ''}</textarea>
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" onclick="Modal.close()" class="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full">Cancel</button>
    <button type="button" id="save-client-submit-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-full shadow-lg shadow-blue-500/20">${isEdit ? 'Update Client' : 'Create Client'}</button>
  `;

  Modal.create({
    title,
    content,
    widthClass: 'max-w-xl',
    footerHtml
  });

  document.getElementById('save-client-submit-btn').onclick = () => {
    const name = document.getElementById('client-name').value.trim();
    const email = document.getElementById('client-email').value.trim();

    if (!name || !email) {
      Toast.error('Client name and email address are required.');
      return;
    }

    if (!Validators.isValidEmail(email)) {
      Toast.error('Please enter a valid email address.');
      return;
    }

    const payload = {
      name,
      company: document.getElementById('client-company').value.trim(),
      email,
      phone: document.getElementById('client-phone').value.trim(),
      gstin: document.getElementById('client-gstin').value.trim().toUpperCase(),
      pan: document.getElementById('client-pan').value.trim().toUpperCase(),
      address: document.getElementById('client-address').value.trim(),
      status: isEdit ? client.status : 'active'
    };

    if (isEdit) {
      AppState.updateClient(client.id, payload);
      Toast.success('Client updated successfully');
    } else {
      AppState.addClient(payload);
      Toast.success('Client created successfully');
    }

    Modal.close();
    renderClientsPage();
  };
}

function editClient(id) {
  const client = AppState.getClientById(id);
  if (client) openClientModal(client);
}
