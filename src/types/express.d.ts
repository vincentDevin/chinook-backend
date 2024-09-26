// src/types/express.d.ts

import { User } from '../models/user'; // Adjust the import to your actual User model path

declare global {
  namespace Express {
    interface Request {
      user?: User; // Use the actual type of the user object you are attaching
    }
  }
}
