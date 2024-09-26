// src/index.ts

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import albumRoutes from './routes/albumRoutes';
import trackRoutes from './routes/trackRoutes';
import userRoutes from './routes/userRoutes';
import userRoleRoutes from './routes/userRoleRoutes';
import artistRoutes from './routes/artistRoutes';
import genreRoutes from './routes/genreRoutes';
import mediaTypeRoutes from './routes/mediaTypeRoutes';
import playlistRoutes from './routes/playlistRoutes';
import playlistTrackRoutes from './routes/playlistTrackRoutes'; // Adjusted route path
import customerRoutes from './routes/customerRoutes';
import employeeRoutes from './routes/employeeRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import invoiceLineRoutes from './routes/invoiceLineRoutes'; // Import invoice line routes

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies or other credentials if needed
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/albums', albumRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/media-types', mediaTypeRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/playlists/:id/tracks', playlistTrackRoutes); // Use a different route for playlist tracks
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/invoice-lines', invoiceLineRoutes); // Use invoice line routes

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
