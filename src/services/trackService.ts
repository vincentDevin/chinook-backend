// src/services/trackService.ts

import pool from '../utils/db';
import { Track } from '../models/track';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Define an interface for track with related data
export interface TrackWithDetails extends Track {
  AlbumTitle?: string;
  GenreName?: string;
  MediaTypeName?: string;
}

// Get all tracks with pagination and related data
export const getAllTracks = async (
  limit: number,
  offset: number
): Promise<{ tracks: TrackWithDetails[], totalCount: number }> => {
  // Get paginated tracks with related data
  const [tracks] = await pool.query<TrackWithDetails[] & RowDataPacket[]>(
    `SELECT 
      t.TrackId, t.Name, t.AlbumId, t.MediaTypeId, t.GenreId, 
      t.Composer, t.Milliseconds, t.Bytes, t.UnitPrice,
      a.Title AS AlbumTitle, g.Name AS GenreName, m.Name AS MediaTypeName
    FROM 
      Track t
    LEFT JOIN 
      Album a ON t.AlbumId = a.AlbumId
    LEFT JOIN 
      Genre g ON t.GenreId = g.GenreId
    LEFT JOIN 
      MediaType m ON t.MediaTypeId = m.MediaTypeId
    LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  // Get the total count of tracks
  const [totalCountResult] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as totalCount FROM Track'
  );
  const totalCount = totalCountResult[0].totalCount;

  return { tracks, totalCount };
};

// Get track by ID with related data and validation
export const getTrackById = async (id: number): Promise<TrackWithDetails | null> => {
  // Validate that the ID is a positive number
  if (isNaN(id) || id <= 0) {
    console.error(`Invalid TrackId: ${id}`);
    return null; // Return null or handle the error as needed
  }

  try {
    const [rows] = await pool.query<TrackWithDetails[] & RowDataPacket[]>(
      `SELECT 
        t.TrackId, t.Name, t.AlbumId, t.MediaTypeId, t.GenreId, 
        t.Composer, t.Milliseconds, t.Bytes, t.UnitPrice,
        a.Title AS AlbumTitle, g.Name AS GenreName, m.Name AS MediaTypeName
      FROM 
        Track t
      LEFT JOIN 
        Album a ON t.AlbumId = a.AlbumId
      LEFT JOIN 
        Genre g ON t.GenreId = g.GenreId
      LEFT JOIN 
        MediaType m ON t.MediaTypeId = m.MediaTypeId
      WHERE 
        t.TrackId = ?
      LIMIT 1`, // Adding LIMIT 1 to ensure single record
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching track by ID:', error);
    throw new Error('Database query error');
  }
};

// Create a new track
export const createTrack = async (newTrack: Omit<Track, 'TrackId'>): Promise<Track> => {
  const { Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice } = newTrack;
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO Track 
     (Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice]
  );
  const insertedId = result.insertId;
  return { TrackId: insertedId, ...newTrack };
};

// Update an existing track
export const updateTrack = async (id: number, updatedTrack: Partial<Track>): Promise<Track | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE Track SET Name = ?, AlbumId = ?, MediaTypeId = ?, GenreId = ?, Composer = ?, Milliseconds = ?, Bytes = ?, UnitPrice = ?
     WHERE TrackId = ?`,
    [
      updatedTrack.Name,
      updatedTrack.AlbumId,
      updatedTrack.MediaTypeId,
      updatedTrack.GenreId,
      updatedTrack.Composer,
      updatedTrack.Milliseconds,
      updatedTrack.Bytes,
      updatedTrack.UnitPrice,
      id
    ]
  );
  if (result.affectedRows > 0) {
    const updated = await getTrackById(id);
    return updated;
  }
  return null;
};

// Delete a track
export const deleteTrack = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM Track WHERE TrackId = ?',
    [id]
  );
  return result.affectedRows > 0;
};
