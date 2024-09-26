import pool from '../utils/db';
import { Artist } from '../models/artist';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all artists with pagination
export const getAllArtists = async (limit: number, offset: number): Promise<{ artists: Artist[], totalCount: number }> => {
  // Get paginated artists
  const [artists] = await pool.query<Artist[] & RowDataPacket[]>(
    'SELECT * FROM Artist LIMIT ? OFFSET ?',
    [limit, offset]
  );

  // Get the total count of artists
  const [totalCountResult] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as totalCount FROM Artist'
  );
  const totalCount = totalCountResult[0].totalCount;

  return { artists, totalCount };
};

// Get artist by ID
export const getArtistById = async (id: number): Promise<Artist | null> => {
  try {
    const [rows] = await pool.query<Artist[] & RowDataPacket[]>(
      'SELECT * FROM Artist WHERE ArtistId = ?',
      [id]
    );

    if (rows.length > 0) {
      return rows[0];
    } else {
      return null; // No artist found with the provided ID
    }
  } catch (error) {
    console.error('Error fetching artist:', error); // Log the error for debugging purposes
    throw new Error('Database query failed'); // Throw a generic error message
  }
};

// Create a new artist
export const createArtist = async (newArtist: Omit<Artist, 'ArtistId'>): Promise<Artist> => {
  const { Name } = newArtist;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO Artist (Name) VALUES (?)',
    [Name]
  );
  const insertedId = result.insertId;
  return { ArtistId: insertedId, Name };
};

// Update an existing artist
export const updateArtist = async (id: number, updatedArtist: Partial<Artist>): Promise<Artist | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE Artist SET ? WHERE ArtistId = ?',
    [updatedArtist, id]
  );
  if (result.affectedRows > 0) {
    return await getArtistById(id);
  }
  return null;
};

// Delete an artist
export const deleteArtist = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM Artist WHERE ArtistId = ?', [id]);
  return result.affectedRows > 0;
};
