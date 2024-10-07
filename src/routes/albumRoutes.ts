import { Router } from 'express';
import * as albumController from '../controllers/albumController';
import * as trackController from '../controllers/trackController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   GET /api/albums
 * @desc    Get all albums with pagination and related artist data
 * @access  Public
 * @returns {Array} - List of albums with related artist information
 * 
 * @example
 * Response:
 * {
 *   "albums": [
 *     {
 *       "AlbumId": 1,
 *       "Title": "Album 1",
 *       "ArtistId": 1,
 *       "ArtistName": "Artist 1"
 *     },
 *     {
 *       "AlbumId": 2,
 *       "Title": "Album 2",
 *       "ArtistId": 2,
 *       "ArtistName": "Artist 2"
 *     }
 *   ],
 *   "totalCount": 100
 * }
 */
router.get('/', albumController.getAllAlbums);

/**
 * @route   GET /api/albums/:id
 * @desc    Get a specific album by ID with tracks and artist information
 * @access  Public
 * @param   {Number} id - Album ID
 * @returns {Object} - The album object with related tracks and artist data
 * 
 * @example
 * Request URL: /api/albums/1
 * Response:
 * {
 *   "AlbumId": 1,
 *   "Title": "Album Title",
 *   "ArtistName": "Artist Name",
 *   "Tracks": [
 *     { "TrackId": 1, "Name": "Track 1" },
 *     { "TrackId": 2, "Name": "Track 2" }
 *   ]
 * }
 */
router.get('/:id', albumController.getAlbumById);

/**
 * @route   GET /api/albums/:albumId/tracks
 * @desc    Get all tracks for a specific album by album ID
 * @access  Public
 * @param   {Number} albumId - Album ID
 * @returns {Array} - List of tracks for the specified album
 * 
 * @example
 * Request URL: /api/albums/1/tracks
 * Response:
 * [
 *   { "TrackId": 1, "Name": "Track 1", "AlbumId": 1 },
 *   { "TrackId": 2, "Name": "Track 2", "AlbumId": 1 }
 * ]
 */
router.get('/:albumId/tracks', trackController.getTracksByAlbumId);

/**
 * @route   POST /api/albums
 * @desc    Create a new album
 * @access  Admin (roleId >= 3)
 * @param   {Object} Album - The new album data
 * @returns {Object} - The created album object
 * 
 * @example
 * Request Body:
 * {
 *   "Title": "New Album",
 *   "ArtistId": 1
 * }
 * Response:
 * {
 *   "AlbumId": 10,
 *   "Title": "New Album",
 *   "ArtistId": 1
 * }
 */
router.post('/', authenticateToken, authorizeRole(3), albumController.createAlbum);

/**
 * @route   PUT /api/albums/:id
 * @desc    Update an existing album by ID
 * @access  Admin (roleId >= 3)
 * @param   {Number} id - Album ID
 * @param   {Object} Album - The updated album data
 * @returns {Object} - The updated album object
 * 
 * @example
 * Request URL: /api/albums/1
 * Request Body:
 * {
 *   "Title": "Updated Album Title"
 * }
 * Response:
 * {
 *   "AlbumId": 1,
 *   "Title": "Updated Album Title",
 *   "ArtistId": 1
 * }
 */
router.put('/:id', authenticateToken, authorizeRole(3), albumController.updateAlbum);

/**
 * @route   DELETE /api/albums/:id
 * @desc    Delete an album by ID
 * @access  Admin (roleId >= 3)
 * @param   {Number} id - Album ID
 * @returns {Object} - A message confirming the deletion
 * 
 * @example
 * Request URL: /api/albums/1
 * Response:
 * {
 *   "message": "Album deleted successfully"
 * }
 */
router.delete('/:id', authenticateToken, authorizeRole(3), albumController.deleteAlbum);

export default router;
