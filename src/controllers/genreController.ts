import { Request, Response } from 'express';
import * as genreService from '../services/genreService';
import * as trackService from '../services/trackService'; // Import track service to fetch tracks
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

// Get tracks by GenreId with pagination
export const getTracksByGenreId = async (req: Request, res: Response) => {
  const genreId = parseInt(req.params.id, 10);
  const limit = parseInt(req.query.limit as string) || 10; // Default to 10 if not provided
  const offset = parseInt(req.query.offset as string) || 0; // Default to 0 if not provided

  try {
    const { tracks, totalCount } = await genreService.getTracksByGenreId(genreId, limit, offset);
    res.status(200).json({
      tracks,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Math.floor(offset / limit) + 1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tracks for genre', error });
  }
};

// Create a new genre
export const createGenre = async (req: Request, res: Response) => {
  const newGenre: Omit<Genre, 'GenreId'> = req.body;

  // Validation: Check if 'Name' is provided and not an empty string
  if (!newGenre.Name || newGenre.Name.trim() === '') {
    return res.status(400).json({ message: 'Genre name is required' });
  }

  try {
    const createdGenre = await genreService.createGenre(newGenre);
    res.status(201).json(createdGenre);
  } catch (error) {
    console.error('Error creating genre:', error);
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
