/* ============================================================
   FREELANCELEDGER INDIA - DEMO SEED DATA
   ============================================================ */

const DEMO_DATA = {
  user: {
    id: "user_demo_101",
    name: "Rahul Sharma",
    email: "rahul@freelancedger.in",
    phone: "+91 98765 43210",
    country: "India",
    businessName: "Rahul Sharma Design & Consulting",
    gstin: "27ABCDE1234F1Z5",
    pan: "ABCDE1234F",
    address: "Suite 402, Trade Tower, BKC, Mumbai, Maharashtra - 400051",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    invoicePrefix: "INV-2026-",
    paymentTerms: "15 Days"
  },

  clients: [
    {
      id: "cli_acme_01",
      name: "Acme Technologies Pvt Ltd",
      company: "Acme Group India",
      email: "billing@acmetechnologies.in",
      phone: "+91 22 4567 8900",
      country: "India",
      currency: "INR",
      billingAddress: "Plot 12, Hinjewadi IT Park Phase 1, Pune, Maharashtra 411057",
      gstin: "27AAACA1234A1Z2",
      pan: "AAACA1234A",
      notes: "Key enterprise client for web application design & frontend engineering.",
      status: "active",
      createdAt: "2025-11-10T10:00:00Z"
    },
    {
      id: "cli_nova_02",
      name: "Nova Labs Inc",
      company: "Nova Digital",
      email: "finance@novalabs.io",
      phone: "+1 415 890 1234",
      country: "United States",
      currency: "INR",
      billingAddress: "500 Howard Street, San Francisco, CA 94105, USA",
      gstin: "URP-NOT-APPLICABLE",
      pan: "NOTAPPLICABLE",
      notes: "Export of services client. Billing in INR equivalents.",
      status: "active",
      createdAt: "2025-12-01T11:30:00Z"
    },
    {
      id: "cli_byte_03",
      name: "ByteBridge Solutions",
      company: "ByteBridge India",
      email: "accounts@bytebridge.in",
      phone: "+91 80 2345 6789",
      country: "India",
      currency: "INR",
      billingAddress: "Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103",
      gstin: "29BBBCC5678D1Z9",
      pan: "BBBCC5678D",
      notes: "Quarterly UI overhaul retainer contract.",
      status: "active",
      createdAt: "2026-01-15T09:15:00Z"
    },
    {
      id: "cli_growth_04",
      name: "Growth Studio",
      company: "Growth Media LLP",
      email: "hello@growthstudio.in",
      phone: "+91 11 9876 5432",
      country: "India",
      currency: "INR",
      billingAddress: "Connaught Place, New Delhi 110001",
      gstin: "07DDDEE9012F1Z1",
      pan: "DDDEE9012F",
      notes: "Branding and design sprint partner.",
      status: "inactive",
      createdAt: "2025-08-20T14:00:00Z"
    }
  ],

  work: [
    {
      id: "wrk_101",
      clientId: "cli_acme_01",
      clientName: "Acme Technologies Pvt Ltd",
      project: "Dashboard Redesign",
      description: "Implemented high-density data tables and customizable metric widgets.",
      date: "2026-02-18",
      hours: 14.5,
      rate: 3500,
      amount: 50750,
      billable: true,
      status: "invoiced",
      createdAt: "2026-02-18T16:00:00Z"
    },
    {
      id: "wrk_102",
      clientId: "cli_nova_02",
      clientName: "Nova Labs Inc",
      project: "Design System Tokens",
      description: "Created Swiss editorial typography tokens and color palette system.",
      date: "2026-02-15",
      hours: 20,
      rate: 4000,
      amount: 80000,
      billable: true,
      status: "invoiced",
      createdAt: "2026-02-15T18:30:00Z"
    },
    {
      id: "wrk_103",
      clientId: "cli_byte_03",
      clientName: "ByteBridge Solutions",
      project: "Mobile Responsive Layout",
      description: "Converted legacy desktop tables into responsive CSS cards and slide drawers.",
      date: "2026-02-12",
      hours: 18,
      rate: 3500,
      amount: 63000,
      billable: true,
      status: "invoiced",
      createdAt: "2026-02-12T14:20:00Z"
    },
    {
      id: "wrk_104",
      clientId: "cli_acme_01",
      clientName: "Acme Technologies Pvt Ltd",
      project: "Financial Reports Export",
      description: "Added client-side JSON and CSV backup generator.",
      date: "2026-02-20",
      hours: 8,
      rate: 3500,
      amount: 28000,
      billable: true,
      status: "unbilled",
      createdAt: "2026-02-20T17:45:00Z"
    }
  ],

  invoices: [
    {
      id: "inv_1001",
      number: "INV-2026-001",
      clientId: "cli_acme_01",
      clientName: "Acme Technologies Pvt Ltd",
      issueDate: "2026-02-01",
      dueDate: "2026-02-16",
      currency: "INR",
      paymentTerms: "15 Days",
      status: "paid",
      items: [
        { description: "Dashboard Redesign Phase 1", quantity: 1, rate: 150000, amount: 150000 },
        { description: "UI Component Library Integration", quantity: 1, rate: 50000, amount: 50000 }
      ],
      subtotal: 200000,
      discount: 0,
      taxPercent: 18,
      taxAmount: 36000,
      total: 236000,
      notes: "Payment received with thanks via NEFT.",
      createdAt: "2026-02-01T10:00:00Z"
    },
    {
      id: "inv_1002",
      number: "INV-2026-002",
      clientId: "cli_nova_02",
      clientName: "Nova Labs Inc",
      issueDate: "2026-02-10",
      dueDate: "2026-02-25",
      currency: "INR",
      paymentTerms: "15 Days",
      status: "paid",
      items: [
        { description: "Design System Architecture & Guidelines", quantity: 1, rate: 210000, amount: 210000 }
      ],
      subtotal: 210000,
      discount: 0,
      taxPercent: 0,
      taxAmount: 0,
      total: 210000,
      notes: "Export of Service without payment of tax under LUT.",
      createdAt: "2026-02-10T11:00:00Z"
    },
    {
      id: "inv_1003",
      number: "INV-2026-003",
      clientId: "cli_byte_03",
      clientName: "ByteBridge Solutions",
      issueDate: "2026-02-15",
      dueDate: "2026-03-02",
      currency: "INR",
      paymentTerms: "15 Days",
      status: "sent",
      items: [
        { description: "Q1 UX Audit & Mobile Optimization", quantity: 1, rate: 72034, amount: 72034 }
      ],
      subtotal: 72034,
      discount: 0,
      taxPercent: 18,
      taxAmount: 12966,
      total: 85000,
      notes: "Please remit to HDFC Bank Account.",
      createdAt: "2026-02-15T15:00:00Z"
    }
  ],

  payments: [
    {
      id: "pay_501",
      invoiceId: "inv_1001",
      invoiceNumber: "INV-2026-001",
      clientName: "Acme Technologies Pvt Ltd",
      amount: 236000,
      date: "2026-02-14",
      method: "NEFT / Bank Transfer",
      notes: "HDFC Bank Ref #908234710"
    },
    {
      id: "pay_502",
      invoiceId: "inv_1002",
      invoiceNumber: "INV-2026-002",
      clientName: "Nova Labs Inc",
      amount: 210000,
      date: "2026-02-19",
      method: "Wire Transfer",
      notes: "USD conversion credited to ICICI EEFC Account."
    }
  ],

  activities: [
    { id: "act_1", type: "invoice_paid", title: "Invoice Paid", description: "Nova Labs Inc paid invoice INV-2026-002 (₹2,10,000)", timestamp: "2026-02-19T14:30:00Z" },
    { id: "act_2", type: "work_added", title: "Work Entry Logged", description: "Logged 8.0 hrs for Acme Technologies Pvt Ltd", timestamp: "2026-02-20T17:45:00Z" },
    { id: "act_3", type: "invoice_created", title: "Invoice Created", description: "Created invoice INV-2026-003 for ByteBridge Solutions (₹85,000)", timestamp: "2026-02-15T15:00:00Z" },
    { id: "act_4", type: "invoice_paid", title: "Invoice Paid", description: "Acme Technologies Pvt Ltd paid invoice INV-2026-001 (₹2,36,000)", timestamp: "2026-02-14T11:00:00Z" }
  ]
};
