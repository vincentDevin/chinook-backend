import { Request, Response } from 'express';
import * as customerService from '../services/customerService';
import { Customer } from '../models/customer';

// Get all customers with pagination
export const getAllCustomers = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10
  const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0

  try {
    const { customers, totalCount } = await customerService.getAllCustomers(limit, offset);
    res.status(200).json({ customers, totalPages: Math.ceil(totalCount / limit) });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

// Get customer by ID
export const getCustomerById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const customer = await customerService.getCustomerById(id);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Error fetching customer', error });
  }
};

// Create a new customer
export const createCustomer = async (req: Request, res: Response) => {
  const newCustomer: Omit<Customer, 'CustomerId'> = req.body;
  try {
    const createdCustomer = await customerService.createCustomer(newCustomer);
    res.status(201).json(createdCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Error creating customer', error });
  }
};

// Update an existing customer
export const updateCustomer = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedCustomer: Partial<Customer> = req.body;
  try {
    const result = await customerService.updateCustomer(id, updatedCustomer);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Error updating customer', error });
  }
};

// Delete a customer
export const deleteCustomer = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await customerService.deleteCustomer(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};
