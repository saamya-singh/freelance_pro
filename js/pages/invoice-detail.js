/* ============================================================
   INVOICE DETAIL PRINTABLE VIEW SCRIPT
   ============================================================ */

document.addEventListener('ledger-ready', () => {
  const params = Utils.getQueryParams();
  const invoiceId = params.id;

  if (!invoiceId) {
    Toast.error("No invoice ID provided.");
    Router.navigate('invoices');
    return;
  }

  renderInvoiceDetail(invoiceId);
});

function renderInvoiceDetail(invoiceId) {
  const invoices = AppState.getInvoices();
  const invoice = invoices.find(i => i.id === invoiceId);

  if (!invoice) {
    Toast.error("Invoice record not found.");
    Router.navigate('invoices');
    return;
  }

  const clients = AppState.getClients();
  const client = clients.find(c => c.id === invoice.clientId) || { name: invoice.clientName, billingAddress: '' };
  const userSettings = AppState.getSettings() || {};

  const docContainer = document.getElementById('printable-invoice-document');
  if (!docContainer) return;

  let itemsRows = '';
  if (invoice.items) {
    invoice.items.forEach(it => {
      itemsRows += `
        <tr>
          <td>${Utils.escapeHtml(it.description)}</td>
          <td style="text-align:center;">${it.quantity}</td>
          <td style="text-align:right;">${Utils.formatCurrency(it.rate)}</td>
          <td style="text-align:right; font-weight:600;">${Utils.formatCurrency(it.quantity * it.rate)}</td>
        </tr>
      `;
    });
  }

  docContainer.innerHTML = `
    <div class="invoice-doc-header">
      <div>
        <div style="font-weight:800; font-size:1.5rem; line-height:1.1; margin-bottom:0.25rem;">${Utils.escapeHtml(userSettings.businessName || userSettings.name || 'FreelanceLedger Consultant')}</div>
        <p style="font-size:0.85rem; color:var(--text-secondary); max-width:300px;">${Utils.escapeHtml(userSettings.address || 'Mumbai, Maharashtra, India')}</p>
        <div style="font-size:0.8rem; color:var(--text-tertiary); margin-top:0.35rem;">
          <strong>GSTIN:</strong> ${Utils.escapeHtml(userSettings.gstin || '27ABCDE1234F1Z5')} | <strong>PAN:</strong> ${Utils.escapeHtml(userSettings.pan || 'ABCDE1234F')}
        </div>
      </div>

      <div class="invoice-doc-meta">
        <div class="invoice-doc-title">INVOICE</div>
        <div class="text-mono" style="font-size:1.1rem; font-weight:700; margin-top:0.35rem;">${invoice.number}</div>
        <div style="margin-top:0.75rem;">
          <span class="badge ${invoice.status === 'paid' ? 'badge-success' : invoice.status === 'overdue' ? 'badge-danger' : 'badge-warning'}">${invoice.status}</span>
        </div>
      </div>
    </div>

    <div class="invoice-doc-parties">
      <div class="party-block">
        <h4>Billed To</h4>
        <p><strong>${Utils.escapeHtml(client.name)}</strong></p>
        <p>${Utils.escapeHtml(client.company || '')}</p>
        <p style="white-space:pre-line;">${Utils.escapeHtml(client.billingAddress || 'India')}</p>
        ${client.gstin ? `<p style="font-size:0.8rem; margin-top:0.35rem;"><strong>GSTIN:</strong> ${Utils.escapeHtml(client.gstin)}</p>` : ''}
      </div>

      <div class="party-block" style="text-align:right;">
        <h4>Invoice Details</h4>
        <p><strong>Issue Date:</strong> ${Utils.formatDate(invoice.issueDate)}</p>
        <p><strong>Due Date:</strong> ${Utils.formatDate(invoice.dueDate)}</p>
        <p><strong>Payment Terms:</strong> ${invoice.paymentTerms || '15 Days'}</p>
      </div>
    </div>

    <table class="invoice-items-table">
      <thead>
        <tr>
          <th style="text-align:left;">Description</th>
          <th style="text-align:center; width:80px;">Qty</th>
          <th style="text-align:right; width:120px;">Rate</th>
          <th style="text-align:right; width:130px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="invoice-totals-block">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${Utils.formatCurrency(invoice.subtotal)}</span>
      </div>
      ${invoice.discount > 0 ? `
      <div class="totals-row">
        <span>Discount (${invoice.discount}%)</span>
        <span>-${Utils.formatCurrency(invoice.subtotal * (invoice.discount/100))}</span>
      </div>` : ''}
      <div class="totals-row">
        <span>GST Tax (${invoice.taxPercent || 18}%)</span>
        <span>${Utils.formatCurrency(invoice.taxAmount)}</span>
      </div>
      <div class="totals-row grand-total">
        <span>Total Due</span>
        <span>${Utils.formatCurrency(invoice.total)}</span>
      </div>
    </div>

    <div style="border-top:1px solid var(--border-color); padding-top:1.5rem; margin-top:2rem; font-size:0.85rem; color:var(--text-secondary);">
      <strong>Payment Instructions:</strong>
      <p style="margin-top:0.25rem;">${Utils.escapeHtml(invoice.notes || 'Please transfer payment to HDFC Bank Account via NEFT/UPI.')}</p>
    </div>
  `;

  // Action Button Listeners
  const printBtn = document.getElementById('print-invoice-btn');
  if (printBtn) {
    printBtn.onclick = () => window.print();
  }
}
