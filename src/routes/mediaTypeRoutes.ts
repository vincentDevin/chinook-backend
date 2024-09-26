// src/routes/mediaTypeRoutes.ts

import { Router } from 'express';
import * as mediaTypeController from '../controllers/mediaTypeController';

const router = Router();

router.get('/', mediaTypeController.getAllMediaTypes);
router.get('/:id', mediaTypeController.getMediaTypeById);
router.post('/', mediaTypeController.createMediaType);
router.put('/:id', mediaTypeController.updateMediaType);
router.delete('/:id', mediaTypeController.deleteMediaType);

export default router;
