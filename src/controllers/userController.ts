import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { SafeUser } from '../services/userService'; // Import SafeUser type

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: SafeUser[] = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);  // Log the error for debugging
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  try {
    const user = await userService.getUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);  // Log the error
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const newUser = req.body; // Omit<User, 'UserId'> is inferred here
  try {
    const createdUser = await userService.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error('Error creating user:', error);  // Log the error
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Update an existing user
export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  const updatedUser: Partial<SafeUser> = req.body; // Use SafeUser type for update
  try {
    const result = await userService.updateUser(id, updatedUser);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);  // Log the error
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  try {
    const result = await userService.deleteUser(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);  // Log the error
    res.status(500).json({ message: 'Error deleting user' });
  }
};
