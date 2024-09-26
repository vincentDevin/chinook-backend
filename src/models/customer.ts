// src/models/customer.ts

export interface Customer {
    CustomerId: number;       // Primary key, auto-incremented
    FirstName: string;        // First name of the customer
    LastName: string;         // Last name of the customer
    Company?: string | null;  // Company name, can be null
    Address?: string | null;  // Address, can be null
    City?: string | null;     // City, can be null
    State?: string | null;    // State, can be null
    Country?: string | null;  // Country, can be null
    PostalCode?: string | null; // Postal code, can be null
    Phone?: string | null;    // Phone number, can be null
    Fax?: string | null;      // Fax number, can be null
    Email: string;            // Email of the customer
    SupportRepId?: number | null; // Support representative ID, can be null
  }
  