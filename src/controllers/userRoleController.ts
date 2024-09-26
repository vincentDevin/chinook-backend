// src/controllers/userRoleController.ts

import { Request, Response } from 'express';
import * as userRoleService from '../services/userRoleService';
import { UserRole } from '../models/userRole';

// Get all user roles
export const getAllUserRoles = async (req: Request, res: Response) => {
  try {
    const userRoles: UserRole[] = await userRoleService.getAllUserRoles();
    res.status(200).json(userRoles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user roles', error });
  }
};

// Get user role by ID
export const getUserRoleById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const userRole = await userRoleService.getUserRoleById(id);
    if (userRole) {
      res.status(200).json(userRole);
    } else {
      res.status(404).json({ message: 'User role not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user role', error });
  }
};

// Create a new user role
export const createUserRole = async (req: Request, res: Response) => {
  const newUserRole: Omit<UserRole, 'UserRoleId'> = req.body;
  try {
    const createdUserRole = await userRoleService.createUserRole(newUserRole);
    res.status(201).json(createdUserRole);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user role', error });
  }
};

// Update an existing user role
export const updateUserRole = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedUserRole: Partial<UserRole> = req.body;
  try {
    const result = await userRoleService.updateUserRole(id, updatedUserRole);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'User role not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error });
  }
};

// Delete a user role
export const deleteUserRole = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await userRoleService.deleteUserRole(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'User role not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user role', error });
  }
};
