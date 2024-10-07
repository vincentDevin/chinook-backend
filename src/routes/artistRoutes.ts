import { Router } from 'express';
import * as artistController from '../controllers/artistController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   GET /api/artists
 * @desc    Get all artists with pagination
 * @access  Public
 * @returns {Array} - List of artists with pagination info
 * 
 * @example
 * Response:
 * {
 *   "artists": [
 *     { "ArtistId": 1, "Name": "Artist Name", "Albums": [...] },
 *     { "ArtistId": 2, "Name": "Another Artist", "Albums": [...] }
 *   ],
 *   "totalCount": 100
 * }
 */
router.get('/', artistController.getAllArtists);

/**
 * @route   GET /api/artists/:id
 * @desc    Get a specific artist by ID with albums
 * @access  Public
 * @param   {Number} id - Artist ID
 * @returns {Object} - The artist object with related albums
 * 
 * @example
 * Request URL: /api/artists/1
 * Response:
 * {
 *   "ArtistId": 1,
 *   "Name": "Artist Name",
 *   "Albums": [
 *     { "AlbumId": 1, "Title": "Album 1" },
 *     { "AlbumId": 2, "Title": "Album 2" }
 *   ]
 * }
 */
router.get('/:id', artistController.getArtistByIdWithAlbums);

/**
 * @route   POST /api/artists
 * @desc    Create a new artist
 * @access  Admin (roleId >= 3)
 * @param   {Object} Artist - The new artist data
 * @returns {Object} - The created artist object
 * 
 * @example
 * Request Body:
 * {
 *   "Name": "New Artist"
 * }
 * Response:
 * {
 *   "ArtistId": 10,
 *   "Name": "New Artist"
 * }
 */
router.post(
  '/',
  authenticateToken,
  authorizeRole(3),
  artistController.createArtist
);

/**
 * @route   PUT /api/artists/:id
 * @desc    Update an artist by ID
 * @access  Admin (roleId >= 3)
 * @param   {Number} id - Artist ID
 * @param   {Object} Artist - The updated artist data
 * @returns {Object} - The updated artist object
 * 
 * @example
 * Request URL: /api/artists/1
 * Request Body:
 * {
 *   "Name": "Updated Artist Name"
 * }
 * Response:
 * {
 *   "ArtistId": 1,
 *   "Name": "Updated Artist Name"
 * }
 */
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(3),
  artistController.updateArtist
);

/**
 * @route   DELETE /api/artists/:id
 * @desc    Delete an artist by ID
 * @access  Admin (roleId >= 3)
 * @param   {Number} id - Artist ID
 * @returns {Object} - A message confirming the deletion
 * 
 * @example
 * Request URL: /api/artists/1
 * Response:
 * {
 *   "message": "Artist deleted successfully"
 * }
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(3),
  artistController.deleteArtist
);

// Handle invalid routes
router.use((req, res) => {
  res.status(404).json({ message: 'Invalid artist route' });
});

export default router;
