import { Request, Response } from 'express';
import * as albumService from '../services/albumService';
import { Album, NewAlbum } from '../models/album';

// Get all albums with pagination and artist data
export const getAllAlbums = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10
  const offset = parseInt(req.query.offset as string, 10) || 0; // Default offset to 0

  try {
    const { albums, totalCount } = await albumService.getAllAlbums(limit, offset);
    res.status(200).json({ albums, totalCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching albums', error });
  }
};

// Get album by ID
export const getAlbumById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const album = await albumService.getAlbumById(id);
    if (album) {
      res.status(200).json(album);
    } else {
      res.status(404).json({ message: 'Album not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching album', error });
  }
};

// Get all albums by a specific artist ID
export const getAlbumsByArtistId = async (req: Request, res: Response) => {
  const artistId = parseInt(req.params.artistId, 10);

  // Validate the artistId
  if (isNaN(artistId) || artistId <= 0) {
    return res.status(400).json({ message: 'Invalid artist ID provided' });
  }

  try {
    const albums = await albumService.getAlbumsByArtistId(artistId);
    
    if (albums.length > 0) {
      res.status(200).json(albums);
    } else {
      res.status(404).json({ message: 'No albums found for this artist' });
    }
  } catch (error) {
    console.error('Error fetching albums by artist:', error);
    res.status(500).json({ message: 'Error fetching albums by artist', error });
  }
};

// Create a new album (NewAlbum type doesn't require AlbumId)
export const createAlbum = async (req: Request, res: Response) => {
  const newAlbum: NewAlbum = req.body;
  try {
    const createdAlbum = await albumService.createAlbum(newAlbum);
    res.status(201).json(createdAlbum);
  } catch (error) {
    res.status(500).json({ message: 'Error creating album', error });
  }
};

// Update an existing album (Album type includes AlbumId)
export const updateAlbum = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedAlbum: Partial<Album> = req.body;
  try {
    const result = await albumService.updateAlbum(id, updatedAlbum);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Album not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating album', error });
  }
};

// Delete an album
export const deleteAlbum = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await albumService.deleteAlbum(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Album not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting album', error });
  }
};
