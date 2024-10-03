import { Router } from 'express';
import * as genreController from '../controllers/genreController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware'; // Import the middleware

const router = Router();

// Open to unauthenticated users
router.get('/', genreController.getAllGenres);

// Public access for getting genres (authenticated users can view)
router.get('/:id', authenticateToken, genreController.getGenreById);

// Admin-only access for creating, updating, and deleting genres (roleId >= 3)
router.post('/', authenticateToken, authorizeRole(3), genreController.createGenre);
router.put('/:id', authenticateToken, authorizeRole(3), genreController.updateGenre);
router.delete('/:id', authenticateToken, authorizeRole(3), genreController.deleteGenre);

export default router;
