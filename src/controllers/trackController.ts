// src/controllers/trackController.ts

import { Request, Response } from 'express';
import * as trackService from '../services/trackService';
import { Track } from '../models/track';

// Get all tracks with pagination
export const getAllTracks = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10; // Default to 10 if not provided
  const offset = parseInt(req.query.offset as string) || 0; // Default to 0 if not provided

  try {
    const { tracks, totalCount } = await trackService.getAllTracks(limit, offset);
    res.status(200).json({
      tracks,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Math.floor(offset / limit) + 1,
    });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({ message: 'Error fetching tracks', error });
  }
};

// Get track by ID with details
export const getTrackById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  // Validate that the ID is a positive number
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid TrackId. It must be a positive number.' });
  }

  try {
    const track = await trackService.getTrackById(id);
    if (track) {
      res.status(200).json(track);
    } else {
      res.status(404).json({ message: 'Track not found' });
    }
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({ message: 'Error fetching track', error });
  }
};

// Create a new track
export const createTrack = async (req: Request, res: Response) => {
  const newTrack: Omit<Track, 'TrackId'> = req.body;
  try {
    const createdTrack = await trackService.createTrack(newTrack);
    res.status(201).json(createdTrack);
  } catch (error) {
    console.error('Error creating track:', error);
    res.status(500).json({ message: 'Error creating track', error });
  }
};

// Update an existing track
export const updateTrack = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedTrack: Partial<Track> = req.body;
  try {
    const result = await trackService.updateTrack(id, updatedTrack);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Track not found' });
    }
  } catch (error) {
    console.error('Error updating track:', error);
    res.status(500).json({ message: 'Error updating track', error });
  }
};

// Delete a track
export const deleteTrack = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await trackService.deleteTrack(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Track not found' });
    }
  } catch (error) {
    console.error('Error deleting track:', error);
    res.status(500).json({ message: 'Error deleting track', error });
  }
};
