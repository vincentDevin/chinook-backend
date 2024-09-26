// src/models/employee.ts

export interface Employee {
    EmployeeId: number;           // Primary key, auto-incremented
    LastName: string;             // Last name of the employee
    FirstName: string;            // First name of the employee
    Title?: string | null;        // Job title of the employee, can be null
    ReportsTo?: number | null;    // ID of the manager the employee reports to, can be null
    BirthDate?: Date | null;      // Birth date of the employee, can be null
    HireDate?: Date | null;       // Hire date of the employee, can be null
    Address?: string | null;      // Address of the employee, can be null
    City?: string | null;         // City of the employee, can be null
    State?: string | null;        // State of the employee, can be null
    Country?: string | null;      // Country of the employee, can be null
    PostalCode?: string | null;   // Postal code of the employee, can be null
    Phone?: string | null;        // Phone number of the employee, can be null
    Fax?: string | null;          // Fax number of the employee, can be null
    Email?: string | null;        // Email of the employee, can be null
  }
  