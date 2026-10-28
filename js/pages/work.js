/* ============================================================
   WORK ENTRIES TRACKING & BILLABLE HOURS SCRIPT
   ============================================================ */

document.addEventListener('ledger-ready', () => {
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
    const clients = AppState.getClients();

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
        { header: 'Date', render: (w) => Utils.formatDate(w.date) },
        { header: 'Client', render: (w) => `<strong>${Utils.escapeHtml(w.clientName)}</strong>` },
        { header: 'Project', key: 'project' },
        { header: 'Description', key: 'description' },
        { header: 'Hours', render: (w) => `${w.hours} hrs` },
        { header: 'Rate', render: (w) => `${Utils.formatCurrency(w.rate)}/hr` },
        { header: 'Amount', render: (w) => `<span style="font-weight:700;">${Utils.formatCurrency(w.amount)}</span>` },
        {
          header: 'Billable',
          render: (w) => `<span class="billable-tag ${w.billable ? 'billable' : 'non-billable'}">${w.billable ? 'Billable' : 'Non-Billable'}</span>`
        },
        {
          header: 'Status',
          render: (w) => `<span class="badge ${w.status === 'invoiced' ? 'badge-info' : 'badge-warning'}">${w.status}</span>`
        },
        {
          header: 'Actions',
          style: 'text-align:right;',
          render: (w) => `
            <div class="table-actions">
              ${w.status === 'unbilled' && w.billable ? `<button class="btn btn-primary btn-sm convert-inv-btn" data-id="${w.id}">Convert to Invoice</button>` : ''}
              <button class="btn btn-secondary btn-sm edit-work-btn" data-id="${w.id}">Edit</button>
              <button class="btn btn-danger btn-sm delete-work-btn" data-id="${w.id}">Delete</button>
            </div>
          `
        }
      ]
    });

    // Action button handlers
    const container = document.getElementById('work-table-container');

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
          Router.navigate('invoices', { action: 'create', workId: entry.id, clientId: entry.clientId });
        }
      };
    });
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
    const modalId = 'work-form-modal';
    const title = isEdit ? 'Edit Work Entry' : 'Log New Work Entry';

    const clients = AppState.getClients();
    if (clients.length === 0) {
      Toast.warning('Please add a client first before logging work.');
      Router.navigate('clients');
      return;
    }

    let clientOptions = '';
    const activeClientId = isEdit ? workToEdit.clientId : (preselectedClientId || clients[0].id);

    clients.forEach(c => {
      clientOptions += `<option value="${c.id}" ${c.id === activeClientId ? 'selected' : ''}>${Utils.escapeHtml(c.name)}</option>`;
    });

    const defaultDate = isEdit ? workToEdit.date : new Date().toISOString().split('T')[0];

    const contentHtml = `
      <form id="work-modal-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Client <span class="required">*</span></label>
            <select id="modal-work-client" class="form-control">${clientOptions}</select>
          </div>
          <div class="form-group">
            <label class="form-label">Date <span class="required">*</span></label>
            <input type="date" id="modal-work-date" class="form-control" value="${defaultDate}" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Project Name <span class="required">*</span></label>
          <input type="text" id="modal-work-project" class="form-control" value="${isEdit ? Utils.escapeHtml(workToEdit.project) : ''}" placeholder="e.g. Website Redesign Phase 2" required />
        </div>

        <div class="form-group">
          <label class="form-label">Task Description</label>
          <textarea id="modal-work-desc" class="form-control" placeholder="Details of work completed...">${isEdit ? Utils.escapeHtml(workToEdit.description) : ''}</textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Hours Logged <span class="required">*</span></label>
            <input type="number" step="0.25" min="0.25" id="modal-work-hours" class="form-control" value="${isEdit ? workToEdit.hours : '1.0'}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Hourly Rate (₹) <span class="required">*</span></label>
            <input type="number" step="50" min="0" id="modal-work-rate" class="form-control" value="${isEdit ? workToEdit.rate : '3500'}" required />
          </div>
        </div>

        <div class="card" style="padding:1rem; background:var(--bg-canvas); margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:0.75rem; font-weight:700; color:var(--text-tertiary); text-transform:uppercase;">Total Calculated Amount</div>
            <div id="modal-work-total-calc" style="font-size:1.5rem; font-weight:800;" class="text-large-num">₹0</div>
          </div>
          <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer; font-weight:600; font-size:0.875rem;">
            <input type="checkbox" id="modal-work-billable" ${!isEdit || workToEdit.billable ? 'checked' : ''} />
            Billable Hours
          </label>
        </div>
      </form>
    `;

    const actionsHtml = `
      <button class="btn btn-secondary" onclick="Modal.close('${modalId}')">Cancel</button>
      <button class="btn btn-primary" id="save-work-submit-btn">${isEdit ? 'Save Changes' : 'Log Work'}</button>
    `;

    Modal.createModal(modalId, title, contentHtml, actionsHtml);
    Modal.open(modalId);

    // Auto calculate amount on input change
    const hoursInput = document.getElementById('modal-work-hours');
    const rateInput = document.getElementById('modal-work-rate');
    const calcEl = document.getElementById('modal-work-total-calc');

    function updateCalc() {
      const h = Number(hoursInput.value) || 0;
      const r = Number(rateInput.value) || 0;
      calcEl.textContent = Utils.formatCurrency(h * r);
    }

    hoursInput.oninput = updateCalc;
    rateInput.oninput = updateCalc;
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

      if (!Validators.isRequired(project) || hours <= 0) {
        Toast.error('Please fill in valid project name and logged hours.');
        return;
      }

      const amount = hours * rate;
      let workList = AppState.getWork();

      if (isEdit) {
        const idx = workList.findIndex(w => w.id === workToEdit.id);
        if (idx !== -1) {
          workList[idx] = {
            ...workList[idx],
            clientId, clientName: clientObj ? clientObj.name : 'Client',
            date, project, description, hours, rate, amount, billable
          };
          StorageManager.setItem(STORAGE_KEYS.WORK, workList);
          StorageManager.logActivity('work_updated', 'Work Log Updated', `Updated work log for ${project}`);
          Toast.success('Work entry updated successfully.');
        }
      } else {
        const newWork = {
          id: Utils.generateId('wrk'),
          clientId, clientName: clientObj ? clientObj.name : 'Client',
          date, project, description, hours, rate, amount, billable,
          status: 'unbilled',
          createdAt: new Date().toISOString()
        };
        workList.unshift(newWork);
        StorageManager.setItem(STORAGE_KEYS.WORK, workList);
        StorageManager.logActivity('work_added', 'Work Logged', `Logged ${hours} hrs for ${clientObj ? clientObj.name : 'Client'}`);
        Toast.success('Work entry logged successfully.');
      }

      Modal.close(modalId);
      AppState.notify('work_updated');
      renderWorkEntries();
    };
  }

  function deleteWork(id) {
    let work = AppState.getWork();
    work = work.filter(w => w.id !== id);
    StorageManager.setItem(STORAGE_KEYS.WORK, work);
    StorageManager.logActivity('work_deleted', 'Work Entry Deleted', `Deleted work entry ${id}`);
    Toast.success('Work entry deleted.');
    AppState.notify('work_updated');
    renderWorkEntries();
  }
});
