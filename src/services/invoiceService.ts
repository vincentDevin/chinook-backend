// src/services/invoiceService.ts

import pool from '../utils/db';
import { Invoice } from '../models/invoice';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all invoices
export const getAllInvoices = async (): Promise<Invoice[]> => {
  const [rows] = await pool.query<Invoice[] & RowDataPacket[]>('SELECT * FROM Invoice');
  return rows;
};

// Get invoice by ID
export const getInvoiceById = async (id: number): Promise<Invoice | null> => {
  const [rows] = await pool.query<Invoice[] & RowDataPacket[]>('SELECT * FROM Invoice WHERE InvoiceId = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Create a new invoice
export const createInvoice = async (newInvoice: Omit<Invoice, 'InvoiceId'>): Promise<Invoice> => {
  const { CustomerId, InvoiceDate, BillingAddress, BillingCity, BillingState, BillingCountry, BillingPostalCode, Total } = newInvoice;
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO Invoice 
     (CustomerId, InvoiceDate, BillingAddress, BillingCity, BillingState, BillingCountry, BillingPostalCode, Total) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [CustomerId, InvoiceDate, BillingAddress, BillingCity, BillingState, BillingCountry, BillingPostalCode, Total]
  );
  const insertedId = result.insertId;
  return { InvoiceId: insertedId, ...newInvoice };
};

// Update an existing invoice
export const updateInvoice = async (id: number, updatedInvoice: Partial<Invoice>): Promise<Invoice | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE Invoice SET ? WHERE InvoiceId = ?',
    [updatedInvoice, id]
  );
  if (result.affectedRows > 0) {
    return await getInvoiceById(id);
  }
  return null;
};

// Delete an invoice
export const deleteInvoice = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM Invoice WHERE InvoiceId = ?', [id]);
  return result.affectedRows > 0;
};
