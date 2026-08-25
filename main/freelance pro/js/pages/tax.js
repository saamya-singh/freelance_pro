/* ============================================================
   INDIAN TAX CALCULATOR CONTROLLER (FY 2025-26 NEW REGIME)
   ============================================================ */

let currentTaxCalculation = null;
let savedTaxCalculation = null;
let taxSaveSignature = '';

const TAX_INPUT_IDS = [
  'tax-annual-revenue',
  'tax-expenses',
  'tax-other-income',
  'tax-tds'
];

document.addEventListener('DOMContentLoaded', () => {
  initTaxCalculator();
});

function getTaxInputs() {
  return {
    annualRevenue: Number(document.getElementById('tax-annual-revenue')?.value) || 0,
    allowableExpenses: Number(document.getElementById('tax-expenses')?.value) || 0,
    otherIncome: Number(document.getElementById('tax-other-income')?.value) || 0,
    tdsDeducted: Number(document.getElementById('tax-tds')?.value) || 0
  };
}

function makeTaxSignature(inputs, result) {
  return JSON.stringify({
    inputs,
    totalTaxLiability: Number(result.totalTaxLiability) || 0,
    netTakeHome: Number(result.netTakeHome) || 0
  });
}

function initTaxCalculator() {
  TAX_INPUT_IDS.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.addEventListener('input', calculateAndRenderTax);
  });

  const saveBtn = document.getElementById('save-tax-calculation-btn');
  if (saveBtn) saveBtn.addEventListener('click', saveCurrentTaxCalculation);

  // Restore the last explicitly saved calculation first. Only fall back to
  // paid invoices when the user has never saved a tax calculation.
  savedTaxCalculation = AppState.getSavedTaxCalculation();
  if (savedTaxCalculation && savedTaxCalculation.inputs) {
    setTaxInputs(savedTaxCalculation.inputs);
  } else {
    prefillRevenueFromPaidInvoices();
  }

  calculateAndRenderTax();

  // Keep this page in sync if the tax calculation is changed elsewhere.
  AppState.subscribe('tax_calculation_updated', saved => {
    savedTaxCalculation = saved;
    if (saved && saved.inputs) setTaxInputs(saved.inputs);
    calculateAndRenderTax();
  });

  // Cross-tab synchronization.
  window.addEventListener('storage', event => {
    const expectedKey = StorageManager.getUserKey(STORAGE_KEYS.TAX_CALCULATION);
    if (event.key === expectedKey) {
      savedTaxCalculation = AppState.getSavedTaxCalculation();
      calculateAndRenderTax();
    }
  });
}

function setTaxInputs(inputs) {
  const values = {
    'tax-annual-revenue': inputs.annualRevenue,
    'tax-expenses': inputs.allowableExpenses,
    'tax-other-income': inputs.otherIncome,
    'tax-tds': inputs.tdsDeducted
  };

  Object.entries(values).forEach(([id, value]) => {
    const input = document.getElementById(id);
    if (input && value !== undefined && value !== null) input.value = value;
  });
}

function prefillRevenueFromPaidInvoices() {
  const invoices = AppState.getInvoices();
  const paidTotal = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + (Number(i.total) || 0), 0);

  if (paidTotal > 0) {
    const revInput = document.getElementById('tax-annual-revenue');
    if (revInput) revInput.value = paidTotal;
  }
}

function calculateAndRenderTax() {
  const inputs = getTaxInputs();
  const result = TaxEngine.calculateTax(inputs);
  currentTaxCalculation = { inputs, result };

  // Update UI Elements
  const grossEl = document.getElementById('tax-gross-income');
  if (grossEl) grossEl.textContent = Utils.formatCurrency(result.grossIncome);

  const bizEl = document.getElementById('tax-business-profit');
  if (bizEl) bizEl.textContent = Utils.formatCurrency(result.businessProfit);

  const taxIncEl = document.getElementById('taxable-income');
  if (taxIncEl) taxIncEl.textContent = Utils.formatCurrency(result.taxableIncome);

  const beforeRebateEl = document.getElementById('tax-before-rebate');
  if (beforeRebateEl) beforeRebateEl.textContent = Utils.formatCurrency(result.taxBeforeRebate);

  const rebateEl = document.getElementById('tax-rebate-87a');
  if (rebateEl) rebateEl.textContent = Utils.formatCurrency(result.rebate87A);

  const baseEl = document.getElementById('tax-base-amount');
  if (baseEl) baseEl.textContent = Utils.formatCurrency(result.baseTax);

  const cessEl = document.getElementById('tax-cess-amount');
  if (cessEl) cessEl.textContent = Utils.formatCurrency(result.cessAmount);

  const grossLiabilityEl = document.getElementById('tax-gross-liability');
  if (grossLiabilityEl) grossLiabilityEl.textContent = Utils.formatCurrency(result.grossTaxLiability);

  const tdsCreditEl = document.getElementById('tax-tds-credit');
  if (tdsCreditEl) tdsCreditEl.textContent = Utils.formatCurrency(result.tdsCredit);

  const totalEl = document.getElementById('tax-total-liability');
  if (totalEl) totalEl.textContent = Utils.formatCurrency(result.balanceTaxPayable);

  const rateEl = document.getElementById('tax-effective-rate');
  if (rateEl) rateEl.textContent = `${result.effectiveRate.toFixed(1)}%`;

  const monEl = document.getElementById('tax-monthly-provision');
  if (monEl) monEl.textContent = Utils.formatCurrency(result.monthlyProvision);

  const netEl = document.getElementById('tax-net-takehome');
  if (netEl) netEl.textContent = Utils.formatCurrency(result.netTakeHome);

  const cashNetEl = document.getElementById('tax-cash-takehome');
  if (cashNetEl) cashNetEl.textContent = Utils.formatCurrency(result.cashTakeHome);

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

  updateSaveState();
}

function updateSaveState() {
  const statusEl = document.getElementById('tax-save-status');
  const saveBtn = document.getElementById('save-tax-calculation-btn');
  if (!currentTaxCalculation) return;

  const signature = makeTaxSignature(currentTaxCalculation.inputs, currentTaxCalculation.result);
  const savedSignature = savedTaxCalculation
    ? makeTaxSignature(savedTaxCalculation.inputs || {}, savedTaxCalculation.result || {})
    : '';
  const isSaved = signature === savedSignature;
  taxSaveSignature = signature;

  if (statusEl) {
    statusEl.textContent = isSaved
      ? `Saved to dashboard • ${new Date(savedTaxCalculation.savedAt).toLocaleString()}`
      : 'Unsaved changes • save this calculation to update your dashboard';
    statusEl.className = isSaved
      ? 'text-xs font-bold text-lime-600 dark:text-lime-400'
      : 'text-xs font-bold text-amber-600 dark:text-amber-400';
  }

  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.textContent = isSaved ? 'Saved to Dashboard' : 'Save Tax & Sync Dashboard';
    saveBtn.classList.toggle('opacity-70', isSaved);
  }
}

function saveCurrentTaxCalculation() {
  if (!currentTaxCalculation) return;

  const saveBtn = document.getElementById('save-tax-calculation-btn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';
  }

  const saved = AppState.saveTaxCalculation(currentTaxCalculation);
  if (!saved) {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Tax & Sync Dashboard';
    }
    if (typeof Toast !== 'undefined') Toast.error('Could not save the tax calculation. Please try again.');
    return;
  }

  savedTaxCalculation = saved;
  updateSaveState();
  if (typeof Toast !== 'undefined') Toast.success('Tax and net take-home saved to your dashboard.');
}
