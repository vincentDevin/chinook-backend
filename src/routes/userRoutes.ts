import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware'; // Import the middleware

const router = Router();

// Only allow authenticated users with UserRoleId >= 2 to access these routes (assuming roleId 2 is for admins)
router.get('/', authenticateToken, authorizeRole(2), userController.getAllUsers);
router.get('/:id', authenticateToken, authorizeRole(2), userController.getUserById);
router.post('/', authenticateToken, authorizeRole(2), userController.createUser);
router.put('/:id', authenticateToken, authorizeRole(2), userController.updateUser);
router.delete('/:id', authenticateToken, authorizeRole(2), userController.deleteUser);

export default router;
