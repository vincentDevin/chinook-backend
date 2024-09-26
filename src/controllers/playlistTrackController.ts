// src/controllers/playlistTrackController.ts

import { Request, Response } from 'express';
import * as playlistTrackService from '../services/playlistTrackService';
import { PlaylistTrack } from '../models/playlistTrack';

// Get all tracks in a specific playlist
export const getTracksInPlaylist = async (req: Request, res: Response) => {
  const playlistId = parseInt(req.params.id, 10);
  try {
    const tracks: PlaylistTrack[] = await playlistTrackService.getTracksInPlaylist(playlistId);
    res.status(200).json(tracks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tracks in playlist', error });
  }
};

// Add a track to a specific playlist
export const addTrackToPlaylist = async (req: Request, res: Response) => {
  const playlistId = parseInt(req.params.id, 10);
  const trackId = req.body.TrackId;
  if (!trackId) {
    return res.status(400).json({ message: 'TrackId is required' });
  }
  
  const playlistTrack: PlaylistTrack = { PlaylistId: playlistId, TrackId: trackId };
  try {
    const addedTrack = await playlistTrackService.addTrackToPlaylist(playlistTrack);
    res.status(201).json(addedTrack);
  } catch (error) {
    res.status(500).json({ message: 'Error adding track to playlist', error });
  }
};

// Remove a track from a specific playlist
export const removeTrackFromPlaylist = async (req: Request, res: Response) => {
  const playlistId = parseInt(req.params.id, 10);
  const trackId = parseInt(req.params.trackId, 10);
  try {
    const result = await playlistTrackService.removeTrackFromPlaylist(playlistId, trackId);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Track not found in playlist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing track from playlist', error });
  }
};
