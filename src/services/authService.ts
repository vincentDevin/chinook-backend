import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { User } from '../models/user';

// Service to authenticate user
export const authenticateUser = async (email: string, password: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM users WHERE UserEmail = ?',
    [email]
  );

  if (rows.length === 0) {
    throw new Error('User not found');
  }

  const user = rows[0] as User;

  const validPassword = await bcrypt.compare(password, user.UserPassword);
  if (!validPassword) {
    throw new Error('Invalid password');
  }

  // Include UserRoleId in the JWT payload
  const token = jwt.sign(
    {
      id: user.UserId,
      roleId: user.UserRoleId,  // Include the roleId
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '1h' }
  );

  return token;
};

// Service to register a new user
export const registerUser = async (email: string, password: string, roleId: number) => {
  // Check if the user already exists
  const [existingUser] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM users WHERE UserEmail = ?',
    [email]
  );

  if (existingUser.length > 0) {
    throw new Error('User already exists');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert the new user into the database
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (UserEmail, UserPassword, UserSalt, UserRoleId, UserActive) VALUES (?, ?, ?, ?, ?)',
    [email, hashedPassword, salt, roleId, true] // Assuming active by default
  );

  if (result.affectedRows === 0) {
    throw new Error('User registration failed');
  }

  // Generate JWT for the newly registered user
  const token = jwt.sign(
    {
      id: result.insertId,
      roleId: roleId,  // Include the roleId in the token
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '1h' }
  );

  return token;
};
