/* ============================================================
   INDIAN TAX COMPUTATION ENGINE (FY 2025-26)
   Keeps gross computed tax, Sec 87A rebate, TDS credit and
   final balance payable separate so the UI never hides tax.
   ============================================================ */

const TaxEngine = {
  calculateTax(options = {}) {
    const {
      annualRevenue = 0,
      allowableExpenses = 0,
      otherIncome = 0,
      tdsDeducted = 0,
      regime = 'new'
    } = options;

    const revenue = Math.max(0, Number(annualRevenue) || 0);
    const expenses = Math.max(0, Number(allowableExpenses) || 0);
    const other = Math.max(0, Number(otherIncome) || 0);
    const tds = Math.max(0, Number(tdsDeducted) || 0);

    const grossIncome = revenue + other;
    const businessProfit = Math.max(0, revenue - expenses);

    // Freelance/business income is not salary income. Do not apply the
    // ₹75,000 salary standard deduction to business/professional profit.
    const standardDeduction = 0;
    const taxableIncome = Math.max(0, businessProfit + other - standardDeduction);

    const slabs = [
      { min: 0, max: 400000, rate: 0, label: 'Up to ₹4,00,000 (0%)' },
      { min: 400000, max: 800000, rate: 0.05, label: '₹4,00,001 to ₹8,00,000 (5%)' },
      { min: 800000, max: 1200000, rate: 0.10, label: '₹8,00,001 to ₹12,00,000 (10%)' },
      { min: 1200000, max: 1600000, rate: 0.15, label: '₹12,00,001 to ₹16,00,000 (15%)' },
      { min: 1600000, max: 2000000, rate: 0.20, label: '₹16,00,001 to ₹20,00,000 (20%)' },
      { min: 2000000, max: 2400000, rate: 0.25, label: '₹20,00,001 to ₹24,00,000 (25%)' },
      { min: 2400000, max: Infinity, rate: 0.30, label: 'Above ₹24,00,000 (30%)' }
    ];

    let taxBeforeRebate = 0;
    const breakdown = [];

    slabs.forEach(slab => {
      if (taxableIncome > slab.min) {
        const taxableAmountInSlab = Math.min(taxableIncome - slab.min, slab.max - slab.min);
        const taxInSlab = Math.round(taxableAmountInSlab * slab.rate);
        taxBeforeRebate += taxInSlab;
        breakdown.push({
          slab: slab.label,
          tax: taxInSlab,
          taxableAmount: taxableAmountInSlab
        });
      }
    });

    // FY 2025-26 new regime: Sec 87A rebate can reduce tax to nil when
    // total taxable income is within the ₹12 lakh threshold.
    const rebate87A = taxableIncome <= 1200000 ? taxBeforeRebate : 0;
    const baseTax = Math.max(0, taxBeforeRebate - rebate87A);
    const cessAmount = Math.round(baseTax * 0.04);
    const grossTaxLiability = baseTax + cessAmount;
    const tdsCredit = Math.min(tds, grossTaxLiability);
    const balanceTaxPayable = Math.max(0, grossTaxLiability - tdsCredit);
    const excessTds = Math.max(0, tds - grossTaxLiability);

    const effectiveRate = grossIncome > 0 ? (grossTaxLiability / grossIncome) * 100 : 0;
    const monthlyProvision = Math.round(grossTaxLiability / 12);

    // Cash take-home reflects expenses and TDS already withheld. TDS remains
    // a tax credit/refund claim rather than an additional tax liability.
    const cashTakeHome = Math.max(0, grossIncome - expenses - tds);
    const netTakeHome = Math.max(0, grossIncome - expenses - grossTaxLiability);

    return {
      grossIncome,
      businessProfit,
      standardDeduction,
      taxableIncome,
      taxBeforeRebate,
      rebate87A,
      baseTax,
      cessAmount,
      grossTaxLiability,
      tdsCredit,
      balanceTaxPayable,
      excessTds,
      totalTaxLiability: balanceTaxPayable,
      effectiveRate,
      monthlyProvision,
      cashTakeHome,
      netTakeHome,
      breakdown,
      regime
    };
  }
};
