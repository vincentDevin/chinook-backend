// src/models/invoiceLine.ts

export interface InvoiceLine {
    InvoiceLineId: number;  // Primary key, auto-incremented
    InvoiceId: number;      // Foreign key to the Invoice table
    TrackId: number;        // Foreign key to the Track table
    UnitPrice: number;      // Price per unit
    Quantity: number;       // Quantity of the track purchased
  }
  