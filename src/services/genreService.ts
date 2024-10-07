import pool from '../utils/db';
import { Genre } from '../models/genre';
import { TrackWithDetails } from './trackService'; // Import the interface for tracks with details
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all genres
export const getAllGenres = async (): Promise<Genre[]> => {
  const [rows] = await pool.query<Genre[] & RowDataPacket[]>('SELECT * FROM Genre');
  return rows;
};

// Get genre by ID
export const getGenreById = async (id: number): Promise<Genre | null> => {
  const [rows] = await pool.query<Genre[] & RowDataPacket[]>('SELECT * FROM Genre WHERE GenreId = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

// Get all tracks by GenreId with pagination
export const getTracksByGenreId = async (
  genreId: number, 
  limit: number, 
  offset: number
): Promise<{ tracks: TrackWithDetails[], totalCount: number }> => {
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
        t.GenreId = ?
      LIMIT ? OFFSET ?`, // Add pagination parameters
      [genreId, limit, offset]
    );

    // Get the total count of tracks in this genre (without pagination)
    const [totalCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as totalCount FROM Track WHERE GenreId = ?',
      [genreId]
    );
    const totalCount = totalCountResult[0].totalCount;

    return { tracks, totalCount };
  } catch (error) {
    throw new Error('Database query error');
  }
};

// Create a new genre
export const createGenre = async (newGenre: Omit<Genre, 'GenreId'>): Promise<Genre> => {
  const { Name } = newGenre;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO Genre (Name) VALUES (?)',
    [Name]
  );
  const insertedId = result.insertId;
  return { GenreId: insertedId, Name };
};

// Update an existing genre
export const updateGenre = async (id: number, updatedGenre: Partial<Genre>): Promise<Genre | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE Genre SET ? WHERE GenreId = ?',
    [updatedGenre, id]
  );
  if (result.affectedRows > 0) {
    return await getGenreById(id);
  }
  return null;
};

// Delete a genre
export const deleteGenre = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM Genre WHERE GenreId = ?', [id]);
  return result.affectedRows > 0;
};
