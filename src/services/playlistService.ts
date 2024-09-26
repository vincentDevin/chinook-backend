// src/services/playlistService.ts

import pool from '../utils/db';
import { Playlist } from '../models/playlist';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all playlists
export const getAllPlaylists = async (): Promise<Playlist[]> => {
  const [rows] = await pool.query<Playlist[] & RowDataPacket[]>('SELECT * FROM Playlist');
  return rows;
};

// Get playlist by ID
export const getPlaylistById = async (id: number): Promise<Playlist | null> => {
  const [rows] = await pool.query<Playlist[] & RowDataPacket[]>('SELECT * FROM Playlist WHERE PlaylistId = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Create a new playlist
export const createPlaylist = async (newPlaylist: Omit<Playlist, 'PlaylistId'>): Promise<Playlist> => {
  const { Name } = newPlaylist;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO Playlist (Name) VALUES (?)',
    [Name]
  );
  const insertedId = result.insertId;
  return { PlaylistId: insertedId, Name };
};

// Update an existing playlist
export const updatePlaylist = async (id: number, updatedPlaylist: Partial<Playlist>): Promise<Playlist | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE Playlist SET ? WHERE PlaylistId = ?',
    [updatedPlaylist, id]
  );
  if (result.affectedRows > 0) {
    return await getPlaylistById(id);
  }
  return null;
};

// Delete a playlist
export const deletePlaylist = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM Playlist WHERE PlaylistId = ?', [id]);
  return result.affectedRows > 0;
};
