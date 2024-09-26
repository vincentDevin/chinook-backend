// src/models/invoice.ts

export interface Invoice {
    InvoiceId: number;         // Primary key, auto-incremented
    CustomerId: number;        // Foreign key to the Customer table
    InvoiceDate: Date;         // Date of the invoice
    BillingAddress?: string | null;   // Billing address, can be null
    BillingCity?: string | null;      // Billing city, can be null
    BillingState?: string | null;     // Billing state, can be null
    BillingCountry?: string | null;   // Billing country, can be null
    BillingPostalCode?: string | null;// Billing postal code, can be null
    Total: number;             // Total amount of the invoice
  }
  