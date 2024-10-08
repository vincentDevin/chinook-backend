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
 */
router.get('/', albumController.getAllAlbums);

/**
 * @route   GET /api/albums/byArtist/:artistId
 * @desc    Get all albums by a specific artist ID
 * @access  Public
 * @param   {Number} artistId - Artist ID
 * @returns {Array} - List of albums for the specified artist
 */
router.get('/byArtist/:artistId', albumController.getAlbumsByArtistId);

/**
 * @route   GET /api/albums/:id
 * @desc    Get a specific album by ID with tracks and artist information
 * @access  Public
 * @param   {Number} id - Album ID
 * @returns {Object} - The album object with related tracks and artist data
 */
router.get('/:id', albumController.getAlbumById);

/**
 * @route   GET /api/albums/:albumId/tracks
 * @desc    Get all tracks for a specific album by album ID
 * @access  Public
 * @param   {Number} albumId - Album ID
 * @returns {Array} - List of tracks for the specified album
 */
router.get('/:albumId/tracks', trackController.getTracksByAlbumId);

/**
 * @route   POST /api/albums
 * @desc    Create a new album
 * @access  Admin (roleId >= 3)
 * @param   {Object} Album - The new album data
 * @returns {Object} - The created album object
 */
router.post('/', authenticateToken, authorizeRole(3), albumController.createAlbum);

/**
 * @route   PUT /api/albums/:id
 * @desc    Update an existing album by ID
 * @access  Admin (roleId >= 3)
 * @param   {Number} id - Album ID
 * @param   {Object} Album - The updated album data
 * @returns {Object} - The updated album object
 */
router.put('/:id', authenticateToken, authorizeRole(3), albumController.updateAlbum);

/**
 * @route   DELETE /api/albums/:id
 * @desc    Delete an album by ID
 * @access  Admin (roleId >= 3)
 * @param   {Number} id - Album ID
 * @returns {Object} - A message confirming the deletion
 */
router.delete('/:id', authenticateToken, authorizeRole(3), albumController.deleteAlbum);

export default router;
