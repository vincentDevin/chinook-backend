// src/services/playlistTrackService.ts

import pool from '../utils/db';
import { PlaylistTrack } from '../models/playlistTrack';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all tracks in a specific playlist
export const getTracksInPlaylist = async (playlistId: number): Promise<PlaylistTrack[]> => {
  const [rows] = await pool.query<PlaylistTrack[] & RowDataPacket[]>(
    'SELECT * FROM PlaylistTrack WHERE PlaylistId = ?',
    [playlistId]
  );
  return rows;
};

// Add a track to a specific playlist
export const addTrackToPlaylist = async (playlistTrack: PlaylistTrack): Promise<PlaylistTrack> => {
  const { PlaylistId, TrackId } = playlistTrack;
  await pool.query<ResultSetHeader>(
    'INSERT INTO PlaylistTrack (PlaylistId, TrackId) VALUES (?, ?)',
    [PlaylistId, TrackId]
  );
  return { PlaylistId, TrackId };
};

// Remove a track from a specific playlist
export const removeTrackFromPlaylist = async (playlistId: number, trackId: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM PlaylistTrack WHERE PlaylistId = ? AND TrackId = ?',
    [playlistId, trackId]
  );
  return result.affectedRows > 0;
};
