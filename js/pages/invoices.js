/* ============================================================
   INVOICES CONTROLLER WITH TAB FILTERING & STATE SUBSCRIPTION
   ============================================================ */

let currentInvoiceFilter = 'all';

document.addEventListener('ledger-ready', () => {
  renderInvoicesPage();
  setupInvoiceEventListeners();

  // Subscribe to state change notifications
  AppState.subscribe('invoices_updated', () => {
    renderInvoicesPage();
  });

  // Check URL query parameters for auto action (e.g. ?action=create)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('action') === 'create') {
    openInvoiceModal();
  }
});

function setupInvoiceEventListeners() {
  const createBtn = document.getElementById('create-invoice-btn');
  if (createBtn) createBtn.onclick = () => openInvoiceModal();

  const searchInput = document.getElementById('invoice-search-input');
  if (searchInput) {
    searchInput.oninput = (e) => {
      renderInvoicesTable(e.target.value.trim(), currentInvoiceFilter);
    };
  }

  // Filter Buttons Event Handlers
  const filterBtns = document.querySelectorAll('.inv-filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-blue-600', 'text-white', 'font-extrabold');
        b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'font-bold');
      });

      btn.classList.add('active', 'bg-blue-600', 'text-white', 'font-extrabold');
      btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'font-bold');

      currentInvoiceFilter = btn.dataset.filter || 'all';
      const q = searchInput ? searchInput.value.trim() : '';
      renderInvoicesTable(q, currentInvoiceFilter);
    };
  });
}

function renderInvoicesPage() {
  updateInvoiceMetrics();
  const searchInput = document.getElementById('invoice-search-input');
  const q = searchInput ? searchInput.value.trim() : '';
  renderInvoicesTable(q, currentInvoiceFilter);
}

function updateInvoiceMetrics() {
  const invoices = AppState.getInvoices();

  let invoicedSum = 0;
  let paidSum = 0;
  let pendingSum = 0;
  let overdueSum = 0;
  let pendingCount = 0;
  let overdueCount = 0;

  invoices.forEach(inv => {
    const total = Number(inv.total) || 0;
    invoicedSum += total;
    if (inv.status === 'paid') {
      paidSum += total;
    } else if (inv.status === 'sent' || inv.status === 'draft') {
      pendingSum += total;
      pendingCount++;
    } else if (inv.status === 'overdue') {
      overdueSum += total;
      overdueCount++;
    }
  });

  const pendingEl = document.getElementById('inv-total-pending');
  if (pendingEl) pendingEl.textContent = Utils.formatCurrency(pendingSum);

  const pendingSub = document.getElementById('inv-pending-count-sub');
  if (pendingSub) pendingSub.textContent = `Across ${pendingCount} active invoice${pendingCount !== 1 ? 's' : ''}`;

  const overdueEl = document.getElementById('inv-total-overdue');
  if (overdueEl) overdueEl.textContent = Utils.formatCurrency(overdueSum);

  const overdueSub = document.getElementById('inv-overdue-count-sub');
  if (overdueSub) overdueSub.textContent = `${overdueCount} invoice${overdueCount !== 1 ? 's' : ''} need attention`;

  const paidEl = document.getElementById('inv-total-paid');
  if (paidEl) paidEl.textContent = Utils.formatCurrency(paidSum);
}

function renderInvoicesTable(searchQuery = '', filter = 'all') {
  let invoices = AppState.getInvoices();

  if (filter === 'draft') invoices = invoices.filter(i => i.status === 'draft');
  if (filter === 'sent') invoices = invoices.filter(i => i.status === 'sent');
  if (filter === 'paid') invoices = invoices.filter(i => i.status === 'paid');
  if (filter === 'overdue') invoices = invoices.filter(i => i.status === 'overdue');

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    invoices = invoices.filter(i => {
      const client = AppState.getClientById(i.clientId);
      const clientName = client ? client.name.toLowerCase() : '';
      return i.number.toLowerCase().includes(q) || clientName.includes(q);
    });
  }

  const columns = [
    {
      header: 'Status',
      render: (inv) => Utils.formatStatusBadge(inv.status)
    },
    {
      header: 'Invoice #',
      render: (inv) => `<span class="font-extrabold font-mono text-xs text-blue-600 dark:text-blue-400">${Utils.escapeHtml(inv.number)}</span>`
    },
    {
      header: 'Client / Company',
      render: (inv) => {
        const client = AppState.getClientById(inv.clientId);
        return `
          <div>
            <div class="font-bold text-slate-900 dark:text-slate-100">${Utils.escapeHtml(client ? client.name : 'Client')}</div>
            ${client && client.company ? `<div class="text-[11px] text-slate-400 font-medium">${Utils.escapeHtml(client.company)}</div>` : ''}
          </div>
        `;
      }
    },
    {
      header: 'Issue Date',
      render: (inv) => `<span class="text-xs text-slate-500 font-medium">${Utils.formatDate(inv.issueDate)}</span>`
    },
    {
      header: 'Due Date',
      render: (inv) => `<span class="text-xs text-slate-500 font-medium">${Utils.formatDate(inv.dueDate)}</span>`
    },
    {
      header: 'Amount',
      render: (inv) => `<span class="font-extrabold text-sm font-mono text-slate-900 dark:text-slate-100">${Utils.formatCurrency(inv.total)}</span>`
    },
    {
      header: 'Actions',
      style: 'text-right',
      render: (inv) => `
        <div class="flex items-center justify-end gap-2">
          ${inv.status !== 'paid' ? `
            <button onclick="event.stopPropagation(); markInvoicePaid('${inv.id}')" class="px-3 py-1 bg-lime-400 hover:bg-lime-500 text-slate-950 text-[11px] font-extrabold rounded-full transition-all border border-slate-900 shadow-sm">Mark Paid</button>
          ` : ''}
          <button onclick="event.stopPropagation(); window.location.href='invoice-detail.html?id=${inv.id}'" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-full transition-all">View PDF</button>
        </div>
      `
    }
  ];

  DataTable.render('invoices-table-container', {
    columns,
    data: invoices,
    emptyTitle: 'No invoices found',
    emptyDesc: 'Create your first GST-compliant invoice to send to clients.',
    onRowClick: (inv) => {
      window.location.href = `invoice-detail.html?id=${inv.id}`;
    }
  });
}

function openInvoiceModal(invoice = null) {
  const clients = AppState.getClients();
  if (clients.length === 0) {
    Toast.error('Please add at least one client before generating an invoice.');
    return;
  }

  const isEdit = !!invoice;
  const title = isEdit ? 'Edit Invoice' : 'Create New Invoice';
  const nextNum = isEdit ? invoice.number : AppState.getNextInvoiceNumber();

  let lineItems = isEdit && invoice.items ? [...invoice.items] : [
    { description: 'Professional Consulting Services', quantity: 1, rate: 50000, amount: 50000 }
  ];

  const content = `
    <form id="invoice-form" class="space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Client <span class="text-red-500">*</span></label>
          <select id="inv-client-id" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600">
            ${clients.map(c => `<option value="${c.id}" ${isEdit && invoice.clientId === c.id ? 'selected' : ''}>${Utils.escapeHtml(c.name)} ${c.company ? `(${Utils.escapeHtml(c.company)})` : ''}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Invoice Number <span class="text-red-500">*</span></label>
          <input type="text" id="inv-number" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-blue-600" value="${Utils.escapeHtml(nextNum)}" required />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Date</label>
          <input type="date" id="inv-issue-date" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" value="${isEdit ? invoice.issueDate : new Date().toISOString().split('T')[0]}" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
          <input type="date" id="inv-due-date" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" value="${isEdit ? invoice.dueDate : new Date(Date.now() + 15*86400000).toISOString().split('T')[0]}" />
        </div>
      </div>

      <!-- Line Items Section -->
      <div class="space-y-3 pt-2">
        <div class="flex justify-between items-center">
          <label class="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Line Items</label>
          <button type="button" id="add-line-item-btn" class="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline">+ Add Item</button>
        </div>

        <div id="line-items-container" class="space-y-2"></div>
      </div>

      <!-- Financial Calculation Summary Box -->
      <div class="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-500 mb-1">Discount (%)</label>
            <input type="number" step="1" id="inv-discount-rate" class="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold" value="${isEdit && invoice.discountRate ? invoice.discountRate : 0}" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 mb-1">GST Tax (%)</label>
            <input type="number" step="1" id="inv-gst-rate" class="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold" value="${isEdit && invoice.gstRate !== undefined ? invoice.gstRate : 18}" />
          </div>
        </div>

        <div class="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 font-medium">
          <div class="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span id="calc-subtotal" class="font-mono font-bold text-slate-900 dark:text-slate-100">₹0</span>
          </div>
          <div class="flex justify-between text-slate-500">
            <span>GST Amount:</span>
            <span id="calc-gst" class="font-mono font-bold text-slate-900 dark:text-slate-100">₹0</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-extrabold text-slate-900 dark:text-white">
            <span>Total Payable:</span>
            <span id="calc-total" class="font-mono text-base text-blue-600 dark:text-blue-400">₹0</span>
          </div>
        </div>
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" onclick="Modal.close()" class="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full">Cancel</button>
    <button type="button" id="save-invoice-submit-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-full shadow-lg shadow-blue-500/20">${isEdit ? 'Update Invoice' : 'Generate Invoice'}</button>
  `;

  Modal.create({
    title,
    content,
    widthClass: 'max-w-3xl',
    footerHtml
  });

  // Render Line Items List inside Modal
  renderLineItems(lineItems);

  document.getElementById('add-line-item-btn').onclick = () => {
    lineItems.push({ description: '', quantity: 1, rate: 0, amount: 0 });
    renderLineItems(lineItems);
  };

  document.getElementById('inv-discount-rate').oninput = () => recalculateTotals(lineItems);
  document.getElementById('inv-gst-rate').oninput = () => recalculateTotals(lineItems);

  document.getElementById('save-invoice-submit-btn').onclick = () => {
    const clientId = document.getElementById('inv-client-id').value;
    const number = document.getElementById('inv-number').value.trim();
    const issueDate = document.getElementById('inv-issue-date').value;
    const dueDate = document.getElementById('inv-due-date').value;
    const discountRate = Number(document.getElementById('inv-discount-rate').value) || 0;
    const gstRate = Number(document.getElementById('inv-gst-rate').value) || 0;

    if (!number) {
      Toast.error('Invoice number is required.');
      return;
    }

    const { subtotal, gstAmount, total } = recalculateTotals(lineItems);

    const payload = {
      clientId,
      number,
      issueDate,
      dueDate,
      items: lineItems,
      discountRate,
      gstRate,
      subtotal,
      gstAmount,
      total,
      status: isEdit ? invoice.status : 'sent'
    };

    if (isEdit) {
      AppState.updateInvoice(invoice.id, payload);
      Toast.success('Invoice updated successfully');
    } else {
      AppState.addInvoice(payload);
      Toast.success('Invoice created successfully');
    }

    Modal.close();
    renderInvoicesPage();
  };
}

function renderLineItems(items) {
  const container = document.getElementById('line-items-container');
  if (!container) return;

  let html = '';
  items.forEach((item, index) => {
    html += `
      <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2 border border-slate-200 dark:border-slate-800 rounded-xl">
        <input type="text" class="line-desc flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600" placeholder="Service description..." value="${Utils.escapeHtml(item.description)}" data-index="${index}" />
        <input type="number" class="line-qty w-16 px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-center focus:outline-none focus:border-blue-600" placeholder="Qty" value="${item.quantity}" data-index="${index}" min="1" />
        <input type="number" class="line-rate w-24 px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600" placeholder="Rate ₹" value="${item.rate}" data-index="${index}" />
        <div class="line-amount w-24 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100 pr-1">${Utils.formatCurrency(item.quantity * item.rate)}</div>
        <button type="button" class="remove-line-btn p-1.5 text-slate-400 hover:text-red-500 rounded-full" data-index="${index}" title="Remove Item">✕</button>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll('.line-desc').forEach(input => {
    input.oninput = (e) => {
      const idx = e.target.dataset.index;
      items[idx].description = e.target.value;
    };
  });

  container.querySelectorAll('.line-qty').forEach(input => {
    input.oninput = (e) => {
      const idx = e.target.dataset.index;
      items[idx].quantity = Number(e.target.value) || 0;
      items[idx].amount = items[idx].quantity * items[idx].rate;
      recalculateTotals(items);
    };
  });

  container.querySelectorAll('.line-rate').forEach(input => {
    input.oninput = (e) => {
      const idx = e.target.dataset.index;
      items[idx].rate = Number(e.target.value) || 0;
      items[idx].amount = items[idx].quantity * items[idx].rate;
      recalculateTotals(items);
    };
  });

  container.querySelectorAll('.remove-line-btn').forEach(btn => {
    btn.onclick = (e) => {
      const idx = e.target.dataset.index;
      if (items.length > 1) {
        items.splice(idx, 1);
        renderLineItems(items);
        recalculateTotals(items);
      } else {
        Toast.error('An invoice must contain at least one line item.');
      }
    };
  });

  recalculateTotals(items);
}

function recalculateTotals(items) {
  let subtotal = 0;
  items.forEach(item => {
    subtotal += (item.quantity * item.rate);
  });

  const discRate = Number(document.getElementById('inv-discount-rate')?.value) || 0;
  const gstRate = Number(document.getElementById('inv-gst-rate')?.value) || 0;

  const discountVal = subtotal * (discRate / 100);
  const taxableVal = Math.max(0, subtotal - discountVal);
  const gstAmount = taxableVal * (gstRate / 100);
  const total = taxableVal + gstAmount;

  const subEl = document.getElementById('calc-subtotal');
  if (subEl) subEl.textContent = Utils.formatCurrency(subtotal);

  const gstEl = document.getElementById('calc-gst');
  if (gstEl) gstEl.textContent = Utils.formatCurrency(gstAmount);

  const totEl = document.getElementById('calc-total');
  if (totEl) totEl.textContent = Utils.formatCurrency(total);

  // Update amounts displayed on line item inputs
  const container = document.getElementById('line-items-container');
  if (container) {
    const amtEls = container.querySelectorAll('.line-amount');
    items.forEach((item, idx) => {
      if (amtEls[idx]) {
        amtEls[idx].textContent = Utils.formatCurrency(item.quantity * item.rate);
      }
    });
  }

  return { subtotal, gstAmount, total };
}

function markInvoicePaid(id) {
  const inv = AppState.getInvoiceById(id);
  if (!inv) return;

  ConfirmDialog.show(
    'Record Payment',
    `Mark invoice #${inv.number} for ${Utils.formatCurrency(inv.total)} as PAID?`,
    'Mark Paid',
    () => {
      AppState.updateInvoice(id, { status: 'paid' });
      AppState.addPayment({
        invoiceId: id,
        amount: inv.total,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer / UPI',
        notes: 'Full payment recorded'
      });
      Toast.success(`Invoice #${inv.number} marked as Paid!`);
      renderInvoicesPage();
    }
  );
}
