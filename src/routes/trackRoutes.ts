// src/routes/trackRoutes.ts

import { Router } from 'express';
import * as trackController from '../controllers/trackController';

const router = Router();

router.get('/', trackController.getAllTracks);
router.get('/:id', trackController.getTrackById);
router.post('/', trackController.createTrack);
router.put('/:id', trackController.updateTrack);
router.delete('/:id', trackController.deleteTrack);

export default router;
