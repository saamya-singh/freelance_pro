/* Estimate income tax from the active workspace's tax configuration. */
const TaxEngine = {
  calculateTax({ annualRevenue = 0, allowableExpenses = 0, otherIncome = 0, deductions80C = 0, tdsDeducted = 0, regime = 'new' } = {}) {
    const config = StorageManager.getItem(STORAGE_KEYS.TAX_SETTINGS, DEFAULT_TAX_CONFIG);
    const businessProfit = Math.max(0, Number(annualRevenue) - Number(allowableExpenses));
    const grossIncome = businessProfit + Math.max(0, Number(otherIncome));
    const old = regime === 'old';
    const deduction = old ? Number(deductions80C) + Number(config.standardDeductionOld || 0) : Number(config.standardDeductionNew || 0);
    const taxableIncome = Math.max(0, grossIncome - deduction);
    const slabs = old ? config.oldRegimeSlabs : config.newRegimeSlabs;
    const breakdown = slabs.map(slab => ({
      slab: slab.label || `Above ₹${slab.min}`,
      tax: Math.max(0, Math.min(taxableIncome, slab.max == null ? Infinity : slab.max) - Number(slab.min)) * Number(slab.rate)
    }));
    const baseTax = breakdown.reduce((total, row) => total + row.tax, 0);
    const surchargeRate = (config.surchargeSlabs || []).find(slab => taxableIncome >= slab.min && (slab.max == null || taxableIncome < slab.max))?.rate || 0;
    const cessAmount = baseTax * (1 + surchargeRate) * Number(config.cessRate || 0);
    const totalTaxLiability = baseTax * (1 + surchargeRate) + cessAmount;
    const outstandingTax = Math.max(0, totalTaxLiability - Number(tdsDeducted));
    return {
      grossIncome, businessProfit, taxableIncome, breakdown, baseTax, cessAmount,
      totalTaxLiability, effectiveRate: grossIncome ? totalTaxLiability / grossIncome * 100 : 0,
      monthlyProvision: outstandingTax / 12, netTakeHome: businessProfit - totalTaxLiability
    };
  }
};
