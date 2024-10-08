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

// Delete an album
export const deleteAlbum = async (id: number): Promise<boolean> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM Album WHERE AlbumId = ?',
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting album:', error);
    throw error;
  }
};
