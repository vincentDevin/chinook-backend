// src/models/user.ts

export interface User {
    UserId: number;         // Primary key, auto-incremented
    UserPassword: string;   // Hashed password, fixed 255 characters
    UserEmail: string;      // User email, fixed 255 characters
    UserSalt: string;       // Salt used for hashing, fixed 32 characters
    UserRoleId: number;     // Foreign key to the userrole table
    UserActive: boolean;    // Boolean to check if the user is active
  }
  