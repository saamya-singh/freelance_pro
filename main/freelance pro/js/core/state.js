/* ============================================================
   APPLICATION CENTRAL STATE, REPOSITORY & EVENT BUS
   ============================================================ */

const AppState = {
  listeners: {},

  // Subscribe to state change topics (e.g. 'clients_updated', 'invoices_updated')
  subscribe(topic, callback) {
    if (!this.listeners[topic]) {
      this.listeners[topic] = [];
    }
    this.listeners[topic].push(callback);
    return () => {
      this.listeners[topic] = this.listeners[topic].filter(cb => cb !== callback);
    };
  },

  // Notify subscribers
  notify(topic, data) {
    if (this.listeners[topic]) {
      this.listeners[topic].forEach(callback => {
        try {
          callback(data);
        } catch (err) {
          console.error(`Error in state listener for ${topic}:`, err);
        }
      });
    }
  },

  // ==================== CLIENTS ====================
  getClients() {
    return StorageManager.getItem(STORAGE_KEYS.CLIENTS, []);
  },

  getClientById(id) {
    const clients = this.getClients();
    return clients.find(c => c.id === id) || null;
  },

  addClient(data) {
    const clients = this.getClients();
    const newClient = {
      id: Utils.generateId('cli'),
      name: data.name || '',
      company: data.company || '',
      email: data.email || '',
      phone: data.phone || '',
      gstin: (data.gstin || '').toUpperCase(),
      pan: (data.pan || '').toUpperCase(),
      address: data.address || '',
      notes: data.notes || '',
      status: data.status || 'active',
      createdAt: new Date().toISOString()
    };

    clients.unshift(newClient);
    StorageManager.setItem(STORAGE_KEYS.CLIENTS, clients);
    StorageManager.logActivity('client_created', 'Client Added', `Created client profile for ${newClient.name}`);
    this.notify('clients_updated', clients);
    return newClient;
  },

  updateClient(id, updates) {
    const clients = this.getClients();
    const idx = clients.findIndex(c => c.id === id);
    if (idx !== -1) {
      clients[idx] = { ...clients[idx], ...updates, updatedAt: new Date().toISOString() };
      StorageManager.setItem(STORAGE_KEYS.CLIENTS, clients);
      StorageManager.logActivity('client_updated', 'Client Updated', `Updated profile for ${clients[idx].name}`);
      this.notify('clients_updated', clients);
      return clients[idx];
    }
    return null;
  },

  deleteClient(id) {
    let clients = this.getClients();
    const target = clients.find(c => c.id === id);
    clients = clients.filter(c => c.id !== id);
    StorageManager.setItem(STORAGE_KEYS.CLIENTS, clients);
    if (target) {
      StorageManager.logActivity('client_deleted', 'Client Removed', `Deleted client ${target.name}`);
    }
    this.notify('clients_updated', clients);
  },

  getClientStats(clientId) {
    const invoices = this.getInvoices().filter(i => i.clientId === clientId);
    let totalInvoiced = 0;
    let totalPaid = 0;
    let totalPending = 0;

    invoices.forEach(inv => {
      const tot = Number(inv.total) || 0;
      totalInvoiced += tot;
      if (inv.status === 'paid') totalPaid += tot;
      else totalPending += tot;
    });

    return { totalInvoiced, totalPaid, totalPending, invoiceCount: invoices.length };
  },

  // ==================== WORK ENTRIES ====================
  getWork() {
    return StorageManager.getItem(STORAGE_KEYS.WORK, []);
  },

  getWorkEntries() {
    return this.getWork();
  },

  getWorkById(id) {
    return this.getWork().find(w => w.id === id) || null;
  },

  addWork(data) {
    const entries = this.getWork();
    const hours = Number(data.hours) || 0;
    const rate = Number(data.hourlyRate) || 0;
    const amount = data.amount !== undefined ? Number(data.amount) : (hours * rate);

    const newWork = {
      id: Utils.generateId('wrk'),
      clientId: data.clientId || '',
      projectName: data.projectName || '',
      description: data.description || '',
      hours: hours,
      hourlyRate: rate,
      amount: amount,
      date: data.date || new Date().toISOString().split('T')[0],
      status: data.status || 'unbilled',
      createdAt: new Date().toISOString()
    };

    entries.unshift(newWork);
    StorageManager.setItem(STORAGE_KEYS.WORK, entries);
    StorageManager.logActivity('work_added', 'Work Logged', `Logged work for ${newWork.projectName || 'Project'}`);
    this.notify('work_updated', entries);
    return newWork;
  },

  addWorkEntry(data) {
    return this.addWork(data);
  },

  updateWork(id, updates) {
    const entries = this.getWork();
    const idx = entries.findIndex(w => w.id === id);
    if (idx !== -1) {
      entries[idx] = { ...entries[idx], ...updates, updatedAt: new Date().toISOString() };
      StorageManager.setItem(STORAGE_KEYS.WORK, entries);
      this.notify('work_updated', entries);
      return entries[idx];
    }
    return null;
  },

  deleteWork(id) {
    let entries = this.getWork();
    entries = entries.filter(w => w.id !== id);
    StorageManager.setItem(STORAGE_KEYS.WORK, entries);
    this.notify('work_updated', entries);
  },

  // ==================== INVOICES ====================
  getInvoices() {
    return StorageManager.getItem(STORAGE_KEYS.INVOICES, []);
  },

  getInvoiceById(id) {
    return this.getInvoices().find(i => i.id === id) || null;
  },

  getNextInvoiceNumber() {
    const invoices = this.getInvoices();
    const settings = this.getSettings();
    const prefix = (settings && settings.invoicePrefix) ? settings.invoicePrefix : 'INV-2026-';
    const nextSeq = String(invoices.length + 1).padStart(3, '0');
    return `${prefix}${nextSeq}`;
  },

  addInvoice(data) {
    const invoices = this.getInvoices();
    const newInvoice = {
      id: Utils.generateId('inv'),
      number: data.number || this.getNextInvoiceNumber(),
      clientId: data.clientId || '',
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date(Date.now() + 15*86400000).toISOString().split('T')[0],
      items: data.items || [],
      discountRate: Number(data.discountRate) || 0,
      gstRate: Number(data.gstRate) !== undefined ? Number(data.gstRate) : 18,
      subtotal: Number(data.subtotal) || 0,
      gstAmount: Number(data.gstAmount) || 0,
      total: Number(data.total) || 0,
      status: data.status || 'sent',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    invoices.unshift(newInvoice);
    StorageManager.setItem(STORAGE_KEYS.INVOICES, invoices);

    const client = this.getClientById(newInvoice.clientId);
    const clientName = client ? client.name : 'Client';
    StorageManager.logActivity('invoice_created', 'Invoice Issued', `Issued invoice #${newInvoice.number} for ${clientName}`);
    
    this.notify('invoices_updated', invoices);
    return newInvoice;
  },

  updateInvoice(id, updates) {
    const invoices = this.getInvoices();
    const idx = invoices.findIndex(i => i.id === id);
    if (idx !== -1) {
      invoices[idx] = { ...invoices[idx], ...updates, updatedAt: new Date().toISOString() };
      StorageManager.setItem(STORAGE_KEYS.INVOICES, invoices);
      this.notify('invoices_updated', invoices);
      return invoices[idx];
    }
    return null;
  },

  deleteInvoice(id) {
    let invoices = this.getInvoices();
    invoices = invoices.filter(i => i.id !== id);
    StorageManager.setItem(STORAGE_KEYS.INVOICES, invoices);
    this.notify('invoices_updated', invoices);
  },

  // ==================== PAYMENTS ====================
  getPayments() {
    return StorageManager.getItem(STORAGE_KEYS.PAYMENTS, []);
  },

  addPayment(data) {
    const payments = this.getPayments();
    const newPayment = {
      id: Utils.generateId('pay'),
      invoiceId: data.invoiceId || '',
      amount: Number(data.amount) || 0,
      paymentDate: data.paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: data.paymentMethod || 'Bank Transfer / UPI',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    payments.unshift(newPayment);
    StorageManager.setItem(STORAGE_KEYS.PAYMENTS, payments);

    const inv = this.getInvoiceById(newPayment.invoiceId);
    const invNum = inv ? `#${inv.number}` : '';
    StorageManager.logActivity('payment_received', 'Payment Recorded', `Received ${Utils.formatCurrency(newPayment.amount)} for invoice ${invNum}`);

    this.notify('payments_updated', payments);
    return newPayment;
  },

  // ==================== ACTIVITIES & SETTINGS ====================
  getActivities() {
    return StorageManager.getItem(STORAGE_KEYS.ACTIVITIES, []);
  },

  getSettings() {
    return StorageManager.getItem(STORAGE_KEYS.SETTINGS, {});
  },

  updateSettings(updates) {
    const settings = { ...this.getSettings(), ...updates };
    StorageManager.setItem(STORAGE_KEYS.SETTINGS, settings);
    this.notify('settings_updated', settings);
    return settings;
  },

  getTaxSettings() {
    return StorageManager.getItem(STORAGE_KEYS.TAX_SETTINGS, DEFAULT_TAX_CONFIG);
  },

  updateTaxSettings(updates) {
    const taxConfig = { ...this.getTaxSettings(), ...updates };
    StorageManager.setItem(STORAGE_KEYS.TAX_SETTINGS, taxConfig);
    this.notify('tax_settings_updated', taxConfig);
    return taxConfig;
  },

  // ==================== SAVED TAX CALCULATION ====================
  getSavedTaxCalculation() {
    return StorageManager.getItem(STORAGE_KEYS.TAX_CALCULATION, null);
  },

  saveTaxCalculation(calculation) {
    const saved = {
      ...calculation,
      savedAt: new Date().toISOString(),
      userId: StorageManager.getActiveUserId()
    };

    const ok = StorageManager.setItem(STORAGE_KEYS.TAX_CALCULATION, saved);
    if (!ok) return null;

    const verified = StorageManager.getItem(STORAGE_KEYS.TAX_CALCULATION, null);
    if (!verified || verified.savedAt !== saved.savedAt) return null;

    StorageManager.logActivity(
      'tax_calculation_saved',
      'Tax Calculation Saved',
      `Saved tax liability ${Utils.formatCurrency(saved.result.totalTaxLiability)} and net take-home ${Utils.formatCurrency(saved.result.netTakeHome)}`
    );
    this.notify('tax_calculation_updated', saved);
    return verified;
  },

  clearSavedTaxCalculation() {
    const ok = StorageManager.removeItem(STORAGE_KEYS.TAX_CALCULATION);
    if (ok) this.notify('tax_calculation_updated', null);
    return ok;
  }
};
