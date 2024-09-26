// src/controllers/playlistController.ts

import { Request, Response } from 'express';
import * as playlistService from '../services/playlistService';
import { Playlist } from '../models/playlist';

// Get all playlists
export const getAllPlaylists = async (req: Request, res: Response) => {
  try {
    const playlists: Playlist[] = await playlistService.getAllPlaylists();
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlists', error });
  }
};

// Get playlist by ID
export const getPlaylistById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const playlist = await playlistService.getPlaylistById(id);
    if (playlist) {
      res.status(200).json(playlist);
    } else {
      res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlist', error });
  }
};

// Create a new playlist
export const createPlaylist = async (req: Request, res: Response) => {
  const newPlaylist: Omit<Playlist, 'PlaylistId'> = req.body;
  try {
    const createdPlaylist = await playlistService.createPlaylist(newPlaylist);
    res.status(201).json(createdPlaylist);
  } catch (error) {
    res.status(500).json({ message: 'Error creating playlist', error });
  }
};

// Update an existing playlist
export const updatePlaylist = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedPlaylist: Partial<Playlist> = req.body;
  try {
    const result = await playlistService.updatePlaylist(id, updatedPlaylist);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating playlist', error });
  }
};

// Delete a playlist
export const deletePlaylist = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await playlistService.deletePlaylist(id);
    if (result) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting playlist', error });
  }
};
