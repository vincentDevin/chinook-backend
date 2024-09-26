// src/services/userRoleService.ts

import pool from '../utils/db';
import { UserRole } from '../models/userRole';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all user roles
export const getAllUserRoles = async (): Promise<UserRole[]> => {
  const [rows] = await pool.query<UserRole[] & RowDataPacket[]>('SELECT * FROM userrole');
  return rows;
};

// Get user role by ID
export const getUserRoleById = async (id: number): Promise<UserRole | null> => {
  const [rows] = await pool.query<UserRole[] & RowDataPacket[]>('SELECT * FROM userrole WHERE UserRoleId = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Create a new user role
export const createUserRole = async (newUserRole: Omit<UserRole, 'UserRoleId'>): Promise<UserRole> => {
  const { UserRoleName, UserRoleDescription } = newUserRole;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO userrole (UserRoleName, UserRoleDescription) VALUES (?, ?)',
    [UserRoleName, UserRoleDescription]
  );
  const insertedId = result.insertId;
  return { UserRoleId: insertedId, UserRoleName, UserRoleDescription };
};

// Update an existing user role
export const updateUserRole = async (id: number, updatedUserRole: Partial<UserRole>): Promise<UserRole | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE userrole SET ? WHERE UserRoleId = ?',
    [updatedUserRole, id]
  );
  if (result.affectedRows > 0) {
    const updated = await getUserRoleById(id);
    return updated;
  }
  return null;
};

// Delete a user role
export const deleteUserRole = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM userrole WHERE UserRoleId = ?', [id]);
  return result.affectedRows > 0;
};
