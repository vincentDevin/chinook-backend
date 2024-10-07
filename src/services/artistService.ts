import pool from '../utils/db';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Genre } from '../models/genre';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Define a new type that includes an artist and their related albums
export type ArtistWithAlbums = Artist & {
  albums: Album[];
};

// Define the ArtistWithDetails type
export type ArtistWithDetails = {
  ArtistId: number;
  Name: string;
  // You can add more fields if needed, depending on your schema
};


// Fetch artist by ID, including albums
export const getArtistByIdWithAlbums = async (id: number): Promise<ArtistWithAlbums | null> => {
  try {
    // Fetch the artist by ID
    const [artistRows] = await pool.query<Artist[] & RowDataPacket[]>(
      'SELECT * FROM Artist WHERE ArtistId = ?',
      [id]
    );

    if (artistRows.length === 0) {
      return null; // Artist not found
    }

    const artist = artistRows[0];

    // Fetch the albums related to the artist
    const [albumRows] = await pool.query<Album[] & RowDataPacket[]>(
      'SELECT * FROM Album WHERE ArtistId = ?',
      [id]
    );

    // Return the artist with their albums
    return {
      ...artist,
      albums: albumRows,
    };
  } catch (error) {
    console.error('Error fetching artist with albums:', error);
    throw new Error('Database query failed');
  }
};

export const getAllArtists = async (limit: number, offset: number): Promise<{ artists: Artist[], totalCount: number }> => {
  try {
    const [artists] = await pool.query<Artist[] & RowDataPacket[]>(
      'SELECT * FROM Artist LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [totalCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as totalCount FROM Artist'
    );

    const totalCount = totalCountResult[0].totalCount;
    return { artists, totalCount };
  } catch (error) {
    console.error('Error fetching all artists:', error);
    throw new Error('Failed to fetch artists');
  }
};

// Get artist by ID, including all distinct genres from their albums
export const getArtistById = async (id: number): Promise<Artist | null> => {
  try {
    // Modify the query to join Genre through the Track table
    const [rows] = await pool.query<Artist[] & RowDataPacket[]>(
      `SELECT 
        ar.ArtistId,
        ar.Name,
        GROUP_CONCAT(DISTINCT g.Name) AS Genres -- Concatenate distinct genre names
      FROM Artist ar
      LEFT JOIN Album a ON ar.ArtistId = a.ArtistId
      LEFT JOIN Track t ON a.AlbumId = t.AlbumId -- Join Track through Album
      LEFT JOIN Genre g ON t.GenreId = g.GenreId -- Join Genre through Track
      WHERE ar.ArtistId = ?
      GROUP BY ar.ArtistId, ar.Name`, // Group by Artist to get unique genres
      [id]
    );

    if (rows.length > 0) {
      return {
        ArtistId: rows[0].ArtistId,
        Name: rows[0].Name,
        Genres: rows[0].Genres ? (rows[0].Genres as unknown as string).split(',') : [] // Convert Genres to string first
      };
    } else {
      return null; // No artist found with the provided ID
    }
  } catch (error) {
    console.error('Error fetching artist with genres:', error); // Log the error for debugging purposes
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

export const updateArtist = async (id: number, updatedArtist: Partial<ArtistWithDetails>): Promise<ArtistWithDetails | null> => {
  const currentArtist = await getArtistById(id);

  if (!currentArtist) {
    throw new Error('Artist not found');
  }

  const mergedArtist = {
    Name: updatedArtist.Name ?? currentArtist.Name,
  };

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE Artist SET Name = ? WHERE ArtistId = ?`,
    [mergedArtist.Name, id]
  );

  if (result.affectedRows > 0) {
    // Instead of fetching again, return the merged data
    return {
      ArtistId: id,
      Name: mergedArtist.Name,
    };
  }

  return null;
};


// Delete an artist
export const deleteArtist = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM Artist WHERE ArtistId = ?', [id]);
  return result.affectedRows > 0;
};
