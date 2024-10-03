import { Request, Response } from 'express';
import * as employeeService from '../services/employeeService';
import { Employee } from '../models/employee';

// Get all employees with pagination
export const getAllEmployees = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10
  const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0

  try {
    const { employees, totalCount } = await employeeService.getAllEmployees(limit, offset);
    res.status(200).json({ employees, totalPages: Math.ceil(totalCount / limit) });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};

// Get employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const employee = await employeeService.getEmployeeById(id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Error fetching employee', error });
  }
};

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
  const newEmployee: Omit<Employee, 'EmployeeId'> = req.body;
  try {
    const createdEmployee = await employeeService.createEmployee(newEmployee);
    res.status(201).json(createdEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Error creating employee', error });
  }
};

// Update an existing employee
export const updateEmployee = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedEmployee: Partial<Employee> = req.body;
  try {
    const result = await employeeService.updateEmployee(id, updatedEmployee);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Error updating employee', error });
  }
};

// Delete an employee
export const deleteEmployee = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await employeeService.deleteEmployee(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Error deleting employee', error });
  }
};
