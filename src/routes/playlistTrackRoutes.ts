// src/routes/playlistTrackRoutes.ts

import { Router } from 'express';
import * as playlistTrackController from '../controllers/playlistTrackController';

const router = Router();

router.get('/:id/tracks', playlistTrackController.getTracksInPlaylist);
router.post('/:id/tracks', playlistTrackController.addTrackToPlaylist);
router.delete('/:id/tracks/:trackId', playlistTrackController.removeTrackFromPlaylist);

export default router;
