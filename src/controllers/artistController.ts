import { Request, Response } from 'express';
import * as artistService from '../services/artistService';
import { Artist } from '../models/artist';

// Get all artists with pagination
export const getAllArtists = async (req: Request, res: Response) => {
  // Extract limit and offset from query parameters with default values
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10 if not provided
  const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0 if not provided

  try {
    // Call the service function with limit and offset
    const { artists, totalCount } = await artistService.getAllArtists(limit, offset);

    // Send the paginated data and total count
    res.status(200).json({
      artists,  // Paginated artists data
      totalCount,  // Total number of artists for pagination
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists', error });
  }
};

// Get artist by ID
export const getArtistById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  // Validate that the ID is a positive number
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid ArtistId. It must be a positive number.' });
  }

  try {
    const artist = await artistService.getArtistById(id);
    if (artist) {
      res.status(200).json(artist);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({ message: 'Error fetching artist', error });
  }
};

// Create a new artist
export const createArtist = async (req: Request, res: Response) => {
  const newArtist: Omit<Artist, 'ArtistId'> = req.body;
  try {
    const createdArtist = await artistService.createArtist(newArtist);
    res.status(201).json(createdArtist);
  } catch (error) {
    res.status(500).json({ message: 'Error creating artist', error });
  }
};

// Update an existing artist
export const updateArtist = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedArtist: Partial<Artist> = req.body;
  try {
    const result = await artistService.updateArtist(id, updatedArtist);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating artist', error });
  }
};

// Delete an artist
export const deleteArtist = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await artistService.deleteArtist(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting artist', error });
  }
};
