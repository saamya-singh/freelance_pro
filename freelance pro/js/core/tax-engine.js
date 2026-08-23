/* ============================================================
   INDIAN TAX COMPUTATION ENGINE (FY 2025-26)
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

    const grossIncome = Number(annualRevenue) + Number(otherIncome);
    const businessProfit = Math.max(0, Number(annualRevenue) - Number(allowableExpenses));
    
    // Standard deduction under New Tax Regime FY 2025-26
    const stdDeduction = 75000;
    const taxableIncome = Math.max(0, businessProfit + Number(otherIncome) - stdDeduction);

    let baseTax = 0;
    const breakdown = [];

    // New Tax Regime Slabs (FY 2025-26 / Sec 115BAC)
    const slabs = [
      { min: 0, max: 400000, rate: 0, label: "Up to ₹4,00,000 (0%)" },
      { min: 400000, max: 800000, rate: 0.05, label: "₹4,00,001 to ₹8,00,000 (5%)" },
      { min: 800000, max: 1200000, rate: 0.10, label: "₹8,00,001 to ₹12,00,000 (10%)" },
      { min: 1200000, max: 1600000, rate: 0.15, label: "₹12,00,001 to ₹16,00,000 (15%)" },
      { min: 1600000, max: 2000000, rate: 0.20, label: "₹16,00,001 to ₹20,00,000 (20%)" },
      { min: 2000000, max: 2400000, rate: 0.25, label: "₹20,00,001 to ₹24,00,000 (25%)" },
      { min: 2400000, max: Infinity, rate: 0.30, label: "Above ₹24,00,000 (30%)" }
    ];

    slabs.forEach(slab => {
      if (taxableIncome > slab.min) {
        const taxableAmountInSlab = Math.min(taxableIncome - slab.min, slab.max - slab.min);
        const taxInSlab = Math.round(taxableAmountInSlab * slab.rate);
        baseTax += taxInSlab;

        breakdown.push({
          slab: slab.label,
          tax: taxInSlab,
          taxableAmount: taxableAmountInSlab
        });
      }
    });

    // Tax Rebate under Sec 87A (Nil tax if taxable income <= ₹12,00,000 under FY 25-26 New Regime)
    if (taxableIncome <= 1200000) {
      baseTax = 0;
    }

    const cessAmount = Math.round(baseTax * 0.04);
    const totalTaxLiability = Math.max(0, baseTax + cessAmount - Number(tdsDeducted));
    const effectiveRate = grossIncome > 0 ? (totalTaxLiability / grossIncome) * 100 : 0;
    const monthlyProvision = Math.round(totalTaxLiability / 12);
    const netTakeHome = Math.max(0, grossIncome - Number(allowableExpenses) - totalTaxLiability);

    return {
      grossIncome,
      businessProfit,
      taxableIncome,
      baseTax,
      cessAmount,
      totalTaxLiability,
      effectiveRate,
      monthlyProvision,
      netTakeHome,
      breakdown
    };
  }
};
