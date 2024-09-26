// src/controllers/genreController.ts

import { Request, Response } from 'express';
import * as genreService from '../services/genreService';
import { Genre } from '../models/genre';

// Get all genres
export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const genres: Genre[] = await genreService.getAllGenres();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching genres', error });
  }
};

// Get genre by ID
export const getGenreById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const genre = await genreService.getGenreById(id);
    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(404).json({ message: 'Genre not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching genre', error });
  }
};

// Create a new genre
export const createGenre = async (req: Request, res: Response) => {
  const newGenre: Omit<Genre, 'GenreId'> = req.body;
  try {
    const createdGenre = await genreService.createGenre(newGenre);
    res.status(201).json(createdGenre);
  } catch (error) {
    res.status(500).json({ message: 'Error creating genre', error });
  }
};

// Update an existing genre
export const updateGenre = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedGenre: Partial<Genre> = req.body;
  try {
    const result = await genreService.updateGenre(id, updatedGenre);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Genre not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating genre', error });
  }
};

// Delete a genre
export const deleteGenre = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await genreService.deleteGenre(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Genre not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting genre', error });
  }
};
