import pool from '../utils/db';
import { Album } from '../models/album';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all albums with related artist data
export const getAllAlbums = async (limit: number, offset: number): Promise<{ albums: any[], totalCount: number }> => {
  // Get paginated albums with related artist data
  const [albums] = await pool.query<RowDataPacket[]>(
    `SELECT 
      Album.AlbumId, Album.Title, 
      Artist.ArtistId, Artist.Name AS ArtistName 
    FROM Album 
    LEFT JOIN Artist ON Album.ArtistId = Artist.ArtistId 
    LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  // Get the total count of albums
  const [totalCountResult] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as totalCount FROM Album'
  );
  const totalCount = totalCountResult[0].totalCount;

  return { albums, totalCount };
};


// Get album by ID
export const getAlbumById = async (id: number): Promise<Album | null> => {
  const [rows] = await pool.query<Album[] & RowDataPacket[]>(
    'SELECT * FROM Album WHERE AlbumId = ?',
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Create a new album
export const createAlbum = async (newAlbum: Omit<Album, 'AlbumId'>): Promise<Album> => {
  const { Title, ArtistId } = newAlbum;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO Album (Title, ArtistId) VALUES (?, ?)',
    [Title, ArtistId]
  );
  const insertedId = result.insertId;
  return { AlbumId: insertedId, Title, ArtistId };
};

// Update an existing album
export const updateAlbum = async (id: number, updatedAlbum: Partial<Album>): Promise<Album | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE Album SET ? WHERE AlbumId = ?',
    [updatedAlbum, id]
  );
  if (result.affectedRows > 0) {
    const updated = await getAlbumById(id);
    return updated;
  }
  return null;
};

// Delete an album
export const deleteAlbum = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM Album WHERE AlbumId = ?',
    [id]
  );
  return result.affectedRows > 0;
};
