// src/controllers/userController.ts

import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { User } from '../models/user';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: User[] = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const user = await userService.getUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const newUser: Omit<User, 'UserId'> = req.body;
  try {
    const createdUser = await userService.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Update an existing user
export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedUser: Partial<User> = req.body;
  try {
    const result = await userService.updateUser(id, updatedUser);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await userService.deleteUser(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
