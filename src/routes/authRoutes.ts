// src/routes/authRoutes.ts

import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';

const router = express.Router();

// Login route
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
  ],
  authController.login
);

// Register route
router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }), // Require password to be at least 5 characters
    body('roleId').isInt({ min: 1 })      // Ensure roleId is an integer
  ],
  authController.register
);

export default router;
