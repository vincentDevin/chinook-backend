// src/routes/albumRoutes.ts

import { Router } from 'express';
import * as albumController from '../controllers/albumController';

const router = Router();

router.get('/', albumController.getAllAlbums);
router.get('/:id', albumController.getAlbumById);
router.post('/', albumController.createAlbum);
router.put('/:id', albumController.updateAlbum);
router.delete('/:id', albumController.deleteAlbum);

export default router;
