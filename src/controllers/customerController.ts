// src/controllers/customerController.ts

import { Request, Response } from 'express';
import * as customerService from '../services/customerService';
import { Customer } from '../models/customer';

// Get all customers
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers: Customer[] = await customerService.getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
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
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};
