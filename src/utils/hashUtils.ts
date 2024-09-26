// src/utils/hashUtils.ts

import bcrypt from 'bcryptjs';

// Hash password with salt
export const hashPassword = async (password: string, salt: string): Promise<string> => {
  return bcrypt.hash(password + salt, 10);
};

// Validate password
export const validatePassword = async (password: string, hash: string, salt: string): Promise<boolean> => {
  return bcrypt.compare(password + salt, hash);
};
