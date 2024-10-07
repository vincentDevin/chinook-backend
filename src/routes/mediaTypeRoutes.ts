import { Router } from 'express';
import * as mediaTypeController from '../controllers/mediaTypeController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware'; // Import the middleware

const router = Router();

/**
 * @route   GET /api/media-types
 * @desc    Get all media types
 * @access  Public
 * @returns {Array} - List of all media types
 * 
 * @example
 * Response:
 * [
 *   {
 *     "MediaTypeId": 1,
 *     "Name": "MP3"
 *   },
 *   {
 *     "MediaTypeId": 2,
 *     "Name": "WAV"
 *   }
 * ]
 */
router.get('/', mediaTypeController.getAllMediaTypes);

/**
 * @route   GET /api/media-types/:id
 * @desc    Get a specific media type by ID
 * @param   {Number} id - Media type ID
 * @returns {Object} - The media type object
 * 
 * @example
 * Request URL: /api/media-types/1
 * Response:
 * {
 *   "MediaTypeId": 1,
 *   "Name": "MP3"
 * }
 */
router.get('/:id', mediaTypeController.getMediaTypeById);

/**
 * @route   POST /api/media-types
 * @desc    Create a new media type
 * @access  Admin (roleId >= 3)
 * @param   {Object} MediaType - The new media type data
 * @returns {Object} - The created media type object
 * 
 * @example
 * Request Body:
 * {
 *   "Name": "FLAC"
 * }
 * Response:
 * {
 *   "MediaTypeId": 3,
 *   "Name": "FLAC"
 * }
 */
router.post('/', authenticateToken, authorizeRole(3), mediaTypeController.createMediaType);

/**
 * @route   PUT /api/media-types/:id
 * @desc    Update a media type by ID
 * @access  Admin (roleId >= 3)
 * @param   {Number} id - Media type ID
 * @param   {Object} MediaType - The updated media type data
 * @returns {Object} - The updated media type object
 * 
 * @example
 * Request URL: /api/media-types/1
 * Request Body:
 * {
 *   "Name": "Updated MP3"
 * }
 * Response:
 * {
 *   "MediaTypeId": 1,
 *   "Name": "Updated MP3"
 * }
 */
router.put('/:id', authenticateToken, authorizeRole(3), mediaTypeController.updateMediaType);

/**
 * @route   DELETE /api/media-types/:id
 * @desc    Delete a media type by ID
 * @access  Admin (roleId >= 3)
 * @param   {Number} id - Media type ID
 * @returns {Object} - A message confirming the deletion
 * 
 * @example
 * Request URL: /api/media-types/1
 * Response:
 * {
 *   "message": "Media type deleted successfully"
 * }
 */
router.delete('/:id', authenticateToken, authorizeRole(3), mediaTypeController.deleteMediaType);

export default router;
