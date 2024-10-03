import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      roleId: number;  // Ensure roleId from the JWT payload is available on the request
    };
  }
}

// Middleware to authenticate JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user; // Attach the decoded JWT payload to the request
    next();
  });
};

// Middleware to authorize based on user role using UserRoleId
export const authorizeRole = (requiredRoleId: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.roleId >= requiredRoleId) {  // Check roleId from the JWT payload
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. Insufficient privileges.' });
    }
  };
};

export default authenticateToken;
