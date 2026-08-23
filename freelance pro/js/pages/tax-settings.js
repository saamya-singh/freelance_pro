/* ============================================================
   TAX SETTINGS & CONFIGURATION MANAGER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderTaxSettings();

  const saveBtn = document.getElementById('save-tax-settings-btn');
  if (saveBtn) {
    saveBtn.onclick = saveTaxSettings;
  }

  const resetBtn = document.getElementById('reset-tax-settings-btn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      ConfirmDialog.show(
        'Reset Tax Settings',
        'Reset tax slabs and configurations to default Indian FY 2025-26 rules?',
        'Reset Defaults',
        () => {
          StorageManager.setItem(STORAGE_KEYS.TAX_SETTINGS, DEFAULT_TAX_CONFIG);
          Toast.success('Tax settings reset to defaults.');
          renderTaxSettings();
        }
      );
    };
  }

  function renderTaxSettings() {
    const config = AppState.getTaxSettings() || DEFAULT_TAX_CONFIG;

    const regimeSelect = document.getElementById('tax-default-regime');
    const stdNewInput = document.getElementById('tax-std-new');
    const stdOldInput = document.getElementById('tax-std-old');
    const cessInput = document.getElementById('tax-cess-rate');

    if (regimeSelect) regimeSelect.value = config.defaultRegime || 'new';
    if (stdNewInput) stdNewInput.value = config.standardDeductionNew || 75000;
    if (stdOldInput) stdOldInput.value = config.standardDeductionOld || 50000;
    if (cessInput) cessInput.value = (config.cessRate * 100) || 4;

    // Render Slab Items List
    renderSlabTable('new-regime-slabs-container', config.newRegimeSlabs || DEFAULT_TAX_CONFIG.newRegimeSlabs);
  }

  function renderSlabTable(containerId, slabs) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <table class="table">
        <thead>
          <tr>
            <th>Income Bracket</th>
            <th>Tax Rate (%)</th>
          </tr>
        </thead>
        <tbody>
    `;

    slabs.forEach(slab => {
      html += `
        <tr>
          <td><strong>${slab.label}</strong></td>
          <td><span class="badge badge-info">${(slab.rate * 100).toFixed(0)}%</span></td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    container.innerHTML = html;
  }

  function saveTaxSettings() {
    const config = AppState.getTaxSettings() || DEFAULT_TAX_CONFIG;

    const defaultRegime = document.getElementById('tax-default-regime').value;
    const stdNew = Number(document.getElementById('tax-std-new').value) || 75000;
    const stdOld = Number(document.getElementById('tax-std-old').value) || 50000;
    const cessRate = (Number(document.getElementById('tax-cess-rate').value) || 4) / 100;

    config.defaultRegime = defaultRegime;
    config.standardDeductionNew = stdNew;
    config.standardDeductionOld = stdOld;
    config.cessRate = cessRate;

    StorageManager.setItem(STORAGE_KEYS.TAX_SETTINGS, config);
    StorageManager.logActivity('tax_settings_updated', 'Tax Settings Updated', 'Updated tax regime and slab rules.');
    Toast.success('Tax configuration saved successfully.');
  }
});
