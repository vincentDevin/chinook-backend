import { Router } from 'express';
import * as mediaTypeController from '../controllers/mediaTypeController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware'; // Import the middleware

const router = Router();

// Open to unauthenticated users
router.get('/', mediaTypeController.getAllMediaTypes);

// Public access for getting media types (only authenticated users can view)
router.get('/:id', authenticateToken, mediaTypeController.getMediaTypeById);

// Admin-only access for creating, updating, and deleting media types (roleId >= 3)
router.post('/', authenticateToken, authorizeRole(3), mediaTypeController.createMediaType);
router.put('/:id', authenticateToken, authorizeRole(3), mediaTypeController.updateMediaType);
router.delete('/:id', authenticateToken, authorizeRole(3), mediaTypeController.deleteMediaType);

export default router;
