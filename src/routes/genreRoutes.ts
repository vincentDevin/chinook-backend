import { Router } from 'express';
import * as genreController from '../controllers/genreController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware'; // Import the middleware

const router = Router();

/**
 * @route   GET /api/genres
 * @desc    Get all genres
 * @access  Public
 * @returns {Array} - List of all genres
 * 
 * @example
 * Response:
 * [
 *   { "GenreId": 1, "Name": "Rock" },
 *   { "GenreId": 2, "Name": "Jazz" }
 * ]
 */
router.get('/', genreController.getAllGenres);

/**
 * @route   GET /api/genres/:id
 * @desc    Get a specific genre by ID
 * @param   {Number} id - Genre ID
 * @returns {Object} - The genre object
 * 
 * @example
 * Request URL: /api/genres/1
 * Response:
 * {
 *   "GenreId": 1,
 *   "Name": "Rock"
 * }
 */
router.get('/:id', genreController.getGenreById);

/**
 * @route   GET /api/genres/:id/tracks
 * @desc    Get paginated tracks by genre ID
 * @param   {Number} id - Genre ID
 * @param   {Number} [limit=10] - Number of tracks per page
 * @param   {Number} [offset=0] - Starting point for pagination
 * @returns {Array} - List of tracks in the specified genre
 * 
 * @example
 * Request URL: /api/genres/1/tracks?limit=10&offset=0
 * Response:
 * {
 *   "tracks": [
 *     { "TrackId": 1, "Name": "Track 1" },
 *     { "TrackId": 2, "Name": "Track 2" }
 *   ],
 *   "totalCount": 100
 * }
 */
router.get('/:id/tracks', genreController.getTracksByGenreId); // Pass limit and offset via query params

/**
 * @route   POST /api/genres
 * @desc    Create a new genre
 * @access  Admin (roleId >= 3)
 * @param   {Object} Genre - The new genre data
 * @returns {Object} - The created genre object
 * 
 * @example
 * Request Body:
 * {
 *   "Name": "Hip-Hop"
 * }
 * Response:
 * {
 *   "GenreId": 3,
 *   "Name": "Hip-Hop"
 * }
 */
router.post('/', authenticateToken, authorizeRole(3), genreController.createGenre);

/**
 * @route   PUT /api/genres/:id
 * @desc    Update a genre by ID
 * @access  Admin (roleId >= 3)
 * @param   {Number} id - Genre ID
 * @param   {Object} Genre - The updated genre data
 * @returns {Object} - The updated genre object
 * 
 * @example
 * Request URL: /api/genres/1
 * Request Body:
 * {
 *   "Name": "Updated Rock"
 * }
 * Response:
 * {
 *   "GenreId": 1,
 *   "Name": "Updated Rock"
 * }
 */
router.put('/:id', authenticateToken, authorizeRole(3), genreController.updateGenre);

/**
 * @route   DELETE /api/genres/:id
 * @desc    Delete a genre by ID
 * @access  Admin (roleId >= 3)
 * @param   {Number} id - Genre ID
 * @returns {Object} - A message confirming the deletion
 * 
 * @example
 * Request URL: /api/genres/1
 * Response:
 * {
 *   "message": "Genre deleted successfully"
 * }
 */
router.delete('/:id', authenticateToken, authorizeRole(3), genreController.deleteGenre);

export default router;
