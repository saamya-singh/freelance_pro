const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('tax calculations work with JSON-persisted open-ended slabs', () => {
  const root = path.join(__dirname, '..');
  const config = vm.runInNewContext(fs.readFileSync(path.join(root, 'js/data/tax-slabs.js'), 'utf8') + '\nDEFAULT_TAX_CONFIG');
  const saved = JSON.parse(JSON.stringify(config)); // Infinity becomes null on disk.
  const context = {
    StorageManager: { getItem: () => saved },
    STORAGE_KEYS: { TAX_SETTINGS: 'taxSettings' },
    DEFAULT_TAX_CONFIG: config
  };
  const engine = vm.runInNewContext(fs.readFileSync(path.join(root, 'js/core/tax-engine.js'), 'utf8') + '\nTaxEngine', context);
  const result = engine.calculateTax({ annualRevenue: 2000000, regime: 'new' });
  assert.ok(result.totalTaxLiability > 0);
  assert.ok(result.breakdown.at(-1).tax > 0);
  assert.equal(result.monthlyProvision, result.totalTaxLiability / 12);
});
