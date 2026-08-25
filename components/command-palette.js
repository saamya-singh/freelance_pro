/* ============================================================
   GLOBAL COMMAND PALETTE (Cmd+K / Ctrl+K)
   ============================================================ */

const CommandPalette = {
  paletteEl: null,
  inputEl: null,
  resultsEl: null,

  init() {
    if (this.paletteEl) return;

    this.paletteEl = document.createElement('div');
    this.paletteEl.id = 'command-palette-backdrop';
    this.paletteEl.className = 'modal-backdrop';
    this.paletteEl.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(17, 17, 17, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 10vh;
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease-out;
    `;

    this.paletteEl.innerHTML = `
      <div class="command-palette-box" style="
        background: var(--bg-card);
        border: 1px solid var(--border-dark);
        border-radius: var(--radius-md);
        max-width: 600px;
        width: 100%;
        box-shadow: var(--shadow-modal);
        overflow: hidden;
        transform: translateY(-10px);
        transition: transform 200ms ease-out;
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-tertiary);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="command-search-input" type="text" placeholder="Type a command or search clients, work, invoices..." style="
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            font-size: 1rem;
            color: var(--text-primary);
          " />
          <span style="font-size:0.75rem; color:var(--text-tertiary); background:var(--bg-canvas); padding:0.2rem 0.5rem; border-radius:3px; border:1px solid var(--border-color);">ESC</span>
        </div>

        <div id="command-results-list" style="
          max-height: 360px;
          overflow-y: auto;
          padding: 0.5rem;
        ">
          <!-- Results rendered dynamically -->
        </div>
      </div>
    `;

    document.body.appendChild(this.paletteEl);

    this.inputEl = this.paletteEl.querySelector('#command-search-input');
    this.resultsEl = this.paletteEl.querySelector('#command-results-list');

    this.inputEl.oninput = () => this.search(this.inputEl.value);

    this.paletteEl.onclick = (e) => {
      if (e.target === this.paletteEl) this.close();
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  },

  isOpen() {
    return this.paletteEl && this.paletteEl.style.visibility === 'visible';
  },

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  },

  open() {
    this.init();
    this.paletteEl.style.visibility = 'visible';
    this.paletteEl.style.opacity = '1';
    const box = this.paletteEl.querySelector('.command-palette-box');
    box.style.transform = 'translateY(0)';
    this.inputEl.value = '';
    this.search('');
    setTimeout(() => this.inputEl.focus(), 50);
  },

  close() {
    if (!this.paletteEl) return;
    this.paletteEl.style.opacity = '0';
    const box = this.paletteEl.querySelector('.command-palette-box');
    box.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      this.paletteEl.style.visibility = 'hidden';
    }, 200);
  },

  search(query) {
    const q = query.toLowerCase().trim();
    const clients = AppState.getClients();
    const work = AppState.getWork();
    const invoices = AppState.getInvoices();

    let html = '';

    // Action Commands
    const actions = [
      { label: 'Go to Dashboard', action: () => Router.navigate('dashboard'), icon: '📊' },
      { label: 'View Clients Directory', action: () => Router.navigate('clients'), icon: '👥' },
      { label: 'View Work Entries Log', action: () => Router.navigate('work'), icon: '⏱️' },
      { label: 'View Invoices & Payments', action: () => Router.navigate('invoices'), icon: '📄' },
      { label: 'Open Tax Calculator', action: () => Router.navigate('tax'), icon: '🧮' },
      { label: 'Open Tax Settings', action: () => Router.navigate('tax-settings'), icon: '⚙️' }
    ];

    const matchedActions = actions.filter(a => a.label.toLowerCase().includes(q));

    if (matchedActions.length > 0) {
      html += `<div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-tertiary); padding:0.5rem 0.75rem 0.25rem 0.75rem;">Navigation & Commands</div>`;
      matchedActions.forEach(act => {
        html += `
          <div class="command-item" data-type="action" style="
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.65rem 0.75rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-size: 0.875rem;
            color: var(--text-primary);
          ">
            <span>${act.icon}</span>
            <span style="flex:1;">${Utils.escapeHtml(act.label)}</span>
          </div>
        `;
      });
    }

    // Clients Search
    const matchedClients = clients.filter(c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q));
    if (matchedClients.length > 0) {
      html += `<div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-tertiary); padding:0.75rem 0.75rem 0.25rem 0.75rem;">Clients</div>`;
      matchedClients.slice(0, 4).forEach(c => {
        html += `
          <div class="command-item" data-type="client" data-id="${c.id}" style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.65rem 0.75rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-size: 0.875rem;
          ">
            <div>
              <span style="font-weight:600;">${Utils.escapeHtml(c.name)}</span>
              <span style="font-size:0.75rem; color:var(--text-secondary); margin-left:0.5rem;">${Utils.escapeHtml(c.company)}</span>
            </div>
            <span style="font-size:0.75rem; color:var(--text-tertiary);">View Profile →</span>
          </div>
        `;
      });
    }

    // Invoices Search
    const matchedInvoices = invoices.filter(inv => inv.number.toLowerCase().includes(q) || inv.clientName.toLowerCase().includes(q));
    if (matchedInvoices.length > 0) {
      html += `<div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-tertiary); padding:0.75rem 0.75rem 0.25rem 0.75rem;">Invoices</div>`;
      matchedInvoices.slice(0, 4).forEach(inv => {
        html += `
          <div class="command-item" data-type="invoice" data-id="${inv.id}" style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.65rem 0.75rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-size: 0.875rem;
          ">
            <div>
              <span style="font-weight:700;" class="text-mono">${Utils.escapeHtml(inv.number)}</span>
              <span style="font-size:0.8rem; color:var(--text-secondary); margin-left:0.5rem;">${Utils.escapeHtml(inv.clientName)}</span>
            </div>
            <span style="font-weight:600;">${Utils.formatCurrency(inv.total)}</span>
          </div>
        `;
      });
    }

    if (!html) {
      html = `<div style="padding:2rem; text-align:center; color:var(--text-tertiary); font-size:0.875rem;">No matching commands or records found.</div>`;
    }

    this.resultsEl.innerHTML = html;

    // Attach click listeners to command items
    const items = this.resultsEl.querySelectorAll('.command-item');
    items.forEach(item => {
      item.onmouseover = () => item.style.background = 'var(--bg-canvas)';
      item.onmouseout = () => item.style.background = 'transparent';
      item.onclick = () => {
        const type = item.getAttribute('data-type');
        const id = item.getAttribute('data-id');
        this.close();

        if (type === 'action') {
          const actName = item.querySelector('span:nth-child(2)').innerText;
          const matched = actions.find(a => a.label === actName);
          if (matched) matched.action();
        } else if (type === 'client') {
          Router.navigate('client-detail', { id });
        } else if (type === 'invoice') {
          Router.navigate('invoice-detail', { id });
        }
      };
    });
  }
};
