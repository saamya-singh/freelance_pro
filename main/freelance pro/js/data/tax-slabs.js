/* ============================================================
   INDIAN INCOME TAX SLABS & REGIME CONFIGURATION
   ============================================================ */

const DEFAULT_TAX_CONFIG = {
  financialYear: "2025-26",
  defaultRegime: "new",
  cessRate: 0.04, // 4% Health & Education Cess
  standardDeductionNew: 75000, // ₹75,000 standard deduction under New Regime
  standardDeductionOld: 50000, // ₹50,000 standard deduction under Old Regime
  
  // New Tax Regime Slabs (Section 115BAC)
  newRegimeSlabs: [
    { min: 0, max: 300000, rate: 0, label: "Up to ₹3,00,000" },
    { min: 300000, max: 700000, rate: 0.05, label: "₹3,00,001 to ₹7,00,000" },
    { min: 700000, max: 1000000, rate: 0.10, label: "₹7,00,001 to ₹10,00,000" },
    { min: 1000000, max: 1200000, rate: 0.15, label: "₹10,00,001 to ₹12,00,000" },
    { min: 1200000, max: 1500000, rate: 0.20, label: "₹12,00,001 to ₹15,00,000" },
    { min: 1500000, max: Infinity, rate: 0.30, label: "Above ₹15,00,000" }
  ],

  // Old Tax Regime Slabs
  oldRegimeSlabs: [
    { min: 0, max: 250000, rate: 0, label: "Up to ₹2,50,000" },
    { min: 250000, max: 500000, rate: 0.05, label: "₹2,50,001 to ₹5,00,000" },
    { min: 500000, max: 1000000, rate: 0.20, label: "₹5,00,001 to ₹10,00,000" },
    { min: 1000000, max: Infinity, rate: 0.30, label: "Above ₹10,00,000" }
  ],

  // Surcharge Rates based on Taxable Income
  surchargeSlabs: [
    { min: 0, max: 5000000, rate: 0 },
    { min: 5000000, max: 10000000, rate: 0.10 },
    { min: 10000000, max: 20000000, rate: 0.15 },
    { min: 20000000, max: Infinity, rate: 0.25 }
  ]
};
