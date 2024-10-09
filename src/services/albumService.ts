import pool from '../utils/db';
import { Album } from '../models/album';
import { Track } from '../models/track';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all albums with related artist data
export const getAllAlbums = async (limit: number, offset: number): Promise<{ albums: any[], totalCount: number }> => {
  try {
    const [albums] = await pool.query<RowDataPacket[]>(
      `SELECT 
        Album.AlbumId, Album.Title, 
        Artist.ArtistId, Artist.Name AS ArtistName 
      FROM Album 
      LEFT JOIN Artist ON Album.ArtistId = Artist.ArtistId 
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [totalCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as totalCount FROM Album'
    );
    const totalCount = totalCountResult[0].totalCount;

    return { albums, totalCount };
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
};

// Get album by ID, including tracks and artist name
export const getAlbumById = async (id: number): Promise<Album | null> => {
  try {
    const [albumRows] = await pool.query<Album[] & RowDataPacket[]>(
      `SELECT 
        a.AlbumId,
        a.Title,
        ar.Name AS ArtistName 
      FROM Album a
      LEFT JOIN Artist ar ON a.ArtistId = ar.ArtistId
      WHERE a.AlbumId = ?`,
      [id]
    );

    if (albumRows.length === 0) {
      return null;
    }

    const album = albumRows[0];

    const [trackRows] = await pool.query<Track[] & RowDataPacket[]>(
      'SELECT * FROM Track WHERE AlbumId = ?',
      [id]
    );

    return {
      ...album,
      tracks: trackRows,
    };
  } catch (error) {
    console.error('Error fetching album with tracks:', error);
    throw error;
  }
};
// Get all albums by a specific artist ID
export const getAlbumsByArtistId = async (artistId: number): Promise<Album[]> => {
  if (!artistId || isNaN(artistId)) {
    throw new Error('Invalid ArtistId');
  }

  try {
    const [albumRows] = await pool.query<Album[] & RowDataPacket[]>(
      'SELECT * FROM Album WHERE ArtistId = ?',
      [artistId]
    );
    return albumRows;
  } catch (error) {
    console.error('Error fetching albums by artist:', error);
    throw error;
  }
};

// Create a new album
export const createAlbum = async (newAlbum: Omit<Album, 'AlbumId'>): Promise<Album> => {
  try {
    const { Title, ArtistId } = newAlbum;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO Album (Title, ArtistId) VALUES (?, ?)',
      [Title, ArtistId]
    );
    const insertedId = result.insertId;
    return { AlbumId: insertedId, Title, ArtistId };
  } catch (error) {
    console.error('Error creating album:', error);
    throw error;
  }
};

// Update an existing album
export const updateAlbum = async (id: number, updatedAlbum: Partial<Album>): Promise<Album | null> => {
  try {
    const { Title, ArtistId } = updatedAlbum;

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE Album SET Title = ?, ArtistId = ? WHERE AlbumId = ?',
      [Title, ArtistId, id]
    );

    if (result.affectedRows > 0) {
      return getAlbumById(id);
    }

    return null;
  } catch (error) {
    console.error('Error updating album:', error);
    throw error;
  }
};

// Delete an album and update related tracks with NULL albumId
export const deleteAlbum = async (id: number): Promise<boolean> => {
  const connection = await pool.getConnection(); // Start a transaction
  try {
    // Start the transaction
    await connection.beginTransaction();

    // Set AlbumId to NULL in the Track table for all tracks related to this album
    await connection.query<ResultSetHeader>(
      'UPDATE Track SET AlbumId = NULL WHERE AlbumId = ?',
      [id]
    );

    // Now delete the album after the related tracks are updated
    const [result] = await connection.query<ResultSetHeader>(
      'DELETE FROM Album WHERE AlbumId = ?',
      [id]
    );

    // Commit the transaction
    await connection.commit();

    return result.affectedRows > 0;
  } catch (error) {
    // Rollback the transaction in case of an error
    await connection.rollback();
    console.error('Error deleting album:', error);
    throw error;
  } finally {
    connection.release(); // Release the connection
  }
};

