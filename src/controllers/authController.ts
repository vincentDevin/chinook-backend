import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as authService from '../services/authService';

// Login a user and return a JWT
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const token = await authService.authenticateUser(email, password);
    res.json({ token });  // Return the JWT token
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

// Register a new user and return a JWT
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, roleId } = req.body;  // Ensure roleId is provided

  try {
    const token = await authService.registerUser(email, password, roleId);  // Pass roleId
    res.status(201).json({ token });  // Return the JWT token after successful registration
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};
