import pool from '../utils/db';
import { Artist } from '../models/artist';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Define the ArtistWithDetails type
export type ArtistWithDetails = {
  ArtistId: number;
  Name: string;
  // You can add more fields if needed, depending on your schema
};


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
export const updateArtist = async (id: number, updatedArtist: Partial<ArtistWithDetails>): Promise<ArtistWithDetails | null> => {
  // Fetch the current artist details to get the existing values
  const currentArtist = await getArtistById(id);
  
  if (!currentArtist) {
    throw new Error('Artist not found');
  }

  // Merge the updated fields with the current values (preserve the current values if not provided)
  const mergedArtist = {
    Name: updatedArtist.Name ?? currentArtist.Name,
  };

  // Perform the update with the merged values
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE Artist SET Name = ? WHERE ArtistId = ?`,
    [mergedArtist.Name, id]
  );

  if (result.affectedRows > 0) {
    // Fetch the updated artist details
    const updated = await getArtistById(id);
    return updated;
  }

  return null;
};



// Delete an artist
export const deleteArtist = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM Artist WHERE ArtistId = ?', [id]);
  return result.affectedRows > 0;
};
