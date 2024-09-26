// src/controllers/invoiceLineController.ts

import { Request, Response } from 'express';
import * as invoiceLineService from '../services/invoiceLineService';
import { InvoiceLine } from '../models/invoiceLine';

// Get all invoice lines
export const getAllInvoiceLines = async (req: Request, res: Response) => {
  try {
    const invoiceLines: InvoiceLine[] = await invoiceLineService.getAllInvoiceLines();
    res.status(200).json(invoiceLines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice lines', error });
  }
};

// Get invoice line by ID
export const getInvoiceLineById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const invoiceLine = await invoiceLineService.getInvoiceLineById(id);
    if (invoiceLine) {
      res.status(200).json(invoiceLine);
    } else {
      res.status(404).json({ message: 'Invoice line not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice line', error });
  }
};

// Create a new invoice line
export const createInvoiceLine = async (req: Request, res: Response) => {
  const newInvoiceLine: Omit<InvoiceLine, 'InvoiceLineId'> = req.body;
  try {
    const createdInvoiceLine = await invoiceLineService.createInvoiceLine(newInvoiceLine);
    res.status(201).json(createdInvoiceLine);
  } catch (error) {
    res.status(500).json({ message: 'Error creating invoice line', error });
  }
};

// Update an existing invoice line
export const updateInvoiceLine = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedInvoiceLine: Partial<InvoiceLine> = req.body;
  try {
    const result = await invoiceLineService.updateInvoiceLine(id, updatedInvoiceLine);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Invoice line not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating invoice line', error });
  }
};

// Delete an invoice line
export const deleteInvoiceLine = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await invoiceLineService.deleteInvoiceLine(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Invoice line not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting invoice line', error });
  }
};
