/* ============================================================
   SETTINGS, PROFILE & BACKUP/RESTORE SCRIPT
   ============================================================ */

document.addEventListener('ledger-ready', () => {
  renderSettings();

  // Save Profile & Business Settings
  const saveBtn = document.getElementById('save-settings-btn');
  if (saveBtn) {
    saveBtn.onclick = saveSettings;
  }

  // Export Data Button
  const exportBtn = document.getElementById('export-data-btn');
  if (exportBtn) {
    exportBtn.onclick = exportBackupFile;
  }

  // Import Data File Picker Listener
  const importInput = document.getElementById('import-file-input');
  if (importInput) {
    importInput.onchange = handleImportFile;
  }

  // Clear Workspace Button
  const clearBtn = document.getElementById('clear-workspace-btn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      ConfirmDialog.show(
        'Clear Entire Workspace Data?',
        'WARNING: This will permanently delete all your clients, work entries, invoices, and payments. This action CANNOT be undone.',
        'Clear Workspace',
        async () => {
          try { await StorageManager.clearWorkspace(); }
          catch (err) { Toast.error(err.message); return; }
          StorageManager.logActivity('workspace_cleared', 'Workspace Cleared', 'User cleared all workspace data.');
          Toast.success('Workspace data cleared.');
          setTimeout(() => window.location.reload(), 500);
        }
      );
    };
  }

  function renderSettings() {
    const user = Auth.getCurrentUser() || {};
    const settings = AppState.getSettings() || {};

    setVal('setting-name', settings.name || user.name || '');
    setVal('setting-email', user.email || '');
    setVal('setting-phone', settings.phone || '');
    setVal('setting-country', settings.country || 'India');

    setVal('setting-business-name', settings.businessName || '');
    setVal('setting-gstin', settings.gstin || '');
    setVal('setting-pan', settings.pan || '');
    setVal('setting-address', settings.address || '');

    setVal('setting-currency', settings.currency || 'INR');
    setVal('setting-date-format', settings.dateFormat || 'DD/MM/YYYY');
    setVal('setting-inv-prefix', settings.invoicePrefix || 'INV-2026-');
    setVal('setting-payment-terms', settings.paymentTerms || '15 Days');
  }

  function saveSettings() {
    const settings = AppState.getSettings() || {};

    settings.name = getVal('setting-name');
    settings.email = Auth.getCurrentUser().email;
    settings.phone = getVal('setting-phone');
    settings.country = getVal('setting-country');

    settings.businessName = getVal('setting-business-name');
    settings.gstin = getVal('setting-gstin').toUpperCase();
    settings.pan = getVal('setting-pan').toUpperCase();
    settings.address = getVal('setting-address');

    settings.currency = getVal('setting-currency');
    settings.dateFormat = getVal('setting-date-format');
    settings.invoicePrefix = getVal('setting-inv-prefix');
    settings.paymentTerms = getVal('setting-payment-terms');

    StorageManager.setItem(STORAGE_KEYS.SETTINGS, settings);

    // Update active user session name
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
      currentUser.name = settings.name;
      StorageManager.setItem(STORAGE_KEYS.SESSION, currentUser);
    }

    StorageManager.logActivity('settings_saved', 'Settings Saved', 'Updated business profile and preferences.');
    Toast.success('Settings and profile updated successfully.');
  }

  function exportBackupFile() {
    const jsonStr = StorageManager.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freelanceledger-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Toast.success('Backup downloaded as JSON.');
  }

  function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      ConfirmDialog.show(
        'Confirm Data Import',
        'Importing this backup file will restore client directory, work logs, invoices, and settings. Continue?',
        'Import & Restore',
        async () => {
          const success = await StorageManager.importBackup(content);
          if (success) {
            Toast.success('Data imported successfully! Reloading...');
            setTimeout(() => window.location.reload(), 600);
          } else {
            Toast.error('Failed to import backup. File format invalid.');
          }
        },
        false
      );
    };
    reader.readAsText(file);
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
});
