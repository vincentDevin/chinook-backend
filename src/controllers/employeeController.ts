// src/controllers/employeeController.ts

import { Request, Response } from 'express';
import * as employeeService from '../services/employeeService';
import { Employee } from '../models/employee';

// Get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees: Employee[] = await employeeService.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
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
    res.status(500).json({ message: 'Error deleting employee', error });
  }
};
