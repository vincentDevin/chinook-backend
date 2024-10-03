// src/services/employeeService.ts

import pool from '../utils/db';
import { Employee } from '../models/employee';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all employees with pagination
export const getAllEmployees = async (limit: number, offset: number): Promise<{ employees: Employee[]; totalCount: number }> => {
  const [rows] = await pool.query<Employee[] & RowDataPacket[]>(
    `SELECT SQL_CALC_FOUND_ROWS * 
     FROM Employee
     LIMIT ?
     OFFSET ?`,
    [limit, offset]
  );

  // Retrieve the total count of employees
  const [totalRows] = await pool.query<RowDataPacket[]>(
    'SELECT FOUND_ROWS() AS totalCount'
  );

  return {
    employees: rows,
    totalCount: totalRows[0].totalCount,
  };
};

// Get employee by ID
export const getEmployeeById = async (id: number): Promise<Employee | null> => {
  const [rows] = await pool.query<Employee[] & RowDataPacket[]>('SELECT * FROM Employee WHERE EmployeeId = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Create a new employee
export const createEmployee = async (newEmployee: Omit<Employee, 'EmployeeId'>): Promise<Employee> => {
  const { LastName, FirstName, Title, ReportsTo, BirthDate, HireDate, Address, City, State, Country, PostalCode, Phone, Fax, Email } = newEmployee;
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO Employee 
     (LastName, FirstName, Title, ReportsTo, BirthDate, HireDate, Address, City, State, Country, PostalCode, Phone, Fax, Email) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [LastName, FirstName, Title, ReportsTo, BirthDate, HireDate, Address, City, State, Country, PostalCode, Phone, Fax, Email]
  );
  const insertedId = result.insertId;
  return { EmployeeId: insertedId, ...newEmployee };
};

// Update an existing employee
export const updateEmployee = async (id: number, updatedEmployee: Partial<Employee>): Promise<Employee | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE Employee SET ? WHERE EmployeeId = ?',
    [updatedEmployee, id]
  );
  if (result.affectedRows > 0) {
    return await getEmployeeById(id);
  }
  return null;
};

// Delete an employee
export const deleteEmployee = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM Employee WHERE EmployeeId = ?', [id]);
  return result.affectedRows > 0;
};
