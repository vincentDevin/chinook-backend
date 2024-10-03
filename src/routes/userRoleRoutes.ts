import { Router } from 'express';
import * as userRoleController from '../controllers/userRoleController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware'; // Import the middleware

const router = Router();

// Admin-only access for all user role routes (roleId >= 2)
router.get('/', authenticateToken, authorizeRole(2), userRoleController.getAllUserRoles);
router.get('/:id', authenticateToken, authorizeRole(2), userRoleController.getUserRoleById);
router.post('/', authenticateToken, authorizeRole(2), userRoleController.createUserRole);
router.put('/:id', authenticateToken, authorizeRole(2), userRoleController.updateUserRole);
router.delete('/:id', authenticateToken, authorizeRole(2), userRoleController.deleteUserRole);

export default router;
