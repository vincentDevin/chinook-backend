// src/services/invoiceLineService.ts

import pool from '../utils/db';
import { InvoiceLine } from '../models/invoiceLine';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all invoice lines
export const getAllInvoiceLines = async (): Promise<InvoiceLine[]> => {
  const [rows] = await pool.query<InvoiceLine[] & RowDataPacket[]>('SELECT * FROM InvoiceLine');
  return rows;
};

// Get invoice line by ID
export const getInvoiceLineById = async (id: number): Promise<InvoiceLine | null> => {
  const [rows] = await pool.query<InvoiceLine[] & RowDataPacket[]>('SELECT * FROM InvoiceLine WHERE InvoiceLineId = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Create a new invoice line
export const createInvoiceLine = async (newInvoiceLine: Omit<InvoiceLine, 'InvoiceLineId'>): Promise<InvoiceLine> => {
  const { InvoiceId, TrackId, UnitPrice, Quantity } = newInvoiceLine;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO InvoiceLine (InvoiceId, TrackId, UnitPrice, Quantity) VALUES (?, ?, ?, ?)',
    [InvoiceId, TrackId, UnitPrice, Quantity]
  );
  const insertedId = result.insertId;
  return { InvoiceLineId: insertedId, ...newInvoiceLine };
};

// Update an existing invoice line
export const updateInvoiceLine = async (id: number, updatedInvoiceLine: Partial<InvoiceLine>): Promise<InvoiceLine | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE InvoiceLine SET ? WHERE InvoiceLineId = ?',
    [updatedInvoiceLine, id]
  );
  if (result.affectedRows > 0) {
    return await getInvoiceLineById(id);
  }
  return null;
};

// Delete an invoice line
export const deleteInvoiceLine = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM InvoiceLine WHERE InvoiceLineId = ?', [id]);
  return result.affectedRows > 0;
};
