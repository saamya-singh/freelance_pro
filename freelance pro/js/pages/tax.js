/* ============================================================
   INDIAN TAX CALCULATOR CONTROLLER (FY 2025-26 NEW REGIME)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTaxCalculator();
});

function initTaxCalculator() {
  const formInputs = [
    'tax-annual-revenue',
    'tax-expenses',
    'tax-other-income',
    'tax-tds'
  ];

  formInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => calculateAndRenderTax());
    }
  });

  // Pre-fill revenue from paid invoices if available
  const invoices = AppState.getInvoices();
  let paidTotal = 0;
  invoices.filter(i => i.status === 'paid').forEach(i => paidTotal += Number(i.total) || 0);

  if (paidTotal > 0) {
    const revInput = document.getElementById('tax-annual-revenue');
    if (revInput) revInput.value = paidTotal;
  }

  calculateAndRenderTax();
}

function calculateAndRenderTax() {
  const rev = Number(document.getElementById('tax-annual-revenue')?.value) || 0;
  const exp = Number(document.getElementById('tax-expenses')?.value) || 0;
  const oth = Number(document.getElementById('tax-other-income')?.value) || 0;
  const tds = Number(document.getElementById('tax-tds')?.value) || 0;

  const result = TaxEngine.calculateTax({
    annualRevenue: rev,
    allowableExpenses: exp,
    otherIncome: oth,
    tdsDeducted: tds
  });

  // Update UI Elements
  const grossEl = document.getElementById('tax-gross-income');
  if (grossEl) grossEl.textContent = Utils.formatCurrency(result.grossIncome);

  const bizEl = document.getElementById('tax-business-profit');
  if (bizEl) bizEl.textContent = Utils.formatCurrency(result.businessProfit);

  const taxIncEl = document.getElementById('taxable-income');
  if (taxIncEl) taxIncEl.textContent = Utils.formatCurrency(result.taxableIncome);

  const baseEl = document.getElementById('tax-base-amount');
  if (baseEl) baseEl.textContent = Utils.formatCurrency(result.baseTax);

  const cessEl = document.getElementById('tax-cess-amount');
  if (cessEl) cessEl.textContent = Utils.formatCurrency(result.cessAmount);

  const totalEl = document.getElementById('tax-total-liability');
  if (totalEl) totalEl.textContent = Utils.formatCurrency(result.totalTaxLiability);

  const rateEl = document.getElementById('tax-effective-rate');
  if (rateEl) rateEl.textContent = `${result.effectiveRate.toFixed(1)}%`;

  const monEl = document.getElementById('tax-monthly-provision');
  if (monEl) monEl.textContent = Utils.formatCurrency(result.monthlyProvision);

  const netEl = document.getElementById('tax-net-takehome');
  if (netEl) netEl.textContent = Utils.formatCurrency(result.netTakeHome);

  // Render Slab Breakdown List
  const breakdownContainer = document.getElementById('tax-slabs-breakdown-list');
  if (breakdownContainer) {
    let html = '';
    result.breakdown.forEach(b => {
      html += `
        <div class="flex justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span>${Utils.escapeHtml(b.slab)}</span>
          <span class="font-mono font-bold text-slate-900 dark:text-slate-100">${Utils.formatCurrency(b.tax)}</span>
        </div>
      `;
    });
    breakdownContainer.innerHTML = html;
  }
}
