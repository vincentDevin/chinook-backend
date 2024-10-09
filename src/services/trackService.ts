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

// Get all tracks by GenreId
export const getTracksByGenreId = async (genreId: number): Promise<TrackWithDetails[]> => {
  try {
    // Get tracks where the GenreId matches
    const [tracks] = await pool.query<TrackWithDetails[] & RowDataPacket[]>(
      `SELECT 
        t.TrackId, 
        t.Name, 
        t.Composer, 
        t.Milliseconds, 
        t.Bytes, 
        t.UnitPrice,
        a.Title AS AlbumTitle,           -- Include related Album title
        g.Name AS GenreName,             -- Include related Genre name
        m.Name AS MediaTypeName,         -- Include related MediaType name
        ar.Name AS ArtistName            -- Include related Artist name
      FROM 
        Track t
      LEFT JOIN 
        Album a ON t.AlbumId = a.AlbumId
      LEFT JOIN 
        Genre g ON t.GenreId = g.GenreId
      LEFT JOIN 
        MediaType m ON t.MediaTypeId = m.MediaTypeId
      LEFT JOIN 
        Artist ar ON a.ArtistId = ar.ArtistId -- Join artist table through album
      WHERE 
        t.GenreId = ?`, // Filter by GenreId
      [genreId]
    );

    return tracks;
  } catch (error) {
    console.error(`Error fetching tracks for genre ID ${genreId}:`, error);
    throw new Error('Database query error');
  }
};

// Get all tracks by AlbumId
export const getTracksByAlbumId = async (albumId: number): Promise<TrackWithDetails[]> => {
  try {
    const [tracks] = await pool.query<TrackWithDetails[] & RowDataPacket[]>(
      `SELECT 
        t.TrackId, 
        t.Name, 
        t.Composer, 
        t.Milliseconds, 
        t.Bytes, 
        t.UnitPrice,
        a.Title AS AlbumTitle,           -- Include related Album title
        g.Name AS GenreName,             -- Include related Genre name
        m.Name AS MediaTypeName          -- Include related MediaType name
      FROM 
        Track t
      LEFT JOIN 
        Album a ON t.AlbumId = a.AlbumId
      LEFT JOIN 
        Genre g ON t.GenreId = g.GenreId
      LEFT JOIN 
        MediaType m ON t.MediaTypeId = m.MediaTypeId
      WHERE 
        t.AlbumId = ?`,
      [albumId]
    );

    return tracks;
  } catch (error) {
    console.error(`Error fetching tracks for album ID ${albumId}:`, error);
    throw new Error('Database query error');
  }
};

// Get all tracks with pagination and related data, excluding IDs
export const getAllTracks = async (
  limit: number,
  offset: number
): Promise<{ tracks: TrackWithDetails[], totalCount: number }> => {
  try {
    // Get paginated tracks with related data, excluding IDs from the result
    const [tracks] = await pool.query<TrackWithDetails[] & RowDataPacket[]>(
      `SELECT 
        t.TrackId,                     -- Keep the TrackId for identification
        t.Name, 
        t.Composer, 
        t.Milliseconds, 
        t.Bytes, 
        t.UnitPrice,
        a.Title AS AlbumTitle,          -- Include related Album title, exclude AlbumId
        g.Name AS GenreName,            -- Include related Genre name, exclude GenreId
        m.Name AS MediaTypeName,        -- Include related MediaType name, exclude MediaTypeId
        ar.Name AS ArtistName           -- Include related Artist name, exclude ArtistId
      FROM 
        Track t
      LEFT JOIN 
        Album a ON t.AlbumId = a.AlbumId
      LEFT JOIN 
        Genre g ON t.GenreId = g.GenreId
      LEFT JOIN 
        MediaType m ON t.MediaTypeId = m.MediaTypeId
      LEFT JOIN 
        Artist ar ON a.ArtistId = ar.ArtistId -- Join artist table through album
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    // Get the total count of tracks (this includes all tracks, not just paginated ones)
    const [totalCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as totalCount FROM Track'
    );
    const totalCount = totalCountResult[0].totalCount;

    // Return tracks and totalCount
    return { tracks, totalCount };
  } catch (error) {
    console.error('Error fetching all tracks:', error);
    throw new Error('Database query error');
  }
};

// Get track by ID with related data, including artist name
export const getTrackById = async (id: number): Promise<TrackWithDetails | null> => {
  // Validate that the ID is a positive number
  if (isNaN(id) || id <= 0) {
    console.error(`Invalid TrackId: ${id}`);
    return null; // Return null or handle the error as needed
  }

  try {
    const [rows] = await pool.query<TrackWithDetails[] & RowDataPacket[]>(
      `SELECT 
        t.TrackId,                      -- Keep the TrackId to identify the track
        t.Name, 
        t.Composer, 
        t.Milliseconds, 
        t.Bytes, 
        t.UnitPrice, 
        a.Title AS AlbumTitle,           -- Include related Album title
        g.Name AS GenreName,             -- Include related Genre name
        m.Name AS MediaTypeName,         -- Include related Media type name
        ar.Name AS ArtistName            -- Fetch ArtistName from the Artist table
      FROM 
        Track t
      LEFT JOIN 
        Album a ON t.AlbumId = a.AlbumId -- Join Album to get Album title and ArtistId
      LEFT JOIN 
        Artist ar ON a.ArtistId = ar.ArtistId -- Join Artist through Album to get Artist name
      LEFT JOIN 
        Genre g ON t.GenreId = g.GenreId -- Join Genre to get Genre name
      LEFT JOIN 
        MediaType m ON t.MediaTypeId = m.MediaTypeId -- Join MediaType to get MediaType name
      WHERE 
        t.TrackId = ?
      LIMIT 1`, // Fetching only a single track
      [id]
    );
    
    // Return the first row if a track is found, else return null
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching track by ID:', error);
    throw new Error('Database query error');
  }
};


// Create a new track
export const createTrack = async (newTrack: Omit<Track, 'TrackId'>): Promise<TrackWithDetails> => {
  const { Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice } = newTrack;

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO Track 
     (Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice]
  );

  const insertedId = result.insertId;

  // Fetch the newly created track with its related details (excluding the raw IDs)
  const createdTrack = await getTrackById(insertedId);

  return createdTrack!;
};

// Update an existing track (including changing the album, which effectively changes the artist)
export const updateTrack = async (id: number, updatedTrack: Partial<Track>): Promise<TrackWithDetails | null> => {
  // Fetch the current track details
  const currentTrack = await getTrackById(id);
  
  if (!currentTrack) {
    throw new Error('Track not found');
  }

  // Merge the updated fields with the current values (preserve the current values if not provided)
  const mergedTrack = {
    Name: updatedTrack.Name ?? currentTrack.Name,
    Composer: updatedTrack.Composer ?? currentTrack.Composer,
    Milliseconds: updatedTrack.Milliseconds ?? currentTrack.Milliseconds,
    Bytes: updatedTrack.Bytes ?? currentTrack.Bytes,
    UnitPrice: updatedTrack.UnitPrice ?? currentTrack.UnitPrice,
    AlbumId: updatedTrack.AlbumId !== undefined ? updatedTrack.AlbumId : currentTrack.AlbumId, // This indirectly changes the artist
    MediaTypeId: updatedTrack.MediaTypeId !== undefined ? updatedTrack.MediaTypeId : currentTrack.MediaTypeId,
    GenreId: updatedTrack.GenreId !== undefined ? updatedTrack.GenreId : currentTrack.GenreId,
  };

  // Perform the update with the merged values
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE Track 
     SET Name = ?, Composer = ?, Milliseconds = ?, Bytes = ?, UnitPrice = ?, AlbumId = ?, MediaTypeId = ?, GenreId = ?
     WHERE TrackId = ?`,
    [
      mergedTrack.Name,
      mergedTrack.Composer,
      mergedTrack.Milliseconds,
      mergedTrack.Bytes,
      mergedTrack.UnitPrice,
      mergedTrack.AlbumId,
      mergedTrack.MediaTypeId,
      mergedTrack.GenreId,
      id
    ]
  );

  if (result.affectedRows > 0) {
    // Fetch the updated track after the update
    const updatedTrack = await getTrackById(id);
    return updatedTrack;
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
