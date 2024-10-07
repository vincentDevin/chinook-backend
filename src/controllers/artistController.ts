import { Request, Response } from 'express';
import * as artistService from '../services/artistService';
import { Artist } from '../models/artist';

// Get all artists with pagination
export const getAllArtists = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = parseInt(req.query.offset as string, 10) || 0;

  try {
    const { artists, totalCount } = await artistService.getAllArtists(limit, offset);
    res.status(200).json({
      artists,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ message: 'Error fetching artists' });
  }
};

// Get artist by ID, including albums
export const getArtistByIdWithAlbums = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid ArtistId. It must be a positive number.' });
  }

  try {
    const artist = await artistService.getArtistByIdWithAlbums(id);
    if (artist) {
      res.status(200).json(artist);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error('Error fetching artist with albums:', error);
    res.status(500).json({ message: 'Error fetching artist' });
  }
};

// Get artist by ID
export const getArtistById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

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
    res.status(500).json({ message: 'Error fetching artist' });
  }
};

// Create a new artist with validation
export const createArtist = async (req: Request, res: Response) => {
  const { Name } = req.body;

  if (!Name || Name.length < 2) {
    return res.status(400).json({ errors: { Name: 'Artist name is required and must be at least 2 characters long.' } });
  }

  try {
    const createdArtist = await artistService.createArtist({ Name });
    res.status(201).json(createdArtist);
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({ message: 'Error creating artist' });
  }
};

// Update an existing artist with validation
export const updateArtist = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { Name } = req.body;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid ArtistId. It must be a positive number.' });
  }

  if (!Name || Name.length < 2) {
    return res.status(400).json({ errors: { Name: 'Artist name is required and must be at least 2 characters long.' } });
  }

  try {
    const result = await artistService.updateArtist(id, { Name });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({ message: 'Error updating artist' });
  }
};

// Delete an artist
export const deleteArtist = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid ArtistId. It must be a positive number.' });
  }

  try {
    const result = await artistService.deleteArtist(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ message: 'Error deleting artist' });
  }
};
