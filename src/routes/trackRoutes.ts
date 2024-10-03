import { Router } from 'express';
import * as trackController from '../controllers/trackController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware'; // Import the middleware

const router = Router();

// Public route for getting all tracks (no authentication required)
router.get('/', trackController.getAllTracks);
router.get('/:id', trackController.getTrackById);

// Admin-only routes for creating, editing, and deleting tracks (roleId >= 2)
router.post('/', authenticateToken, authorizeRole(2), trackController.createTrack);
router.put('/:id', authenticateToken, authorizeRole(2), trackController.updateTrack);
router.delete('/:id', authenticateToken, authorizeRole(2), trackController.deleteTrack);

export default router;
