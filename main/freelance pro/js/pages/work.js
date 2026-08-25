/* ============================================================
   WORK ENTRIES TRACKING & BILLABLE HOURS SCRIPT (TAILWIND REBUILD)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const params = Utils.getQueryParams();
  let selectedClientId = params.clientId || 'all';

  renderWorkEntries();

  // Add Work Entry Button
  const addBtn = document.getElementById('add-work-btn');
  if (addBtn) {
    addBtn.onclick = () => openWorkModal(null, selectedClientId !== 'all' ? selectedClientId : null);
  }

  // Filter Listener
  const clientFilterSelect = document.getElementById('work-client-filter');
  if (clientFilterSelect) {
    populateClientFilterSelect(clientFilterSelect, selectedClientId);
    clientFilterSelect.onchange = (e) => {
      selectedClientId = e.target.value;
      renderWorkEntries();
    };
  }

  function renderWorkEntries() {
    let work = AppState.getWork();

    if (selectedClientId !== 'all') {
      work = work.filter(w => w.clientId === selectedClientId);
    }

    // Compute metrics
    let totalHours = 0;
    let totalUnbilledAmount = 0;
    let totalInvoicedAmount = 0;

    work.forEach(w => {
      const h = Number(w.hours) || 0;
      const amt = Number(w.amount) || 0;
      totalHours += h;
      if (w.status === 'unbilled') totalUnbilledAmount += amt;
      else if (w.status === 'invoiced') totalInvoicedAmount += amt;
    });

    const hoursEl = document.getElementById('work-total-hours');
    const unbilledEl = document.getElementById('work-total-unbilled');
    const invoicedEl = document.getElementById('work-total-invoiced');

    if (hoursEl) hoursEl.textContent = `${totalHours.toFixed(1)} hrs`;
    if (unbilledEl) unbilledEl.textContent = Utils.formatCurrency(totalUnbilledAmount);
    if (invoicedEl) invoicedEl.textContent = Utils.formatCurrency(totalInvoicedAmount);

    DataTable.render('work-table-container', {
      data: work,
      emptyTitle: 'No work entries logged',
      emptyDesc: 'Track billable hours and projects to convert them into invoices.',
      columns: [
        { header: 'Date', render: (w) => `<span class="text-xs text-slate-500 font-medium">${Utils.formatDate(w.date)}</span>` },
        { 
          header: 'Client', 
          render: (w) => {
            const client = AppState.getClientById(w.clientId);
            return `<span class="font-bold text-slate-900 dark:text-slate-100">${Utils.escapeHtml(client ? client.name : (w.clientName || 'Client'))}</span>`;
          }
        },
        { header: 'Project', render: (w) => `<span class="font-semibold text-slate-800 dark:text-slate-200">${Utils.escapeHtml(w.project || w.projectName || '-')}</span>` },
        { header: 'Description', render: (w) => `<span class="text-xs text-slate-500">${Utils.escapeHtml(w.description || '-')}</span>` },
        { header: 'Hours', render: (w) => `<span class="font-mono text-xs">${w.hours} hrs</span>` },
        { header: 'Rate', render: (w) => `<span class="font-mono text-xs">${Utils.formatCurrency(w.rate || w.hourlyRate)}/hr</span>` },
        { header: 'Amount', render: (w) => `<span class="font-extrabold text-sm font-mono text-slate-900 dark:text-slate-100">${Utils.formatCurrency(w.amount)}</span>` },
        {
          header: 'Status',
          render: (w) => `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${w.status === 'invoiced' ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200' : 'bg-amber-100 dark:bg-amber-950 text-amber-600 border border-amber-200'}">${w.status}</span>`
        },
        {
          header: 'Actions',
          style: 'text-right',
          render: (w) => `
            <div class="flex items-center justify-end gap-2">
              ${w.status === 'unbilled' ? `<button class="convert-inv-btn px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold rounded-full transition-all border border-slate-900 shadow-sm" data-id="${w.id}">Invoice</button>` : ''}
              <button class="edit-work-btn p-1 text-slate-400 hover:text-blue-600 rounded-full" data-id="${w.id}" title="Edit">✏️</button>
              <button class="delete-work-btn p-1 text-slate-400 hover:text-red-600 rounded-full" data-id="${w.id}" title="Delete">🗑️</button>
            </div>
          `
        }
      ]
    });

    // Action button handlers
    const container = document.getElementById('work-table-container');
    if (container) {
      container.querySelectorAll('.edit-work-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          const entry = work.find(w => w.id === id);
          if (entry) openWorkModal(entry);
        };
      });

      container.querySelectorAll('.delete-work-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          const entry = work.find(w => w.id === id);
          if (entry) {
            ConfirmDialog.show(
              'Delete Work Entry',
              `Are you sure you want to delete this work entry?`,
              'Delete Entry',
              () => deleteWork(id)
            );
          }
        };
      });

      container.querySelectorAll('.convert-inv-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          const entry = work.find(w => w.id === id);
          if (entry) {
            window.location.href = `invoices.html?action=create&workId=${entry.id}&clientId=${entry.clientId}`;
          }
        };
      });
    }
  }

  function populateClientFilterSelect(selectEl, selectedVal) {
    const clients = AppState.getClients();
    let html = `<option value="all">All Clients</option>`;
    clients.forEach(c => {
      html += `<option value="${c.id}" ${c.id === selectedVal ? 'selected' : ''}>${Utils.escapeHtml(c.name)}</option>`;
    });
    selectEl.innerHTML = html;
  }

  function openWorkModal(workToEdit = null, preselectedClientId = null) {
    const isEdit = !!workToEdit;
    const title = isEdit ? 'Edit Work Entry' : 'Log New Work Entry';

    const clients = AppState.getClients();
    if (clients.length === 0) {
      Toast.warning('Please add a client first before logging work.');
      window.location.href = 'clients.html';
      return;
    }

    let clientOptions = '';
    const activeClientId = isEdit ? workToEdit.clientId : (preselectedClientId || clients[0].id);

    clients.forEach(c => {
      clientOptions += `<option value="${c.id}" ${c.id === activeClientId ? 'selected' : ''}>${Utils.escapeHtml(c.name)}</option>`;
    });

    const defaultDate = isEdit ? workToEdit.date : new Date().toISOString().split('T')[0];

    const contentHtml = `
      <form id="work-modal-form" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Client <span class="text-red-500">*</span></label>
            <select id="modal-work-client" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600">${clientOptions}</select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date <span class="text-red-500">*</span></label>
            <input type="date" id="modal-work-date" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" value="${defaultDate}" required />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Project Name <span class="text-red-500">*</span></label>
          <input type="text" id="modal-work-project" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" value="${isEdit ? Utils.escapeHtml(workToEdit.project || workToEdit.projectName || '') : ''}" placeholder="e.g. Website Redesign Phase 2" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Task Description</label>
          <textarea id="modal-work-desc" rows="2" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" placeholder="Details of work completed...">${isEdit ? Utils.escapeHtml(workToEdit.description || '') : ''}</textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hours Logged <span class="text-red-500">*</span></label>
            <input type="number" step="0.25" min="0.25" id="modal-work-hours" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" value="${isEdit ? (workToEdit.hours || 1.0) : '1.0'}" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hourly Rate (₹) <span class="text-red-500">*</span></label>
            <input type="number" step="50" min="0" id="modal-work-rate" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600" value="${isEdit ? (workToEdit.rate || workToEdit.hourlyRate || 3500) : '3500'}" required />
          </div>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-between items-center">
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Calculated Amount</div>
            <div id="modal-work-total-calc" class="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">₹0</div>
          </div>
          <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" id="modal-work-billable" ${!isEdit || workToEdit.billable !== false ? 'checked' : ''} class="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            Billable Hours
          </label>
        </div>
      </form>
    `;

    const footerHtml = `
      <button type="button" onclick="Modal.close()" class="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full">Cancel</button>
      <button type="button" id="save-work-submit-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-full shadow-lg shadow-blue-500/20">${isEdit ? 'Save Changes' : 'Log Work'}</button>
    `;

    Modal.create({
      title,
      content: contentHtml,
      widthClass: 'max-w-lg',
      footerHtml
    });

    // Auto calculate amount on input change
    const hoursInput = document.getElementById('modal-work-hours');
    const rateInput = document.getElementById('modal-work-rate');
    const calcEl = document.getElementById('modal-work-total-calc');

    function updateCalc() {
      const h = Number(hoursInput.value) || 0;
      const r = Number(rateInput.value) || 0;
      if (calcEl) calcEl.textContent = Utils.formatCurrency(h * r);
    }

    if (hoursInput) hoursInput.oninput = updateCalc;
    if (rateInput) rateInput.oninput = updateCalc;
    updateCalc();

    // Save click listener
    document.getElementById('save-work-submit-btn').onclick = () => {
      const clientId = document.getElementById('modal-work-client').value;
      const clientObj = clients.find(c => c.id === clientId);
      const date = document.getElementById('modal-work-date').value;
      const project = document.getElementById('modal-work-project').value.trim();
      const description = document.getElementById('modal-work-desc').value.trim();
      const hours = Number(hoursInput.value) || 0;
      const rate = Number(rateInput.value) || 0;
      const billable = document.getElementById('modal-work-billable').checked;

      if (!project || hours <= 0) {
        Toast.error('Please fill in valid project name and logged hours.');
        return;
      }

      const amount = hours * rate;

      if (isEdit) {
        AppState.updateWork(workToEdit.id, {
          clientId,
          clientName: clientObj ? clientObj.name : 'Client',
          date,
          project,
          projectName: project,
          description,
          hours,
          rate,
          hourlyRate: rate,
          amount,
          billable
        });
        Toast.success('Work entry updated successfully.');
      } else {
        AppState.addWork({
          clientId,
          clientName: clientObj ? clientObj.name : 'Client',
          date,
          project,
          projectName: project,
          description,
          hours,
          rate,
          hourlyRate: rate,
          amount,
          billable,
          status: 'unbilled'
        });
        Toast.success('Work entry logged successfully.');
      }

      Modal.close();
      renderWorkEntries();
    };
  }

  function deleteWork(id) {
    AppState.deleteWork(id);
    Toast.success('Work entry deleted.');
    renderWorkEntries();
  }
});
