import pool from '../utils/db';
import { User } from '../models/user';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { hashPassword, validatePassword } from '../utils/hashUtils';

// Define a type that omits sensitive information
export type SafeUser = Omit<User, 'UserPassword' | 'UserSalt'>;

// Get all users excluding sensitive fields
export const getAllUsers = async (): Promise<SafeUser[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT UserId, UserEmail, UserRoleId, UserActive FROM user'  // Exclude password and salt
  );
  return rows as SafeUser[];
};

// Get user by ID excluding sensitive fields
export const getUserById = async (id: number): Promise<SafeUser | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT UserId, UserEmail, UserRoleId, UserActive FROM user WHERE UserId = ?',
    [id]
  );
  return rows.length > 0 ? (rows[0] as SafeUser) : null;
};

// Get user by email (for authentication purposes, includes password and salt)
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
export const updateUser = async (id: number, updatedUser: Partial<User>): Promise<SafeUser | null> => {
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
