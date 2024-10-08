// src/services/customerService.ts

import pool from '../utils/db';
import { Customer } from '../models/customer';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all customers with pagination
export const getAllCustomers = async (limit: number, offset: number): Promise<{ customers: Customer[]; totalCount: number }> => {
  const [rows] = await pool.query<Customer[] & RowDataPacket[]>(
    `SELECT SQL_CALC_FOUND_ROWS * 
     FROM Customer
     LIMIT ?
     OFFSET ?`,
    [limit, offset]
  );

  // Retrieve the total count of customers
  const [totalRows] = await pool.query<RowDataPacket[]>(
    'SELECT FOUND_ROWS() AS totalCount'
  );

  return {
    customers: rows,
    totalCount: totalRows[0].totalCount,
  };
};

// Get customer by ID
export const getCustomerById = async (id: number): Promise<Customer | null> => {
  const [rows] = await pool.query<Customer[] & RowDataPacket[]>('SELECT * FROM Customer WHERE CustomerId = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Create a new customer
export const createCustomer = async (newCustomer: Omit<Customer, 'CustomerId'>): Promise<Customer> => {
  const { FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId } = newCustomer;
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO Customer 
     (FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId]
  );
  const insertedId = result.insertId;
  return { CustomerId: insertedId, ...newCustomer };
};

// Update an existing customer
export const updateCustomer = async (id: number, updatedCustomer: Partial<Customer>): Promise<Customer | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE Customer SET ? WHERE CustomerId = ?',
    [updatedCustomer, id]
  );
  if (result.affectedRows > 0) {
    return await getCustomerById(id);
  }
  return null;
};

// Delete a customer
export const deleteCustomer = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM Customer WHERE CustomerId = ?', [id]);
  return result.affectedRows > 0;
};
