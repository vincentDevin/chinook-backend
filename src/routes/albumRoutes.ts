import { Router } from 'express';
import * as albumController from '../controllers/albumController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware'; // Import the middleware

const router = Router();

// Open to un-authenticated users
router.get('/', albumController.getAllAlbums);

// Public access for getting albums (authenticated users can view)
router.get('/:id', authenticateToken, albumController.getAlbumById);

// Admin-only access for creating, updating, and deleting albums (roleId >= 3)
router.post('/', authenticateToken, authorizeRole(3), albumController.createAlbum);
router.put('/:id', authenticateToken, authorizeRole(3), albumController.updateAlbum);
router.delete('/:id', authenticateToken, authorizeRole(3), albumController.deleteAlbum);

export default router;
