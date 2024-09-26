// src/services/userService.ts

import pool from '../utils/db';
import { User } from '../models/user';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { hashPassword, validatePassword } from '../utils/hashUtils';

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await pool.query<User[] & RowDataPacket[]>('SELECT * FROM user');
  return rows;
};

// Get user by ID
export const getUserById = async (id: number): Promise<User | null> => {
  const [rows] = await pool.query<User[] & RowDataPacket[]>('SELECT * FROM user WHERE UserId = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Get user by email (for authentication)
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await pool.query<User[] & RowDataPacket[]>('SELECT * FROM user WHERE UserEmail = ?', [email]);
  return rows.length > 0 ? rows[0] : null;
};

// Create a new user
export const createUser = async (user: Omit<User, 'UserId'>): Promise<User> => {
  const { UserEmail, UserPassword, UserSalt, UserRoleId, UserActive } = user;
  
  // Hash the password
  const hashedPassword = await hashPassword(UserPassword, UserSalt);
  
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO user (UserPassword, UserEmail, UserSalt, UserRoleId, UserActive) 
     VALUES (?, ?, ?, ?, ?)`,
    [hashedPassword, UserEmail, UserSalt, UserRoleId, UserActive]
  );
  const insertedId = result.insertId;
  return { UserId: insertedId, UserPassword: hashedPassword, UserEmail, UserSalt, UserRoleId, UserActive };
};

// Update an existing user
export const updateUser = async (id: number, updatedUser: Partial<User>): Promise<User | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE user SET ? WHERE UserId = ?',
    [updatedUser, id]
  );
  if (result.affectedRows > 0) {
    return await getUserById(id);
  }
  return null;
};

// Delete a user
export const deleteUser = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM user WHERE UserId = ?', [id]);
  return result.affectedRows > 0;
};
