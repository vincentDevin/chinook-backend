import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware'; // Import the middleware

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Admin (roleId >= 2)
 * @returns {Array} - List of all users
 * 
 * @example
 * Response:
 * [
 *   {
 *     "id": 1,
 *     "username": "admin",
 *     "email": "admin@example.com",
 *     "role": "admin"
 *   },
 *   {
 *     "id": 2,
 *     "username": "user1",
 *     "email": "user1@example.com",
 *     "role": "user"
 *   }
 * ]
 */
router.get('/', authenticateToken, authorizeRole(2), userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get a specific user by ID
 * @access  Admin (roleId >= 2)
 * @param   {Number} id - User ID
 * @returns {Object} - The user object
 * 
 * @example
 * Request URL: /api/users/1
 * Response:
 * {
 *   "id": 1,
 *   "username": "admin",
 *   "email": "admin@example.com",
 *   "role": "admin"
 * }
 */
router.get('/:id', authenticateToken, authorizeRole(2), userController.getUserById);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Admin (roleId >= 2)
 * @param   {Object} User - The new user data
 * @returns {Object} - The created user object
 * 
 * @example
 * Request Body:
 * {
 *   "username": "newUser",
 *   "email": "newuser@example.com",
 *   "password": "password123",
 *   "roleId": 2
 * }
 * Response:
 * {
 *   "id": 3,
 *   "username": "newUser",
 *   "email": "newuser@example.com",
 *   "role": "user"
 * }
 */
router.post('/', authenticateToken, authorizeRole(2), userController.createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user by ID
 * @access  Admin (roleId >= 2)
 * @param   {Number} id - User ID
 * @param   {Object} User - The updated user data
 * @returns {Object} - The updated user object
 * 
 * @example
 * Request URL: /api/users/1
 * Request Body:
 * {
 *   "username": "updatedAdmin",
 *   "email": "updatedadmin@example.com",
 *   "roleId": 2
 * }
 * Response:
 * {
 *   "id": 1,
 *   "username": "updatedAdmin",
 *   "email": "updatedadmin@example.com",
 *   "role": "admin"
 * }
 */
router.put('/:id', authenticateToken, authorizeRole(2), userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user by ID
 * @access  Admin (roleId >= 2)
 * @param   {Number} id - User ID
 * @returns {Object} - A message confirming the deletion
 * 
 * @example
 * Request URL: /api/users/1
 * Response:
 * {
 *   "message": "User deleted successfully"
 * }
 */
router.delete('/:id', authenticateToken, authorizeRole(2), userController.deleteUser);

export default router;
