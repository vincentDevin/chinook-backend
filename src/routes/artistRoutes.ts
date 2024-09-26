// src/routes/artistRoutes.ts

import { Router } from 'express';
import * as artistController from '../controllers/artistController';

const router = Router();

router.get('/', artistController.getAllArtists);
router.get('/:id', artistController.getArtistById);
router.post('/', artistController.createArtist);
router.put('/:id', artistController.updateArtist);
router.delete('/:id', artistController.deleteArtist);

export default router;
