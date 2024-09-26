// src/routes/genreRoutes.ts

import { Router } from 'express';
import * as genreController from '../controllers/genreController';

const router = Router();

router.get('/', genreController.getAllGenres);
router.get('/:id', genreController.getGenreById);
router.post('/', genreController.createGenre);
router.put('/:id', genreController.updateGenre);
router.delete('/:id', genreController.deleteGenre);

export default router;
