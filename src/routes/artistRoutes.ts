import { Router } from 'express';
import * as artistController from '../controllers/artistController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware'; // Import the middleware

const router = Router();

// Open to un-authenticated users
router.get('/', artistController.getAllArtists);

// Public access for getting artists (authenticated users can view)
router.get('/:id', authenticateToken, artistController.getArtistById);

// Admin-only access for creating, updating, and deleting artists (roleId >= 3)
router.post('/', authenticateToken, authorizeRole(3), artistController.createArtist);
router.put('/:id', authenticateToken, authorizeRole(3), artistController.updateArtist);
router.delete('/:id', authenticateToken, authorizeRole(3), artistController.deleteArtist);

export default router;
