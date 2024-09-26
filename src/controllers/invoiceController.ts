// src/controllers/invoiceController.ts

import { Request, Response } from 'express';
import * as invoiceService from '../services/invoiceService';
import { Invoice } from '../models/invoice';

// Get all invoices
export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices: Invoice[] = await invoiceService.getAllInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const invoice = await invoiceService.getInvoiceById(id);
    if (invoice) {
      res.status(200).json(invoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice', error });
  }
};

// Create a new invoice
export const createInvoice = async (req: Request, res: Response) => {
  const newInvoice: Omit<Invoice, 'InvoiceId'> = req.body;
  try {
    const createdInvoice = await invoiceService.createInvoice(newInvoice);
    res.status(201).json(createdInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Error creating invoice', error });
  }
};

// Update an existing invoice
export const updateInvoice = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedInvoice: Partial<Invoice> = req.body;
  try {
    const result = await invoiceService.updateInvoice(id, updatedInvoice);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating invoice', error });
  }
};

// Delete an invoice
export const deleteInvoice = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await invoiceService.deleteInvoice(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting invoice', error });
  }
};
